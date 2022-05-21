import React from "react";
import debug from "debug";
import { Formik, Form, Field, ErrorMessage } from "formik";
import basicSchema from "../../schema/newsletterSubscriptionSchema";
import * as newsletterSubscriptionService from "../../services/newsletterSubscriptionService";
import toastr from "../../utils/toastr";
import "rc-pagination/assets/index.css";
import "./newsletter-subscription.css";

const _logger = debug.extend("Subscribe");

function Subscribe() {
  const formState = {
    formData: {
      email: "",
    },
  };

  const handleSubscribe = (values) => {
    newsletterSubscriptionService
      .subscribe(values)
      .then(onAddSubscriberSuccess)
      .catch(onSubscriberError);
  };

  const onAddSubscriberSuccess = (response) => {
    _logger(response);
    toastr.success("You have successfully subscribed", "Success!");
  };

  const onSubscriberError = (err) => {
    _logger(err);
    toastr.error("Try subscribing again");
  };

  return (
    <React.Fragment>
      <Formik
        onSubmit={handleSubscribe}
        enableReinitialize={true}
        initialValues={formState.formData}
        validationSchema={basicSchema}
      >
        <Form>
          <div className="row">
            <div className="col-12 text-muted">
              <div className="form-group" style={{ width: "100%" }}>
                <h1
                  style={{ width: "70%", textAlignLast: "center" }}
                  htmlFor="email"
                >
                  Join Our Newsletter
                </h1>
                <div>
                  <Field
                    className="form-control field"
                    type="text"
                    name="email"
                  ></Field>
                  <ErrorMessage
                    className="has-error"
                    name="email"
                    component="div"
                  ></ErrorMessage>
                  <div>
                    <button className="subscribe" type="submit" id="subscribe">
                      Subscribe
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Form>
      </Formik>
    </React.Fragment>
  );
}
export default Subscribe;
