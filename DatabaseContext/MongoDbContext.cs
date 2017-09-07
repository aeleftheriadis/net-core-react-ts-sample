using admin.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace admin.DatabaseContext
{
    public class MongoDbContext
    {
        private readonly IMongoDatabase _database = null;

        public MongoDbContext(IOptions<Settings> settings)
        {
            var client = new MongoClient(settings.Value.ConnectionString);
            if (client != null)
                _database = client.GetDatabase(settings.Value.Database);
        }

        /// <summary>
        /// The private GetCollection method
        /// </summary>
        /// <typeparam name="TEntity"></typeparam>
        /// <returns></returns>
        public IMongoCollection<TEntity> GetCollection<TEntity>()
        {
            return _database.GetCollection<TEntity>(typeof(TEntity).Name.ToLower()+"s");
        }


        //public IMongoCollection<User> Users
        //{
        //    get
        //    {
        //        return _database.GetCollection<User>("User");
        //    }
        //}

        public IMongoCollection<Page> Pages
        {
            get
            {
                return _database.GetCollection<Page>("Page");
            }
        }

        //public IMongoCollection<Place> Places
        //{
        //    get
        //    {
        //        return _database.GetCollection<Place>("Place");
        //    }
        //}

        //public IMongoCollection<Tip> Tips
        //{
        //    get
        //    {
        //        return _database.GetCollection<Tip>("Tip");
        //    }
        //}
    }
}
