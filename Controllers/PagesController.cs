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
    public class PagesController : Controller
    {
        private readonly IMongoRepository _repository = null;

        public PagesController(IMongoRepository repository)
        {
            _repository = repository;
        }

        // GET: api/pages
        [Authorize(Roles = "Administrator")]
        [HttpGet]
        public async Task<IEnumerable<Page>> Get()
        {
            return await _repository.GetAll<Page>();
        }

        // GET api/pages/5
        [Authorize(Roles = "Administrator")]
        [HttpGet("{id}")]
        public async Task<Page> Get(string id)
        {
            return await _repository.Get<Page>(id);
        }

        // GET api/pages/GetByKey/test
        [HttpGet("getbykey")]
        public async Task<Page> GetByKey(string key)
        {
            var filter = Builders<Page>.Filter.Where(x => x.Key == key);
            return await _repository.FindCursor(filter).FirstAsync();
        }

        // GET api/pages/search/?=
        [Authorize(Roles = "Administrator")]
        [HttpGet("search")]
        public async Task<List<Page>> Search(string q)
        {
            var filter = Builders<Page>.Filter.Where(x => x.Description.Contains(q) || x.Title.Contains(q));
            return await _repository.FindCursor(filter).ToListAsync();
        }

        // POST api/pages
        [HttpPost]
        [Authorize(Roles = "Administrator")]
        public async Task<IActionResult> Post([FromBody]Page model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            model.Id = ObjectId.GenerateNewId().ToString();
            await _repository.Insert(model);
            return Ok();
        }

        // PUT api/pages/5
        [Authorize(Roles = "Administrator")]
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(string id, [FromBody]Page model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            Builders<Page>.Filter.Eq("Id", id);


            var update = Builders<Page>.Update.Set("Title",model.Title).Set("Description",model.Description);
            
            await _repository.Update(id, update);
            return Ok();
        }

        // DELETE api/pages/5
        [Authorize(Roles = "Administrator")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            await _repository.Delete<Page>(id);
            return Ok();
        }
    }
}
