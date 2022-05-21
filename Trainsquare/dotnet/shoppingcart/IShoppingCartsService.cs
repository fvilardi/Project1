using Models.Domain;
using Models.Requests.ShoppingCarts;

namespace Services
{
    public interface IShoppingCartsService
    {
        int Add(ShoppingCartAddRequest model, int userId);
        void Delete(int id);
        ShoppingCart GetByCreatedBy(int id);
        void Update(ShoppingCartUpdateRequest model, int userId);
    }
}