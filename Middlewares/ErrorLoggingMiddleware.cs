using Microsoft.AspNetCore.Http;
using SharpRaven.Core;
using SharpRaven.Core.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace admin.Middlewares
{
    public class ErrorLoggingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly IRavenClient _client = null;

        public ErrorLoggingMiddleware(RequestDelegate next, IRavenClient client)
        {
            _client = client;
            _next = next;            
        }

        public async Task Invoke(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception e)
            {
                await _client.CaptureAsync(new SentryEvent(e));
            }
        }
    }
}
