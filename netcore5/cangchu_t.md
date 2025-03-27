## 1.设计仓储基类接口
在SwiftCode.BBS.IRepositories中添加BASE文件夹，并添加接口IBaseRepository
~~~
namespace SwiftCode.BBS.IRepositories.BASE
{
    /// <summary>
    /// 仓储基类接口
    /// </summary>
    /// <typeparam name="TEntity"></typeparam>
    public interface IBaseRepository<TEntity> where TEntity:class
    {
        /// <summary>
        /// 添加实体数据
        /// </summary>
        /// <param name="entity"></param>
        /// <param name="autoSave">是否马上更新到数据库</param>
        /// <param name="cancellationToken">取消令牌(当CancellationToken是取消状态，Task内部未启动的任务不会启动新线程)</param>
        /// <returns></returns>
        Task<TEntity> InsertAsync(TEntity entity, bool autoSave = false, CancellationToken cancellationToken = default);

        /// <summary>
        /// 功能描述:批量插入实体
        /// </summary>
        /// <param name="entities">实体类集合</param>
        /// <param name="autoSave">是否马上更新到数据库</param>
        /// <param name="cancellationToken">取消令牌(当CancellationToken是取消状态，Task内部未启动的任务不会启动新线程)</param>
        /// <returns></returns>
        Task InsertManyAsync(IEnumerable<TEntity> entities, bool autoSave = false, CancellationToken cancellationToken = default);

        /// <summary>
        /// 功能描述:更新实体数据
        /// </summary>
        /// <param name="entity">实体类</param>
        /// <param name="autoSave">是否马上更新到数据库</param>
        /// <param name="cancellationToken">取消令牌(当CancellationToken是取消状态，Task内部未启动的任务不会启动新线程)</param>
        /// <returns></returns>
        Task<TEntity> UpdateAsync(TEntity entity, bool autoSave = false, CancellationToken cancellationToken = default);

        /// <summary>
        /// 功能描述:批量更新实体
        /// </summary>
        /// <param name="entities">实体类集合</param>
        /// <param name="autoSave">是否马上更新到数据库</param>
        /// <param name="cancellationToken">取消令牌(当CancellationToken是取消状态，Task内部未启动的任务不会启动新线程)</param>
        /// <returns></returns>
        Task UpdateManyAsync(IEnumerable<TEntity> entities, bool autoSave = false, CancellationToken cancellationToken = default);

        /// <summary>
        /// 功能描述:根据实体删除一条数据
        /// </summary>
        /// <param name="entity">实体类</param>
        /// <param name="autoSave">是否马上更新到数据库</param>
        /// <param name="cancellationToken">取消令牌(当CancellationToken是取消状态，Task内部未启动的任务不会启动新线程)</param>
        /// <returns></returns>
        Task DeleteAsync(TEntity entity, bool autoSave = false, CancellationToken cancellationToken = default);

        /// <summary>
        /// 功能描述:根据筛选条件删除数据
        /// </summary>
        /// <param name="predicate">筛选条件</param>
        /// <param name="autoSave">是否马上更新到数据库</param>
        /// <param name="cancellationToken">取消令牌(当CancellationToken是取消状态，Task内部未启动的任务不会启动新线程)</param>
        /// <returns></returns>
        Task DeleteAsync(Expression<Func<TEntity, bool>> predicate, bool autoSave = false, CancellationToken cancellationToken = default);

        /// <summary>
        /// 功能描述:根据实体集合删除数据
        /// </summary>
        /// <param name="entities">实体类集合</param>
        /// <param name="autoSave">是否马上更新到数据库</param>
        /// <param name="cancellationToken">取消令牌(当CancellationToken是取消状态，Task内部未启动的任务不会启动新线程)</param>
        /// <returns></returns>
        Task DeleteManyAsync(IEnumerable<TEntity> entities, bool autoSave = false, CancellationToken cancellationToken = default);

        /// <summary>
        /// 功能描述:根据筛条件获取一条数据(如果不存在返回Null)
        /// </summary>
        /// <param name="predicate">筛选条件</param>
        /// <param name="cancellationToken">取消令牌(当CancellationToken是取消状态，Task内部未启动的任务不会启动新线程)</param>
        /// <returns></returns>
        Task<TEntity> FindAsync(Expression<Func<TEntity, bool>> predicate, CancellationToken cancellationToken = default);

