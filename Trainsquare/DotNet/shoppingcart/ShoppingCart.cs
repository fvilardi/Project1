using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Domain
{
    public class ShoppingCart : BaseShoppingCart
    {
        public int WorkShopId { get; set; }
        public int Quantity { get; set; }
    }
}
