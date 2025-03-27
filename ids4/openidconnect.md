
## 1.IdentityServer4 服务端(端口号：5000)
#### 1.1 创建Asp.Net Core WebApi.
#### 1.2 添加UI
~~~
dotnet new is4ui
~~~
#### 1.3 修改为支持mvc
~~~
public void ConfigureServices(IServiceCollection services)
{
    services.AddControllersWithViews();
}
public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
{
    if (env.IsDevelopment())
    {
        app.UseDeveloperExceptionPage();
    }

    app.UseHttpsRedirection();
    app.UseStaticFiles();

    app.UseRouting();

    app.UseAuthorization();

    app.UseEndpoints(endpoints =>
    {
        endpoints.MapControllerRoute(
            name: "default",
            pattern: "{controller=Home}/{action=Index}/{id?}");
    });
}
~~~

## 2.MVC客户端(端口号：5001)
#### 2.1 创建Asp.Net Core MVC 程序。
#### 2.2 添加Nuget包 Microsoft.AspNetCore.Authentication.OpenIdConnect。
#### 2.3 修改startup.cs
~~~
// This method gets called by the runtime. Use this method to add services to the container.
public void ConfigureServices(IServiceCollection services)
{
    services.AddControllersWithViews();

    JwtSecurityTokenHandler.DefaultMapInboundClaims = false;

    services.AddAuthentication(options =>
        {
            options.DefaultScheme = "Cookies";
            options.DefaultChallengeScheme = "oidc";
        })
        .AddCookie("Cookies")
        .AddOpenIdConnect("oidc", options =>
        {
            options.Authority = "https://localhost:5000";

            options.ClientId = "mvc";
            options.ClientSecret = "secret";
            options.ResponseType = "code";

            options.SaveTokens = true;
        });
}

// This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
{
    if (env.IsDevelopment())
    {
        app.UseDeveloperExceptionPage();
    }
    else
    {
        app.UseExceptionHandler("/Home/Error");
        // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
        app.UseHsts();
    }
    app.UseHttpsRedirection();
    app.UseStaticFiles();

    app.UseRouting();

    app.UseAuthentication();
    app.UseAuthorization();

    app.UseEndpoints(endpoints =>
    {
        endpoints.MapDefaultControllerRoute()
            .RequireAuthorization();
    });

    //app.UseEndpoints(endpoints =>
    //{
    //    endpoints.MapControllerRoute(
    //        name: "default",
    //        pattern: "{controller=Home}/{action=Index}/{id?}");
    //});
}
~~~
#### 2.4 修改home/index.cshtml
~~~
@using Microsoft.AspNetCore.Authentication

<h2>Claims</h2>

<dl>
    @foreach (var claim in User.Claims)
    {
        <dt>@claim.Type</dt>
        <dd>@claim.Value</dd>
    }
</dl>

<h2>Properties</h2>

<dl>
    @foreach (var prop in (await Context.AuthenticateAsync()).Properties.Items)
    {
        <dt>@prop.Key</dt>
        <dd>@prop.Value</dd>
    }
</dl>
~~~

## 3.修改MVC客户端
#### 3.1 Config.cs类如下：
~~~
public class Config
{
    /// <summary>
    /// 提示invalid_scope 添加
    /// </summary>
    public static IEnumerable<ApiScope> ApiScopes =>
        new[] { new ApiScope("api1") };

    public static IEnumerable<IdentityResource> IdentityResources =>
        new List<IdentityResource>
        {
            new IdentityResources.OpenId(),
            new IdentityResources.Profile(),
        };


    public static IEnumerable<Client> Clients =>
        new List<Client>
        {
            // machine to machine client (from quickstart 1)
            new Client
            {
                ClientId = "client",
                ClientSecrets = { new Secret("secret".Sha256()) },

                AllowedGrantTypes = GrantTypes.ClientCredentials,
                // scopes that client has access to
                AllowedScopes = { "api1" }
            },
            // interactive ASP.NET Core MVC client
            new Client
            {
                ClientId = "mvc",
                ClientSecrets = { new Secret("secret".Sha256()) },

                AllowedGrantTypes = GrantTypes.Code,

                // where to redirect to after login
                RedirectUris = { "https://localhost:5001/signin-oidc" },

                // where to redirect to after logout
                PostLogoutRedirectUris = { "https://localhost:5001/signout-callback-oidc" },

                AllowedScopes = new List<string>
                {
                    IdentityServerConstants.StandardScopes.OpenId,
                    IdentityServerConstants.StandardScopes.Profile
                }
            }
        };
}
~~~
#### 3.2 startup.cs修改如下：
~~~
// This method gets called by the runtime. Use this method to add services to the container.
public void ConfigureServices(IServiceCollection services)
{
    services.AddControllersWithViews();

    services.AddIdentityServer()
        .AddDeveloperSigningCredential()
        .AddInMemoryIdentityResources(Config.IdentityResources)
        .AddInMemoryApiScopes(Config.ApiScopes)
        .AddInMemoryClients(Config.Clients)
        .AddTestUsers(TestUsers.Users);
    ;
}

// This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
{
    if (env.IsDevelopment())
    {
        app.UseDeveloperExceptionPage();
    }

    app.UseHttpsRedirection();
    app.UseStaticFiles();

    app.UseRouting();

    //添加identityserver4
    app.UseIdentityServer();

    app.UseEndpoints(endpoints =>
    {
        endpoints.MapControllerRoute(
            name: "default",
            pattern: "{controller=Home}/{action=Index}/{id?}");
    });
}
~~~

登录页面如下：

![aa](https://huihui_teresa.gitee.io/docs/image/youdao/20220419001.png)

登录后页面跳转如下：

![aa](https://huihui_teresa.gitee.io/docs/image/youdao/20220419002.png)

## 4.添加注销
在客户端添加如下注销代码(随便那个控制器)：
~~~
public IActionResult Logout()
{
    return SignOut("Cookies", "oidc");
}
~~~

## 5.进一步的实验
~~~
.AddOpenIdConnect("oidc", options =>
{
    //.......
    options.Scope.Add("profile");
    options.GetClaimsFromUserInfoEndpoint = true;
    options.ClaimActions.MapUniqueJsonKey("myclaim1", "myclaim1");
    //.......
});
~~~



## 注意：
1. 需要使用https,否则Chrome浏览器有问题，登录后还是跳转到登录页面。
2. AddDeveloperSigningCredential,要加上这个，否则提示未配置证书。
