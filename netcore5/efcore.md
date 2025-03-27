## 1.实体Model数据层
1. Models文件夹中存放的是整个项目的数据库表实体类。
2. ViewModels文件夹中存放的是DTO实体类。在开发中，一般接口需要接收并返回的数据。
3. 负责消息数据的MessageModel
~~~
/// <summary>
/// 通用返回信息类
/// </summary>
/// <typeparam name="T"></typeparam>
public class MessageModel<T>
{
    /// <summary>
    /// 状态码
    /// </summary>
    public int Status { get; set; } = 200;

    /// <summary>
    /// 操作是否成功
    /// </summary>
    public bool Success { get; set; } = false;

    /// <summary>
    /// 返回信息
    /// </summary>
    public string Msg { get; set; } = "服务器异常";

    /// <summary>
    /// 返回数据集合
    /// </summary>
    public T Response { get; set; }
}
~~~
4. 负责表数据的TableModel
~~~
/// <summary>
/// 表格数据，支持分页
/// </summary>
/// <typeparam name="T"></typeparam>
public class TableModel<T>
{
    /// <summary>
    /// 返回编码
    /// </summary>
    public int Code { get; set; }

    /// <summary>
    /// 返回消息
    /// </summary>
    public string Msg { get; set; }

    /// <summary>
    /// 记录总数
    /// </summary>
    public int Count { get; set; }

    /// <summary>
    /// 返回数据集
    /// </summary>
    public List<T> Data { get; set; }
}
~~~

## 2.创建实体模型与数据库
### 2.1创建实体模型 Article
~~~
/// <summary>
/// 文章
/// </summary>
public class Article
{
    /// <summary>
    /// 主键
    /// </summary>
    public int Id { get; set; }
    /// <summary>
    /// 创建人
    /// </summary>
    public string Submitter { get; set; }

    /// <summary>
    /// 标题blog
    /// </summary>
    public string Title { get; set; }

    /// <summary>
    /// 类别
    /// </summary>
    public string Category { get; set; }

    /// <summary>
    /// 内容
    /// </summary>
    public string Content { get; set; }

    /// <summary>
    /// 访问量
    /// </summary>
    public int Traffic { get; set; }

    /// <summary>
    /// 评论数量
    /// </summary>
    public int CommentNum { get; set; }

    /// <summary> 
    /// 修改时间
    /// </summary>
    public DateTime UpdateTime { get; set; }

    /// <summary>
    /// 创建时间
    /// </summary>
    public DateTime CreateTime { get; set; }
    /// <summary>
    /// 备注
    /// </summary>
    public string Remark { get; set; }

    /// <summary>
    /// 逻辑删除
    /// </summary>
    public bool? IsDeleted { get; set; }
}
~~~

### 2.2创建文章仓储接口
在SwiftCode.BBS.IRepositories层创建文章仓储接口。
~~~
public interface IArticleRepository
{
    void Add(Article model);
    void Delete(Article model);
    void Update(Article model);
    List<Article> Query(Expression<Func<Article, bool>> whereExpression);
}
~~~
在SwiftCode.BBS.Repositories层创建文章仓储实现
~~~
public class ArticleRepository:IArticleRepository
{
    public void Add(Article model)
    {
        throw new NotImplementedException();
    }

    public void Delete(Article model)
    {
        throw new NotImplementedException();
    }

    public void Update(Article model)
    {
        throw new NotImplementedException();
    }

    public List<Article> Query(Expression<Func<Article, bool>> whereExpression)
    {
        throw new NotImplementedException();
    }
}
~~~

### 2.3创建数据库
SwiftCode.BBS.API层Nuget引入 Microsoft.EntityFrameworkCore.Design

SwiftCode.BBS.Repositories层Nuget引入 Microsoft.EntityFrameworkCore、Microsoft.EntityFrameworkCore.SqlServ、Microsoft.EntityFrameworkCore.Tools

