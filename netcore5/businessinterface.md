## 1.介绍
我们来实现一个BBS论坛系统，业务功能包含文章、问答两个主要板块，外加一个用户板块。

## 2.创建模型
先创建一个RootEntityTkey类，用来作为Entity的主键
~~~
namespace SwiftCode.BBS.Model.Models.RootTKey
{
    public class RootEntityTkey<Tkey> where Tkey:IEquatable<Tkey>
    {
        /// <summary>
        /// ID
        /// 泛型主键Tkey
        /// </summary>
        public Tkey Id { get; set; }
    }
}
~~~
Models文件夹下新建如下实体类：

UserInfo.cs
~~~
namespace SwiftCode.BBS.Model.Models
{
    /// <summary>
    /// 用户表
    /// </summary>
    public class UserInfo : RootEntityTkey<int>
    {
        /// <summary>
        /// 用户名
        /// </summary>
        public string UserName { get; set; }
        /// <summary>
        /// 登录账号
        /// </summary>
        public string LoginName { get; set; }
        /// <summary>
        /// 登录密码
        /// </summary>
        public string LoginPassWord { get; set; }
        /// <summary>
        /// 手机号
        /// </summary>
        public string Phone { get; set; }
        /// <summary>
        /// 个人介绍
        /// </summary>
        public string Introduction { get; set; }
        /// <summary>
        /// 邮箱
        /// </summary>
        public string Email { get; set; }
        /// <summary>
        /// 头像
        /// </summary>
        public string HeadPortrait { get; set; }
        /// <summary>
        /// 创建时间
        /// </summary>
        public DateTime CreateTime { get; set; }

    }
}
~~~
UserCollectionArticle.cs
~~~
namespace SwiftCode.BBS.Model.Models
{
    /// <summary>
    /// 用户文章收藏表
    /// </summary>
    public class UserCollectionArticle : RootEntityTkey<int>
    {
        public int UserId { get; set; }

        public int ArticleId { get; set; }
    }
}
~~~
Article.cs
~~~
namespace SwiftCode.BBS.Model.Models
{
    /// <summary>
    /// 文章
    /// </summary>
    public class Article : RootEntityTkey<int>
    {
        /// <summary>
        /// 标题
        /// </summary>
        public string Title { get; set; }
        /// <summary>
        /// 封面
        /// </summary>
        public string Cover { get; set; }
        /// <summary>
        /// 内容
        /// </summary>
        public string Content { get; set; }
        /// <summary>
        /// 类别
        /// </summary>
        public string Tag { get; set; }
        /// <summary>
        /// 访问量
        /// </summary>
        public int Traffic { get; set; }
        /// <summary>
        /// 创建时间
        /// </summary>
        public DateTime CreateTime { get; set; }
        /// <summary>
        /// 创建用户
        /// </summary>
        public int CreateUserId { get; set; }
        /// <summary>
        /// 创建用户
        /// </summary>
        public virtual UserInfo CreateUser { get; set; }
        /// <summary>
        /// 收藏文章的用户
        /// </summary>
        public virtual ICollection<UserCollectionArticle> CollectionArticles { get; set; } = new List<UserCollectionArticle>();
        /// <summary>
        /// 文章评论
        /// </summary>
        public virtual ICollection<ArticleComment> ArticleComments { get; set; } = new List<ArticleComment>();

    }
}
~~~
ArticleComment.cs
~~~
namespace SwiftCode.BBS.Model.Models
{
    /// <summary>
    /// 文章评论
    /// </summary>
    public class ArticleComment : RootEntityTkey<int>
    {
        /// <summary>
        /// 内容
        /// </summary>
        public string Content { get; set; }
        /// <summary>
        /// 创建时间
        /// </summary>
        public DateTime CreateTime { get; set; }
        /// <summary>
        /// 创建用户
        /// </summary>
        public int CreateUserId { get; set; }
        /// <summary>
        /// 创建用户
        /// </summary>
        public virtual UserInfo CreateUser { get; set; }


        /// <summary>
        /// 文章Id
        /// </summary>
        public int ArticleId { get; set; }

        /// <summary>
        /// 文章信息
        /// </summary>
        public virtual Article Article { get; set; }

    }
}
~~~
Question.cs
~~~
namespace SwiftCode.BBS.Model.Models
{
    /// <summary>
    /// 问答
    /// </summary>
    public class Question : RootEntityTkey<int>
    {
        /// <summary>
        /// 标题
        /// </summary>
        public string Title { get; set; }
        /// <summary>
        /// 内容
        /// </summary>
        public string Content { get; set; }
        /// <summary>
        /// 类别
        /// </summary>
        public string Tag { get; set; }
        /// <summary>
        /// 访问量
        /// </summary>
        public int Traffic { get; set; }
        /// <summary>
        /// 创建时间
        /// </summary>
        public DateTime CreateTime { get; set; }
        /// <summary>
        /// 创建用户
        /// </summary>
        public int CreateUserId { get; set; }
        /// <summary>
        /// 创建用户
        /// </summary>
        public virtual UserInfo CreateUser { get; set; }

        /// <summary>
        /// 问答评论
        /// </summary>
        public virtual ICollection<QuestionComment> QuestionComments { get; set; }

    }
}
~~~
QuestionComment.cs
~~~
namespace SwiftCode.BBS.Model.Models
{
    /// <summary>
    /// 问答评论
    /// </summary>
    public class QuestionComment : RootEntityTkey<int>
    {
        /// <summary>
        /// 内容
        /// </summary>
        public string Content { get; set; }
        /// <summary>
        /// 创建时间
        /// </summary>
        public DateTime CreateTime { get; set; }
        /// <summary>
        /// 是否采纳
        /// </summary>
        public bool IsAdoption { get; set; }
        /// <summary>
        /// 创建用户
        /// </summary>
        public int CreateUserId { get; set; }
        /// <summary>
        /// 创建用户
        /// </summary>
        public virtual UserInfo CreateUser { get; set; }
        /// <summary>
        /// 问答Id
        /// </summary>
        public int QuestionId { get; set; }
        /// <summary>
        /// 问答信息
        /// </summary>
        public virtual Question Question { get; set; }
    }
}
~~~
Advertisement.cs
~~~
namespace SwiftCode.BBS.Model.Models
{
    /// <summary>
    /// 广告
    /// </summary>
    public class Advertisement : RootEntityTkey<int>
    {
        /// <summary>
        /// 广告图片
        /// </summary>
        public string ImgUrl { get; set; }
        /// <summary>
        /// 广告链接
        /// </summary>
        public string Url { get; set; }
        /// <summary>
        /// 创建时间
        /// </summary>
        public DateTime CreateTime { get; set; }
    }
}
~~~

在SwitchCode.BBS.Model文件夹下新建ViewModels文件夹，用于创建Dto数据传输对象。

EntityTKeyDto.cs
~~~
namespace SwiftCode.BBS.Model.RooTKey
{
    public class EntityTKeyDto<Tkey> where Tkey : IEquatable<Tkey>
    {
        /// <summary>
        /// ID
        /// 泛型主键Tkey
        /// </summary>
        public Tkey Id { get; set; }

    }
}
~~~
UserInfoDto.cs
~~~
namespace SwiftCode.BBS.Model.ViewModels.UserInfo
{
    public class UserInfoDto : EntityTKeyDto<int>
    {

