using System.Collections.Generic;
using System.Data;

namespace Code_Challenge
{
    public class CustomersService : ICustomersService
    {
        IDataProvider _data = null;

        public CustomersService(IDataProvider data)
        {
            _data = data;
        }
        public List<Customer> GetAll()
        {
            List<Customer> list = new List<Customer>();

            _data.ExecuteCmd(inputParamMapper: null,
                singleRecordMapper: delegate (IDataReader reader, short set)
                {
                    Customer aCustomer = new Customer();
                    Customer customer = MapCustomer(reader, out int startingIndex);
                    list.Add(customer);
                }
                );
            return list;
        }
        private static Customer MapCustomer(IDataReader reader, out int startingIndex)
        {
            Customer aCustomer = new Customer();

            startingIndex = 0;
            aCustomer.CustomerId = reader.GetString(startingIndex++);
            aCustomer.FirstName = reader.GetString(startingIndex++);
            aCustomer.LastName = reader.GetString(startingIndex++);
            aCustomer.Email = reader.GetString(startingIndex++);
            aCustomer.PhoneNumber = reader.GetString(startingIndex++);
            aCustomer.CountryCode = reader.GetString(startingIndex++);
            aCustomer.Gender = reader.GetString(startingIndex++);
            aCustomer.Balance = reader.GetInt32(startingIndex++);

            return aCustomer;
        }
    }
}
