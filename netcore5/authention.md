## 1 JWT权限认证
JWT请求流程：
1. 客户端向授权服务系统发起请求，申请获取“令牌”。
2. 授权服务根据用户身份，生成一张专属“令牌”，并将该“令牌”以JWT规范返回给客户端。
3. 客户端将获取到的“令牌”放到Http请求的Headers中后，向主服务系统发起请求。主服务系统接收请求后，会从Headers中获取“令牌”，并从“令牌”中解析出该用户的身份权限，然后做出相应的处理（同意或拒绝返回资源）

## 2 生成一个令牌
### 2.1 服务注册与参数配置
新建SwiftCode.BBS.Common类库，类库下新建Helper文件夹并创建Appsettings类，用于帮助读取appsettings.json中的系统配置参数。

Nuget包安装：
~~~
Microsoft.Extensions.Configuration
Microsoft.Extensions.Configuration.Abstractions
Microsoft.Extensions.Configuration.Json
Microsoft.Extensions.Configuration.Binder
~~~

Appsettings类如下：
~~~
namespace SwiftCode.BBS.Common.Helper
{
    /// <summary>
    /// appsettings.json操作类
    /// </summary>
    public class Appsettings
    {
        static IConfiguration Configuration { get; set; }
        private static string contentPath { get; set; }

        public Appsettings(string contentPath)
        {
            var Path = "appsettings.json";

            //如果配置文件是根据环境变量来区分的，可以这样配置
            //Path = $"appsettings.{Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT")}.json";

            Configuration=new ConfigurationBuilder()
                    .SetBasePath(contentPath)
                    .Add(new JsonConfigurationSource
                    {
                        Path = Path,Optional = false,
                        ReloadOnChange = true //这样可以直接读取目录里json文件，而不是bin文件夹下的，所以不用修改复制属性
                    }).Build();
        }

        public Appsettings(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        /// <summary>
        /// 封装要操作的字符
        /// </summary>
        /// <param name="sections">节点配置</param>
        /// <returns></returns>
        public static string app(params string[] sections)
        {
            try
            {
                if (sections.Any())
                {
                    return Configuration[string.Join(":", sections)];
                }
            }
            catch (Exception)
            {
            }

            return "";
        }

        /// <summary>
        /// 递归获取信息配置数组
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="sections"></param>
        /// <returns></returns>
        public static List<T> app<T>(params string[] sections)
        {
            var list = new List<T>();
            Configuration.Bind(string.Join(";", sections), list);
            return list;
        }

    }
}
~~~

在SwiftCode.BBS.API下的Startup.cs下注入Appsettings：
~~~
public void ConfigureServices(IServiceCollection services)
{
    services.AddControllers();
    
    //注入appsettings
    services.AddSingleton(new Appsettings(Configuration));

}
~~~

在Helper文件夹下新建JwtHelper类。

Nuget包安装：System.IdentityModel.Tokens.Jwt

~~~
namespace SwiftCode.BBS.Common.Helper
{
    public class JwtHelper
    {
        /// <summary>
        /// 颁发JWT字符串
        /// </summary>
        /// <param name="tokenModel"></param>
        /// <returns></returns>
        public static string IssueJwt(TokenModelJwt tokenModel)
        {
            var iss = Appsettings.app(new string[] {"Audience", "Issuer"});
            var aud = Appsettings.app(new string[] { "Audience", "Audience" });
            var secret = Appsettings.app(new string[] { "Audience", "Secret" });

            var claims = new List<Claim>
            {
                /*
                 * 特别重要：这里将用户的部分信息，比如Uid存到了Claim中
                 * 其他地方怎么用还没看到...
                 */
                new Claim(JwtRegisteredClaimNames.Jti,tokenModel.Uid.ToString()),
                new Claim(JwtRegisteredClaimNames.Iat,$"{new DateTimeOffset(DateTime.Now).ToUnixTimeSeconds()}"),
                new Claim(JwtRegisteredClaimNames.Nbf,$"{new DateTimeOffset(DateTime.Now).ToUnixTimeSeconds()}"),
                //这个就是过期时间，目前过期时间1000秒，可自定义，注意JWT有自己的缓冲过期时间
                new Claim(ClaimTypes.Expiration,DateTime.Now.AddSeconds(1000).ToString()),
                new Claim(JwtRegisteredClaimNames.Iss,iss),
                new Claim(JwtRegisteredClaimNames.Aud,aud)
            };

            //可以将一个用户的多个角色全部赋予
            claims.AddRange(tokenModel.Role.Split(",").Select(s => new Claim(ClaimTypes.Role, s)));

            //密钥（SymmetricSecurityKey对安全性的要求，秘钥的长度太短会报出异常）
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret));
            var creds=new SigningCredentials(key,SecurityAlgorithms.HmacSha256);