        /// <summary>
        /// 用户名
        /// </summary>
        public string UserName { get; set; }
        /// <summary>
        /// 头像
        /// </summary>
        public string HeadPortrait { get; set; }
        /// <summary>
        /// 文章数量
        /// </summary>
        public long ArticlesCount { get; set; }
        /// <summary>
        /// 问答数量
        /// </summary>
        public long QuestionsCount { get; set; }
    }
}
~~~
UserInfoDetailsDto.cs
~~~
namespace SwiftCode.BBS.Model.ViewModels.UserInfo
{
    public class UserInfoDetailsDto
    {
        /// <summary>
        /// 用户名
        /// </summary>
        public string UserName { get; set; }
        /// <summary>
        /// 手机号
        /// </summary>
        public string Phone { get; set; }
        /// <summary>
        /// 个人介绍
        /// </summary>
        public string Introduction { get; set; }
        /// <summary>
        /// 邮箱
        /// </summary>
        public string Email { get; set; }
        /// <summary>
        /// 头像
        /// </summary>
        public string HeadPortrait { get; set; }
    }
}
~~~
CreateUserInfoInputDto.cs
~~~
namespace SwiftCode.BBS.Model.ViewModels.UserInfo
{
    public class CreateUserInfoInputDto
    {
        /// <summary>
        /// 用户名
        /// </summary>
        public string UserName { get; set; }
        /// <summary>
        /// 登录账号
        /// </summary>
        public string LoginName { get; set; }
        /// <summary>
        /// 登录密码
        /// </summary>
        public string LoginPassWord { get; set; }
        /// <summary>
        /// 手机号
        /// </summary>
        public string Phone { get; set; }
        /// <summary>
        /// 个人介绍
        /// </summary>
        public string Introduction { get; set; }
        /// <summary>
        /// 邮箱
        /// </summary>
        public string Email { get; set; }
        /// <summary>
        /// 头像
        /// </summary>
        public string HeadPortrait { get; set; }

    }
}
~~~
UpdateUserInfoInputDto.cs
~~~
namespace SwiftCode.BBS.Model.ViewModels.UserInfo
{
    public class UpdateUserInfoInputDto
    {
        /// <summary>
        /// 个人介绍
        /// </summary>
        public string Introduction { get; set; }
        /// <summary>
        /// 邮箱
        /// </summary>
        public string Email { get; set; }
        /// <summary>
        /// 头像
        /// </summary>
        public string HeadPortrait { get; set; }
    }
}
~~~
ArticleDto.cs
~~~
namespace SwiftCode.BBS.Model.ViewModels.Article
{
    public class ArticleDto : EntityTKeyDto<int>
    {
        /// <summary>
        /// 标题
        /// </summary>
        public string Title { get; set; }
        /// <summary>
        /// 封面
        /// </summary>
        public string Cover { get; set; }
        /// <summary>
        /// 内容
        /// </summary>
        public string Content { get; set; }
        /// <summary>
        /// 类别
        /// </summary>
        public string Tag { get; set; }
        /// <summary>
        /// 创建时间
        /// </summary>
        public DateTime CreateTime { get; set; }
        /// <summary>
        /// 创建用户
        /// </summary>
        public int CreateUserId { get; set; }
        /// <summary>
        /// 用户名
        /// </summary>
        public string UserName { get; set; }
        /// <summary>
        /// 头像
        /// </summary>
        public string HeadPortrait { get; set; }
    }
}
~~~
ArticleDetailsDto.cs
~~~
namespace SwiftCode.BBS.Model.ViewModels.Article
{
    public class ArticleDetailsDto
    {
        /// <summary>
        /// 标题
        /// </summary>
        public string Title { get; set; }
        /// <summary>
        /// 封面
        /// </summary>
        public string Cover { get; set; }
        /// <summary>
        /// 内容
        /// </summary>
        public string Content { get; set; }
        /// <summary>
        /// 类别
        /// </summary>
        public string Tag { get; set; }
        /// <summary>
        /// 访问量
        /// </summary>
        public int Traffic { get; set; }
        /// <summary>
        /// 创建时间
        /// </summary>
        public DateTime CreateTime { get; set; }
        /// <summary>
        /// 创建用户
        /// </summary>
        public int CreateUserId { get; set; }

        /// <summary>
        /// 文章评论
        /// </summary>
        public List<ArticleCommentDto> ArticleComments { get; set; }
    }
}
~~~
CreateArticleInputDto.cs
~~~
namespace SwiftCode.BBS.Model.ViewModels.Article
{
    public class CreateArticleInputDto
    {
        /// <summary>
        /// 标题
        /// </summary>
        public string Title { get; set; }
        /// <summary>
        /// 封面
        /// </summary>
        public string Cover { get; set; }
        /// <summary>
        /// 内容
        /// </summary>
        public string Content { get; set; }
        /// <summary>
        /// 类别
        /// </summary>
        public string Tag { get; set; }
    }
}
~~~
UpdateArticleInputDto.cs
~~~
namespace SwiftCode.BBS.Model.ViewModels.Article
{
    public class UpdateArticleInputDto
    {

        /// <summary>
        /// 标题
        /// </summary>
        public string Title { get; set; }
        /// <summary>
        /// 封面
        /// </summary>
        public string Cover { get; set; }
        /// <summary>
        /// 内容
        /// </summary>
        public string Content { get; set; }
        /// <summary>
        /// 类别
        /// </summary>
        public string Tag { get; set; }
    }
}
~~~
ArticleCommentDto.cs
~~~
namespace SwiftCode.BBS.Model.ViewModels.Article
{
    public class ArticleCommentDto : EntityTKeyDto<int>
    {
        /// <summary>
        /// 内容
        /// </summary>
        public string Content { get; set; }
        /// <summary>
        /// 创建时间
        /// </summary>
        public DateTime CreateTime { get; set; }

        /// <summary>
        /// 创建用户
        /// </summary>
        public int CreateUserId { get; set; }

        /// <summary>
        /// 用户名
        /// </summary>
        public string UserName { get; set; }
        /// <summary>
        /// 头像
        /// </summary>
        public string HeadPortrait { get; set; }
    }
}
~~~
CreateArticleCommentsInputDto.cs
~~~
namespace SwiftCode.BBS.Model.ViewModels.Article
{
    public class CreateArticleCommentsInputDto
    {
        public string Content { get; set; }
    }
}
~~~
UpdateQuestionInputDto.cs
~~~
namespace SwiftCode.BBS.Model.ViewModels.Question
{
    public class UpdateQuestionInputDto
    {
        /// <summary>
        /// 标题
        /// </summary>
        public string Title { get; set; }
        /// <summary>
        /// 内容
        /// </summary>
        public string Content { get; set; }
        /// <summary>
        /// 类别
        /// </summary>
        public string Tag { get; set; }
    }
}
~~~
QuestionDto.cs
~~~
namespace SwiftCode.BBS.Model.ViewModels.Question
{
    public class QuestionDto : EntityTKeyDto<int>
    {

