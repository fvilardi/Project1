import axios from "axios";
import debug from "debug";
import {
  API_HOST_PREFIX,
  onGlobalSuccess,
  onGlobalError,
} from "./serviceHelpers";

const _logger = debug.extend("ShoppingCart");

let shoppingCartService = {
  endpoint: `${API_HOST_PREFIX}/api/shoppingcart`,
};
const updateShoppingCartQuantity = (payload, id) => {
  _logger(payload, id);
  const config = {
    method: "PUT",
    url: `${shoppingCartService.endpoint}/${id}`,
    data: payload,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

export { updateShoppingCartQuantity };
