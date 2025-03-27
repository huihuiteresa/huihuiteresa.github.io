在之前的快速入门中，我们探讨了API访问和用户身份认证。现在我们把这两个部分结合在一起。

OpenID Connect和OAuth2.0组合的优点在于，您可以使用单一协议和单一交换使用令牌服务来使用这两种协议。

## 修改客户端配置
需要设置 AllowOfflineAccess，它允许我们通过刷新令牌的方式来实现长期的API访问。
~~~
new Client
{
    ClientId = "mvc",
    ClientSecrets = { new Secret("secret".Sha256()) },

    AllowedGrantTypes = GrantTypes.Code,

    // where to redirect to after login
    RedirectUris = { "https://localhost:5002/signin-oidc" },

    // where to redirect to after logout
    PostLogoutRedirectUris = { "https://localhost:5002/signout-callback-oidc" },

    AllowOfflineAccess = true,

    AllowedScopes = new List<string>
    {
        IdentityServerConstants.StandardScopes.OpenId,
        IdentityServerConstants.StandardScopes.Profile,
        "api1"
    }
}
~~~

## 修改MVC客户端
~~~
services.AddAuthentication(options =>
{
    options.DefaultScheme = "Cookies";
    options.DefaultChallengeScheme = "oidc";
})
    .AddCookie("Cookies")
    .AddOpenIdConnect("oidc", options =>
    {
        options.Authority = "https://localhost:5001";

        options.ClientId = "mvc";
        options.ClientSecret = "secret";
        options.ResponseType = "code";

        options.SaveTokens = true;

        options.Scope.Add("api1");
        options.Scope.Add("offline_access");
    });
~~~

## 添加需要访问的api(5002)
##### 1.修改startup.cs
~~~
public void ConfigureServices(IServiceCollection services)
{

    services.AddControllers();

    services.AddAuthentication("Bearer")
        .AddJwtBearer("Bearer", options =>
        {
            options.Authority = "http://localhost:5000";
            //如果不使用Https，则需要配置这个
            //options.RequireHttpsMetadata = false;
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateAudience = false
            };
        });
}

public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
{
    if (env.IsDevelopment())
    {
        app.UseDeveloperExceptionPage();
    }

    app.UseHttpsRedirection();

    app.UseRouting();

    app.UseAuthentication();
    app.UseAuthorization();

    app.UseEndpoints(endpoints =>
    {
        endpoints.MapControllers();
    });
}
~~~

##### 2.添加IdentityController.cs
~~~
namespace Api.Controllers
{
    [Route("identity")]
    [Authorize]
    public class IdentityController : ControllerBase
    {
        public IActionResult Get()
        {
            return new JsonResult(from c in User.Claims select new { c.Type, c.Value });
        }
    }
}
~~~

## 使用访问令牌
OpenID Connect 处理程序会自动为您保存令牌（在我们的案例中为身份令牌，访问令牌和刷新令牌）。这就是SaveTokens设置的作用。

从技术上讲，令牌存储在cookie中。访问它们的最简单方法是使用Microsoft.AspNetCore.Authentication命名空间中的扩展方法。
~~~
var accessToken = await HttpContext.GetTokenAsync("access_token")
var refreshToken = await HttpContext.GetTokenAsync("refresh_token");
~~~
要使用访问令牌访问API，您需要做的就是先获取访问令牌，然后在HttpClient上设置它：

MVV客户端，homecontroller添加如下代码：

~~~
public async Task<IActionResult> CallApi()
{
    var accessToken = await HttpContext.GetTokenAsync("access_token");

    var client = new HttpClient();
    client.DefaultRequestHeaders.Authorization=new AuthenticationHeaderValue("Bearer",accessToken);
    var content= await client.GetStringAsync("http://localhost:5001/identity");

    ViewBag.Json = JArray.Parse(content).ToString();
    return View("json");
}
~~~

创建一个名为json.cshtmljson 的视图：

~~~
<pre>@ViewBag.Json</pre>
~~~

启动MVC客户端并在身份验证后调用访问/home/CallApi以进行测试,显示如下图：

![aa](https://huihui_teresa.gitee.io/docs/image/youdao/20220505001.png)