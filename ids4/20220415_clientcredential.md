## 添加服务端(api)
#### 1.添加Nuget包
Nuget添加 IdentityServer4

#### 2.添加Config.cs配置类
~~~
public class Config
{
    /// <summary>
    /// 提示invalid_scope 添加
    /// </summary>
    public static IEnumerable<ApiScope> ApiScopes =>
        new ApiScope[] {new ApiScope("api")};
        
    public static IEnumerable<ApiResource> GetResources()
    {
        return new List<ApiResource>
        {
            new ApiResource("api","My Api")
        };
    }
    public static IEnumerable<Client> GetClients()
    {
        return new List<Client>
        {
            new Client
            {
                ClientId = "client",
                AllowedGrantTypes = GrantTypes.ClientCredentials,
                ClientSecrets =
                {
                    new Secret("secret".Sha256())
                },
                AllowedScopes = {"api"}
            }
        };
    }
}
~~~

#### 3.StartUp.cs修改
~~~
public void ConfigureServices(IServiceCollection services)
{
    services.AddIdentityServer()
        .AddDeveloperSigningCredential()
        .AddInMemoryApiResources(Config.GetResources())
        .AddInMemoryClients(Config.GetClients())
        //这个ApiScopes需要新加上，否则访问提示invalid_scope
        .AddInMemoryApiScopes(Config.ApiScopes)
        ;
    services.AddControllers();
}
public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
{
    if (env.IsDevelopment())
    {
        app.UseDeveloperExceptionPage();
    }

    app.UseRouting();

    app.UseIdentityServer();

    app.UseEndpoints(endpoints =>
    {
        endpoints.MapControllers();
    });
}
~~~

#### 4.查看IdentityServer4配置信息
http://localhost:5000/.well-known/openid-configuration 
~~~
{
	"issuer": "http://localhost:5000",
	"jwks_uri": "http://localhost:5000/.well-known/openid-configuration/jwks",
	"authorization_endpoint": "http://localhost:5000/connect/authorize",
	"token_endpoint": "http://localhost:5000/connect/token",
	"userinfo_endpoint": "http://localhost:5000/connect/userinfo",
	"end_session_endpoint": "http://localhost:5000/connect/endsession",
	"check_session_iframe": "http://localhost:5000/connect/checksession",
	"revocation_endpoint": "http://localhost:5000/connect/revocation",
	"introspection_endpoint": "http://localhost:5000/connect/introspect",
	"device_authorization_endpoint": "http://localhost:5000/connect/deviceauthorization",
	"frontchannel_logout_supported": true,
	"frontchannel_logout_session_supported": true,
	"backchannel_logout_supported": true,
	"backchannel_logout_session_supported": true,
	"scopes_supported": ["api", "offline_access"],
	"claims_supported": [],
	"grant_types_supported": ["authorization_code", "client_credentials", "refresh_token", "implicit", "urn:ietf:params:oauth:grant-type:device_code"],
	"response_types_supported": ["code", "token", "id_token", "id_token token", "code id_token", "code token", "code id_token token"],
	"response_modes_supported": ["form_post", "query", "fragment"],
	"token_endpoint_auth_methods_supported": ["client_secret_basic", "client_secret_post"],
	"id_token_signing_alg_values_supported": ["RS256"],
	"subject_types_supported": ["public"],
	"code_challenge_methods_supported": ["plain", "S256"],
	"request_parameter_supported": true
}
~~~

#### 5.获取token
* localhost:5000/connect/token
* post 请求
* body,x-www-form-urlencode添加参数
  * client_id：client
  * client_secret:secret
  * grant_type:client_credentials

