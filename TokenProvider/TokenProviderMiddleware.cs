using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using admin.DatabaseContext;
using MongoDB.Bson;
using admin.Models;
using MongoDB.Driver;
using admin.Services;
using admin.Enumerations;

namespace admin.TokenProvider
{
    public class TokenProviderMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly TokenProviderOptions _options;
        private readonly IMongoRepository _repository = null;
        private readonly IEncryptionService _encryptionService = null;

        public TokenProviderMiddleware(
            RequestDelegate next,
            IOptions<TokenProviderOptions> options,
            IMongoRepository repository,
            IEncryptionService encyptionService)
        {
            _next = next;
            _options = options.Value;
            _repository = repository;
            _encryptionService = encyptionService;
        }

        public Task Invoke(HttpContext context)
        {
            // If the request path doesn't match, skip
            if (!context.Request.Path.Equals(_options.Path, StringComparison.Ordinal))
            {
                return _next(context);
            }

            // Request must be POST with Content-Type: application/x-www-form-urlencoded
            if (context.Request.Method.Equals("POST") && context.Request.HasFormContentType)
                return GenerateToken(context);
            context.Response.StatusCode = 400;
            return context.Response.WriteAsync("Bad request.");
        }

        private async Task GenerateToken(HttpContext context)
        {
            var username = context.Request.Form["username"];
            var password = context.Request.Form["password"];
            var user = await GetUser(username);
            if(user ==null)
            {
                await Unauthorized(context);
                return;
                
            }
            var identity = await GetIdentity(user,username, password);
            if (identity == null)
            {
                await Unauthorized(context);
                return;
            }

            var now = DateTime.UtcNow;
            var dateTimeOffset = new DateTimeOffset(now);

            // Specifically add the jti (random nonce), iat (issued timestamp), and sub (subject/user) claims.
            // You can add other claims here, if you want:
            var claims = new Claim[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, username),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(JwtRegisteredClaimNames.Iat, dateTimeOffset.ToUnixTimeSeconds().ToString(), ClaimValueTypes.Integer64),
                new Claim(ClaimTypes.Role,Enum.GetName(typeof(Role), user.Role))
            };

            // Create the JWT and write it to a string
            var jwt = new JwtSecurityToken(
                issuer: _options.Issuer,
                audience: _options.Audience,
                claims: claims,
                notBefore: now,
                expires: now.Add(_options.Expiration),
                signingCredentials: _options.SigningCredentials);
            var encodedJwt = new JwtSecurityTokenHandler().WriteToken(jwt);

            var response = new
            {
                access_token = encodedJwt,
                expires_in = (int)_options.Expiration.TotalSeconds
            };

            // Serialize and return the response
            context.Response.ContentType = "application/json";
            await context.Response.WriteAsync(JsonConvert.SerializeObject(response, new JsonSerializerSettings { Formatting = Formatting.Indented }));
        }

        private static async Task Unauthorized(HttpContext context)
        {
            context.Response.StatusCode = 400;
            await context.Response.WriteAsync("Λάθος όνομα χρήστη ή κωδικός");
            return;
        }

        private async Task<ClaimsIdentity> GetIdentity(User user,string username, string password)
        {
            if (user.Username == username && _encryptionService.DecryptString(user.Password) == password)
            {
                return await Task.FromResult(new ClaimsIdentity(new System.Security.Principal.GenericIdentity(username, "Token"), new Claim[] { }));
            }

            // Credentials are invalid, or account doesn't exist
            return await Task.FromResult<ClaimsIdentity>(null);
        }

        private async Task<User> GetUser(string username)
        {
            var filter = Builders<User>.Filter.Eq("Username", username);
            return await _repository.Get<User>(filter);
        }
    }
}