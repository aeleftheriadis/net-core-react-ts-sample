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
using System.IO;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Hosting;
using Npoi.Core.SS.UserModel;
using Npoi.Core.HSSF.UserModel;
using Npoi.Core.XSSF.UserModel;
using admin.Services;

namespace admin.Controllers
{
    [Route("api/[controller]")]
    public class UsersController : Controller
    {
        private readonly IMongoRepository _repository = null;
        private IHostingEnvironment _env;
        private readonly IEncryptionService _encryptionService = null;

        public UsersController(IMongoRepository repository, IHostingEnvironment env, IEncryptionService encryptionService)
        {
            _repository = repository;
            _env = env;
            _encryptionService = encryptionService;
        }

        // POST api/UploadFiles
        [HttpPost("UploadFiles")]
        [Authorize(Roles = "Administrator")]
        public async Task<IActionResult> Post()
        {
            var form = HttpContext.Request.Form;

            List<IFormFile> files = new List<IFormFile>(form.Files);
            long size = files.Sum(f => f.Length);

            // full path to file in temp location
            var filePath = Path.GetTempFileName();

            foreach (var formFile in files)
            {
                if (formFile.Length > 0)
                {
                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await formFile.CopyToAsync(stream);
                        await HandleFileAsync(formFile);
                    }
                }
            }
            return Ok();
        }

        private async Task HandleFileAsync(IFormFile formFile)
        {
            var webRoot = _env.WebRootPath;
            ISheet sheet;
            string filename = Path.GetFileName(Path.Combine(webRoot, formFile.FileName));
            var fileExt = Path.GetExtension(filename);

            if (fileExt == ".xls")
            {
                HSSFWorkbook xlsWorkBook = new HSSFWorkbook(formFile.OpenReadStream()); //HSSWorkBook object will read the Excel 97-2000 formats  
                sheet = xlsWorkBook.GetSheetAt(0); //get first Excel sheet from workbook  
            }
            else
            {
                XSSFWorkbook xslsWorkBook = new XSSFWorkbook(formFile.OpenReadStream()); //XSSFWorkBook will read 2007 Excel format  
                sheet = xslsWorkBook.GetSheetAt(0); //get first Excel sheet from workbook   
            }
            for (int row = 1; row <= sheet.LastRowNum; row++) //Loop the records upto filled row  
            {
                if (sheet.GetRow(row) != null) //null is when the row only contains empty cells   
                {
                    for(int col = 0; col<=5; col++)
                    {
                        sheet.GetRow(row).GetCell(col).SetCellType(CellType.String);
                    }

                    string username = sheet.GetRow(row).GetCell(3).StringCellValue;
                    string firstName = sheet.GetRow(row).GetCell(0).StringCellValue;
                    string lastName = sheet.GetRow(row).GetCell(1).StringCellValue;
                    string email = sheet.GetRow(row).GetCell(2).StringCellValue;
                    string password = sheet.GetRow(row).GetCell(4).StringCellValue;
                    string points = sheet.GetRow(row).GetCell(5).StringCellValue;
                    int pointsNum = 0;
                    int.TryParse(points, out pointsNum);

                    string encryptedPassword = _encryptionService.EncryptString(password);

                    User user = await GetUser(username);
                    if (user != null)
                    {
                        await UpdateUser(firstName, lastName, email, pointsNum, encryptedPassword, user);
                    }
                    else
                    {
                        await InsertUser(username, firstName, lastName, email, pointsNum, encryptedPassword);
                    }
                }
            }
        }

        private async Task InsertUser(string username, string firstName, string lastName, string email, int pointsNum, string encryptedPassword)
        {
            await _repository.Insert(new User()
            {
                Username = username,
                Email = email,
                FirstName = firstName,
                Password = encryptedPassword,
                LastName = lastName,
                Points = pointsNum,
                Role = Enumerations.Role.Simple,
                Id = ObjectId.GenerateNewId().ToString()
            });
        }

        private async Task UpdateUser(string firstName, string lastName, string email, int pointsNum, string encryptedPassword, User user)
        {
            Builders<User>.Filter.Eq("Id", user.Id);

            var update = Builders<User>.Update
                .Set("FirstName", firstName)
                .Set("LastName", lastName)
                .Set("Email", email)
                .Set("Password", encryptedPassword)
                .Set("Points", pointsNum);

            await _repository.Update(user.Id, update);
        }

        private async Task<User> GetUser(string username)
        {
            var filter = Builders<User>.Filter.Where(x => x.Username == username);
            return await _repository.FindCursor(filter).FirstOrDefaultAsync();
        }

        // POST api/getbyusername
        [HttpGet("getbyusername")]
        [Authorize(Roles = "Simple")]
        public async Task<User> GetByUsername(string username)
        {
            var filter = Builders<User>.Filter.Where(x => x.Username == username && x.Role != Enumerations.Role.Administrator);            
            return await _repository.FindCursor(filter).FirstOrDefaultAsync();
        }
    }
}