        /// <summary>
        /// 功能描述:根据筛条件获取一条数据(如果不存在抛出异常)
        /// </summary>
        /// <param name="predicate">筛选条件</param>
        /// <param name="cancellationToken">取消令牌(当CancellationToken是取消状态，Task内部未启动的任务不会启动新线程)</param>
        /// <returns></returns>
        Task<TEntity> GetAsync(Expression<Func<TEntity, bool>> predicate, CancellationToken cancellationToken = default);

        /// <summary>
        /// 功能描述:获取所有数据
        /// </summary>
        /// <param name="cancellationToken">取消令牌(当CancellationToken是取消状态，Task内部未启动的任务不会启动新线程)</param>
        /// <returns></returns>
        Task<List<TEntity>> GetListAsync(CancellationToken cancellationToken = default);

        /// <summary>
        /// 功能描述:根据筛选条件查询数据
        /// </summary>
        /// <param name="predicate">筛选条件</param>
        /// <param name="cancellationToken">取消令牌(当CancellationToken是取消状态，Task内部未启动的任务不会启动新线程)</param>
        /// <returns></returns>
        Task<List<TEntity>> GetListAsync(Expression<Func<TEntity, bool>> predicate, CancellationToken cancellationToken = default);

        /// <summary>
        /// 功能描述:分页查询数据
        /// </summary>
        /// <param name="skipCount">跳过多少条</param>
        /// <param name="maxResultCount">获取多少条</param>
        /// <param name="sorting">排序字段</param>
        /// <param name="cancellationToken">取消令牌(当CancellationToken是取消状态，Task内部未启动的任务不会启动新线程)</param>
        /// <returns></returns>
        Task<List<TEntity>> GetPagedListAsync(int skipCount, int maxResultCount, string sorting, CancellationToken cancellationToken = default);

        /// <summary>
        /// 功能描述:获取总共多少条数据
        /// </summary>
        /// <param name="cancellationToken">取消令牌(当CancellationToken是取消状态，Task内部未启动的任务不会启动新线程)</param>
        /// <returns></returns>
        Task<long> GetCountAsync(CancellationToken cancellationToken = default);

        /// <summary>
        /// 功能描述:根据条件获取筛选数据条数
        /// </summary>
        /// <param name="predicate">筛选条件</param>
        /// <param name="cancellationToken">取消令牌(当CancellationToken是取消状态，Task内部未启动的任务不会启动新线程)</param>
        /// <returns></returns>
        Task<long> GetCountAsync(Expression<Func<TEntity, bool>> predicate, CancellationToken cancellationToken);
    }
}
~~~
在SwiftCode.BBS.IRepositories层中，将其他接口集成BASE。

## 2.对仓储基接口进行实现
SwiftCode.BBS.Repositories层中添加BASE文件夹，并添加BaseRepository类；类中有一个排序功能，需要 System.Linq.Dynamic.Core Nuget安装。
~~~
/// <summary>
/// 仓储接口实现
/// </summary>
/// <typeparam name="TEntity"></typeparam>
public class BaseRepository<TEntity>:IBaseRepository<TEntity> where TEntity:class,new()
{
    private SwiftCodeBbsContext _context;

    public BaseRepository()
    {
        _context=new SwiftCodeBbsContext();
    }
    /// <summary>
    /// 暴露DbContext提供给自定义仓储进行使用
    /// </summary>
    /// <returns></returns>
    protected SwiftCodeBbsContext DbContext()
    {
        return _context;
    }

    /// <summary>
    /// 添加实体类
    /// </summary>
    /// <param name="entity"></param>
    /// <param name="autoSave"></param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    public async Task<TEntity> InsertAsync(TEntity entity, bool autoSave = false, CancellationToken cancellationToken = default)
    {
        var savedEntity = (await _context.Set<TEntity>().AddAsync(entity, cancellationToken)).Entity;
        if (autoSave)
            await _context.SaveChangesAsync(cancellationToken);

        return savedEntity;
    }

    /// <summary>
    /// 批量插入实体
    /// </summary>
    /// <param name="entities"></param>
    /// <param name="autoSave"></param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    public async Task InsertManyAsync(IEnumerable<TEntity> entities, bool autoSave = false, CancellationToken cancellationToken = default)
    {
        var entityArray = entities.ToArray();
        await _context.Set<TEntity>().AddRangeAsync(entityArray, cancellationToken);
        if (autoSave) await _context.SaveChangesAsync(cancellationToken);
    }

