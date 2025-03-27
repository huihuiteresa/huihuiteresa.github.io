
## 1.引用NuGet包
安装 Swashbuckle.AspNetCore

## 2.配置服务
Startup.cs类，编辑ConfigureServices类
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
});

#endregion
~~~

## 3.配置中间件
在Configure中，配置.UseSwagger()和.UseSwaggerUI()两个中间件的方法如下：
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
        c.SwaggerEndpoint("/swagger/v1/swagger.json","v1");
    });

    #endregion

    app.UseRouting();

    app.UseAuthorization();

    app.UseEndpoints(endpoints =>
    {
        endpoints.MapControllers();
    });
}
~~~

## 4.查看效果
运行程序访问 localhost:5000/swagger,界面如下：
![swagger界面](https://huihui_teresa.gitee.io/docs/image/youdao/2022021201.png)

## 5.Swagger额外配置
### 5.1 设置Swagger页面为首页-开发环境
修改launchSettings.json配置文件，修改launchUrl属性为swagger
~~~
"IIS Express": {
  "commandName": "IISExpress",
  "launchBrowser": true,
  "launchUrl": "swagger",
  "environmentVariables": {
    "ASPNETCORE_ENVIRONMENT": "Development"
  }
},
"SwiftCode.BBS.API": {
  "commandName": "Project",
  "dotnetRunMessages": "true",
  "launchBrowser": true,
  "launchUrl": "swagger",
  "applicationUrl": "http://localhost:5000",
  "environmentVariables": {
    "ASPNETCORE_ENVIRONMENT": "Development"
  }
}
~~~

### 5.2设置Swagger页面为首页-生产环境
在Configure中配置中间件
~~~
#region Swagger

app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json","ApiHelp v1");
    c.RoutePrefix = "";
});

#endregion
~~~
这样删除上面的launchUrl属性即可，这样设置以后，无论生成环境还是本地开发环境，都可以默认首页加载了。

## 6.给接口添加注释
给接口方法上添加注释：WeatherForecastController接口添加注释
~~~
/// <summary>
/// 天气预报
/// </summary>
[ApiController]
[Route("[controller]")]
public class WeatherForecastController : ControllerBase
{
    private static readonly string[] Summaries = new[]
    {
        "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
    };

    private readonly ILogger<WeatherForecastController> _logger;

    public WeatherForecastController(ILogger<WeatherForecastController> logger)
    {
        _logger = logger;
    }

    /// <summary>
    /// 获取天气
    /// </summary>
    /// <returns></returns>
    [HttpGet]
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
}
~~~

注释信息在Swagger中显示，选择“Web项目名称”=>属性=>生成，如下图：
![配置XML生成文档](https://huihui_teresa.gitee.io/docs/image/youdao/2022021301.png)

修改Startup.cs类的ConfigureServices方法：
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

});

#endregion
~~~
运行如下图：
![接口注释展示效果](https://huihui_teresa.gitee.io/docs/image/youdao/2022021302.png)

## 7.对Model也添加注释说明
1. 新建类库SwiftCode.BBS.Model
2. SwiftCode.BBS.API中的WeatherForecast类移动到SwiftCode.BBS.Model
~~~
/// <summary>
/// 天气预报
/// </summary>
public class WeatherForecast
{
    /// <summary>
    /// 时间
    /// </summary>
    public DateTime Date { get; set; }

    /// <summary>
    /// 摄氏温度
    /// </summary>
    public int TemperatureC { get; set; }

    /// <summary>
    /// 华氏温度
    /// </summary>
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);

    /// <summary>
    /// 摘要
    /// </summary>
    public string Summary { get; set; }
}
~~~
3. 当前API层直接引用Model层情况时，将Model层的XML输出到API层

![配置Model文档文件](https://huihui_teresa.gitee.io/docs/image/youdao/2022021303.png)

4.API层没有直接引用Model层，而是间接引用的情况，配置SwiftCode.BBS.Model项目的XML文档
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

    //配置SwiftCode.BBS.Model项目的XML文档
    var xmlModelPath = Path.Combine(basePath, "SwiftCode.BBS.Model.xml");
    c.IncludeXmlComments(xmlModelPath);

});

#endregion
~~~
运行界面显示如下：
![Swagger中的Model实体参数注释](https://huihui_teresa.gitee.io/docs/image/youdao/2022021304.png)

## 8.去掉Swagger警告提示
添加Swagger后，控制器不填写相应的注释，项目会有很多警告；可以修改项目如下图：
![属性配置参数，取消警告提示](https://huihui_teresa.gitee.io/docs/image/youdao/2022021305.png)

如果不想显示某些接口，可以直接在Controller上或者Action上，增加特性：
~~~
[ApiExplorerSettings(IgnoreApi = true)]
~~~