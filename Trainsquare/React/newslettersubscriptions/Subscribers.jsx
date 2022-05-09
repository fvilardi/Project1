import React, { useState, useEffect, useCallback } from 'react';
import debug from 'sabio-debug';
import * as newsletterSubscriptionService from '../../services/newsletterSubscriptionService';
import './newsletter-subscription.css';
import locale from 'rc-pagination/lib/locale/en_US';
import Pagination from 'rc-pagination';
import 'rc-pagination/assets/index.css';

const _logger = debug.extend('Subscribe');

function Subscribers() {
    const [subscriberData, setSubscriberData] = useState({
        totalCount: 0,
        currentPage: 1,
        pageSize: 8,
        pageIndex: 0,
        totalPages: 1,
        search: '',
        subscribers: [],
        subscriberComponents: [],
    });

    useEffect(() => {
        getSubscribers(subscriberData.pageIndex);
    }, []);

    const getSubscribers = (pageIndex) => {
        newsletterSubscriptionService
            .getAll(pageIndex, subscriberData.pageSize)
            .then(onGetSubscribersSuccess)
            .catch(onGetSubscribersError);
    };

    const onGetSubscribersSuccess = (data) => {
        let subscribers = data.item.pagedItems;
        _logger({ data }, 'getsubscriber data');
        setSubscriberData((prevState) => {
            const sd = { ...prevState };
            sd.subscribers = subscribers;
            sd.subscriberComponents = subscribers.map(mapSubscriber);
            sd.totalCount = data.item.totalCount;
            sd.currentPage = data.item.pageIndex + 1;
            sd.pageSize = data.item.pageSize;
            sd.pageIndex = data.item.pageIndex;
            sd.totalPages = data.item.totalPages;

            return sd;
        });
    };

    const onGetSubscribersError = (err) => {
        _logger(err);
    };

    const onChange = (page) => {
        getSubscribers(page - 1);
    };

    const unSubscribe = useCallback((aSubscriber) => {
        const onUnSubscribeSuccess = removeFromDomSuccessHandler(aSubscriber.email);
        newsletterSubscriptionService
            .unsubscribe(aSubscriber.email)
            .then(onUnSubscribeSuccess)
            .catch(onUnSubscribeError);
    }, []);

    const onUnSubscribeError = (err) => {
        _logger(err);
    };

    const removeFromDomSuccessHandler = (emailToBeRemovedFromDom) => {
        return () => {
            setSubscriberData((prevState) => {
                const sd = { ...prevState };
                const idxOf = sd.subscribers.findIndex((subEmail) => {
                    let result = false;
                    if (subEmail.email === emailToBeRemovedFromDom) {
                        result = true;
                    }
                    return result;
                });
                if (idxOf >= 0) {
                    sd.subscribers.splice(idxOf, 1);
                    sd.subscriberComponents.splice(idxOf, 1);
                }
                return sd;
            });
        };
    };

    const onSearchFieldChange = (event) => {
        _logger('onChange', { syntheticEvent: event });

        const target = event.target;

        const newSubscriberValue = target.value;

        const nameOfField = target.name;
        _logger({ nameOfField, newSubscriberValue });

        setSubscriberData((prevState) => {
            _logger('updater onChange');

            const newSubscriberObject = {
                ...prevState,
            };

            newSubscriberObject[nameOfField] = newSubscriberValue;

            return newSubscriberObject;
        });
        _logger('end onChange');
    };

    const handleSearchSubscribers = () => {
        if (subscriberData.pageIndex !== 0) {
            let resetSearchIndex = (subscriberData.pageIndex = 0);
            _logger(resetSearchIndex);
        }
        newsletterSubscriptionService
            .searchSubscribers(subscriberData.pageIndex, subscriberData.pageSize, subscriberData.search)
            .then(onSearchSubscribersSuccess)
            .catch(onSearchSubscribersError);
    };

    const onSearchSubscribersSuccess = (response) => {
        let arrayofSubscriber = response.item.pagedItems;

        setSubscriberData((prevState) => {
            const srchSubscriber = { ...prevState };
            srchSubscriber.subscribers = arrayofSubscriber;
            srchSubscriber.subscriberComponents = arrayofSubscriber.map(mapSubscriber);
            return srchSubscriber;
        });
    };

    const onSearchSubscribersError = (err) => {
        _logger(err);
    };

    const mapSubscriber = (aSubscriber) => {
        _logger(aSubscriber);
        return (
            <div className="style-1" id={aSubscriber.email} subscriber={aSubscriber} key={'List1' + aSubscriber.email}>
                <strong className="style-2">
                    {aSubscriber.email}
                    <hr></hr>
                </strong>
                <hr></hr>
                <div>
                    <button onClick={() => unSubscribe(aSubscriber)} className="remove style-3">
                        <h4 className="style-4">-</h4>
                    </button>
                    <hr></hr>
                </div>
            </div>
        );
    };
    return (
        <React.Fragment>
            <div className="container-fluid">
                <div className="row center">
                    <div className="card style-5">
                        <Pagination
                            locale={locale}
                            className="pagination"
                            onChange={onChange}
                            current={subscriberData.currentPage}
                            total={subscriberData.totalCount}
                            pageSize={subscriberData.pageSize}
                        />
                        <div className="row">
                            <button type="submit" id="subscribe" onClick={handleSearchSubscribers} className="search">
                                Search
                            </button>
                            <input
                                className="form-control me-2 search-field"
                                type="search"
                                placeholder="Search"
                                aria-label="Search"
                                id="searchFriends"
                                name="search"
                                onChange={onSearchFieldChange}
                                value={subscriberData.search}
                            />
                        </div>
                        {subscriberData.subscribers.map(mapSubscriber)}
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}
export default Subscribers;