        /// <summary>
        /// 标题
        /// </summary>
        public string Title { get; set; }
        /// <summary>
        /// 类别
        /// </summary>
        public string Tag { get; set; }
        /// <summary>
        /// 创建时间
        /// </summary>
        public DateTime CreateTime { get; set; }
        /// <summary>
        /// 创建用户
        /// </summary>
        public int CreateUserId { get; set; }

        /// <summary>
        /// 问答数量
        /// </summary>
        public int QuestionCommentCount { get; set; }

    }
}
~~~
QuestionDetailsDto.cs
~~~
namespace SwiftCode.BBS.Model.ViewModels.Question
{
    public class QuestionDetailsDto
    {
        /// <summary>
        /// 标题
        /// </summary>
        public string Title { get; set; }
        /// <summary>
        /// 类别
        /// </summary>
        public string Tag { get; set; }
        /// <summary>
        /// 问答数量
        /// </summary>
        public int QuestionCommentCount { get; set; }

        /// <summary>
        /// 创建时间
        /// </summary>
        public DateTime CreateTime { get; set; }

        /// <summary>
        /// 问答评论
        /// </summary>
        public virtual List<QuestionCommentDto> QuestionComments { get; set; }
    }
}
~~~
QuestionCommentDto.cs
~~~
namespace SwiftCode.BBS.Model.ViewModels.Question
{
    public class QuestionCommentDto : EntityTKeyDto<int>
    {
        /// <summary>
        /// 内容
        /// </summary>
        public string Content { get; set; }
        /// <summary>
        /// 创建时间
        /// </summary>
        public DateTime CreateTime { get; set; }

        /// <summary>
        /// 是否采纳
        /// </summary>
        public bool IsAdoption { get; set; }

        /// <summary>
        /// 创建用户
        /// </summary>
        public int CreateUserId { get; set; }

        /// <summary>
        /// 用户名
        /// </summary>
        public string UserName { get; set; }
        /// <summary>
        /// 头像
        /// </summary>
        public string HeadPortrait { get; set; }
    }
}
~~~
CreateQuestionInputDto.cs
~~~
namespace SwiftCode.BBS.Model.ViewModels.Question
{
    public class CreateQuestionInputDto
    {
        /// <summary>
        /// 标题
        /// </summary>
        public string Title { get; set; }
        /// <summary>
        /// 内容
        /// </summary>
        public string Content { get; set; }
        /// <summary>
        /// 类别
        /// </summary>
        public string Tag { get; set; }
    }
}
~~~
CreateQuestionCommentsInputDto.cs
~~~
namespace SwiftCode.BBS.Model.ViewModels.Question
{
    public class CreateQuestionCommentsInputDto
    {
        public string Content { get; set; }
    }
}
~~~

## 3.配置上下文
在Code First方法中，我们可以通过Fluent API的方式来处理实体与数据表之间的映射关系。要使用Fluent API,必须在构造自定义的DbContext时重写OnModelCreating方法，在此方法内部调用Fluent API.
~~~
namespace SwiftCode.BBS.EntityFramework
{
    public class SwiftCodeBbsContext : DbContext
    {
        public SwiftCodeBbsContext()
        {

        }
        public SwiftCodeBbsContext(DbContextOptions<SwiftCodeBbsContext> options) : base(options)
        {
        }

        public DbSet<UserInfo> UserInfos { get; set; }
        public DbSet<Article> Articles { get; set; }
        public DbSet<Question> Questions { get; set; }
        public DbSet<ArticleComment> ArticleComments { get; set; }
        public DbSet<QuestionComment> QuestionComments { get; set; }
        public DbSet<Advertisement> Advertisements { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // 用户
            var userInfoCfg = modelBuilder.Entity<UserInfo>();
            userInfoCfg.Property(p => p.UserName).HasMaxLength(64);
            userInfoCfg.Property(p => p.LoginName).HasMaxLength(64);
            userInfoCfg.Property(p => p.LoginPassWord).HasMaxLength(128);
            userInfoCfg.Property(p => p.Phone).HasMaxLength(16);
            userInfoCfg.Property(p => p.Introduction).HasMaxLength(512);
            userInfoCfg.Property(p => p.Email).HasMaxLength(64);
            // userInfoCfg.Property(p => p.HeadPortrait).HasMaxLength(1024);
            userInfoCfg.Property(p => p.CreateTime).HasColumnType("datetime2");



            // 文章
            var articleCfg = modelBuilder.Entity<Article>();
            articleCfg.Property(p => p.Title).HasMaxLength(128);
            articleCfg.Property(p => p.Content).HasMaxLength(2048);
            articleCfg.Property(p => p.Tag).HasMaxLength(128);
            articleCfg.Property(p => p.CreateTime).HasColumnType("datetime2");
            articleCfg.HasOne(p => p.CreateUser).WithMany().HasForeignKey(p => p.CreateUserId).OnDelete(DeleteBehavior.Restrict); ;
            articleCfg.HasMany(p => p.CollectionArticles).WithOne().HasForeignKey(p => p.ArticleId).OnDelete(DeleteBehavior.Cascade);
            articleCfg.HasMany(p => p.ArticleComments).WithOne(p => p.Article).HasForeignKey(p => p.ArticleId).OnDelete(DeleteBehavior.Cascade);


            var articleCommentCfg = modelBuilder.Entity<ArticleComment>();
            articleCommentCfg.Property(p => p.Content).HasMaxLength(512);
            articleCommentCfg.Property(p => p.CreateTime).HasColumnType("datetime2");
            articleCommentCfg.HasOne(p => p.CreateUser).WithMany().HasForeignKey(p => p.CreateUserId).OnDelete(DeleteBehavior.Restrict);



            // 问答
            var questionCfg = modelBuilder.Entity<Question>();
            questionCfg.Property(p => p.Title).HasMaxLength(128);
            questionCfg.Property(p => p.Content).HasMaxLength(2048);
            questionCfg.Property(p => p.Tag).HasMaxLength(128);
            questionCfg.Property(p => p.CreateTime).HasColumnType("datetime2");
            questionCfg.HasOne(p => p.CreateUser).WithMany().HasForeignKey(p => p.CreateUserId).OnDelete(DeleteBehavior.Restrict);
            questionCfg.HasMany(p => p.QuestionComments).WithOne(p => p.Question).HasForeignKey(p => p.QuestionId).OnDelete(DeleteBehavior.Cascade);


            var questionCommentCfg = modelBuilder.Entity<QuestionComment>();
            questionCommentCfg.Property(p => p.Content).HasMaxLength(512);
            questionCommentCfg.Property(p => p.CreateTime).HasColumnType("datetime2");
            questionCommentCfg.HasOne(p => p.CreateUser).WithMany().HasForeignKey(p => p.CreateUserId).OnDelete(DeleteBehavior.Restrict);


            var advertisementCfg = modelBuilder.Entity<Advertisement>();
            advertisementCfg.Property(p => p.ImgUrl).HasMaxLength(1024);
            advertisementCfg.Property(p => p.Url).HasMaxLength(128);
        }

