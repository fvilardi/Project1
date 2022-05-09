using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using Sabio.Data.Providers;
using Sabio.Models.AppSettings;
using Sabio.Models.Requests;
using Sabio.Models.Requests.ContactUs;
using Sabio.Models.Requests.Email;
using Sabio.Models.Requests.NewsletterSubscriptions;
using SendGrid;
using SendGrid.Helpers.Mail;
using SendGrid.Helpers.Mail.Model;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.Encodings.Web;
using System.Threading.Tasks;



namespace Sabio.Services
{
    public class EmailService : IEmailService
    {
        private readonly ILogger<EmailService> _logger;
        private AppKeys _appKeys;
        private IConfiguration _config;
        private IWebHostEnvironment _env;
        public EmailService(IOptions<AppKeys> appKeys,
            IConfiguration config,
            IWebHostEnvironment env,
            ILogger<EmailService> logger)
        {
            _logger = logger;
            _appKeys = appKeys.Value;
            _config = config;
            _env = env;

        }

        public async Task SendEmail(SendGridMessage msg)
        {
            var client = new SendGridClient(_appKeys.SendGridAppKey);
            var response = await client.SendEmailAsync(msg);
            var test = response;

        }

        public async Task SendTest(EmailAddRequest emailModel)
        {

            SendGridMessage msg = new()
            {
                From = new EmailAddress(emailModel.From),
                Subject = emailModel.Subject,
                PlainTextContent = emailModel.Body,
                HtmlContent = GetTestTemplate(),
            };

            msg.AddTo(new EmailAddress(emailModel.To));
            await SendEmail(msg);

        }

        public async Task SendRegistrationConfirmation(string email, string token)
        {
            SendGridMessage msg = new SendGridMessage();
            msg.From = new EmailAddress("abelamezcua@gmail.com");
            msg.HtmlContent = GetRegistrationConfirmationTemplate(token);
            msg.Subject = "Please Comfirm Your Email Address";
            msg.AddTo(email);

            await SendEmail(msg);
        }

        private string GetRegistrationConfirmationTemplate(string token)
        {
            string domain = _config.GetSection("Domain").Value;
            var link = domain + "confirm?token=" + token;
            var path = _env.WebRootPath + "/EmailTemplate/RegistrationConfirmation.html";
            string htmlContent = System.IO.File.ReadAllText(path);
            htmlContent = htmlContent.Replace("{{&&link}}", link);
            return htmlContent;
        }

        public async Task SendPasswordResetEmail(string email, string token)
        {
            SendGridMessage msg = new SendGridMessage();
            msg.From = new EmailAddress("abelamezcua@gmail.com");
            msg.HtmlContent = GetPasswordResetTemplate(token);
            msg.Subject = "Reset your password";
            msg.AddTo(email);

            await SendEmail(msg);
        }

        private string GetPasswordResetTemplate(string token)
        {
            string domain = _config.GetSection("Domain").Value;
            var link = domain + "passwordReset?token=" + token;
            var path = _env.WebRootPath + "/EmailTemplate/PasswordReset.html";
            string htmlContent = System.IO.File.ReadAllText(path);
            htmlContent = htmlContent.Replace("{{&&link}}", link);
            return htmlContent;
        }
        private string GetTestTemplate()
        {

            var path = _env.WebRootPath + "/EmailTemplate/GeneralEmail.html";
            StreamReader sr = new(path);
            string body;
            {
                body = sr.ReadToEnd();
            }
            body = body.Replace("{bodyOne}", "Welcome to Trainsquare.io");
            body = body.Replace("{urlOne}", "Click Here to learn more about Trainsquare");
            return body;

        }
        public async Task<bool> ContactUs(ContactUsAddRequest model)
        {
            SendGridClient client = GetMailClient();
            var email = new EmailAddress("stephaniemzavala@gmail.com");
            var path = _env.WebRootPath + "/EmailTemplate/ContactUs.html";
            SendGridMessage msg = new SendGridMessage();
            {
                msg.From = new EmailAddress(model.Email, model.FirstName);
                msg.Subject = model.Subject;
                msg.PlainTextContent = model.Message;
                msg.HtmlContent = File.ReadAllText(path).Replace("{FirstName}", model.FirstName)
                                                        .Replace("{LastName}", model.LastName)
                                                        .Replace("{Subject}", model.Subject)
                                                        .Replace("{Message}", model.Message);
            }

            msg.AddTo(email);


            SendGrid.Response response = await client.SendEmailAsync(msg);
            bool success = response.StatusCode == System.Net.HttpStatusCode.OK || response.StatusCode == System.Net.HttpStatusCode.Accepted;
            return success;
        }