    /// <summary>
    /// 更新实体数据
    /// </summary>
    /// <param name="entity"></param>
    /// <param name="autoSave"></param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    public async Task<TEntity> UpdateAsync(TEntity entity, bool autoSave = false, CancellationToken cancellationToken = default)
    {
        // Attach是将一个处于Detached的Entity附加到上下文，而附加到上下文后的这一Entity的State为UnChanged。传递到Attach方法的对象必须具有有效的EntityKey值
        _context.Attach(entity);
        var updateEntity = _context.Update(entity).Entity;
        if (autoSave) await _context.SaveChangesAsync(cancellationToken);
        return updateEntity;
    }

    /// <summary>
    /// 批量更新实体
    /// </summary>
    /// <param name="entities"></param>
    /// <param name="autoSave"></param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    public async Task UpdateManyAsync(IEnumerable<TEntity> entities, bool autoSave = false, CancellationToken cancellationToken = default)
    {
        _context.Set<TEntity>().UpdateRange(entities);
        if (autoSave)
        {
            await _context.SaveChangesAsync(cancellationToken);
        }
    }

    /// <summary>
    /// 根据实体删除一条数据
    /// </summary>
    /// <param name="entity"></param>
    /// <param name="autoSave"></param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    public async Task DeleteAsync(TEntity entity, bool autoSave = false, CancellationToken cancellationToken = default)
    {
        _context.Set<TEntity>().Remove(entity);

        if (autoSave)
        {
            await _context.SaveChangesAsync(cancellationToken);
        }
    }
    /// <summary>
    /// 根据筛选条件删除数据
    /// </summary>
    /// <param name="predicate"></param>
    /// <param name="autoSave"></param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    public async Task DeleteAsync(Expression<Func<TEntity, bool>> predicate, bool autoSave = false, CancellationToken cancellationToken = default)
    {
        var dbSet = _context.Set<TEntity>();

        var entities = await dbSet
            .Where(predicate)
            .ToListAsync(cancellationToken);

        await DeleteManyAsync(entities, autoSave, cancellationToken);

        if (autoSave)
        {
            await _context.SaveChangesAsync(cancellationToken);
        }
    }
    /// <summary>
    /// 根据实体集合删除数据
    /// </summary>
    /// <param name="entities"></param>
    /// <param name="autoSave"></param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    public async Task DeleteManyAsync(IEnumerable<TEntity> entities, bool autoSave = false, CancellationToken cancellationToken = default)
    {
        _context.RemoveRange(entities);

        if (autoSave)
        {
            await _context.SaveChangesAsync(cancellationToken);
        }
    }

    /// <summary>
    /// 根据筛条件获取一条数据(如果不存在返回Null)
    /// </summary>
    /// <param name="predicate"></param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    public Task<TEntity> FindAsync(Expression<Func<TEntity, bool>> predicate, CancellationToken cancellationToken = default)
    {
        return _context.Set<TEntity>().Where(predicate).SingleOrDefaultAsync(cancellationToken);
    }
    /// <summary>
    /// 根据筛条件获取一条数据(如果不存在抛出异常)
    /// </summary>
    /// <param name="predicate"></param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    public async Task<TEntity> GetAsync(Expression<Func<TEntity, bool>> predicate, CancellationToken cancellationToken = default)
    {
        var entity = await FindAsync(predicate, cancellationToken);
        // 数据不存在触发异常
        if (entity == null)
        {
            throw new Exception(nameof(TEntity) + ": 数据不存在");
        }

        return entity;
    }
    /// <summary>
    /// 获取所有数据
    /// </summary>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    public Task<List<TEntity>> GetListAsync(CancellationToken cancellationToken = default)
    {
        return _context.Set<TEntity>().ToListAsync(cancellationToken);
    }
    /// <summary>
    /// 根据筛选条件查询数据
    /// </summary>
    /// <param name="predicate"></param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    public Task<List<TEntity>> GetListAsync(Expression<Func<TEntity, bool>> predicate, CancellationToken cancellationToken = default)
    {
        return _context.Set<TEntity>().Where(predicate).ToListAsync(cancellationToken);
    }