        //protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        //{
        //    optionsBuilder
        //        .UseSqlServer(@"Server=192.168.31.118;User ID=sa;Password=QWE!@qwe123; Database=SwiftCodeBbs; Trusted_Connection=False; Connection Timeout=600;MultipleActiveResultSets=true;")
        //        .LogTo(Console.WriteLine, LogLevel.Information);
        //}

    }
}
~~~
## 4.模型映射
#### 1.引入AutoMapper的相关包
在SwiftCode.BBS.Extensions层应用Nuget包，AutoMapper和AutoMapper.Extensions.Microsoft.DependencyInjection。

#### 2.添加映射文件
在SwiftCode.BBS.Extensions层添加文件夹AutoMapper，然后添加映射配置文件UserInfoProfile.cs用来匹配所有的映射对象关系。
~~~
public class UserInfoProfile:Profile
{
    /// <summary>
    /// 配置构造函数，用来创建关系映射
    /// </summary>
    public UserInfoProfile()
    {
        CreateMap<CreateUserInfoInputDto, UserInfo>();
        CreateMap<UserInfo, UserInfoDto>();

        CreateMap<UserInfo, UserInfoDetailsDto>();
    }
}

public class ArticlePorfile : Profile
{
    /// <summary>
    /// 配置构造函数，用来创建关系映射
    /// </summary>
    public ArticlePorfile()
    {
        CreateMap<CreateArticleInputDto, Article>();
        CreateMap<UpdateArticleInputDto, Article>();

        CreateMap<Article, ArticleDto>();
        CreateMap<Article, ArticleDetailsDto>();


        CreateMap<ArticleComment, ArticleCommentDto>()
            .ForMember(a => a.UserName, o => o.MapFrom(x => x.CreateUser.UserName))
            .ForMember(a => a.HeadPortrait, o => o.MapFrom(x => x.CreateUser.HeadPortrait));


        CreateMap<CreateArticleCommentsInputDto, ArticleComment>();
    }
}

public class QuestionProfile : Profile
{
    public QuestionProfile()
    {
        CreateMap<CreateQuestionInputDto, Question>();
        CreateMap<UpdateQuestionInputDto, Question>();

        CreateMap<Question, QuestionDto>()
            .ForMember(a => a.QuestionCommentCount, o => o.MapFrom(x => x.QuestionComments.Count));

        CreateMap<Question, QuestionDetailsDto>();


        CreateMap<QuestionComment, QuestionCommentDto>()
            .ForMember(a => a.UserName, o => o.MapFrom(x => x.CreateUser.UserName))
            .ForMember(a => a.HeadPortrait, o => o.MapFrom(x => x.CreateUser.HeadPortrait));


        CreateMap<CreateQuestionCommentsInputDto, QuestionComment>();
    }
}
~~~

#### 3.使用AutoMapper实现模型映射，并注入
在SwiftCode.BBS.Extensions层的ServiceExtensions文件夹中添加AutoMapperSetup.cs,在创建的文件夹AutoMapper中添加AutoMapperConfig.cs.
~~~
namespace SwiftCode.BBS.Extensions.ServiceExtensions
{
    public static class AutoMapperSetup
    {
        public static void AddAutoMapperSetup(this IServiceCollection services)
        {
            if(services==null) throw new ArgumentNullException(nameof(services));

            services.AddAutoMapper(typeof(AutoMapperConfig));
        }
    }
}

namespace SwiftCode.BBS.Extensions.AutoMapper
{
    /// <summary>
    /// 静态全局AutoMapper配置文件
    /// </summary>
    public class AutoMapperConfig
    {
        public static MapperConfiguration RegisterMappings()
        {
            return new MapperConfiguration(cfg=>{
                cfg.AddProfile(new UserInfoProfile());
                cfg.AddProfile(new ArticlePorfile());
                cfg.AddProfile(new QuestionProfile());
            });
        }
    }
}
~~~

记得在Startup.cs中调用Automapper启动服务
~~~
//调用AutoMapper启动服务
//需要安装Microsoft.Entity Framework Code.Proxies
services.AddDbContext<SwiftCodeBbsContext>(o =>
    o.UseLazyLoadingProxies().UseSqlServer(
        @"Server.;Database=SwiftCodeDbs;Trusted_Connection=True;Connection Timeout=600;MultipleActiveResultSets=true;"
        , oo => oo.MigrationsAssembly("SwiftCode.BBS.Entity Framework"))
);
services.AddSingleton(new Appsettings(Configuration));
services.AddAutoMapperSetup();
~~~

## 5.注入泛型仓储
这里又两种使用方式，一种是给每一个Entity创建一个仓储接口、仓储实现以及服务接口和服务实现，也可以使用简单的方式——直接使用泛型仓储，修改SwiftCode.BBS.Extensions层下的AutofacModuleRegister类，注入泛型仓储：
~~~
namespace SwiftCode.BBS.Extensions.ServiceExtensions
{
    public class AutofacModuleRegister:Autofac.Module
    {
        protected override void Load (ContainerBuilder builder)
        {
            builder.RegisterGeneric(typeof(BaseRepository<>)).As(typeof(IBaseRepository<>)).InstancePerDependency();
            builder.RegisterGeneric(typeof(BaseServices<>)).As(typeof(IBaseServices<>)).InstancePerDependency();
            //要记得！！！这个注入是实现层，不是接口层！不是IServices
            var assemblysServices = Assembly.Load("SwiftCode.BBS.Services");
            //在LOAD方法中，指定要扫描的程序集的类库名称，这样系统会自动把改程序集中所有的接口和实现类注册到服务中
            builder.RegisterAssemblyTypes(assemblysServices).AsImplementedInterfaces();

            var assemblysRepository = Assembly.Load("SwiftCode.BBS.Repositories"); //模式是Load（解决方案名）
            builder.RegisterAssemblyTypes(assemblysRepository).AsImplementedInterfaces();
        }
    }
}
~~~

## 6.业务接口实现
下面会对每个业务接口和需要注意的细节进行讲解，需要注意的功能也会在代码中添加注释。

两个公共类
~~~
namespace SwiftCode.BBS.Model
{
    /// <summary>
    /// 通用返回信息类
    /// </summary>
    public class MessageModel<T>
    {
        /// <summary>
        /// 状态码
        /// </summary>
        public int status { get; set; } = 200;
        /// <summary>
        /// 操作是否成功
        /// </summary>
        public bool success { get; set; } = false;
        /// <summary>
        /// 返回信息
        /// </summary>
        public string msg { get; set; } = "服务器异常";
        /// <summary>
        /// 返回数据集合
        /// </summary>
        public T response { get; set; }
    }
}

