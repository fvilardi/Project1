using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Sabio.Models;
using Sabio.Models.Domain;
using Sabio.Services;
using Sabio.Web.Controllers;
using Sabio.Web.Models.Responses;
using System;
using System.Collections.Generic;
using System.Dynamic;

namespace Sabio.Web.Api.Controllers.LocationTypes
{
    [Route("api/lookup")]
    [ApiController]
    public class LookupApiController : BaseApiController
    {
        private ILookupsService _service = null;
        private IAuthenticationService<int> _authService = null;
        public LookupApiController(ILookupsService service
            , ILogger<LookupApiController> logger
            , IAuthenticationService<int> authService) : base(logger)
        {
            _service = service;
            _authService = authService;
        }

        [HttpPost]
        public ActionResult<ItemResponse<ExpandoObject>> GetTypes(IEnumerable<string> tableNames)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                ExpandoObject result = _service.GetTypes(tableNames);

                if (result == null)
                {
                    code = 404;
                    response = new ErrorResponse("App Resource not found");
                }
                else
                {
                    response = new ItemResponse<ExpandoObject> { Item = result };
                }
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }

            return StatusCode(code, response);

        }

    }
}
