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

namespace admin.Controllers
{
    [Route("api/[controller]")]
    public class PlacesController : Controller
    {
        private readonly IMongoRepository _repository = null;

        public PlacesController(IMongoRepository repository)
        {
            _repository = repository;
        }

        // GET: api/Places
        [Authorize(Roles = "Administrator")]
        [HttpGet]
        public async Task<IEnumerable<Place>> Get()
        {
            return await _repository.GetAll<Place>();
        }

        // GET: api/Places
        [HttpGet("getbytype")]
        public async Task<List<Place>> GetByType(Enumerations.PlaceType type)
        {
            var filter = Builders<Place>.Filter.Where(x => x.PlaceType == type);
            return await _repository.FindCursor(filter).ToListAsync();
        }

        // GET api/Places/5
        [Authorize(Roles = "Administrator")]
        [HttpGet("{id}")]
        public async Task<Place> Get(string id)
        {
            return await _repository.Get<Place>(id);
        }

        // GET api/Places/search/?=
        [Authorize(Roles = "Administrator")]
        [HttpGet("search")]
        public async Task<List<Place>> Search(string q)
        {
            var filter = Builders<Place>.Filter.Where(x => x.Description.Contains(q) || x.Title.Contains(q) || x.Address.Contains(q) || x.City.Contains(q));
            return await _repository.FindCursor(filter).ToListAsync();
        }

        // POST api/Places
        [HttpPost]
        [Authorize(Roles = "Administrator")]
        public async Task<IActionResult> Post([FromBody]Place model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            model.Id = ObjectId.GenerateNewId().ToString();
            await _repository.Insert(model);
            return Ok();
        }

        // PUT api/Places/5
        [Authorize(Roles = "Administrator")]
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(string id, [FromBody]Place model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            Builders<Place>.Filter.Eq("Id", id);


            var update = Builders<Place>.Update.Set("Title",model.Title).Set("Description",model.Description).Set("Lat",model.Lat).Set("Long", model.Long).Set("PlaceType", model.PlaceType).Set("PostCode", model.PostCode).Set("Address", model.Address).Set("City",model.City);
            
            await _repository.Update(id, update);
            return Ok();
        }

        // DELETE api/Places/5
        [Authorize(Roles = "Administrator")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            await _repository.Delete<Place>(id);
            return Ok();
        }
    }
}
