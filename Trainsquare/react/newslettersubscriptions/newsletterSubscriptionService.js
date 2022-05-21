import axios from "axios";
import debug from "debug";
import {
  API_HOST_PREFIX,
  onGlobalSuccess,
  onGlobalError,
} from "./serviceHelpers";

const _logger = debug.extend("Subscriptions");

let endpoint = `${API_HOST_PREFIX}/api/newslettersubscription`;

const subscribe = (payload) => {
  _logger(payload);
  const config = {
    method: "POST",
    url: `${endpoint}/subscribe`,
    data: payload,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const unsubscribe = (email) => {
  _logger(email);
  const config = {
    method: "PUT",
    url: `${endpoint}/${email}`,
    data: email,

    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const getAll = (pageIndex, pageSize) => {
  const config = {
    method: "GET",
    url: `${endpoint}/paginate?pageIndex=${pageIndex}&pageSize=${pageSize}`,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const searchSubscribers = (pageIndex, pageSize, search) => {
  const config = {
    method: "GET",
    url: `${endpoint}/search?pageIndex=${pageIndex}&pageSize=${pageSize}&query=${search}`,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

export { subscribe, unsubscribe, getAll, searchSubscribers };