然后SwiftCode.BBS.Repositories层的EfContext文件夹中创建SwiftCodeBbsContext，一个详细的上下文类，包含数据库链接字符串，数据表的映射方式。
~~~
public class SwiftCodeBbsContext:DbContext
{
    public SwiftCodeBbsContext()
    {
    }
    public SwiftCodeBbsContext(DbContextOptions<SwiftCodeBbsContext> options):base(options)
    {
    }

    public DbSet<Article> Articles { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Article>().Property(p => p.Title).HasMaxLength(128);
        modelBuilder.Entity<Article>().Property(p => p.Submitter).HasMaxLength(64);
        modelBuilder.Entity<Article>().Property(p => p.Category).HasMaxLength(256);
        //modelBuilder.Entity<Article>().Property(p => p.Content).HasMaxLength(128);
        modelBuilder.Entity<Article>().Property(p => p.Remark).HasMaxLength(1024);
    }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder
            .UseSqlServer(@"Server=.; Database=SwiftCodeBbs; Trusted_Connection=True; Connection Timeout=600;MultipleActiveResultSets=true;")
            .LogTo(Console.WriteLine, LogLevel.Information);
    }

}
~~~

在Nuget包管理控制台中，默认项目修改为SwiftCode.BBS.Repositories，输入命令 Add-Migration Add_Article 生成迁移文件，迁移生成完成后，输入Update-database生成数据库。

遇到问题：
1. 生成迁移文件报错
~~~
Unable to create an object of type 'SwiftCodeBbsContext'. For the different patterns supported at design time, see https://go.microsoft.com/fwlink/?linkid=851728
~~~
SwiftCodeBbsContext类添加空构造函数即可。
2. 更新数据库错误
~~~
Login failed. The login is from an untrusted domain and cannot be used with Integrated authentication.
~~~
数据库连接串 Trusted_Connection 属性值修改为False。

## 3.Article 服务调用
将Article实体模型的仓储和服务完善。

### 3.1 完善仓储实现
修改ArticleRepository 类
~~~
public class ArticleRepository:IArticleRepository
{
    private SwiftCodeBbsContext context;
    public ArticleRepository()
    {
        context=new SwiftCodeBbsContext();
    }

    public void Add(Article model)
    {
        context.Articles.Add(model);
        context.SaveChanges();
    }

    public void Delete(Article model)
    {
        context.Articles.Remove(model);
        context.SaveChanges();
    }

    public void Update(Article model)
    {
        context.Articles.Update(model);
        context.SaveChanges();
    }

    public List<Article> Query(Expression<Func<Article, bool>> whereExpression)
    {
        return context.Articles.Where(whereExpression).ToList();
    }
}
~~~

### 3.2补充Article服务
新建 IArticleService 类
~~~
namespace SwiftCode.BBS.IServices
{
    public interface IArticleService
    {
        void Add(Article model);
        void Delete(Article model);
        void Update(Article model);
        List<Article> Query(Expression<Func<Article, bool>> whereExpression);
    }
}
~~~
新建ArticleService类
~~~
namespace SwiftCode.BBS.Services
{
    public class ArticleService:IArticleService
    {
        public IArticleRepository dal=new ArticleRepository();
        public void Add(Article model)
        {
            dal.Add(model);
        }

        public void Delete(Article model)
        {
            dal.Delete(model);
        }

        public void Update(Article model)
        {
            dal.Update(model);
        }

        public List<Article> Query(Expression<Func<Article, bool>> whereExpression)
        {
            return dal.Query(whereExpression);
        }
    }
}
~~~

### 3.3调用 Article Controller
~~~
[Route("api/[controller]")]
[ApiController]
public class ArticleController : ControllerBase
{
    /// <summary>
    /// 根据Id查询文章
    /// </summary>
    /// <param name="id"></param>
    /// <returns></returns>
    [HttpGet("{id}",Name = "Get")]
    public List<Article> Get(int id)
    {
        var articleService = new ArticleService();
        return articleService.Query(a => a.Id == id);
    }
}
~~~
这样，在Swagger中即可调用Article接口。