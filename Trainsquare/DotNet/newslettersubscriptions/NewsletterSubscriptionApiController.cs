using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Models;
using Models.Domain;
using Models.Requests.Email;
using Models.Requests.NewsletterSubscriptions;
using Services;
using Web.Controllers;
using Web.Models.Responses;
using System;

namespace Web.Api.Controllers
{
    [Route("api/newslettersubscription")]
    [ApiController]
    public class NewsletterSubscriptionApiController : BaseApiController
    {
        private INewsletterSubscriptionsService _service = null;
        private IEmailService _emailService = null;

        public NewsletterSubscriptionApiController(INewsletterSubscriptionsService service
            , ILogger<NewsletterSubscriptionApiController> logger
            , IEmailService emailService
            ) : base(logger)
        {
            _service = service;
            _emailService = emailService;
        }

        [HttpPost("subscribe")]
        [AllowAnonymous]
        public ActionResult<SuccessResponse> SubscribeToNewsletter(NewsletterSubscriptionsAddRequest model)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                string email = _service.AddSubscriber(model);
                _emailService.SubscribeToNewsletter(model.Email);
                response = new SuccessResponse();

            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }

            return StatusCode(code, response);
        }

        [HttpPut("{email}")]
        public ActionResult<SuccessResponse> UnsubscribeFromNewsletter(string email)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                _service.Unsubscribe(email);
                response = new SuccessResponse();
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }

            return StatusCode(code, response);
        }

        [HttpGet("paginate")]
        public ActionResult<ItemResponse<Paged<NewsletterSubscription>>> GetAll(int pageIndex, int pageSize)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                Paged<NewsletterSubscription> paged = _service.GetAll(pageIndex, pageSize);

                if (paged == null)
                {
                    code = 404;
                    response = new ErrorResponse("Record not found.");
                }
                else
                {
                    ItemResponse<Paged<NewsletterSubscription>> itemResponse = new ItemResponse<Paged<NewsletterSubscription>>();
                    itemResponse.Item = paged;
                    response = new ItemResponse<Paged<NewsletterSubscription>> { Item = paged };
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

        [HttpGet("search")]
        public ActionResult<ItemResponse<Paged<NewsletterSubscription>>> Search(int pageIndex, int pageSize, string query)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                Paged<NewsletterSubscription> paged = _service.Search(pageIndex, pageSize, query);

                if (paged == null)
                {
                    code = 404;
                    response = new ErrorResponse("Records Not Found.");
                }
                else
                {
                    response = new ItemResponse<Paged<NewsletterSubscription>> { Item = paged };
                }
            }
            catch (Exception ex)
            {
                code = 500;
                base.Logger.LogError(ex.ToString());
                response = new ErrorResponse(ex.Message);
            }
            return StatusCode(code, response);

        }
    }
}
