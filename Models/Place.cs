using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using admin.Enumerations;
using MongoDB.Bson.Serialization.Attributes;

namespace admin.Models
{
    public class Place
    {
        [BsonId]
        public string Id { get; set; }

        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal Lat { get; set; } = 0;
        public decimal Long { get; set; } = 0;
        public string Address { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;
        public string PostCode { get; set; } = string.Empty;

        public PlaceType PlaceType {get;set;}
    }
}