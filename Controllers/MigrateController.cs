using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using admin.DatabaseContext;
using admin.Models;
using MongoDB.Driver;
using MongoDB.Bson;
using Microsoft.AspNetCore.Authorization;
using admin.Services;

namespace admin.Controllers
{
    [Route("api/[controller]")]
    public class MigrateController : Controller
    {
        private readonly IMongoRepository _repository = null;
        private readonly IEncryptionService _encryptionService = null;

        public MigrateController(IMongoRepository repository, IEncryptionService encryptionService)
        {
            _repository = repository;
            _encryptionService = encryptionService;
        }

        // GET: api/pages
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var filter = Builders<User>.Filter.Where(x => x.Username == "admin");
            var user = await _repository.FindCursor(filter).ToListAsync();
            if(user.Count == 0)
            {
                var password = _encryptionService.EncryptString("admin!@#321");
                await _repository.Insert(new User()
                {
                    Username = "admin",
                    Email = "admin@test.gr",
                    FirstName = "admin",
                    Password = password,
                    LastName = "admin",
                    Points = 0,
                    Role = Enumerations.Role.Administrator,
                    Id = ObjectId.GenerateNewId().ToString()
                });
            }
           
            var pages = await _repository.GetAll<Page>();
            if(pages.Count() == 0)
            {
                await _repository.Insert(new Page()
                {
                    Title = "Γραμμή άμεσης αποκατάστασης θραύσης κρυστάλλων",
                    Description = "Περιγραφή",
                    Key = "glassSupport",
                    Id = ObjectId.GenerateNewId().ToString()
                });

                await _repository.Insert(new Page()
                {
                    Title = "Νομική Προστασία",
                    Description = "Περιγραφή",
                    Key = "legalProtection",
                    Id = ObjectId.GenerateNewId().ToString()
                });

                await _repository.Insert(new Page()
                {
                    Title = "Οδική Βοήθεια",
                    Description = "Περιγραφή",
                    Key = "roadSupport",
                    Id = ObjectId.GenerateNewId().ToString()
                });

                await _repository.Insert(new Page()
                {
                    Title = "Πρόγραμμα ανταπόδοσης ΦροντEASY",
                    Description = "Περιγραφή",
                    Key = "pointsProgram",
                    Id = ObjectId.GenerateNewId().ToString()
                });

                await _repository.Insert(new Page()
                {
                    Title = "Φροντίδα ατυχήματος",
                    Description = "Περιγραφή",
                    Key = "accidentSupport",
                    Id = ObjectId.GenerateNewId().ToString()
                });
            }
            return Ok();
        }
    }
}
