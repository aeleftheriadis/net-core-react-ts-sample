using System;
using admin.Enumerations;
using MongoDB.Bson.Serialization.Attributes;

namespace admin.Models
{
    public class User
    {
        [BsonId]
        public string Id { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public Role Role { get; set; } = Role.Simple;
        public int Points { get; set; } = 0;
    }
}