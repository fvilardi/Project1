using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System.Threading.Tasks;

namespace Service
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
    }
}
