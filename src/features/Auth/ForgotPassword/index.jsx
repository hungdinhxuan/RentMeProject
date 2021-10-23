import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
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

export default function ForgotPassword() {
  const [values, setValues] = useState({ email: "" });
  const history = useHistory();
  const handleBack = () => {
    history.push("/signin");
  };

  const { isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const handleSubmit = () => {
    dispatch(AsyncForgotPassword(values));
    setValues({ email: "" });
  };
  if (isAuthenticated) {
    history.push("/");
  }

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
          <DialogTitle id="form-dialog-title">Quên mật khẩu</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Vui lòng nhập email đã đăng ký tài khoản. Chúng tôi sẽ gửi một
              email xác nhận đến email của bạn.
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Email Address"
              type="email"
              fullWidth
              value={values.email}
              onChange={(e) => setValues({ email: e.target.value })}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleBack} color="primary">
              Trở về đăng nhập
            </Button>
            <Button onClick={handleSubmit} color="primary">
              Gửi
            </Button>
          </DialogActions>
        </Dialog>
      </div>
      <ToastContainer pauseOnFocusLoss={false} />
    </div>
  );
}