namespace SwiftCode.BBS.Model
{
    /// <summary>
    /// 表格数据，支持分页
    /// </summary>
    public class TableModel<T>
    {
        /// <summary>
        /// 返回编码
        /// </summary>
        public int Code { get; set; }
        /// <summary>
        /// 返回信息
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
}
~~~


#### 6.1授权接口
在SwiftCode.BBS.API层创建AuthController控制器，通过构造函数注入泛型仓储，授权登录接口主要负责注册和登录，采用的是JWT进行授权认证，密码记得要加密，注册时不要出现重复注册。

使用IMapper可以帮助我们进行数据模型转换。
~~~
namespace SwiftCode.BBS.API.Controllers
{
    /// <summary>
    /// 授权
    /// </summary>
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IBaseServices<UserInfo> _userInfoServices;
        private readonly IMapper _mapper;

        public AuthController(IBaseServices<UserInfo> userInfoServices,IMapper mapper)
        {
            _userInfoServices = userInfoServices;
            _mapper = mapper;
        }

        /// <summary>
        /// 登录
        /// </summary>
        /// <param name="loginName"></param>
        /// <param name="loginPassword"></param>
        /// <returns></returns>
        [HttpGet]
        public async Task<MessageModel<string>> Login(string loginName, string loginPassword)
        {
            var jwtStr = string.Empty;
            if(string.IsNullOrEmpty(loginName) || string.IsNullOrEmpty(loginPassword))
                return new MessageModel<string>
                {
                    success = false,
                    msg = "用户名或密码不能为空！"
                };

            var pass = MD5Helper.MD5Encrypt32(loginPassword);
            var userInfo = await _userInfoServices.GetAsync(x => x.LoginName == loginName && x.LoginPassWord == pass);
            if(userInfo==null) 
                return new MessageModel<string>
                {
                    success = false,
                    msg = "认证失败！"
                };

            jwtStr = GetUserJwt(userInfo);

            return new MessageModel<string>
            {
                success = true,
                msg = "获取成功",
                response = jwtStr
            };
        }

        /// <summary>
        /// 注册
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>
        [HttpPost]
        public async Task<MessageModel<string>> Register(CreateUserInfoInputDto input)
        {
            var userInfo =await _userInfoServices.FindAsync(x => x.LoginName == input.LoginName);
            if(userInfo!=null)
                return new MessageModel<string>
                {
                    success = false,
                    msg = "账号已存在"
                };

            userInfo = await _userInfoServices.FindAsync(x => x.Email == input.Email);
            if(userInfo!=null)
                return new MessageModel<string>
                {
                    success = false,
                    msg = "邮箱已存在"
                };

            userInfo = await _userInfoServices.FindAsync(x => x.Phone == input.Phone);
            if(userInfo!=null)
                return new MessageModel<string>
                {
                    success = false,
                    msg = "手机号已存在"
                };

            userInfo = await _userInfoServices.FindAsync(x => x.UserName == input.UserName);
            if(userInfo!=null)
                return new MessageModel<string>
                {
                    success = false,
                    msg = "用户名已存在"
                };
            input.LoginPassWord = MD5Helper.MD5Encrypt32(input.LoginPassWord);

            var user = _mapper.Map<UserInfo>(input);
            user.CreateTime=DateTime.Now;
            await _userInfoServices.InsertAsync(user, true);
            var jwtStr = GetUserJwt(user);

            return new MessageModel<string>
            {
                success = true,
                msg = "注册成功",
                response = jwtStr
            };
        }


        private string GetUserJwt(UserInfo userInfo)
        {
            var tokenModel = new TokenModelJwt {Uid = userInfo.Id, Role = "User"};
            var jwtStr = JwtHelper.IssueJwt(tokenModel);
            return jwtStr;

        }
    }
}
~~~

MD5加密类，放在SwiftCode.BBS.Common项目的Helper文件夹下：
~~~
namespace SwiftCode.BBS.Common.Helper
{
    public class MD5Helper
    {
        /// <summary>
        /// 16位MD5加密
        /// </summary>
        /// <param name="password"></param>
        /// <returns></returns>
        public static string MD5Encrypt16(string password)
        {
            var md5 = new MD5CryptoServiceProvider();
            string t2 = BitConverter.ToString(md5.ComputeHash(Encoding.Default.GetBytes(password)), 4, 8);
            t2 = t2.Replace("-", string.Empty);
            return t2;
        }

        /// <summary>
        /// 32位MD5加密
        /// </summary>
        /// <param name="password"></param>
        /// <returns></returns>
        public static string MD5Encrypt32(string password = "")
        {
            string pwd = string.Empty;
            try
            {
                if (!string.IsNullOrEmpty(password) && !string.IsNullOrWhiteSpace(password))
                {
                    MD5 md5 = MD5.Create(); //实例化一个md5对像
                    // 加密后是一个字节类型的数组，这里要注意编码UTF8/Unicode等的选择　
                    byte[] s = md5.ComputeHash(Encoding.UTF8.GetBytes(password));
                    // 通过使用循环，将字节类型的数组转换为字符串，此字符串是常规字符格式化所得
                    foreach (var item in s)
                    {
                        // 将得到的字符串使用十六进制类型格式。格式后的字符是小写的字母，如果使用大写（X）则格式后的字符是大写字符 
                        pwd = string.Concat(pwd, item.ToString("X2"));
                    }
                }
            }
            catch
            {
                throw new Exception($"错误的 password 字符串:【{password}】");
            }
            return pwd;
        }

        /// <summary>
        /// 64位MD5加密
        /// </summary>
        /// <param name="password"></param>
        /// <returns></returns>
        public static string MD5Encrypt64(string password)
        {
            // 实例化一个md5对像
            // 加密后是一个字节类型的数组，这里要注意编码UTF8/Unicode等的选择　
            MD5 md5 = MD5.Create();
            byte[] s = md5.ComputeHash(Encoding.UTF8.GetBytes(password));
            return Convert.ToBase64String(s);
        }

    }
}
~~~

#### 6.2文章接口
文章接口中我们使用了自定义服务接口IArticleServices来完成业务处理，在GetList方法中通过循环将业务模型组合成Dto并返回。

其中自定义服务中使用的是自定义仓储，在仓储中我们使用Include和ThenInclude查询导航属性数据。
~~~
namespace SwiftCode.BBS.API.Controllers
{
    /// <summary>
    /// 文章
    /// </summary>
    [Route("api/[controller]/[action]")]
    [ApiController]
    [Authorize]
    public class ArticleController : ControllerBase
    {
        private readonly IArticleService _articleServices;
        private readonly IBaseServices<UserInfo> _userInfoServices;
        private readonly IMapper _mapper;

        public ArticleController(IArticleService articleService,IBaseServices<UserInfo> userInfoServices,IMapper mapper)
        {
            _articleServices = articleService;
            _userInfoServices = userInfoServices;
            _mapper = mapper;
        }

        /// <summary>
        /// 分页获取文章列表
        /// </summary>
        /// <param name="page"></param>
        /// <param name="pageSize"></param>
        /// <returns></returns>
        [HttpGet]
        public async Task<MessageModel<List<ArticleDto>>> GetList(int page, int pageSize)
        {
            //这里只是展示用法，还可以通过懒加载的形式或自定义仓储去Include UserInfo
            var entityList = await _articleServices.GetPagedListAsync(page, pageSize, nameof(Article.CreateTime));
            var articleUserIdList = entityList.Select(x => x.CreateUserId);
            var userList = await _userInfoServices.GetListAsync(x => articleUserIdList.Contains(x.Id));
            var response = _mapper.Map<List<ArticleDto>>(entityList);
            foreach (var item in response)
            {
                var user = userList.FirstOrDefault(x => x.Id == item.CreateUserId);
                item.UserName = user?.UserName;
                item.HeadPortrait = user?.HeadPortrait;
            }

            return new MessageModel<List<ArticleDto>>
            {
                success = true,
                msg = "获取成功",
                response = response
            };
        }

