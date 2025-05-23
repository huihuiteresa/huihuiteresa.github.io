## 1、client_credentials
适用于和用户无关，机器与机器之间直接交互访问资源的场景。

这种模式一般只用在服务端与服务端之间的认证,在c#中请求令牌，认证服务器不提供像用户数据这样的重要资源，仅仅是有限的只读资源或者一些开放的API。

Ids4:
~~~
// 控制台客户端 客户端凭证模式
new Client
{
    ClientId = "credentials_client",
    ClientName = "Client Credentials Client",

    AllowedGrantTypes = GrantTypes.ClientCredentials,
    ClientSecrets = { new Secret("secret".Sha256()) },

    AllowedScopes = { "blog.core.api" }
},
~~~
Client Console:
~~~
using var client = new HttpClient();
var discoResponse = await client.GetDiscoveryDocumentAsync("http://localhost:5004");
if (discoResponse.IsError)
{
    Console.WriteLine(discoResponse.Error);
    return;
}

var tokenResponse = await client.RequestClientCredentialsTokenAsync(new ClientCredentialsTokenRequest
{
    Address = discoResponse.TokenEndpoint,
    ClientId = "Console",// 客户端id
    Scope = "blog.core.api",// 对应的受保护资源服务器id
    ClientSecret = "secret",
});

if (tokenResponse.IsError)
{
    Console.WriteLine(tokenResponse.Error);
    return;
}

Console.WriteLine(tokenResponse.Json);
client.SetBearerToken(tokenResponse.AccessToken);
// 获取access_token后，向资源服务器发起请求
var response = await client.GetAsync("http://localhost:8081/api/blog/1");
~~~

## 2、password
这种模式适用于鉴权服务器与资源服务器是高度相互信任的，例如两个服务都是同个团队或者同一公司开发的。该应用Client就使用你的密码，申请令牌，这种方式称为"密码式"（password）。

如果你对接的是第三方的客户端，请不要使用这个方案，因为第三方可能会记录你的认证平台的用户安全信息比如用户名和密码）

这种模式比客户端凭证模式的好处是多了用户信息，同时也可以自定义Claim声明。

ids4:
~~~
// 自定义claim
public static IEnumerable ApiScopes =>
new ApiScope[]
{
    new ApiScope("password_scope1")
};

public static IEnumerable ApiResources =>
 new ApiResource[]
 {
     new ApiResource("blog.core.api","api1")
     {
         Scopes={ "blog.core.api" },
         UserClaims={JwtClaimTypes.Role},  //添加Cliam 角色类型，同时，用户的claim也许配置！
         ApiSecrets={new Secret("apisecret".Sha256())}
     }
 };

        
 // 控制台客户端 密码模式
 new Client
 {
     ClientId = "password_client",
     ClientSecrets = { new Secret("secret".Sha256()) },
     AllowedGrantTypes = new List()
     {
         GrantTypes.ResourceOwnerPassword.FirstOrDefault(),
     },
     AllowedScopes = new List
     {
         "blog.core.api"
     }
 }
~~~

Client Console:
~~~
using var client = new HttpClient();
var discoResponse = awaitclient.GetDiscoveryDocumentAsync("http://localhost:5004");
if (discoResponse.IsError)
{
    Console.WriteLine(discoResponse.Error);
    return;
}
var tokenResponse = await client.RequestPasswordTokenAsync(newPasswordTokenRequest
{
    Address = discoResponse.TokenEndpoint,
    ClientId = "password_client",// 客户端id
    Scope = "blog.core.api",// 对应的受保护资源服务器id
    ClientSecret = "secret",
    UserName = "laozhang",// 这里的用户名密码，是我SeedData的时候导入的
    Password = "BlogIdp123$InitPwd"
});
if (tokenResponse.IsError)
{
    Console.WriteLine(tokenResponse.Error);
    return;
}
Console.WriteLine(tokenResponse.Json);
client.SetBearerToken(tokenResponse.AccessToken);
// 获取access_token后，向资源服务器发起请求
var response = await client.GetAsync("http://localhost:8081/api/blog/1");
~~~

## 3、implicit（MVC模式）
让用户自己在IdentityServer服务器进行登录验证，客户端不需要知道用户的密码，从而实现用户密码的安全性。

有些 Web 应用是纯前端应用，没有后端，必须将令牌储存在前端。这种方式没有授权码这个中间步骤，所以称为（授权码）"简化"（implicit）。

