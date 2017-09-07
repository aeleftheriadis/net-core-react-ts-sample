using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace admin.DatabaseContext
{
    public interface IMongoRepository
    {
        Task<IEnumerable<TEntity>> GetAll<TEntity>() where TEntity : class, new();
        Task<IEnumerable<TEntity>> GetAll<TEntity>(int page, int pageSize) where TEntity : class, new();
        Task<TEntity> Get<TEntity>(string id) where TEntity : class, new();
        Task<TEntity> Get<TEntity>(FilterDefinition<TEntity> filter) where TEntity : class, new();
        Task Insert<TEntity>(TEntity item) where TEntity : class, new();
        Task Insert<TEntity>(IEnumerable<TEntity> items) where TEntity : class, new();
        Task Update<TEntity>(string id, UpdateDefinition<TEntity> update) where TEntity : class, new();
        Task Delete<TEntity>(string id) where TEntity : class, new();
        Task DeleteMany<TEntity>(IEnumerable<string> ids) where TEntity : class, new();
        Task<long> Count<TEntity>(FilterDefinition<TEntity> filter) where TEntity : class, new();
        IFindFluent<TEntity, TEntity> FindCursor<TEntity>(FilterDefinition<TEntity> filter) where TEntity : class, new();
        Task<TEntity> GetRandom<TEntity>() where TEntity : class, new();
    }
}