    /// <summary>
    /// 功能描述:分页查询数据
    /// </summary>
    /// <param name="skipCount">跳过多少条</param>
    /// <param name="maxResultCount">获取多少条</param>
    /// <param name="sorting">排序字段</param>
    /// <param name="cancellationToken">取消令牌(当CancellationToken是取消状态，Task内部未启动的任务不会启动新线程)</param>
    /// <returns></returns>
    public Task<List<TEntity>> GetPagedListAsync(int skipCount, int maxResultCount, string sorting,
        CancellationToken cancellationToken = default)
    {
        // nuget System.Linq.Dynamic.Core
        return _context.Set<TEntity>().OrderBy(sorting).Skip(skipCount).Take(maxResultCount).ToListAsync(cancellationToken);
    }
    /// <summary>
    /// 获取总共多少条数据
    /// </summary>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    public Task<long> GetCountAsync(CancellationToken cancellationToken = default)
    {
        return _context.Set<TEntity>().LongCountAsync(cancellationToken);
    }
    /// <summary>
    /// 根据条件获取筛选数据条数
    /// </summary>
    /// <param name="predicate"></param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    public Task<long> GetCountAsync(Expression<Func<TEntity, bool>> predicate, CancellationToken cancellationToken)
    {
        return _context.Set<TEntity>().Where(predicate).LongCountAsync(cancellationToken);
    }
}
~~~

修改IArticleRepository 和 ArticleRepository
~~~
namespace SwiftCode.BBS.IRepositories
{
    public interface IArticleRepository:IBaseRepository<Article>
    {
    }
}
namespace SwiftCode.BBS.Repositories
{
    public class ArticleRepository:BaseRepository<Article>,IArticleRepository
    {
    }
}
~~~

## 3.设计应用服务层基类与基接口
在SwiftCode.BBS.Services和SwiftCode.BBS.IServices中添加接口和实现基类。
~~~
namespace SwiftCode.BBS.IServices.BASE
{
    public interface IBaseServices<TEntity> where TEntity : class
    {
        /// <summary>
        /// 功能描述:添加实体数据
        /// </summary>
        /// <param name="entity">实体类</param>
        /// <param name="autoSave">是否马上更新到数据库</param>
        /// <param name="cancellationToken">取消令牌(当CancellationToken是取消状态，Task内部未启动的任务不会启动新线程)</param>
        /// <returns></returns>
        Task<TEntity> InsertAsync(TEntity entity, bool autoSave = false, CancellationToken cancellationToken = default);

        /// <summary>
        /// 添加多个
        /// </summary>
        /// <param name="entities"></param>
        /// <param name="autoSave"></param>
        /// <param name="cancellationToken"></param>
        /// <returns></returns>
        Task InsertManyAsync(IEnumerable<TEntity> entities, bool autoSave = false, CancellationToken cancellationToken = default);

        Task<TEntity> UpdateAsync(TEntity entity, bool autoSave = false, CancellationToken cancellationToken = default);

        Task UpdateManyAsync(IEnumerable<TEntity> entities, bool autoSave = false, CancellationToken cancellationToken = default);

        Task DeleteAsync(TEntity entity, bool autoSave = false, CancellationToken cancellationToken = default);

        Task DeleteAsync(Expression<Func<TEntity, bool>> predicate, bool autoSave = false, CancellationToken cancellationToken = default);

        Task DeleteManyAsync(IEnumerable<TEntity> entities, bool autoSave = false, CancellationToken cancellationToken = default);

        Task<TEntity> FindAsync(Expression<Func<TEntity, bool>> predicate, CancellationToken cancellationToken = default);

        Task<TEntity> GetAsync(Expression<Func<TEntity, bool>> predicate, CancellationToken cancellationToken = default);

        Task<List<TEntity>> GetListAsync(CancellationToken cancellationToken = default);

        Task<List<TEntity>> GetListAsync(Expression<Func<TEntity, bool>> predicate, CancellationToken cancellationToken = default);

        Task<List<TEntity>> GetPagedListAsync(int skipCount, int maxResultCount, string sorting, CancellationToken cancellationToken = default);

        Task<long> GetCountAsync(Expression<Func<TEntity, bool>> predicate, CancellationToken cancellationToken = default);

