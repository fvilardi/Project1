using Data;
using Data.Providers;
using Models;
using Models.Domain;
using Models.Requests.NewsletterSubscriptions;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services
{
    public class NewsletterSubscriptionsService : INewsletterSubscriptionsService
    {
        private IDataProvider _data;

        public NewsletterSubscriptionsService( IDataProvider dataProvider)
        {
            _data = dataProvider;
        }
        public string AddSubscriber(NewsletterSubscriptionsAddRequest model)
        {
            string procName = "";
            string email = null;
            
            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                col.AddWithValue("@Email", model.Email);
            }, returnParameters: delegate (SqlParameterCollection returnCollection)
            {
                object email = returnCollection["@Email"].Value;
            });
            return email;
        }
        public void Unsubscribe(string email)
        {
            string procName = "";
            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                col.AddWithValue("@Email", email);
            }, returnParameters: null);
        }
        public Paged<NewsletterSubscription> GetAll(int pageIndex, int pageSize)
        {
            Paged<NewsletterSubscription> pagedList = null;
            List<NewsletterSubscription> list = null;
            int totalCount = 0;

            string procName = "";

            _data.ExecuteCmd(procName, inputParamMapper: delegate (SqlParameterCollection param)
            {
                param.AddWithValue("@pageIndex", pageIndex);
                param.AddWithValue("@pageSize", pageSize);
            },
            singleRecordMapper: delegate (IDataReader reader, short set)
            {
                NewsletterSubscription subscriber = MapSubscribers(reader, out int startingIndex);
                if (totalCount == 0)
                {
                    totalCount = reader.GetSafeInt32(startingIndex++);
                }

                if (list == null)
                {
                    list = new List<NewsletterSubscription>();
                }

                list.Add(subscriber);
            });
            if (list != null)
            {
                pagedList = new Paged<NewsletterSubscription>(list, pageIndex, pageSize, totalCount);
            }
            return pagedList;
        }

        public Paged<NewsletterSubscription> Search(int pageIndex, int pageSize, string query)
        {
            Paged<NewsletterSubscription> pagedlist = null;
            List<NewsletterSubscription> list = null;
            int totalCount = 0;
            string procName = "";
            _data.ExecuteCmd(procName, inputParamMapper: delegate (SqlParameterCollection param)
            {
                    param.AddWithValue("@pageIndex", pageIndex);
                    param.AddWithValue("@pageSize", pageSize);
                    param.AddWithValue("@Query", query);
                },
                singleRecordMapper: delegate (IDataReader reader, short set)
                {
                    NewsletterSubscription newsletterSubscribers = MapSubscribers(reader, out int startingIndex);
                    if (totalCount == 0)
                    {
                        totalCount = reader.GetSafeInt32(startingIndex++);
                    }
                    if (list == null)
                    {
                        list = new List<NewsletterSubscription>();
                    }
                    list.Add(newsletterSubscribers);
                }
                );
            if (list != null)
            {
                pagedlist = new Paged<NewsletterSubscription>(list, pageIndex, pageSize, totalCount);
            }
            return pagedlist;
        }
        private NewsletterSubscription MapSubscribers(IDataReader reader, out int startingIndex)
        {
            NewsletterSubscription subscribers = new NewsletterSubscription();
            startingIndex = 0;
            subscribers.Email = reader.GetSafeString(startingIndex++);
            subscribers.IsSubscribed = reader.GetSafeBool(startingIndex++);
            subscribers.DateCreated = reader.GetSafeDateTime(startingIndex++);
            subscribers.DateModified = reader.GetSafeDateTime(startingIndex++);

            return subscribers;
        }
    }
}
