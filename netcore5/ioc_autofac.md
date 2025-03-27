## 1.依赖注入
依赖注入是指程序运行过程中，如果需要调用另一个对象协助时，无序在代码中创建被调用者，而是依赖于外部的注入。依赖注入通常有两种：设值注入、构造注入。

## 2.什么是控制反转（IoC）
它不是什么技术，而是一种设计思想。简单来说就是把复杂系统分解成相互合作的对象，这些对象类通过封装后，内部实现对外部是透明的，从而降低了解决问题的复杂度，而且可以被灵活的重用和扩展。IoC理论提出的观点大体是这样的：借助于“第三方”实现具有依赖关系的对象之间的解耦。

## 3.依赖注入的理解和思考
使用依赖注入，有以下优点：
1. 传统的代码，每个对象负责管理与自己需要依赖的对象，导致如果需要切换依赖对象的实现类时，需要修改多处地方。同时，过度耦合也使得对象难以进行单元测试。
2. 依赖注入把对象的创造交给外部去管理，很好的解决了代码紧耦合的问题，是一种让代码实现松耦合的机制。
3. 松耦合让代码更具灵活性，能更好的的应对需求变动，以及方便单元测试。

## 4.常见的Ioc框架
ASP.Net Core 本身集成了一个轻量级的IoC容器：
1. AddSingleton 的生命周期：项目启动直至项目关闭，相当于静态类，只会有一个。
2. AddScope的生命周期：请求开始到请求结束，在这次请求中获取的对象都是同一个。
3. AddTransient的生命周期：请求获取（GC回收-主动释放）每一次获取的对象都不是同一个。
4. 

## 5.较好用的IoC框架使用——Autofac
使用Autofac接管ConfigureServices，新建类库SwiftCode.BBS.Extensions，Nuget安装Autofac.Extras.DynamicProxy和Autofac.Extensions.DependencyInjection。添加项目引用SwiftCode.BBS.IServices和SwiftCode.BBS.Services，新建ServiceExtensions文件夹并添加AutofacModuleRegister.cs。
~~~
namespace SwiftCode.BBS.Extensions.ServiceExtensions
{
    public class AutofacModuleRegister:Autofac.Module
    {
        protected override void Load (ContainerBuilder builder)
        {
            builder.RegisterType<ArticleService>().As<IArticleService>();
        }
    }
}
~~~
在SwiftCode.BBS.API中调整引用结构，移除SwiftCode.BBS.IServices和SwiftCode.BBS.Services类库的引用，添加SwiftCode.BBS.Extensions的引用，然后修改Program.cs
~~~
public static IHostBuilder CreateHostBuilder(string[] args) =>
    Host.CreateDefaultBuilder(args)
        .UseServiceProviderFactory(new AutofacServiceProviderFactory()) //autofac服务工厂
        .ConfigureWebHostDefaults(webBuilder =>
        {
            webBuilder.UseStartup<Startup>();
        });
~~~

在Startup.cs中增加如下方法：
~~~
public void ConfigureContainer(ContainerBuilder builder)
{
    builder.RegisterModule<AutofacModuleRegister>();
}
~~~

依赖注入有三种方式（构造方法注入、Setter方法注入和接口方式注入），平时基本采用构造方法注入，修改ArticleController控制器：
~~~
[Route("api/[controller]")]
[ApiController]
public class ArticleController : ControllerBase
{
    private readonly IArticleService _articleService;

    public ArticleController(IArticleService articleService)
    {
        _articleService = articleService;
    }

    /// <summary>
    /// 根据Id查询文章
    /// </summary>
    /// <param name="id"></param>
    /// <returns></returns>
    [HttpGet("{id}",Name = "Get")]
    public async Task<List<Article>> Get(int id)
    {
        return await _articleService.GetListAsync(d => d.Id == id);
    }
}
~~~

## 6.整个dll程序集批量注入
先对原引用进行解耦。

将SwiftCode.BBS.Services项目层引用改为SwiftCode.BBS.IRepositories和SwiftCode.BBS.IServices，并修改BaseService和ArticleService。
~~~
public class BaseServices<TEntity>:IBaseRepository<TEntity> where TEntity:class,new()
{
    private readonly IBaseRepository<TEntity> _baseRepository;

    public BaseServices(IBaseRepository<TEntity> baseDal)
    {
        _baseRepository = baseDal;
    }
    
    //...
}

public class ArticleService:BaseServices<Article>,IArticleService
{
    public ArticleService(IArticleRepository dal) : base(dal)
    {
    }
}
~~~

