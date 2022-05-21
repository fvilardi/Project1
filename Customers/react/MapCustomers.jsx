import React from "react";

function MapCustomers(props) {
  const aCustomer = props.customer;

  const onDeleteCustomerClicked = () => {
    props.onDeleteCustomerClicked(props.customer, props.customer.id);
  };
  const onEditCustomerClicked = () => {
    props.onEditCustomerClicked(props.customer);
  };
  return (
    <tbody id={aCustomer.id}>
      <tr>
        <td>{aCustomer.id}</td>
        <td>{aCustomer.firstname}</td>
        <td>{aCustomer.lastname}</td>
        <td>
          <button className="buttonCustomer">{aCustomer.email}</button>
        </td>
        <td>{aCustomer.phone_Number}</td>
        <td>{aCustomer.country_code}</td>
        <td>{aCustomer.gender}</td>
        <td>${aCustomer.balance}</td>
        <td>
          <button
            type="button"
            className="btn btn-warning"
            onClick={onEditCustomerClicked}
          >
            Edit
          </button>
        </td>
        <td>
          <button
            type="button"
            className="btn btn-danger"
            onClick={onDeleteCustomerClicked}
          >
            Delete
          </button>
        </td>
      </tr>
    </tbody>
  );
}
export default React.memo(MapCustomers);