            var jwt = new JwtSecurityToken(
                issuer: iss,
                claims: claims,
                signingCredentials: creds
            );

            var jwtHandler=new JwtSecurityTokenHandler();
            var encodeJwt = jwtHandler.WriteToken(jwt);

            return encodeJwt;
        }

        /// <summary>
        /// 解析
        /// </summary>
        /// <param name="jwtStr"></param>
        /// <returns></returns>
        public static TokenModelJwt SerializeJwt(string jwtStr)
        {
            var jwtHandler=new JwtSecurityTokenHandler();
            var tokenModelJwt = new TokenModelJwt();

            //token校验
            if (!string.IsNullOrEmpty(jwtStr) && jwtHandler.CanReadToken(jwtStr))
            {
                var jwtToken = jwtHandler.ReadJwtToken(jwtStr);
                object role;
                jwtToken.Payload.TryGetValue(ClaimTypes.Role, out role);
                tokenModelJwt = new TokenModelJwt
                {
                    Uid = Convert.ToInt64(jwtToken.Id),
                    Role = role == null ? "" : role.ToString()
                };
            }

            return tokenModelJwt;
        }
    }

    /// <summary>
    /// 令牌
    /// </summary>
    public class TokenModelJwt
    {
        /// <summary>
        /// Id
        /// </summary>
        public long Uid { get; set; }

        /// <summary>
        /// 角色
        /// </summary>
        public string Role { get; set; }

        /// <summary>
        /// 职能
        /// </summary>
        public string Work { get; set; }
    }
}
~~~

完善SwiftCode.BBS.API下的appsettings.json:
~~~
"Audience": {
    "Secret": "asdfasdfasdfasdfasdfasdfasdf", //不要太短，16位+
    "Issuer": "SwiftCode.BBS",
    "Audience": "wr" 
} 
~~~

### 2.2 设计登录接口
在Controller中新建控制器LoginController，如下：
~~~
[Route("api/[controller]")]
[ApiController]
public class LoginController : ControllerBase
{
    /// <summary>
    /// 获取jwt令牌
    /// </summary>
    /// <param name="name"></param>
    /// <param name="pass"></param>
    /// <returns></returns>
    [HttpGet]
    public async Task<object> GetJwtStr(string name, string pass)
    {
        //将用户id和角色名作为单独的自定义变量，封装进token字符串中
        var tokenModel = new TokenModelJwt {Uid = 1, Role = "Admin"};
        var jwtStr = JwtHelper.IssueJwt(tokenModel);//登录，获取到一定规则的token令牌
        var suc = true;
        return Ok(new
        {
            success = suc,
            token = jwtStr
        });
    }
}
~~~
启动程序，通过Swagger调用上面接口，就成功获取到token了。

## 3.JWT——权限三步走
Swagger作为接口文档输入token：Nuget中安装 Swashbuckle.AspNetCore.Filters，并修改ConfigureServices中Swagger相关代码：
~~~
#region Swagger

services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1",new OpenApiInfo
    {
        Version = "v0.1.0",
        Title = "SwiftCode.BBS.API",
        Description = "框架说明文档",
        Contact = new OpenApiContact
        {
            Name = "SwiftCode",
            Email = "SwiftCode@xxx.com"
        }
    });

    //给接口添加注释修改
    var basePath = AppContext.BaseDirectory;
    var xmlPath = Path.Combine(basePath, "SwiftCode.BBS.API.xml");//这个就是刚刚配置的xml文件名
    c.IncludeXmlComments(xmlPath,true);

    //配置SwiftCode.BBS.Model项目的XML文档(间接引用Model时这样写)
    //var xmlModelPath = Path.Combine(basePath, "SwiftCode.BBS.Model.xml");
    //c.IncludeXmlComments(xmlModelPath);

    //开启小锁
    c.OperationFilter<AddResponseHeadersFilter>();
    c.OperationFilter<AppendAuthorizeToSummaryOperationFilter>();

    //在header中添加token传到后台
    c.OperationFilter<SecurityRequirementsOperationFilter>();
    c.AddSecurityDefinition("oauth2",new OpenApiSecurityScheme
    {
        Description = "JWT授权（数据将在请求头中进行传输）直接在下框中输入Bearer {token}(注意两者之间是一个空格)",
        Name = "Authorization",//jwt默认的参数名称
        In = ParameterLocation.Header, //jwt默认存放Authorization信息的位置（请求头中）
        Type = SecuritySchemeType.ApiKey
    });

});

#endregion
~~~
运行界面如下图：

