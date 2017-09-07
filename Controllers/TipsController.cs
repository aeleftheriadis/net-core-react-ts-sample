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
    public class TipsController : Controller
    {
        private readonly IMongoRepository _repository = null;

        public TipsController(IMongoRepository repository)
        {
            _repository = repository;
        }

        // GET: api/Tips
        [Authorize(Roles = "Administrator")]
        [HttpGet]
        public async Task<IEnumerable<Tip>> Get()
        {
            return await _repository.GetAll<Tip>();
        }

        // GET api/Tips/5
        [Authorize(Roles = "Administrator")]
        [HttpGet("{id}")]
        public async Task<Tip> Get(string id)
        {
            return await _repository.Get<Tip>(id);
        }

        
        // GET api/Tips/Random
        [HttpGet("random")]
        public async Task<Tip> Random() {
            return await _repository.GetRandom<Tip>();
        }

        // GET api/Tips/search/?=
        [Authorize(Roles = "Administrator")]
        [HttpGet("search")]
        public async Task<List<Tip>> Search(string q)
        {
            var filter = Builders<Tip>.Filter.Where(x => x.Title.Contains(q));
            return await _repository.FindCursor(filter).ToListAsync();
        }

        // POST api/Tips
        [HttpPost]
        [Authorize(Roles = "Administrator")]
        public async Task<IActionResult> Post([FromBody]Tip model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            model.Id = ObjectId.GenerateNewId().ToString();
            await _repository.Insert(model);
            return Ok();
        }

        // PUT api/Tips/5
        [Authorize(Roles = "Administrator")]
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(string id, [FromBody]Tip model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            Builders<Tip>.Filter.Eq("Id", id);


            var update = Builders<Tip>.Update.Set("Title",model.Title);
            
            await _repository.Update(id, update);
            return Ok();
        }

        // DELETE api/Tips/5
        [Authorize(Roles = "Administrator")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            await _repository.Delete<Tip>(id);
            return Ok();
        }
    }
}
