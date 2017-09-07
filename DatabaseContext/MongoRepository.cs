using admin.Models;
using Microsoft.Extensions.Options;
using MongoDB.Bson;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace admin.DatabaseContext
{
    public class MongoRepository : IMongoRepository
    {
        private readonly IMongoDatabase _db = null;

        public MongoRepository(IOptions<Settings> settings)
        {
            var client = new MongoClient(settings.Value.ConnectionString);
            if (client != null)
                _db = client.GetDatabase(settings.Value.Database);
        }

        private IMongoCollection<TEntity> GetCollection<TEntity>()
        {
            return _db.GetCollection<TEntity>(typeof(TEntity).Name.ToLower() + "s");
        }

        public async Task Insert<TEntity>(TEntity item) where TEntity : class, new()
        {
            var collection = GetCollection<TEntity>();
            await collection.InsertOneAsync(item);
        }

        public async Task Insert<TEntity>(IEnumerable<TEntity> items) where TEntity : class, new()
        {
            foreach (TEntity item in items)
            {
                await Insert(item);
            }
        }

        public async Task<long> Count<TEntity>(FilterDefinition<TEntity> filter) where TEntity : class, new()
        {
            var collection = GetCollection<TEntity>();
            var cursor = collection.Find(filter);
            var count = await cursor.CountAsync();
            return count;
        }

        public async Task Delete<TEntity>(string id) where TEntity : class, new()
        {            
            var collection = GetCollection<TEntity>();
            await collection.DeleteOneAsync(Builders<TEntity>.Filter.Eq("Id", id));
        }

        public async Task DeleteMany<TEntity>(IEnumerable<string> ids) where TEntity : class, new()
        {
            var collection = GetCollection<TEntity>();
            await collection.DeleteManyAsync(Builders<TEntity>.Filter.In("Id", ids));
        }

        public async Task<TEntity> Get<TEntity>(string id) where TEntity : class, new()
        {
            var collection = GetCollection<TEntity>();
            var filter = Builders<TEntity>.Filter.Eq("Id", id);
            return await collection.Find(filter).SingleOrDefaultAsync();
        }

        public async Task<TEntity> Get<TEntity>(FilterDefinition<TEntity> filter) where TEntity : class, new()
        {
            var collection = GetCollection<TEntity>();
            return await collection.Find(filter).SingleOrDefaultAsync();
        }

        public async Task<TEntity> GetRandom<TEntity>() where TEntity : class, new()
        {
            var collection = GetCollection<TEntity>();
            return await collection.Aggregate().AppendStage<TEntity>(new BsonDocument { { "$sample", new BsonDocument("size", 1) } }).SingleOrDefaultAsync();

        }

        public async Task<IEnumerable<TEntity>> GetAll<TEntity>() where TEntity : class, new()
        {
            return await GetCollection<TEntity>().Find(_ => true).ToListAsync();
        }

        public async Task<IEnumerable<TEntity>> GetAll<TEntity>(int page, int pageSize) where TEntity : class, new()
        {
            var query = GetCollection<TEntity>().Find(_ => true);
            return await query.Skip(page*pageSize).Limit(pageSize).ToListAsync();
        }

        public async Task Update<TEntity>(string id, UpdateDefinition<TEntity> update) where TEntity : class, new()
        {
            var collection = GetCollection<TEntity>();
            var filter = new FilterDefinitionBuilder<TEntity>().Eq("Id", id);
            var updateRes = await collection.UpdateOneAsync(filter, update);
        }

        /// <summary>
        /// FindCursor
        /// </summary>
        /// <typeparam name="TEntity"></typeparam>
        /// <param name="filter"></param>
        /// <returns>A cursor for the query</returns>
        public IFindFluent<TEntity, TEntity> FindCursor<TEntity>(FilterDefinition<TEntity> filter) where TEntity : class, new()
        {
            var collection = GetCollection<TEntity>();
            var cursor = collection.Find(filter);
            return cursor;
        }
    }
}
