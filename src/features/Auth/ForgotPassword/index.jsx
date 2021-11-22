import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { useHistory } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { AsyncForgotPassword } from "../AuthSlice";
import { ToastContainer } from "react-toastify";
import AnhBackGround from "assets/acct_creation_bg.jpg";
import { Form, Input } from "antd";

const validateMessages = {
  required: "${label} is required!",
  types: {
    email: "${label} is not a valid email!",
  },
};

export default function ForgotPassword() {
  const history = useHistory();
  const handleBack = () => {
    history.push("/signin");
  };

  const { isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  if (isAuthenticated) {
    history.push("/");
  }
  const onFinish = (values) => {
    dispatch(AsyncForgotPassword(values));
  };

  return (
    <div
      style={{
        backgroundImage: `url(${AnhBackGround})`,
        width: "100%",
        height: "100vh",
      }}
    >
      <div className="container">
        <Dialog open={true} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">Forgot Password</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Please enter your registered email account. We will send a
              confirmation email to your email.
            </DialogContentText>
            <Form
              name="nest-messages"
              onFinish={onFinish}
              validateMessages={validateMessages}
            >
              <Form.Item
                name={["email"]}
                rules={[
                  {
                    type: "email",
                  },
                ]}
              >
                <Input placeholder="Input your email here" />
              </Form.Item>
              <DialogActions>
                <Button onClick={handleBack} color="primary">
                  Back to Sign In
                </Button>
                <Button type="primary" htmlType="submit">
                  Submit
                </Button>
              </DialogActions>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      <ToastContainer pauseOnFocusLoss={false} />
    </div>
  );
}