将SwiftCode.BBS.Extensions项目引用修改为SwiftCode.BBS.Services和SwiftCode.BBS.Repositories。修改AutofacModuleRegister通过反射将SwiftCode.BBS.Services和SwiftCode.BBS.Repositories两个程序集的全部方法注入：
~~~
public class AutofacModuleRegister:Autofac.Module
{
    protected override void Load (ContainerBuilder builder)
    {
        //builder.RegisterType<ArticleService>().As<IArticleService>();

        //要记得！！！这个注入是实现层，不是接口层！不是IServices
        var assemblysServices = Assembly.Load("SwiftCode.BBS.Services");
        //在LOAD方法中，指定要扫描的程序集的类库名称，这样系统会自动把改程序集中所有的接口和实现类注册到服务中
        builder.RegisterAssemblyTypes(assemblysServices).AsImplementedInterfaces();

        var assemblysResponsity = Assembly.Load("SwiftCode.BBS.Repositories");
        builder.RegisterAssemblyTypes(assemblysResponsity).AsImplementedInterfaces();
    }
}
~~~

将SwiftCode.BBS.Extensions修改为引用SwiftCode.BBS.IServices和SwiftCode.BBS.IRepositories。
~~~
public class AutofacModuleRegister:Autofac.Module
{
    protected override void Load (ContainerBuilder builder)
    {
        var basePath = AppContext.BaseDirectory;

        //builder.RegisterType<ArticleService>().As<IArticleService>();

        ////要记得！！！这个注入是实现层，不是接口层！不是IServices
        //var assemblysServices = Assembly.Load("SwiftCode.BBS.Services");
        ////在LOAD方法中，指定要扫描的程序集的类库名称，这样系统会自动把改程序集中所有的接口和实现类注册到服务中
        //builder.RegisterAssemblyTypes(assemblysServices).AsImplementedInterfaces();

        //var assemblysResponsity = Assembly.Load("SwiftCode.BBS.Repositories");
        //builder.RegisterAssemblyTypes(assemblysResponsity).AsImplementedInterfaces();

        var servicesDllFile = Path.Combine(basePath, "SwiftCode.BBS.Services.dll");
        var repositoryDllFile = Path.Combine(basePath, "SwiftCode.BBS.Repositories.dll");
        if (!(File.Exists(servicesDllFile) && File.Exists(repositoryDllFile)))
        {
            var msg = "Repositories.dll和Services.dll 丢失。";
            throw new Exception(msg);
        }
        var assemblysServices = Assembly.LoadFrom(servicesDllFile);
        builder.RegisterAssemblyTypes(assemblysServices).AsImplementedInterfaces();

        var assemblysRepository = Assembly.LoadFrom(repositoryDllFile);
        builder.RegisterAssemblyTypes(assemblysRepository).AsImplementedInterfaces();
    }
}
~~~

将SwiftCode.BBS.Services层和SwiftCode.BBS.Repositories层项目生成地址改成相对路径\SwiftCode.BBS.API\bin\Debug.

这个时候调试接口会发现报错，这是因为EntityFrameworkCore和DbContext都被我们写在了SwiftCode.BBS.IRepositories层，现在他们没有了依赖关系，就会因为找不到而无法注入，如下图所示：

![无法找到DbContext](https://huihui_teresa.gitee.io/docs/image/youdao/2022022701.png)

新增类库SwiftCode.BBS.EntityFramework添加项目引用SwiftCode.BBS.Model，将SwiftCode.BBS.Repositories层引用的EntityFrameworkCore包和DbContext移动到SwiftCode.BBS.EntityFramework层下，记得修改命名空间，然后SwiftCode.BBS.Repositories和SwiftCode.BBS.Extensions引用SwiftCode.BBS.EntityFramework，这样就成功将持久化分离出来了，修改SwiftCode.BBS.Repositories的BaseRepository和ArticleRepository通过构造函数注入并获取SwifCodeDbsContext.

nuget包：Microsoft.EntityFrameworkCore、Microsoft.EntityFrameworkCore.SqlServer、Microsoft.EntityFrameworkCore.Tools

~~~
public class BaseRepository<TEntity>:IBaseRepository<TEntity> where TEntity:class,new()
{
    private SwiftCodeBbsContext _context;

    public BaseRepository(SwiftCodeBbsContext context)
    {
        _context = context;
    }
}

public class ArticleRepository:BaseRepository<Article>,IArticleRepository
{
    public ArticleRepository(SwiftCodeBbsContext context) : base(context)
    {
    }
}
~~~

这样Swagger即可调试成功。