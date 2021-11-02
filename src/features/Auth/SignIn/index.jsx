import { yupResolver } from "@hookform/resolvers/yup";
import { FormLabel } from "@material-ui/core";
import Avatar from "@material-ui/core/Avatar";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import { createTheme } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import { makeStyles } from "@material-ui/styles";
import AnhBackGround from "assets/acct_creation_bg.jpg";
import Facebook from "assets/facebook.png";
import Google from "assets/google.png";
import axiosClient from "axiosClient";
import Loading from "components/Loading";
import React, { useState } from "react";
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";
import GoogleLogin from "react-google-login";
import ReCAPTCHA from "react-google-recaptcha";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
// React-hook-form
import { Link, useHistory } from "react-router-dom";
import socket from "socket";
import * as yup from "yup";
import { AsyncSignin } from "../AuthSlice";
import "./SignIn.scss";

function Copyright() {
  return (
    <Typography
      variant="body2"
      color="textSecondary"
      align="center"
      style={{ color: "#C4C3E6", fontSize: "20px" }}
    >
      {"Thuộc sở hữu © "}
      <Link color="inherit" to="/">
        RentMe
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const themeMT = createTheme();
const useStyles = makeStyles((theme) => ({
  root: {
    height: "1000px",
    justifyContent: "center",
    backgroundImage: `url(${AnhBackGround})`,
    padding: "130px 0",
  },

  paper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    color: "#C4C3E6",
    fontSize: "14px",
  },

  form: {
    width: "100%", // Fix IE 11 issue.
    height: "40px",
    fontSize: "14px",
    "& label": {
      color: "#a7a7c6",
      fontSize: "14px",
    },
    "& input": {
      color: "#fff",
      border: "1px solid #4F4E60",
      height: "40px",
      borderRadius: "4px",
      padding: "6px 0 7px",
      transition: "all 0.3s",
      "&:hover": {
        border: "1px solid #af93ef",
      },
    },
    "& span": {
      fontSize: "14px",
    },
  },
  submit: {
    color: "#fff",
    background: "#8d65ea !important",
    "&:hover": {
      background: "#AF93EF !important",
    },
  },
  Anh: {
    display: "flex",
    "& img": {
      width: "40px",
      height: "40px",
      marginRight: "12px",
      cursor: "pointer",
    },
  },
  FormBackground: {
    backgroundColor: "#302F3D !important",
    maxWidth: "500px !important",
  },
  Hover: {
    "&:hover": {
      color: "#8d65ea !important",
    },
  },
}));

export default function SignIn(props) {
  const classes = useStyles();

  // Form
  const initialValues = {
    username: "",
    password: "",
    captcha: "",
  };
  const schema = yup.object().shape({
    username: yup
      .string()
      .min(6, "Tài khoản ít nhất 6 ký tự")
      .required("Không được để trống"),
    password: yup
      .string()
      .min(8, "Mật khẩu ít nhất 8 ký tự")
      .required("Không được để trống"),
    captcha: yup.string().required(),
  });
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: initialValues,
    mode: "onChange",
  });

  // Capcha google
  const [capcha, setCapcha] = useState(true);

  const onSubmit = async (data) => {
    dispatch(AsyncSignin(data));
    window.grecaptcha.reset();
    reset();
  };

  const onCaptchaChange = (value) => {
    setValue("captcha", value);
    setCapcha(false);
  };

  // Xử lý redux
  const { user, loading, isAuthenticated } = useSelector((state) => state.auth);
  const history = useHistory();
  const dispatch = useDispatch();

  // Sau khi có tài khoản
  const { referrer } = props.location.state || { referrer: { pathname: "/" } };

  if ((user && user.role !== 0) || isAuthenticated) {
    socket.emit("authenticate", localStorage.getItem("token"));
    history.push(referrer);
  }

  if (loading) {
    return <Loading />;
  }

  const googleButtonStyle = {
    backgroundImage: `url(${Google})`,
    width: "40px",
    height: "40px",
    marginRight: "12px",
    cursor: "pointer",
    backgroundSize: "cover",
    padding: 0,
    border: "none",
    borderRadius: "50%",
  };

  const facebookButtonStyle = {
    backgroundImage: `url(${Facebook})`,
    width: "40px",
    height: "40px",
    marginRight: "12px",
    cursor: "pointer",
    backgroundSize: "cover",
    padding: 0,
    border: "none",
    borderRadius: "50%",
  };

  const responseSuccessGoogle = async (response) => {
    try {
      const res = await axiosClient.post("/auth/google", {
        tokenId: response.tokenId,
      });
      // console.log(res);
      localStorage.setItem("token", res.token);
      socket.emit("authenticate", res.token);
      history.push(referrer);
    } catch (error) {}
  };

  const responseFacebook = async (response) => {
    try {
      const { accessToken } = response;
      const res = await axiosClient.post("/auth/facebook", {
        accessToken,
      });
      // console.log(res.data);
      localStorage.setItem("token", res.token);
      socket.emit("authenticate", res.token);
      history.push(referrer);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Grid
      container
      component="main"
      maxwidth="xs"
      className={`${classes.root} signIn`}
    >
      <CssBaseline />
      <Grid
        item
        xs={12}
        sm={8}
        md={5}
        component={Paper}
        elevation={6}
        square
        className={classes.FormBackground}
      >
        <div className={classes.paper} style={{ margin: "64px 32px" }}>
          <Avatar
            sx={{
              backgroundColor: (theme) => theme.palette.secondary.main,
              margin: (theme) => theme.spacing(1),
            }}
          >
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Đăng nhập
          </Typography>
          <form
            noValidate
            autoComplete="off"
            onSubmit={handleSubmit(onSubmit)}
            className={classes.form}
            style={{ marginTop: 8 }}
          >
            <FormLabel>Tài Khoản</FormLabel>
            <TextField
              fullWidth
              id="username"
              name="username"
              placeholder="Nhập tài khoản"
              autoFocus
              {...register("username")}
            />

            {errors.username && <p>{errors.username.message}</p>}
            <FormLabel className="mt-3">Mật Khẩu</FormLabel>
            <TextField
              fullWidth
              id="password"
              name="password"
              type="password"
              placeholder="Nhập mật khẩu"
              {...register("password")}
            />
            {errors.password && <p>{errors.password.message}</p>}
            <Grid item xs style={{ marginTop: "5px" }}>
              <Link to="/forgot-password" style={{ color: "#AF93EF" }}>
                Quên mật khẩu
              </Link>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              className={classes.submit}
              disabled={capcha}
              style={{ margin: "24px 0 16px" }}
            >
              Đăng nhập
            </Button>
            <Grid container>
              <Grid item xs>
                <Link
                  to="/"
                  style={{ color: "#AF93EF" }}
                  className={classes.Hover}
                >
                  Trở về Trang Chủ
                </Link>
              </Grid>
              <Grid item>
                <Link
                  to="/signup"
                  variant="body2"
                  style={{ color: "#AF93EF" }}
                  className={classes.Hover}
                >
                  {"Đăng ký tài khoản"}
                </Link>
              </Grid>
            </Grid>
            <hr />
            <Grid container className="capcha">
              <Grid item xs>
                <div
                  style={{
                    height: "74px",
                    width: "300px",
                  }}
                >
                  <ReCAPTCHA
                    // ref={recaptchaRef}
                    sitekey={`${process.env.REACT_APP_GOOGLE_RECAPTCHA_SITE_KEY}`}
                    onChange={onCaptchaChange}
                    onExpired={() => {
                      setCapcha(true);
                    }}
                  />
                </div>
              </Grid>
              <div className={`${classes.Anh} align-items-center`}>
                <GoogleLogin
                  clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
                  render={(renderProps) => (
                    <button
                      onClick={renderProps.onClick}
                      style={googleButtonStyle}
                    />
                  )}
                  onSuccess={responseSuccessGoogle}
                  onFailure={responseSuccessGoogle}
                  cookiePolicy={"single_host_origin"}
                />
                {/* <img src={Facebook} alt="Facebook" /> */}
                <FacebookLogin
                  appId={process.env.REACT_APP_FACEBOOK_APP_ID}
                  autoLoad={false}
                  callback={responseFacebook}
                  render={(renderProps) => (
                    <button
                      onClick={renderProps.onClick}
                      style={facebookButtonStyle}
                    />
                  )}
                />
              </div>
            </Grid>
            <Box mt={8}>
              <Copyright />
            </Box>
          </form>
        </div>
      </Grid>
    </Grid>
  );
}