简化模式（implicit grant type）不通过第三方应用程序的服务器，直接在浏览器中向认证服务器申请令牌，跳过了"授权码"这个步骤

这种模式基于安全性考虑，建议把token时效设置短一些, 不支持refresh token

这种模式由于token携带在url中，安全性方面不能保证。不过，令牌的位置是 URL 锚点（fragment），而不是查询字符串（querystring），这是因为 OAuth 2.0 允许跳转网址是 HTTP 协议，因此存在"中间人攻击"的风险，而浏览器跳转时，锚点不会发到服务器，就减少了泄漏令牌的风险。

Ids4:
~~~
new Client
{
    ClientId = "Implicit_client",
    ClientName="Demo MVC Client",

    AllowedGrantTypes = GrantTypes.Implicit,
 
    RedirectUris = { "http://localhost:1003/signin-oidc" },
    PostLogoutRedirectUris = { "http://localhost:1003/signout-callback-oidc" },
    
    RequireConsent=true,

    AllowedScopes = new List
    {
        IdentityServerConstants.StandardScopes.OpenId,
        IdentityServerConstants.StandardScopes.Profile,
        IdentityServerConstants.StandardScopes.Email,
        "roles",
        "rolename",
        "blog.core.api"
    }
}
~~~
Client MVC:
~~~
services.AddAuthentication(options =>
{
    options.DefaultScheme = "Cookies";
    options.DefaultChallengeScheme = "oidc";
})
   .AddCookie("Cookies")
  .AddOpenIdConnect("oidc", options =>
  {
      options.Authority = "http://localhost:5004";
      options.RequireHttpsMetadata = false;
      options.ClientId = "Implicit_client";
      options.SaveTokens = true;
      options.GetClaimsFromUserInfoEndpoint = true;
  });
~~~

## 4、implicit（VUE模式）
ids4:
~~~
new Client {
    ClientId = "blogvuejs",
    ClientName = "Blog.Vue JavaScript Client",
    AllowedGrantTypes = GrantTypes.Implicit,
    AllowAccessTokensViaBrowser = true,

    RedirectUris =           {
        "http://vueblog.neters.club/callback",
        "http://apk.neters.club/oauth2-redirect.html",
        "http://localhost:6688/callback",
        "http://localhost:8081/oauth2-redirect.html",
    },
    PostLogoutRedirectUris = { "http://vueblog.neters.club","http://localhost:6688" },
    AllowedCorsOrigins =     { "http://vueblog.neters.club","http://localhost:6688" },

    AccessTokenLifetime=3600,

    AllowedScopes = {
        IdentityServerConstants.StandardScopes.OpenId,
        IdentityServerConstants.StandardScopes.Profile,
        "roles",
        "blog.core.api.BlogModule"
    }
},
~~~
Client Vue.js:
~~~
import { UserManager } from 'oidc-client'

class ApplicationUserManager extends UserManager {
  constructor () {
    super({
      authority: 'https://ids.neters.club',
      client_id: 'blogadminjs',
      redirect_uri: 'http://vueadmin.neters.club/callback',
      response_type: 'id_token token',
      scope: 'openid profile roles blog.core.api',
      post_logout_redirect_uri: 'http://vueadmin.neters.club'
    })
  }

  async login () {
    await this.signinRedirect()
    return this.getUser()
  }

  async logout () {
    return this.signoutRedirect()
  }
}
~~~

## 5、authorization_code
这种模式不同于简化模式，在于授权码模式不直接返回token，而是先返回一个授权码，然后再根据这个授权码去请求token。这显得更为安全。