![Swagger授权](https://huihui_teresa.gitee.io/docs/image/youdao/2022021306.png)

### 3.1 API接口授权
三步走第一步：授权处理。可以直接在API接口上设置该接口所对应的角色权限信息。

API接口授权：
~~~
/// <summary>
/// 获取天气
/// </summary>
/// <returns></returns>
[HttpGet]
[Authorize]
public IEnumerable<WeatherForecast> Get()
{
    var rng = new Random();
    return Enumerable.Range(1, 5).Select(index => new WeatherForecast
    {
        Date = DateTime.Now.AddDays(index),
        TemperatureC = rng.Next(-20, 55),
        Summary = Summaries[rng.Next(Summaries.Length)]
    })
    .ToArray();
}
~~~
指定角色授权：
~~~
/// <summary>
/// 获取天气
/// </summary>
/// <returns></returns>
[HttpGet]
[Authorize(Roles = "Admin")]
public IEnumerable<WeatherForecast> Get()
{
    var rng = new Random();
    return Enumerable.Range(1, 5).Select(index => new WeatherForecast
    {
        Date = DateTime.Now.AddDays(index),
        TemperatureC = rng.Next(-20, 55),
        Summary = Summaries[rng.Next(Summaries.Length)]
    })
    .ToArray();
}
~~~
如果角色很多，上面设置很不方便，这个时候就出现了基于策略的授权机制。在ConfigureServices中可以如下设置：
~~~
//基于策略授权
//然后这么写[Authorize(Policy="Admin")]
services.AddAuthorization(options =>
{
    options.AddPolicy("Client",policy=>policy.RequireRole("Client").Build());//单独角色
    options.AddPolicy("Admin", policy => policy.RequireRole("Admin").Build());//单独角色
    options.AddPolicy("SystemOrAdmin", policy=>policy.RequireRole("Admin","System")); //或的关系
    options.AddPolicy("SystemAndAdmin",policy=>policy.RequireRole("Admin").RequireRole("System"));//且的关系
});
~~~
接口中使用如下：
~~~
/// <summary>
/// 获取天气
/// </summary>
/// <returns></returns>
[HttpGet]
[Authorize(Policy = "SystemOrAdmin")]
public IEnumerable<WeatherForecast> Get()
{
    var rng = new Random();
    return Enumerable.Range(1, 5).Select(index => new WeatherForecast
    {
        Date = DateTime.Now.AddDays(index),
        TemperatureC = rng.Next(-20, 55),
        Summary = Summaries[rng.Next(Summaries.Length)]
    })
    .ToArray();
}
~~~

### 3.2 配置认证服务
已经对API设置好了授权机制，在这里将开始进行认证。先看一下如何实现JWT的Bearer认证，什么是Bearer认证呢？简单来说，就是定义一套逻辑，用来将我们的JWT三个部分进行处理和校验，在登录的时候，可以发现有发行人、订阅人和数字密钥等，JWT Bearer认证就是实现校验的功能。

在ConfigureServices中添加“统一认证”：

安装Nuget包：Microsoft.AspNetCore.Authentication.JwtBearer
~~~
//统一认证
services.AddAuthentication(x =>
    {
        x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    }).AddJwtBearer(o =>
    {
        var audienceConfig = Configuration["Audience:Audience"];
        var symmetricKeyAsBase64 = Configuration["Audience:Secret"];
        var iss = Configuration["Audience:Issuer"];
        var keyByteArray = Encoding.ASCII.GetBytes(symmetricKeyAsBase64);
        var signiningKey = new SymmetricSecurityKey(keyByteArray);
        o.TokenValidationParameters=new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = signiningKey, //参数配置在下边
            ValidateIssuer = true,
            ValidIssuer = iss,//发行人
            ValidateAudience = true,
            ValidAudience = audienceConfig,//订阅人
            ValidateLifetime = true,
            //这个是缓冲过期时间，也就是说，即使我们配置了过期时间，这里也要考虑进去，过期时间+缓冲，默认好像是7分钟，可以直接设置为0。
            ClockSkew = TimeSpan.Zero,
        };
    });
~~~
划重点：我们用这个官方默认的方案，替换了自定义中间件的身份验证方案，从而达到了目的，说白了，就是官方封装了一套方案，这样就不用写中间件了。

### 3.3 配置官方认证中间件
配置官方认证中间件app.UseAuthentication()一定要保证顺序正确。
~~~
public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
{
    if (env.IsDevelopment())
    {
        app.UseDeveloperExceptionPage();
    }

    #region Swagger

    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json","ApiHelp v1");
        c.RoutePrefix = "";
    });

    #endregion

    app.UseRouting();

    //先开启认证
    app.UseAuthentication();
    //然后是授权中间件
    app.UseAuthorization();

    app.UseEndpoints(endpoints =>
    {
        endpoints.MapControllers();
    });
}
~~~

### 3.4 发起登录请求

![居然报错了](https://huihui_teresa.gitee.io/docs/image/youdao/2022022201.png)

**居然报错了，没找到原因，先留在这里吧！**