using Sabio.Models;
using Sabio.Models.Domain;
using Sabio.Models.Requests.NewsletterSubscriptions;
using SendGrid.Helpers.Mail;

namespace Sabio.Services
{
    public interface INewsletterSubscriptionsService
    {
        string AddSubscriber(NewsletterSubscriptionsAddRequest model);
        void Unsubscribe(string email);
        Paged<NewsletterSubscription> GetAll(int pageIndex, int pageSize);
        Paged<NewsletterSubscription> Search(int pageIndex, int pageSize, string query);
    }
}