通过多种授权模式中的授权码模式进行说明，主要针对介绍IdentityServer保护API的资源，授权码访问API资源。
Ids4:
~~~
new Client
{
    ClientId = "blazorserver",
    ClientSecrets = { new Secret("secret".Sha256()) },

    AllowedGrantTypes = GrantTypes.Code,
    RequireConsent = false,
    RequirePkce = true,
    AlwaysIncludeUserClaimsInIdToken=true,//将用户所有的claims包含在IdToken内
    AllowAccessTokensViaBrowser = true,

    // where to redirect to after login
    RedirectUris = { "https://mvp.neters.club/signin-oidc" },

    AllowedCorsOrigins =     { "https://mvp.neters.club" },
   
    // where to redirect to after logout
    PostLogoutRedirectUris = { "https://mvp.neters.club/signout-callback-oidc" },

    AllowedScopes = new List
    {
        IdentityServerConstants.StandardScopes.OpenId,
        IdentityServerConstants.StandardScopes.Profile,
        IdentityServerConstants.StandardScopes.Email,
        "roles",
        "rolename",
        "blog.core.api"
    }
},
~~~
Client MVC:
~~~
// 第一部分:认证方案的配置
// add cookie-based session management with OpenID Connect authentication
services.AddAuthentication(options =>
{
    options.DefaultScheme = "Cookies";
    options.DefaultChallengeScheme = "oidc";
})
.AddCookie("Cookies", options =>
{
    //options.Cookie.Name = "blazorclient";

    //options.ExpireTimeSpan = TimeSpan.FromHours(1);
    //options.SlidingExpiration = false;
})
.AddOpenIdConnect("oidc", options =>
{
    options.Authority = "https://ids.neters.club/";
    options.RequireHttpsMetadata = false;//必须https协议
    options.ClientId = "blazorserver"; // 75 seconds
    options.ClientSecret = "secret";
    options.ResponseType = "code";
    options.SaveTokens = true;

    // 为api在使用refresh_token的时候,配置offline_access作用域
    options.GetClaimsFromUserInfoEndpoint = true;
    // 作用域获取
    options.Scope.Clear();
    options.Scope.Add("roles");//"roles"
    options.Scope.Add("rolename");//"rolename"
    options.Scope.Add("blog.core.api");
    options.Scope.Add("profile");
    options.Scope.Add("openid");

    options.Events = new OpenIdConnectEvents
    {
        // called if user clicks Cancel during login
        OnAccessDenied = context =>
        {
            context.HandleResponse();
            context.Response.Redirect("/");
            return Task.CompletedTask;
        }
    };
});
~~~

## 6、hybrid
客户端根据ResponseType的不同，authorization endpoint返回可以分为三种情况："code id_token"、"code token"、"code id_token token"

适用于服务器端 Web 应用程序和原生桌面/移动应用程序，混合模式是简化模式和授权码模式的组合。

每当考虑使用授权码模式的时候，一般都是使用混合模式。

ids4:
~~~
new Client
{
    ClientId = "hybridclent",
    ClientName="Demo MVC Client",
    ClientSecrets = { new Secret("secret".Sha256()) },

    AllowedGrantTypes = GrantTypes.Hybrid,
    
    AllowAccessTokensViaBrowser = true,//返回类型包含token时候，配置
 
    RequirePkce = false,//v4.x需要配置这个

    RedirectUris = { "http://localhost:1003/signin-oidc" },
    PostLogoutRedirectUris = { "http://localhost:1003/signout-callback-oidc" },

    AllowOfflineAccess=true,
    AlwaysIncludeUserClaimsInIdToken=true,

    AllowedScopes = new List
    {
        IdentityServerConstants.StandardScopes.OpenId,
        IdentityServerConstants.StandardScopes.Profile,
        IdentityServerConstants.StandardScopes.Email,
        "roles",
        "rolename",
        "blog.core.api"
    }
}
~~~
Client MVC:
~~~
JwtSecurityTokenHandler.DefaultInboundClaimTypeMap.Clear();

// 认证方案的配置
services.AddAuthentication(options =>
{
    options.DefaultScheme = "Cookies";
    options.DefaultChallengeScheme = "oidc";
})
.AddCookie("Cookies", options =>
{
    options.AccessDeniedPath = "/Authorization/NoPermission";
})
.AddOpenIdConnect("oidc", options =>
{
    options.SignInScheme = "Cookies";

    options.Authority = "https://ids.neters.club";
    options.RequireHttpsMetadata = false;
    options.ClientId = "hybridclent";
    options.ClientSecret = "secret";

    options.ResponseType = "code id_token";

    options.GetClaimsFromUserInfoEndpoint = true;
    options.SaveTokens = true;


    // 为api在使用refresh_token的时候,配置offline_access作用域
    //options.GetClaimsFromUserInfoEndpoint = true;

    // 作用域获取
    options.Scope.Clear();
    options.Scope.Add("roles");
    options.Scope.Add("rolename");
    options.Scope.Add("blog.core.api");
    options.Scope.Add("profile");
    options.Scope.Add("openid");

    //options.ClaimActions.MapJsonKey("website", "website");

    options.TokenValidationParameters = new TokenValidationParameters
    {
        //映射 User.Name
        //NameClaimType = JwtClaimTypes.Name,
        //RoleClaimType = JwtClaimTypes.Role
    };
});
~~~

参考连接：[https://ids.neters.club/Grants/Config](https://ids.neters.club/Grants/Config)