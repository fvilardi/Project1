using Data;
using Data.Providers;
using Models.Domain;
using Models.Requests.ShoppingCarts;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services
{
    public class ShoppingCartsService : IShoppingCartsService
    {
        IDataProvider _data = null;

        public ShoppingCartsService(IDataProvider data)
        {
            _data = data;
        }

        public void Delete(int id)
        {

            string procName = "";
            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                col.AddWithValue("@Id", id);
            }, returnParameters: null);
        }

        public int Add(ShoppingCartAddRequest model, int userId)
        {
            int id = 0;

            string procName = "";
            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                SqlParameter idOut = new SqlParameter("@Id", SqlDbType.Int);
                idOut.Direction = ParameterDirection.Output;
                col.Add(idOut);

                AddCommonParams(model, col, userId);

            }, returnParameters: delegate (SqlParameterCollection returnCollection)
            {
                object oId = returnCollection["@Id"].Value;
                int.TryParse(oId.ToString(), out id);
            });
            return id;
        }
        public ShoppingCart GetByCreatedBy(int id)
        {
            string procName = "";

            ShoppingCart shoppingCart = null;

            _data.ExecuteCmd(procName, delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@CreatedBy", id);

            }, delegate (IDataReader reader, short set)
            {
                shoppingCart = new ShoppingCart();

                shoppingCart = MapShoppingCart(reader, out int startingIndex);
            }
            );

            return shoppingCart;
        }
        public void Update(ShoppingCartUpdateRequest model, int userId)
        {
            string procName = "";
            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                AddCommonParams(model, col, userId);
                col.AddWithValue("@Id", model.Id);

            }, returnParameters: null);
        }
        private static ShoppingCart MapShoppingCart(IDataReader reader, out int startingIndex)
        {
            ShoppingCart aShoppingCart = new ShoppingCart();

            startingIndex = 0;
            aShoppingCart.Id = reader.GetInt32(startingIndex++);
            aShoppingCart.WorkShopId = reader.GetInt32(startingIndex++);
            aShoppingCart.InventoryId = reader.GetInt32(startingIndex++);
            aShoppingCart.Quantity = reader.GetInt32(startingIndex++);
            aShoppingCart.DateAdded = reader.GetSafeDateTime(startingIndex++);
            aShoppingCart.DateModified = reader.GetSafeDateTime(startingIndex++);

            return aShoppingCart;
        }
        private static void AddCommonParams(ShoppingCartAddRequest model, SqlParameterCollection col, int userId)
        {
            col.AddWithValue("@WorkShopId", model.WorkShopId);
            col.AddWithValue("@InventoryId", model.InventoryId);
            col.AddWithValue("@Quantity", model.Quantity);
            col.AddWithValue("@User", userId);
       


        }
    }
}
