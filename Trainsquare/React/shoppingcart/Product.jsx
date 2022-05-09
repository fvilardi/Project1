import React from 'react';
import PropTypes from 'prop-types';

function Product(props) {
    const { product, onAdd } = props;

    return (
        <div>
            <img style={{ maxWidth: '15rem', maxHeight: '13rem' }} src={product.img} alt={product.title}></img>
            <h3 style={{ textAlign: 'center' }}>{product.title}</h3>
            <div style={{ fontSize: '18px', textAlign: 'center' }}>{product.price} AED</div>
            <div>
                <button
                    onClick={() => onAdd(product)}
                    type="button"
                    id="editButton"
                    style={{
                        width: '100%',
                        fontSize: '0.8rem',
                        color: '#727CF5',
                        fontWeight: 'bolder',
                        padding: '0.3rem',
                        margin: '0.1rem',
                        borderRadius: '0.5rem',
                        border: '0.1rem #e0e0e0 solid',
                        backgroundColor: '#e0e0e0',
                        cursor: 'pointer',
                    }}>
                    Add To Cart
                </button>
            </div>
        </div>
    );
}

Product.propTypes = {
    product: PropTypes.shape({
        id: PropTypes.number.isRequired,
        img: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        price: PropTypes.number.isRequired,
    }),
    onAdd: PropTypes.func.isRequired,
};

export default Product;