~~~
{
    "access_token": "eyJhbGciOiJSUzI1NiIsImtpZCI6IkFDMEU3NUU4QzdGNjI0NkRBNjY2RDE5RjVCMDdCNjkyIiwidHlwIjoiYXQrand0In0.eyJuYmYiOjE2NDEzMTAxMjksImV4cCI6MTY0MTMxMzcyOSwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDo1MDAwIiwiY2xpZW50X2lkIjoiY2xpZW50IiwianRpIjoiNEZCMUNCMTU3ODJCNzgwM0U4NUQ2NTNCNTY0RkIzQzEiLCJpYXQiOjE2NDEzMTAxMjksInNjb3BlIjpbImFwaSJdfQ.ysbsX8tUFpg3QzHewF3-hR5soC2SBc0wCiqMBS3Y6TjYeCLud_W97s9t3DW8JmZR6HE5Kx9M6rakDx1xsgbzUuo9VXGQFQCI6Oe__ALzPDglkygRikr6QmQ7zOpKcefd2mFXP1ILLC8DUr-oUa9n_-SkixFMDVk4siIpv4bXG2sVIMFmo-hkBLwIS0SCe0o0sgzu_bfMBKIKtmbc89Kq2ZSe2abDIF7D6ecNS0nXUInh8B1uYiRohdB8jmfMRcE0qm5-ztrEIfOXhlfaI_dP0hGVOFNHYFqiFcLj-0ShqAYwijVNaGXtZ79agIacmozkmtWszEtvuE4VdlSiUcIBMw",
    "expires_in": 3600,
    "token_type": "Bearer",
    "scope": "api"
}
~~~
![获取token](https://huihui_teresa.gitee.io/docs/image/youdao/20220415001.png)


## 添加客户端（api）
#### 1.api添加[Authorize]
  ~~~
    [Authorize] //授权
    [ApiController]
    [Route("[controller]")]
    public class WeatherForecastController : ControllerBase{}
  ~~~
  
#### 2.startup.cs配置
1. Nuget安装 IdentityServer4.AccessTokenValidation
2. StartUp.cs 文件修改
~~~
public void ConfigureServices(IServiceCollection services)
{
    services.AddAuthentication("Bearer")
        .AddJwtBearer("Bearer",options =>
        {
            options.Authority = "http://localhost:5000";
            //如果不使用Https，则需要配置这个
            options.RequireHttpsMetadata = false;
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateAudience = false
            };
        })
        ;

    services.AddControllers();
}
public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
{
    if (env.IsDevelopment())
    {
        app.UseDeveloperExceptionPage();
    }
    app.UseRouting();
    app.UseAuthentication();
    app.UseAuthorization();
    app.UseEndpoints(endpoints =>
    {
        endpoints.MapControllers();
    });
}
~~~

#### 3.postman 调用
* url:http://localhost:5001/weatherforecast
* Headers key：Authorization
* headers value:
~~~
Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IkFDMEU3NUU4QzdGNjI0NkRBNjY2RDE5RjVCMDdCNjkyIiwidHlwIjoiYXQrand0In0.eyJuYmYiOjE2NDEzMTE5MDYsImV4cCI6MTY0MTMxNTUwNiwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDo1MDAwIiwiY2xpZW50X2lkIjoiY2xpZW50IiwianRpIjoiNUE1QzQzRTkzOTJGM0U0QTNCOTIxNThERkM4QjNDRjIiLCJpYXQiOjE2NDEzMTE5MDYsInNjb3BlIjpbImFwaSJdfQ.Tu1LhlxOCvLlxKbrpGEN6npvjLmLw2R3_GXkhqpZqIID09Sj5y5fRqZe2WQN2kXmxms8AHON6rS_DRePb7ZA_YVBk9DrWxL8QG3JpHor8RTk1qQZHxwfnlRtkGNqLsN9g7gBTxaAvzTInPwSE9EbFkUCvP_iGdawrvzwFPovcP31FlNWL4eUkINcsLr8nuPchIWjLaVRydrq8O_c_OBBURGiiCvN4YO-0VLPV3vaFjkv1MQxRR3UvxnfXFN1M1-nsHqXzLPXCdNi3ubh58nraKc4IjPHSm2M-1ELZ2htLOzLwtGTL37qtL1QOs-L5vZ7V1Zz7PpSNJa6ngnJ9pzgww
~~~
![获取token](https://huihui_teresa.gitee.io/docs/image/youdao/20220415002.png)

至此，postman调用成功。


## 第三方调用api
#### 1.创建控制台应用程序（ThirdPartyDemo）

#### 2.添加Nuget包
Nuget添加 IdentityModel

#### 3.具体代码
~~~
static async Task Main(string[] args)
{
    var client = new HttpClient();
    var disco = await client.GetDiscoveryDocumentAsync("http://localhost:5000");
    if (disco.IsError)
    {
        Console.WriteLine(disco.Error);
    }
    var tokenResponse = await client.RequestClientCredentialsTokenAsync(new ClientCredentialsTokenRequest
    {
        Address = disco.TokenEndpoint,
        ClientId = "client",
        ClientSecret = "secret",
        Scope = "api"
    });
    if (tokenResponse.IsError)
    {
        Console.WriteLine(tokenResponse.Error);
        return;
    }
    Console.WriteLine(tokenResponse.Json);

    //调用api
    var apiClient = new HttpClient();
    apiClient.SetBearerToken(tokenResponse.AccessToken);

    var response = await apiClient.GetAsync("http://localhost:5001/WeatherForecast");
    if (!response.IsSuccessStatusCode)
    {
        Console.WriteLine(response.StatusCode);
    }
    else
    {
        var content = await response.Content.ReadAsStringAsync();
        Console.WriteLine(JArray.Parse(content));
    }

    Console.ReadKey();
}
~~~
![aa](https://huihui_teresa.gitee.io/docs/image/youdao/20220415003.png)