        /// <summary>
        /// 根据Id查询文章
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet]
        public async Task<MessageModel<ArticleDetailsDto>> Get(int id)
        {
            // 通过自定义服务层处理内部业务
            var entity = await _articleServices.GetArticleDetailsAsync(id);
            var result = _mapper.Map<ArticleDetailsDto>(entity);
            return new MessageModel<ArticleDetailsDto>()
            {
                success = true,
                msg = "获取成功",
                response = result
            };
        }


        /// <summary>
        /// 创建文章
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        public async Task<MessageModel<string>> CreateAsync(CreateArticleInputDto input)
        {
            var token = JwtHelper.ParsingJwtToken(HttpContext);

            var entity = _mapper.Map<Article>(input);
            entity.CreateTime = DateTime.Now;
            entity.CreateUserId = token.Uid;
            await _articleServices.InsertAsync(entity, true);

            return new MessageModel<string>()
            {
                success = true,
                msg = "创建成功"
            };
        }

        /// <summary>
        /// 修改文章
        /// </summary>
        [HttpPut]
        public async Task<MessageModel<string>> UpdateAsync(int id, UpdateArticleInputDto input)
        {
            var entity = await _articleServices.GetAsync(d => d.Id == id);

            entity = _mapper.Map(input, entity);

            await _articleServices.UpdateAsync(entity, true);
            return new MessageModel<string>()
            {
                success = true,
                msg = "修改成功"
            };
        }

        /// <summary>
        /// 删除文章
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpDelete]
        public async Task<MessageModel<string>> DeleteAsync(int id)
        {
            var entity = await _articleServices.GetAsync(d => d.Id == id);
            await _articleServices.DeleteAsync(entity, true);
            return new MessageModel<string>()
            {
                success = true,
                msg = "删除成功"
            };
        }

        /// <summary>
        /// 收藏文章
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpPost("{id}", Name = "CreateCollection")]
        public async Task<MessageModel<string>> CreateCollectionAsync(int id)
        {
            var token = JwtHelper.ParsingJwtToken(HttpContext);
            await _articleServices.AddArticleCollection(id, token.Uid);
            return new MessageModel<string>()
            {
                success = true,
                msg = "收藏成功"
            };
        }


        /// <summary>
        /// 添加文章评论
        /// </summary>
        /// <param name="id"></param>
        /// <param name="input"></param>
        /// <returns></returns>
        [HttpPost(Name = "CreateArticleComments")]
        public async Task<MessageModel<string>> CreateArticleCommentsAsync(int id, CreateArticleCommentsInputDto input)
        {
            var token = JwtHelper.ParsingJwtToken(HttpContext);
            await _articleServices.AddArticleComments(id, token.Uid, input.Content);
            return new MessageModel<string>()
            {
                success = true,
                msg = "评论成功"
            };
        }


        /// <summary>
        /// 删除文章评论
        /// </summary>
        /// <param name="articleId"></param>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpDelete(Name = "DeleteArticleComments")]
        public async Task<MessageModel<string>> DeleteArticleCommentsAsync(int articleId, int id)
        {
            var entity = await _articleServices.GetByIdAsync(articleId);
            entity.ArticleComments.Remove(entity.ArticleComments.FirstOrDefault(x => x.Id == id));
            await _articleServices.UpdateAsync(entity, true);
            return new MessageModel<string>()
            {
                success = true,
                msg = "删除评论成功"
            };
        }

    }
}

namespace SwiftCode.BBS.IServices
{
    public interface IArticleService:IBaseServices<Article>
    {
        Task<Article> GetByIdAsync(int id, CancellationToken cancellationToken = default);

        Task<Article> GetArticleDetailsAsync(int id, CancellationToken cancellationToken = default);

        Task AddArticleCollection(int id, int userId, CancellationToken cancellationToken = default);

        Task AddArticleComments(int id, int userId, string content, CancellationToken cancellationToken = default);
    }
}

namespace SwiftCode.BBS.Services
{
    public class ArticleServices : BaseServices<Article>, IArticleService
    {
        private readonly IArticleRepository _articleRepository;
        public ArticleServices(IBaseRepository<Article> baseRepository, IArticleRepository articleRepository) : base(baseRepository)
        {
            _articleRepository = articleRepository;
        }


        public Task<Article> GetByIdAsync(int id, CancellationToken cancellationToken = default)
        {
            return _articleRepository.GetByIdAsync(id, cancellationToken);
        }

        public async Task<Article> GetArticleDetailsAsync(int id, CancellationToken cancellationToken = default)
        {
            var entity = await _articleRepository.GetByIdAsync(id, cancellationToken);
            entity.Traffic += 1;

            await _articleRepository.UpdateAsync(entity, true, cancellationToken: cancellationToken);

            return entity;
        }

        public async Task AddArticleCollection(int id, int userId, CancellationToken cancellationToken = default)
        {
            var entity = await _articleRepository.GetCollectionArticlesByIdAsync(id, cancellationToken);
            entity.CollectionArticles.Add(new UserCollectionArticle()
            {
                ArticleId = id,
                UserId = userId
            });
            await _articleRepository.UpdateAsync(entity, true, cancellationToken);
        }

        public async Task AddArticleComments(int id, int userId, string content, CancellationToken cancellationToken = default)
        {
            var entity = await _articleRepository.GetByIdAsync(id, cancellationToken);
            entity.ArticleComments.Add(new ArticleComment()
            {
                Content = content,
                CreateTime = DateTime.Now,
                CreateUserId = userId
            });
            await _articleRepository.UpdateAsync(entity, true, cancellationToken);
        }

    }
}

namespace SwiftCode.BBS.IRepositories
{
    public interface IArticleRepository : IBaseRepository<Article>
    {

        Task<Article> GetByIdAsync(int id, CancellationToken cancellationToken = default);

        Task<Article> GetCollectionArticlesByIdAsync(int id, CancellationToken cancellationToken = default);
    }
}

namespace SwiftCode.BBS.Repositories
{
    public class ArticleRepository : BaseRepository<Article>, IArticleRepository
    {
        public ArticleRepository(SwiftCodeBbsContext context) : base(context)
        {
        }

        public Task<Article> GetByIdAsync(int id, CancellationToken cancellationToken = default)
        {
            return DbContext().Articles.Where(x => x.Id == id)
                .Include(x => x.ArticleComments).ThenInclude(x => x.CreateUser).SingleOrDefaultAsync(cancellationToken);
        }

