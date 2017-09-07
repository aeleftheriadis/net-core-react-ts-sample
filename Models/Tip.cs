using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MongoDB.Bson.Serialization.Attributes;

namespace admin.Models
{
    public class Tip
    {
        [BsonId]
        public string Id { get; set; }

        public string Title { get; set; } = string.Empty;
    }
}