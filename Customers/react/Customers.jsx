import React, { useEffect, useState, useCallback } from "react";
import "./App.css";
import * as customerService from "./customerService";
import MapCustomers from "./MapCustomers";
import { useNavigate } from "react-router-dom";

function Customers() {
  const navigate = useNavigate();
  const [customerData, setCustomerData] = useState({
    customers: [],
    customerComponents: [],
  });

  useEffect(() => {
    getCustomers();
    console.log("useEffect firing");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onGetCustomersSuccess = (data) => {
    let customers = data.data;

    setCustomerData((prevState) => {
      const cd = { ...prevState };
      cd.customers = customers;
      cd.customerComponents = customers.map(mapCustomer);
      return cd;
    });
  };

  const getCustomers = () => {
    customerService
      .getAll()
      .then(onGetCustomersSuccess)
      .catch(onGetCustomersError);
  };

  const onGetCustomersError = (err) => {
    console.log(err);
  };

  const editCustomer = (aCustomer) => {
    let editCustomerId = aCustomer.id;
    const stateForTransport = { type: "Customer", payload: aCustomer };
    navigate(`/Customer/${editCustomerId}`, { state: { stateForTransport } });
  };

  const onDeleteRequested = useCallback((myCustomer, customerId) => {
    console.log({ myCustomer, customerId });

    const handler = getDeleteSuccessHandler(myCustomer.id);

    customerService
      .deleteCustomer(myCustomer.id)
      .then(handler)
      .catch(onDeleteCustomerError);
  }, []);

  const getDeleteSuccessHandler = (customerIdToBeDeleted) => {
    console.log("getDeleteSuccessHandler", customerIdToBeDeleted);

    return () => {
      setCustomerData((prevState) => {
        const cd = { ...prevState };
        console.log(cd);
        const idxOf = cd.customers.findIndex((cstmrId) => {
          let result = false;

          if (cstmrId.id === customerIdToBeDeleted) {
            console.log(
              "condition of customer id",
              cstmrId.id,
              customerIdToBeDeleted
            );
            result = true;
          }
          return result;
        });

        if (idxOf >= 0) {
          cd.customers.splice(idxOf, 1);
          cd.customerComponents.splice(idxOf, 1);
        }
        getCustomers();
        return cd;
      });
    };
  };

  const onDeleteCustomerError = (err) => {
    console.log(err);
  };

  const mapCustomer = (aCustomer) => {
    return (
      <MapCustomers
        customer={aCustomer}
        key={"ListA" + aCustomer.id}
        onEditCustomerClicked={editCustomer}
        onDeleteCustomerClicked={onDeleteRequested}
      />
    );
  };

  const onAddCustomer = () => {
    navigate("/Customer");
  };
  return (
    <React.Fragment>
      <div className="row centerCustomer">
        <h1 className="p-5">Customers</h1>
        <table className="table table-bordered marginCustomer">
          <thead>
            <tr>
              <th scope="col">CustomerId</th>
              <th scope="col">FirstName</th>
              <th scope="col">LastName</th>
              <th scope="col">Email</th>
              <th scope="col">Phone_Number</th>
              <th scope="col">Country_Code</th>
              <th scope="col">Gender</th>
              <th scope="col">Balance</th>
              <th scope="col">Edit</th>
              <th scope="col">Delete</th>
            </tr>
          </thead>
          {customerData.customerComponents}
        </table>
        <button
          onClick={onAddCustomer}
          className="btn btn-primary marginCustomer"
        >
          Add Customer
        </button>
      </div>
    </React.Fragment>
  );
}

export default Customers;
