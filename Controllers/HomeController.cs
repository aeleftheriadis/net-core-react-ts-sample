using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using admin.DatabaseContext;
using admin.Models;
using MongoDB.Driver;
using Microsoft.Extensions.Options;
using MongoDB.Bson;
using admin.Services;

namespace admin.Controllers
{
    public class HomeController : Controller
    {
        private readonly IMongoRepository _repository = null;
        

        public HomeController(IMongoRepository repository)
        {
            _repository = repository;
           
        }
        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Error()
        {
            return View();
        }
    }
}