        public Task<Article> GetCollectionArticlesByIdAsync(int id, CancellationToken cancellationToken = default)
        {
            return DbContext().Articles.Where(x => x.Id == id)
                .Include(x => x.CollectionArticles).SingleOrDefaultAsync(cancellationToken);
        }


    }
}
~~~
JwtHelper添加ParsingJwtToken方法：
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

        /// <summary>
        /// 授权解析jwt
        /// </summary>
        /// <param name="httpContext"></param>
        /// <returns></returns>
        public static TokenModelJwt ParsingJwtToken(HttpContext httpContext)
        {
            if (!httpContext.Request.Headers.ContainsKey("Authorization"))
                return null;
            var tokenHeader = httpContext.Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
            TokenModelJwt tm = SerializeJwt(tokenHeader);
            return tm;
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
        public int Uid { get; set; }

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

#### 6.3问答接口
在SwiftCode.BBS.EntityFramework层引入Microsoft.EntityFrameworkCore.Proxies，并在Startup.cs中修改ConfigureServices方法开启懒加载。

Startup.cs修改：
~~~
services.AddDbContext<SwiftCodeBbsContext>(o =>
                o.UseLazyLoadingProxies().UseSqlServer(
                    @"Server.;Database=SwiftCodeDbs;Trusted_Connection=True;Connection Timeout=600;MultipleActiveResultSets=true;"
                    , oo => oo.MigrationsAssembly("SwiftCode.BBS.EntityFramework"))
~~~

~~~
namespace SwiftCode.BBS.API.Controllers
{
    /// <summary>
    /// 问答
    /// </summary>
    [Route("api/[controller]/[action]")]
    [ApiController]
    [Authorize]
    public class QuestionController : ControllerBase
    {
        private readonly IQuestionServices _questionService;
        private readonly IBaseServices<UserInfo> _userInfoService;
        private readonly IMapper _mapper;

        public QuestionController(IQuestionServices questionService, IBaseServices<UserInfo> userInfoService, IMapper mapper)
        {
            _questionService = questionService;
            _userInfoService = userInfoService;
            _mapper = mapper;
        }


        /// <summary>
        /// 分页获取问答列表
        /// </summary>
        /// <param name="page"></param>
        /// <param name="pageSize"></param>
        /// <returns></returns>
        [HttpGet]
        public async Task<MessageModel<List<QuestionDto>>> GetList(int page, int pageSize)
        {
            var entityList = await _questionService.GetPagedListAsync(page, pageSize, nameof(Question.CreateTime));

            return new MessageModel<List<QuestionDto>>()
            {
                success = true,
                msg = "获取成功",
                response = _mapper.Map<List<QuestionDto>>(entityList)
            };
        }

        /// <summary>
        /// 根据Id查询问答
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet]
        public async Task<MessageModel<QuestionDetailsDto>> Get(int id)
        {
            // 通过自定义服务层处理内部业务
            var entity = await _questionService.GetQuestionDetailsAsync(id);
            var result = _mapper.Map<QuestionDetailsDto>(entity);
            return new MessageModel<QuestionDetailsDto>()
            {
                success = true,
                msg = "获取成功",
                response = result
            };
        }

        /// <summary>
        /// 创建问答
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        public async Task<MessageModel<string>> CreateAsync(CreateQuestionInputDto input)
        {
            var token = JwtHelper.ParsingJwtToken(HttpContext);

            var entity = _mapper.Map<Question>(input);
            entity.Traffic = 1;
            entity.CreateTime = DateTime.Now;
            entity.CreateUserId = token.Uid;
            await _questionService.InsertAsync(entity, true);

            return new MessageModel<string>()
            {
                success = true,
                msg = "创建成功"
            };
        }

        /// <summary>
        /// 修改问答
        /// </summary>
        [HttpPut]
        public async Task<MessageModel<string>> UpdateAsync(int id, UpdateQuestionInputDto input)
        {
            var entity = await _questionService.GetAsync(d => d.Id == id);

            entity = _mapper.Map(input, entity);

            await _questionService.UpdateAsync(entity, true);
            return new MessageModel<string>()
            {
                success = true,
                msg = "修改成功"
            };
        }

        /// <summary>
        /// 删除问答
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpDelete]
        public async Task<MessageModel<string>> DeleteAsync(int id)
        {
            var entity = await _questionService.GetAsync(d => d.Id == id);
            await _questionService.DeleteAsync(entity, true);
            return new MessageModel<string>()
            {
                success = true,
                msg = "删除成功"
            };
        }


        /// <summary>
        /// 添加问答评论
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpPost(Name = "CreateQuestionComments")]
        public async Task<MessageModel<string>> CreateQuestionCommentsAsync(int id, CreateQuestionCommentsInputDto input)
        {
            var token = JwtHelper.ParsingJwtToken(HttpContext);
            await _questionService.AddQuestionComments(id, token.Uid, input.Content);
            return new MessageModel<string>()
            {
                success = true,
                msg = "评论成功"
            };
        }

        /// <summary>
        /// 删除问答评论
        /// </summary>
        /// <param name="questionId"></param>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpDelete(Name = "DeleteQuestionComments")]
        public async Task<MessageModel<string>> DeleteQuestionCommentsAsync(int questionId, int id)
        {
            var entity = await _questionService.GetByIdAsync(questionId);
            entity.QuestionComments.Remove(entity.QuestionComments.FirstOrDefault(x => x.Id == id));
            await _questionService.UpdateAsync(entity, true);
            return new MessageModel<string>()
            {
                success = true,
                msg = "删除评论成功"
            };
        }
    }
}

namespace SwiftCode.BBS.IServices
{
    public interface IQuestionServices : IBaseServices<Question>
    {
        Task<Question> GetByIdAsync(int id, CancellationToken cancellationToken = default);

        Task<Question> GetQuestionDetailsAsync(int id, CancellationToken cancellationToken = default);

        Task AddQuestionComments(int id, int userId, string content, CancellationToken cancellationToken = default);

    }
}

namespace SwiftCode.BBS.Services
{
    public class QuestionServices : BaseServices<Question>, IQuestionServices
    {
        private readonly IQuestionRepository _questionRepository;
        public QuestionServices(IBaseRepository<Question> baseRepository, IQuestionRepository questionRepository) : base(baseRepository)
        {
            _questionRepository = questionRepository;
        }


        public Task<Question> GetByIdAsync(int id, CancellationToken cancellationToken = default)
        {
            return _questionRepository.GetByIdAsync(id, cancellationToken);
        }

        public async Task<Question> GetQuestionDetailsAsync(int id, CancellationToken cancellationToken = default)
        {
            var entity = await _questionRepository.GetByIdAsync(id, cancellationToken);
            entity.Traffic += 1;

            await _questionRepository.UpdateAsync(entity, true, cancellationToken: cancellationToken);

            return entity;
        }

        public async Task AddQuestionComments(int id, int userId, string content, CancellationToken cancellationToken = default)
        {
            var entity = await _questionRepository.GetByIdAsync(id, cancellationToken);
            entity.QuestionComments.Add(new QuestionComment()
            {
                Content = content,
                CreateTime = DateTime.Now,
                CreateUserId = userId
            });
            await _questionRepository.UpdateAsync(entity, true, cancellationToken);
        }
    }
}

