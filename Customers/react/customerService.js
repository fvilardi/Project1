import axios from "axios";

const getAll = () => {
  const config = {
    method: "GET",
    url: `/Customers`,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config);
};

const addCustomer = (payload) => {
  const config = {
    method: "POST",
    data: payload,
    url: `/Customer`,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  console.log("addCustomer firing");
  return axios(config).then((response) => {
    payload.id = response.data.item;
    return payload;
  });
};

const updateCustomer = (payload, id) => {
  const config = {
    method: "POST",
    data: payload,
    url: `/Customer/${id}`,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  console.log("updateCustomer firing");
  return axios(config);
};

const deleteCustomer = (customerId) => {
  const config = {
    method: "DELETE",
    url: `/Customer/${customerId}`,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  console.log("Delete in the middle");
  return axios(config).then(() => {
    return customerId;
  });
};
export { getAll, addCustomer, updateCustomer, deleteCustomer };
