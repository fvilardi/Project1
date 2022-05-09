import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import debug from 'sabio-debug';
import basicSchema from '../../schema/shoppingCartSchema';

const _logger = debug.extend('Checkout');

function Checkout() {
    const formState = {
        formData: {
            addressLine1: '',
            addressLine2: '',
            city: '',
            state: '',
            zip: '',
        },
    };

    const { state } = useLocation();
    _logger(state);

    useEffect(() => {
        if (state.shoppingCartData) {
            _logger(state.shoppingCartData);
            handlePlaceOrder(state.shoppingCartData);
        }
    }, [state]);

    const handlePlaceOrder = (orderInfo) => {
        _logger(orderInfo);
    };

    return (
        <React.Fragment>
            <div className="row" style={{ marginLeft: '3.5in', marginRight: '3.5in' }}>
                <div
                    style={{
                        flex: 2,
                        backgroundColor: 'white',
                        padding: '1rem',
                        margin: '0.5rem',
                        borderRadius: '0.25rem',
                        border: 'grey',
                        color: 'grey',
                        boxShadow: ' 0px 0px 35px 0px rgba(154, 161, 171, 0.15)',
                    }}>
                    <h3 style={{ textAlign: 'center' }}>Shipping address</h3>
                    <div>
                        <Formik
                            enableReinitialize={true}
                            initialValues={formState.formData}
                            validationSchema={basicSchema}>
                            <Form>
                                <div className="container-fluid" style={{ marginLeft: '.8in', maxWidth: '30%' }}>
                                    <div className="form-group" style={{ width: '110%' }}>
                                        <label htmlFor="addressLine1" style={{ fontSize: '17px' }}>
                                            Address Line 1
                                        </label>
                                        <div>
                                            <Field
                                                className="form-control"
                                                type="text"
                                                name="addressLine1"
                                                style={{ width: '300%' }}></Field>
                                            <ErrorMessage
                                                name="addressLine1"
                                                component="div"
                                                style={{ color: 'red', width: '100%' }}></ErrorMessage>
                                        </div>
                                    </div>
                                    <div className="form-group" style={{ width: '110%' }}>
                                        <label htmlFor="addressLine2" style={{ fontSize: '17px' }}>
                                            Address Line 2
                                        </label>
                                        <div>
                                            <Field
                                                className="form-control"
                                                type="text"
                                                name="addressLine2"
                                                style={{ width: '300%' }}></Field>
                                            <ErrorMessage
                                                name="addressLine2"
                                                component="div"
                                                style={{ color: 'red', width: '100%' }}></ErrorMessage>
                                        </div>
                                    </div>
                                    <div className="form-group" style={{ width: '110%' }}>
                                        <label htmlFor="city" style={{ fontSize: '17px' }}>
                                            City
                                        </label>
                                        <div>
                                            <Field
                                                className="form-control"
                                                type="text"
                                                name="city"
                                                style={{ width: '300%' }}></Field>
                                            <ErrorMessage
                                                name="city"
                                                component="div"
                                                style={{ color: 'red', width: '100%' }}></ErrorMessage>
                                        </div>
                                    </div>
                                    <div className="form-group" style={{ width: '110%' }}>
                                        <label htmlFor="state" style={{ fontSize: '17px' }}>
                                            State
                                        </label>
                                        <div>
                                            <Field
                                                className="form-control"
                                                type="text"
                                                name="state"
                                                style={{ width: '300%' }}></Field>
                                            <ErrorMessage
                                                name="state"
                                                component="div"
                                                style={{ color: 'red', width: '100%' }}></ErrorMessage>
                                        </div>
                                    </div>
                                    <div className="form-group" style={{ width: '110%' }}>
                                        <label htmlFor="zip" style={{ fontSize: '17px' }}>
                                            Zip
                                        </label>
                                        <div>
                                            <Field
                                                className="form-control"
                                                type="text"
                                                name="zip"
                                                style={{ width: '300%' }}></Field>
                                            <ErrorMessage
                                                name="zip"
                                                component="div"
                                                style={{ color: 'red', width: '100%' }}></ErrorMessage>
                                        </div>
                                    </div>
                                </div>
                            </Form>
                        </Formik>
                    </div>
                </div>
                <aside
                    style={{
                        flex: 1,
                        justifyContent: 'space-between',
                        backgroundColor: 'white',
                        padding: '1rem',
                        margin: '0.5rem',
                        borderRadius: '0.25rem',
                        color: 'grey',
                        boxShadow: ' 0px 0px 35px 0px rgba(154, 161, 171, 0.15)',
                    }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <button
                            onClick={handlePlaceOrder}
                            type="button"
                            id="editButton"
                            style={{
                                width: '100%',
                                fontSize: '0.8rem',
                                fontWeight: 'bolder',
                                color: '#727CF5',
                                padding: '0.2rem',
                                margin: '0.1rem',
                                borderRadius: '0.5rem',
                                border: '0.1rem #e0e0e0 solid',
                                backgroundColor: '#e0e0e0',
                                cursor: 'pointer',
                            }}>
                            Place your order
                        </button>
                    </div>
                    <hr></hr>

                    <h3>Order Summary</h3>

                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            fontSize: '1rem',
                        }}></div>

                    <>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1rem' }}>
                            <div style={{ flex: 2 }}> Items ({state.shoppingCartData.quantity})</div>
                            <div style={{ flex: 1, textAlign: 'right' }}>
                                {state.shoppingCartData.itemsPrice.toFixed(2)} AED
                            </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1rem' }}>
                            <div style={{ flex: 2 }}> Tax </div>
                            <div style={{ flex: 1, textAlign: 'right' }}>
                                {state.shoppingCartData.taxPrice.toFixed(2)} AED
                            </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1rem' }}>
                            <div style={{ flex: 2 }}> Shipping </div>
                            <div style={{ flex: 1, textAlign: 'right' }}>
                                {state.shoppingCartData.shippingPrice.toFixed(2)} AED
                            </div>
                        </div>
                        <hr></hr>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1rem' }}>
                            <div style={{ flex: 2 }}>
                                <h4>
                                    <strong>Total</strong>
                                </h4>
                            </div>
                            <div style={{ flex: 1, textAlign: 'right' }}>
                                <h4>
                                    <strong>{state.shoppingCartData.totalPrice.toFixed(2)} AED</strong>
                                </h4>
                            </div>
                        </div>
                    </>
                </aside>
            </div>
        </React.Fragment>
    );
}
export default Checkout;
