import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import * as shoppingCartService from "../../services/shoppingCartService";
import debug from "debug";
import toastr from "../../utils/toastr";
const _logger = debug.extend("ShoppingCart");
function Cart(props) {
  const navigate = useNavigate();
  const { cartItems, onAdd, onRemove } = props;
  const itemsPrice = cartItems.reduce((a, c) => a + c.price * c.quantity, 0);
  const taxPrice = itemsPrice * 0.05;
  const shippingPrice = itemsPrice < 100 ? 5 : 0;
  const totalPrice = itemsPrice + taxPrice + shippingPrice;
  const userShoppingCart = {
    id: 4,
    workShopId: "3",
    inventoryId: "9",
    quantity: cartItems.length,
    userId: 227,
  };
  const shoppingCartData = {
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    id: 4,
    quantity: cartItems.length,
  };
  const onUpdateCartQuantitySuccess = (response) => {
    _logger(response, "Cart update success");
    toastr.success("Success!", "You have successfully updated the cart items");
  };
  const onUpdateCartQuantityError = (err) => {
    _logger(err, "Cart update error");
    toastr.error("Not Successful", "You will need to update the cart again ");
  };
  useEffect(() => {
    shoppingCartService
      .updateShoppingCartQuantity(userShoppingCart, userShoppingCart.id)
      .then(onUpdateCartQuantitySuccess)
      .catch(onUpdateCartQuantityError);
  });
  const handleCheckout = () => {
    navigate(`/cart/checkout/${userShoppingCart.id}`, {
      state: { shoppingCartData },
    });
  };
  const mapCartData = (item) => {
    return (
      <div
        key={item.id}
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: "1rem",
        }}
      >
        <img
          style={{ maxWidth: "3rem", maxHeight: "3rem", marginTop: "6px" }}
          src={item.img}
          alt={item.title}
        ></img>
        <div style={{ flex: 3, marginTop: "10px" }}>{item.title}</div>
        <div>
          <button
            style={{
              width: "45px",
              height: "30px",
              fontSize: "0.8rem",
              padding: "0.2rem",
              margin: "0.1rem",
              marginRight: "1rem",
              borderRadius: "0.5rem",
              border: "0.1rem #E0E0E0 solid",
              backgroundColor: "#727CF5",
              cursor: "pointer",
              color: "white",
            }}
            onClick={() => onAdd(item)}
            className="add"
          >
            <h4 style={{ marginTop: "0.1rem" }}>+</h4>
          </button>
          <button
            style={{
              width: "45px",
              height: "30px",
              fontSize: "0.8rem",
              padding: "0.2rem",
              margin: "0.1rem",
              borderRadius: "0.5rem",
              border: "0.1rem #E0E0E0 solid",
              backgroundColor: "#727CF5",
              cursor: "pointer",
              color: "white",
            }}
            onClick={() => onRemove(item)}
            className="remove"
          >
            <h4 style={{ marginTop: "0.1rem" }}>-</h4>
          </button>
        </div>
        <div style={{ flex: 2, textAlign: "right" }}>
          {item.quantity} x {item.price} AED
        </div>
      </div>
    );
  };
  return (
    <aside
      style={{
        flex: 1,
        justifyContent: "space-between",
        backgroundColor: "white",
        padding: "1rem",
        margin: "0.5rem",
        borderRadius: "0.25rem",
        color: "grey",
        boxShadow: " 0px 0px 35px 0px rgba(154, 161, 171, 0.15)",
      }}
    >
      <h3 style={{ size: "24px" }}>Cart Items ({cartItems.length})</h3>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: "1rem",
        }}
      >
        {cartItems.length === 0 && <div>Cart Is Empty</div>}
      </div>
      {cartItems.map(mapCartData)}
      {cartItems.length !== 0 && (
        <>
          <hr></hr>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "1rem",
            }}
          >
            <div style={{ flex: 2 }}> Items </div>
            <div style={{ flex: 1, textAlign: "right" }}>
              {itemsPrice.toFixed(2)} AED
            </div>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "1rem",
            }}
          >
            <div style={{ flex: 2 }}> Tax </div>
            <div style={{ flex: 1, textAlign: "right" }}>
              {taxPrice.toFixed(2)} AED
            </div>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "1rem",
            }}
          >
            <div style={{ flex: 2 }}> Shipping </div>
            <div style={{ flex: 1, textAlign: "right" }}>
              {shippingPrice.toFixed(2)} AED
            </div>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "1rem",
            }}
          >
            <div style={{ flex: 2 }}>
              <h4>Total </h4>
            </div>
            <div style={{ flex: 1, textAlign: "right" }}>
              <h4>{totalPrice.toFixed(2)} AED</h4>
            </div>
          </div>
          <hr></hr>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <button
              type="button"
              id="editButton"
              style={{
                width: "100%",
                fontSize: "0.8rem",
                fontWeight: "bolder",
                color: "#727CF5",
                padding: "0.2rem",
                margin: "0.1rem",
                borderRadius: "0.5rem",
                border: "0.1rem #E0E0E0 solid",
                backgroundColor: "#E0E0E0",
                cursor: "pointer",
              }}
              onClick={handleCheckout}
            >
              Checkout
            </button>
          </div>
        </>
      )}
    </aside>
  );
}
Cart.propTypes = {
  cartItems: PropTypes.arrayOf(PropTypes.object),
  onAdd: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
};
export default Cart;