namespace SwiftCode.BBS.IRepositories
{
    public interface IQuestionRepository : IBaseRepository<Question>
    {
        Task<Question> GetByIdAsync(int id, CancellationToken cancellationToken = default);

    }
}

namespace SwiftCode.BBS.Repositories
{
    public class QuestionRepository : BaseRepository<Question>, IQuestionRepository
    {
        public QuestionRepository(SwiftCodeBbsContext context) : base(context)
        {
        }

        public Task<Question> GetByIdAsync(int id, CancellationToken cancellationToken = default)
        {
            return DbContext().Questions.Where(x => x.Id == id)
                .Include(x => x.QuestionComments).ThenInclude(x => x.CreateUser).SingleOrDefaultAsync(cancellationToken);
        }
    }
}
~~~

#### 6.4个人中心接口
我们把[Authorize]放在API控制器上表示需要用户登录后才能请求这个控制器下的接口，该接口主要用于处理当前登录人个人信息和获取其他操作者资料。
~~~
namespace SwiftCode.BBS.API.Controllers
{
    /// <summary>
    /// 个人中心
    /// </summary>
    [Route("api/[controller]/[action]")]
    [ApiController]
    [Authorize]
    public class UserInfoController : ControllerBase
    {

        private readonly IBaseServices<UserInfo> _userInfoService;
        private readonly IArticleService _articleServices;
        private readonly IBaseServices<Question> _questionService;
        private readonly IMapper _mapper;

        public UserInfoController(IBaseServices<UserInfo> userInfoService, IMapper mapper, IArticleService articleServices, IBaseServices<Question> questionService)
        {
            _userInfoService = userInfoService;
            _mapper = mapper;
            _articleServices = articleServices;
            _questionService = questionService;
        }
        /// <summary>
        /// 用户个人信息
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public async Task<MessageModel<UserInfoDetailsDto>> GetAsync()
        {
            var token = JwtHelper.ParsingJwtToken(HttpContext);
            var userInfo = await _userInfoService.GetAsync(x => x.Id == token.Uid);

            return new MessageModel<UserInfoDetailsDto>()
            {
                success = true,
                msg = "获取成功",
                response = _mapper.Map<UserInfoDetailsDto>(userInfo)
            };
        }

        /// <summary>
        /// 修改个人信息
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>
        [HttpPut]
        public async Task<MessageModel<string>> UpdateAsync(UpdateUserInfoInputDto input)
        {
            var token = JwtHelper.ParsingJwtToken(HttpContext);
            var userInfo = await _userInfoService.GetAsync(x => x.Id == token.Uid);

            userInfo = _mapper.Map<UserInfo>(input);
            await _userInfoService.UpdateAsync(userInfo, true);

            return new MessageModel<string>()
            {
                success = true,
                msg = "修改成功",
            };
        }


        /// <summary>
        /// 获取文章作者
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public async Task<MessageModel<UserInfoDto>> GetAuthor(int id)
        {
            var entity = await _articleServices.GetAsync(x => x.Id == id);
            var user = await _userInfoService.GetAsync(x => x.Id == entity.CreateUserId);
            var response = _mapper.Map<UserInfoDto>(user);
            response.ArticlesCount = await _articleServices.GetCountAsync(x => x.CreateUserId == user.Id);
            response.QuestionsCount = await _questionService.GetCountAsync(x => x.CreateUserId == user.Id);
            return new MessageModel<UserInfoDto>()
            {
                success = true,
                msg = "获取成功",
                response = response
            };

        }
    }
}
~~~

#### 6.5主页接口
Home控制器主要用于加载首页信息，让用户一打开站点就能看到能容，而不是必须登录后才能看到。
~~~
namespace SwiftCode.BBS.API.Controllers
{
    /// <summary>
    /// 主页
    /// </summary>
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class HomeController : ControllerBase
    {
        private readonly IBaseServices<UserInfo> _userInfoService;
        private readonly IBaseServices<Article> _articleService;
        private readonly IBaseServices<Question> _questionService;
        private readonly IBaseServices<Advertisement> _advertisementService;
        private readonly IMapper _mapper;

        public HomeController(IBaseServices<UserInfo> userInfoService,
            IBaseServices<Article> articleService,
            IBaseServices<Question> questionService,
            IBaseServices<Advertisement> advertisementService,
            IMapper mapper)
        {
            _userInfoService = userInfoService;
            _articleService = articleService;
            _questionService = questionService;
            _advertisementService = advertisementService;
            _mapper = mapper;
        }



        /// <summary>
        /// 获取文章列表
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public async Task<MessageModel<List<ArticleDto>>> GetArticle()
        {
            var entityList = await _articleService.GetPagedListAsync(0, 10, nameof(Article.CreateTime));
            var articleUserIdList = entityList.Select(x => x.CreateUserId);
            var userList = await _userInfoService.GetListAsync(x => articleUserIdList.Contains(x.Id));
            var response = _mapper.Map<List<ArticleDto>>(entityList);
            foreach (var item in response)
            {
                var user = userList.FirstOrDefault(x => x.Id == item.CreateUserId);
                item.UserName = user.UserName;
                item.HeadPortrait = user.HeadPortrait;
            }
            return new MessageModel<List<ArticleDto>>()
            {
                success = true,
                msg = "获取成功",
                response = response
            };
        }
        /// <summary>
        /// 获取问答列表
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public async Task<MessageModel<List<QuestionDto>>> GetQuestion()
        {
            var questionList = await _questionService.GetPagedListAsync(0, 10, nameof(Question.CreateTime));

            return new MessageModel<List<QuestionDto>>()
            {
                success = true,
                msg = "获取成功",
                response = _mapper.Map<List<QuestionDto>>(questionList)
            };
        }
        /// <summary>
        /// 获取作者列表
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public async Task<MessageModel<List<UserInfoDto>>> GetUserInfo()
        {
            var userInfoList = await _userInfoService.GetPagedListAsync(0, 5, nameof(UserInfo.CreateTime));

            var response = _mapper.Map<List<UserInfoDto>>(userInfoList);

            // 此处会多次调用数据库操作，实际项目中我们会返回字典来处理
            foreach (var item in response)
            {
                item.QuestionsCount = await _questionService.GetCountAsync(x => x.CreateUserId == item.Id);
                item.ArticlesCount = await _articleService.GetCountAsync(x => x.CreateUserId == item.Id);
            }
            return new MessageModel<List<UserInfoDto>>()
            {
                success = true,
                msg = "获取成功",
                response = response
            };
        }
        /// <summary>
        /// 获取广告列表
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public async Task<MessageModel<string>> GetAdvertisement()
        {
            var advertisementList = await _advertisementService.GetPagedListAsync(0, 5, nameof(Advertisement.CreateTime));
            return new MessageModel<string>();
        }
    }
}
~~~

## 7创建迁移运行测试
在程序包管理控制台，选择SwiftCode.BBS.EntityFramework,运行 Add-Migration InitDb 和 Update-Database. 这样就创建好了数据库。

启动程序，Swagger显示如下：

![swagger](https://huihui_teresa.gitee.io/docs/image/youdao/2022040601.png)

