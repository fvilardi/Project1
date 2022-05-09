import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import debug from 'sabio-debug';
import './newsletter-subscription.css';
import * as newsletterSubscriptionService from '../../services/newsletterSubscriptionService';

const _logger = debug.extend('Unsubscribed');

function Unsubscribed() {
    const state = useLocation().search;
    const emailFromState = new URLSearchParams(state).get('email');

    useEffect(() => {
        unSubscribeEmail(emailFromState);
    }, []);

    const unSubscribeEmail = (emailFromState) => {
        newsletterSubscriptionService
            .unsubscribe(emailFromState)
            .then(onUnsubscribeEmailSuccess)
            .catch(onUnsubscribeEmailError);
    };

    const onUnsubscribeEmailSuccess = (response) => {
        _logger(response);
    };

    const onUnsubscribeEmailError = (err) => {
        _logger(err);
    };

    return (
        <div className="container">
            <div className="row unsubscribe-center">
                <div className="col">
                    <strong>You Have Successfully Unsubscribed!</strong>
                </div>
            </div>
        </div>
    );
}
export default Unsubscribed;
