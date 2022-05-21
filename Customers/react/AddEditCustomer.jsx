import React, { useEffect, useState } from "react";
import "./App.css";
import { useLocation } from "react-router-dom";
import toastr from "toastr";
import * as customerService from "./customerService";

function AddEditCustomer() {
  const { state } = useLocation();

  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const [customerFormData, setCustomerFormData] = useState({
    customerId: "",
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    countryCode: "",
    gender: "",
    balance: 0,
  });
  console.log({ state });

  useEffect(() => {
    if (
      state?.stateForTransport.type === "Customer" &&
      state?.stateForTransport.payload
    ) {
      console.log("");

      setCustomerFormData((prevState) => {
        console.log("This shouldn't run for add ->", state.stateForTransport);
        let editCustomerState = { ...prevState, ...state.payload };
        editCustomerState.customerId = state.stateForTransport.payload.id;
        editCustomerState.firstName = state.stateForTransport.payload.firstname;
        editCustomerState.lastName = state.stateForTransport.payload.lastname;
        editCustomerState.email = state.stateForTransport.payload.email;
        editCustomerState.phoneNumber =
          state.stateForTransport.payload.phone_Number;
        editCustomerState.countryCode =
          state.stateForTransport.payload.country_code;
        editCustomerState.gender = state.stateForTransport.payload.gender;
        editCustomerState.balance = state.stateForTransport.payload.balance;

        return editCustomerState;
      });
    }
  }, [state]);

  const onFormFieldChange = (event) => {
    console.log("onChange", { syntheticEvent: event });

    const target = event.target;

    const newCustomerValue = target.value;

    const nameOfField = target.name;
    console.log({ nameOfField, newCustomerValue });

    setCustomerFormData((prevState) => {
      console.log("updater onChange");

      const newCustomerObject = {
        ...prevState,
      };

      newCustomerObject[nameOfField] = newCustomerValue;

      return newCustomerObject;
    });
    console.log("end onChange");
  };

  const handleAddOrEditCustomer = (e) => {
    e.preventDefault();
    var cd = { ...customerFormData };
    if (cd.customerId) {
      onCustomerUpdate(cd, cd.customerId);
    } else onAddCustomer(cd);
    setFormErrors(validate(cd));
    setIsSubmit(true);
  };

  useEffect(() => {
    console.log(formErrors);
    if (Object.keys(formErrors).length === 0 && isSubmit) {
      console.log(customerFormData);
    }
  }, [formErrors]);

  const onAddCustomer = (cstmrData) => {
    customerService
      .addCustomer(cstmrData)
      .then(onAddCustomerSuccess)
      .catch(onAddCustomerError);
  };

  const onAddCustomerSuccess = (response) => {
    toastr.options = {
      positionclassName: "toast-top-center",
    };
    toastr["success"]("You have successfully added a customer", "Success!");

    console.log(response);

    let newCstrm = response;

    setCustomerFormData((prevState) => {
      let newCdData = { ...prevState };
      newCdData = newCstrm;
      return newCdData;
    });
  };

  const onAddCustomerError = (err) => {
    toastr.options = {
      positionClass: "toast-top-center",
    };
    toastr["error"]("You will need to add a customer again ", "Not Successful");
    console.log(err);
  };

  const onCustomerUpdate = (payload, id) => {
    customerService
      .updateCustomer(payload, id)
      .then(onUpdateCustomerSuccess)
      .catch(onUpdateCustomerError);
  };

  const onUpdateCustomerSuccess = (response) => {
    toastr.options = {
      positionclassName: "toast-top-center",
    };
    toastr["success"](
      "You have successfully updated your customer",
      "Success!"
    );
    console.log(response);
    setCustomerFormData((prevState) => {
      let initialState = { ...prevState };
      initialState = {
        customerId: "",
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        countryCode: "",
        gender: "",
        balance: 0,
      };
      return initialState;
    });
  };

  const onUpdateCustomerError = (err) => {
    toastr.options = {
      positionClass: "toast-top-center",
    };
    toastr["error"](
      "You will need to update your customer again ",
      "Not Successful"
    );
    console.log(err);
  };

  const validate = (values) => {
    const errors = {};
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    if (!values.email) {
      errors.email = "Email required";
    } else if (!regex.test(values.email)) {
      errors.email = "Please enter a valid email";
    }
    return errors;
  };

  return (
    <React.Fragment>
      <div className="row centerAddEditCustomer">
        <div className="marginAddEditCustomer p-5">
          <h1 className="display-4 fw-bold margin2AddEditCustomer">
            Add/Edit Customer
          </h1>
          <form>
            <div className="form-group">
              <label>First Name</label>
              <input
                type="text"
                className="form-control w-50 fieldMargin"
                id="firstName"
                aria-describedby="firstName"
                placeholder="First Name"
                name="firstName"
                value={customerFormData.firstName}
                onChange={onFormFieldChange}
              />
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input
                type="text"
                className="form-control w-50 fieldMargin"
                id="lastName"
                aria-describedby="lastName"
                placeholder="Last Name"
                name="lastName"
                value={customerFormData.lastName}
                onChange={onFormFieldChange}
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                className="form-control w-50 fieldMargin"
                id="email"
                aria-describedby="email"
                placeholder="Email"
                name="email"
                value={customerFormData.email}
                onChange={onFormFieldChange}
              />
            </div>
            <p className="red">{formErrors.email}</p>
            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="text"
                className="form-control w-50 fieldMargin"
                id="phoneNumber"
                aria-describedby="phoneNumber"
                placeholder="Phone Number"
                name="phoneNumber"
                value={customerFormData.phoneNumber}
                onChange={onFormFieldChange}
              />
            </div>
            <div className="form-group">
              <label>Country Code</label>
              <input
                type="text"
                className="form-control w-50 fieldMargin"
                id="countryCode"
                aria-describedby="countryCode"
                placeholder="Country Code"
                name="countryCode"
                value={customerFormData.countryCode}
                onChange={onFormFieldChange}
              />
            </div>
            <div className="form-group">
              <label>Gender</label>
              <input
                type="text"
                className="form-control w-50 fieldMargin"
                id="gender"
                aria-describedby="gender"
                placeholder="Gender"
                name="gender"
                value={customerFormData.gender}
                onChange={onFormFieldChange}
              />
            </div>
            <div className="form-group">
              <label>Balance</label>
              <input
                type="text"
                className="form-control w-50"
                id="balance"
                aria-describedby="balance"
                placeholder="Balance"
                name="balance"
                value={customerFormData.balance}
                onChange={onFormFieldChange}
              />
            </div>
            <div className="form-check"></div>
            {customerFormData.customerId ? (
              <button
                type="button"
                className="btn btn-lg btn-warning"
                onClick={handleAddOrEditCustomer}
              >
                Update
              </button>
            ) : (
              <button
                type="button"
                className="btn btn-lg btn-primary"
                onClick={handleAddOrEditCustomer}
              >
                Add
              </button>
            )}

            <div className="form-group">
              <label></label>
              <input
                type="text"
                className="form-control w-50 "
                id="id"
                name="id"
                style={{ visibility: "hidden" }}
                value={customerFormData.customerId}
              />
            </div>
          </form>
        </div>
      </div>
    </React.Fragment>
  );
}
export default AddEditCustomer;