        Task<long> GetCountAsync(CancellationToken cancellationToken = default);
    }
}
~~~
~~~
namespace SwiftCode.BBS.Services.BASE
{
    public class BaseServices<TEntity>:IBaseRepository<TEntity> where TEntity:class,new()
    {
        public IBaseRepository<TEntity> _baseRepository = new BaseRepository<TEntity>();

        /// <summary>
        /// 添加
        /// </summary>
        /// <param name="entity"></param>
        /// <param name="autoSave"></param>
        /// <param name="cancellationToken"></param>
        /// <returns></returns>
        public async Task<TEntity> InsertAsync(TEntity entity, bool autoSave = false, CancellationToken cancellationToken = default)
        {
            return await _baseRepository.InsertAsync(entity, autoSave, cancellationToken);
        }

        /// <summary>
        /// 添加（多个）
        /// </summary>
        /// <param name="entities"></param>
        /// <param name="autoSave"></param>
        /// <param name="cancellationToken"></param>
        /// <returns></returns>
        public async Task InsertManyAsync(IEnumerable<TEntity> entities, bool autoSave = false, CancellationToken cancellationToken = default)
        {
            await _baseRepository.InsertManyAsync(entities, autoSave, cancellationToken);
        }

        public async Task<TEntity> UpdateAsync(TEntity entity, bool autoSave = false, CancellationToken cancellationToken = default)
        {
            return await _baseRepository.UpdateAsync(entity, autoSave, cancellationToken);
        }

        public async Task UpdateManyAsync(IEnumerable<TEntity> entities, bool autoSave = false, CancellationToken cancellationToken = default)
        {
            await _baseRepository.UpdateManyAsync(entities, autoSave, cancellationToken);
        }

        public async Task DeleteAsync(TEntity entity, bool autoSave = false, CancellationToken cancellationToken = default)
        {
            await _baseRepository.DeleteAsync(entity, autoSave, cancellationToken);
        }

        public async Task DeleteAsync(Expression<Func<TEntity, bool>> predicate, bool autoSave = false, CancellationToken cancellationToken = default)
        {
            await _baseRepository.DeleteAsync(predicate, autoSave, cancellationToken);
        }

        public async Task DeleteManyAsync(IEnumerable<TEntity> entities, bool autoSave = false, CancellationToken cancellationToken = default)
        {
            await _baseRepository.DeleteManyAsync(entities, autoSave, cancellationToken);
        }

        public async Task<TEntity> FindAsync(Expression<Func<TEntity, bool>> predicate, CancellationToken cancellationToken = default)
        {
            return await _baseRepository.FindAsync(predicate, cancellationToken);
        }

        public async Task<TEntity> GetAsync(Expression<Func<TEntity, bool>> predicate, CancellationToken cancellationToken = default)
        {
            return await _baseRepository.GetAsync(predicate, cancellationToken);
        }

        public async Task<List<TEntity>> GetListAsync(CancellationToken cancellationToken = default)
        {
            return await _baseRepository.GetListAsync(cancellationToken);
        }

        public async Task<List<TEntity>> GetListAsync(Expression<Func<TEntity, bool>> predicate, CancellationToken cancellationToken = default)
        {
            return await _baseRepository.GetListAsync(predicate, cancellationToken);
        }

        public async Task<List<TEntity>> GetPagedListAsync(int skipCount, int maxResultCount, string sorting,
            CancellationToken cancellationToken = default)
        {
            return await _baseRepository.GetPagedListAsync(skipCount, maxResultCount, sorting, cancellationToken);
        }
        public async Task<long> GetCountAsync(Expression<Func<TEntity, bool>> predicate, CancellationToken cancellationToken = default)
        {
            return await _baseRepository.GetCountAsync(predicate, cancellationToken);
        }
        public async Task<long> GetCountAsync(CancellationToken cancellationToken = default)
        {
            return await _baseRepository.GetCountAsync(cancellationToken);
        }
    }
}
~~~

修改ArticleService和IArticleService
~~~
namespace SwiftCode.BBS.IServices
{
    public interface IArticleService:IBaseServices<Article>
    {
    }
}
namespace SwiftCode.BBS.Services
{
    public class ArticleService:BaseServices<Article>,IArticleService
    {
        
    }
}
~~~

## 4.修改controller
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
    public async Task<List<Article>> Get(int id)
    {
        var articleService = new ArticleService();
        return await articleService.GetListAsync(d => d.Id == id);
    }
}
~~~

调试Swagger可以正常获取数据。