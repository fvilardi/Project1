import React, { useState } from 'react';
import Products from '../shoppingcart/Products';
import Cart from '../shoppingcart/Cart';
import ProductData from './ProductData';

function Header() {
    const { products } = ProductData;
    const [cartItems, setCartItems] = useState([]);

    const onAdd = (product) => {
        const exist = cartItems.find((c) => c.id === product.id);
        if (exist) {
            setCartItems(cartItems.map((c) => (c.id === product.id ? { ...exist, quantity: exist.quantity + 1 } : c)));
        } else {
            setCartItems([...cartItems, { ...product, quantity: 1 }]);
        }
    };

    const onRemove = (product) => {
        const exist = cartItems.find((c) => c.id === product.id);
        if (exist.quantity === 1) {
            setCartItems(cartItems.filter((c) => c.id !== product.id));
        } else {
            setCartItems(cartItems.map((c) => (c.id === product.id ? { ...exist, quantity: exist.quantity - 1 } : c)));
        }
    };

    return (
        <React.Fragment>
            <header
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    backgroundColor: '#fff',
                    padding: '1rem',
                    margin: '0.5rem',
                    borderRadius: '0.25rem',
                    alignItems: 'center',
                    boxShadow: ' 0px 0px 35px 0px rgba(154, 161, 171, 0.15)',
                }}>
                <div>
                    <a href="#/">
                        <h1 style={{ color: 'grey' }}>Shopping Cart</h1>
                    </a>
                </div>
            </header>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                }}>
                <Products onAdd={onAdd} products={products}></Products>
                <Cart onAdd={onAdd} onRemove={onRemove} cartItems={cartItems}></Cart>
            </div>
        </React.Fragment>
    );
}
export default Header;