        public async Task SendZoomLink(EmailsAddRequest emailsModel)
        {

            List<string> emailList = emailsModel.ToEmails.Split(",").ToList();

            for (int i = 0; i < emailList.Count; i++)
            {
                SendGridMessage msg = new()
                {
                    From = new EmailAddress(emailsModel.HostEmail, emailsModel.HostName),
                    Subject = emailsModel.Subject,
                    PlainTextContent = emailsModel.Message,
                    HtmlContent = GetZoomTemplate(emailsModel),
                };

                EmailAddress recipient = new EmailAddress(emailList[i]);
                msg.AddTo(recipient);

                var client = new SendGridClient(_appKeys.SendGridAppKey);

                await client.SendEmailAsync(msg);
            }
        }
        private string GetZoomTemplate(EmailsAddRequest model)
        {

            var path = _env.WebRootPath + "/EmailTemplate/ZoomEmailTemplate.html";
            StreamReader sr = new(path);
            string body;
            {
                body = sr.ReadToEnd();
            }
            body = body.Replace("{Subject}", model.Subject);
            body = body.Replace("{Message}", model.Message);
            body = body.Replace("{{urlOne}}", model.MeetingUrl);
            return body;

        }

        private SendGridClient GetMailClient()
        {
            string apiKey = _appKeys.SendGridAppKey;
            SendGridClient client = new SendGridClient(apiKey);
            return client;
        }

        private string GetNewsletterTemplate(string email)
        {
            
            string domain = _config.GetSection("Domain").Value;
            var link = domain + "unsubscribed?email=" + email;
            var path = _env.WebRootPath + "/EmailTemplate/NewsletterSubscription.html";
            string htmlContent = System.IO.File.ReadAllText(path);
            htmlContent = htmlContent.Replace("{{&&link}}", link);
            htmlContent = htmlContent.Replace("{Email}", email);
            return htmlContent; 
        }
        public async Task SubscribeToNewsletter(string email)
        {
            SendGridMessage msg = new SendGridMessage();
            msg.From = new EmailAddress("test1@gmail.com");
            msg.Subject = "You have subscribed to our newsletter!";
            msg.HtmlContent = GetNewsletterTemplate(email);
            msg.AddTo(email);

            await SendEmail(msg);
        }

        public async Task SendPdf(IFormFile pdf, IFormFile model)
        {
            StringBuilder requestBuild = new StringBuilder();
            Models.Domain.Email emailRequest = null;
            using (StreamReader sr2 = new StreamReader(model.OpenReadStream()))
            {
                while(sr2.Peek() != -1)
                {
                    requestBuild.Append(sr2.ReadLine());
                }
                string requestString = requestBuild.ToString();
                emailRequest = JsonConvert.DeserializeObject<Models.Domain.Email>(requestString);
            }

            var path = _env.WebRootPath + "/EmailTemplate/Pdf.html";
            StreamReader sr = new(path);
            string body;
            {
                body = sr.ReadToEnd();
            }
            body = body.Replace("{body}", emailRequest.Body);

            SendGridMessage msg = new()
            {
                //change this to official trainsquare email when available
                From = new EmailAddress("throwawaybctempemailnowork@gmail.com"),
                Subject = emailRequest.Subject,
                HtmlContent = body
            };

            using (var fileStream = pdf.OpenReadStream())
            {
                await msg.AddAttachmentAsync(pdf.FileName, fileStream);

            }

            msg.AddTo(new EmailAddress(emailRequest.To));
            await SendEmail(msg);
        }

    }
}
