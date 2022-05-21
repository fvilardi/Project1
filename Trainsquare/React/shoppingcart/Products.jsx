import React from 'react';
import PropTypes from 'prop-types';
import Product from '../shoppingcart/Product';

function Products(props) {
    const { products, onAdd } = props;

    const mapProduct = (product) => {
        return <Product onAdd={onAdd} key={product.id} product={product}></Product>;
    };
    return (
        <main
            style={{
                flex: 2,
                justifyContent: 'space-between',
                backgroundColor: 'white',
                padding: '1rem',
                margin: '0.5rem',
                borderRadius: '0.25rem',
                border: 'grey',
                color: 'grey',
                boxShadow: ' 0px 0px 35px 0px rgba(154, 161, 171, 0.15)',
            }}>
            <h3>Products</h3>
            <hr></hr>
            <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>{products.map(mapProduct)}</div>
        </main>
    );
}
Products.propTypes = {
    products: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            img: PropTypes.string.isRequired,
            title: PropTypes.string.isRequired,
            price: PropTypes.number.isRequired,
        }).isRequired
    ).isRequired,
    onAdd: PropTypes.func.isRequired,
    map: PropTypes.func,
};
export default Products;
