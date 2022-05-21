import React from "react";
import { Routes, Route } from "react-router-dom";
import Customers from "./Customers";
import AddEditCustomer from "./AddEditCustomer";

function App() {
  return (
    <React.Fragment>
      <main role="main">
        <div className="container">
          <Routes>
            <Route path="/" element={<Customers />}></Route>
            <Route path="/Customer" element={<AddEditCustomer />}>
              <Route path=":id" element={<AddEditCustomer />}></Route>
            </Route>
          </Routes>
        </div>
      </main>
    </React.Fragment>
  );
}
export default App;
