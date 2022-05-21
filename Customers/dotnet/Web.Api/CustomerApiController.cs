using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;

namespace Code_Challenge
{
    [Route("api/")]
    [ApiController]
    public class CustomerApiController : BaseApiController
    {
        private ICustomersService _fieldEdgeService = null;

        public CustomerApiController(ICustomersService fieldEdgeService
            , ILogger<CustomerApiController> logger) : base(logger)
        {
            _fieldEdgeService = fieldEdgeService;
        }

        [HttpGet("Customers")]
        public ActionResult<ItemsResponse<Customer>> GetAll()
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                List<Customer> list = _fieldEdgeService.GetAll();

                if (list == null)
                {
                    code = 404;
                    response = new ErrorResponse("App resource not found");
                }
                else
                {
                    response = new ItemsResponse<Customer> { Items = list };
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
