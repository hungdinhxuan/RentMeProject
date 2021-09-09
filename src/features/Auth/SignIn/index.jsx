import React from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import "./SignIn.scss";
import Google from "assets/google.png";
import Facebook from "assets/facebook.png";
import { FormLabel } from "@material-ui/core";
import AnhBackGround from "assets/acct_creation_bg.jpg";
import ReCAPTCHA from "react-google-recaptcha";

// React-hook-form
import { useForm } from "react-hook-form";

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

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100vh",
    justifyContent: "center",
    backgroundImage: `url(${AnhBackGround})`,
    padding: "130px 0",
  },

  paper: {
    margin: theme.spacing(8, 4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    color: "#C4C3E6",
    fontSize: "14px",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
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
    },
    "& span": {
      fontSize: "14px",
    },
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    color: "#fff",
    background: "#8d65ea",
    "&:hover": {
      background: "#AF93EF",
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
    backgroundColor: "#302F3D",
    maxWidth: "500px",
  },
  Hover: {
    "&:hover": {
      color: "#8d65ea !important",
    },
  },
}));

export default function SignIn() {
  const classes = useStyles();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const onSubmit = (data) => {
    console.log(data);
    reset();
  };

  const onCaptchaChange = (value) => {
    console.log("Captcha value:", value);
  }
  return (
    <Grid container component="main" maxWidth="xs" className={classes.root}>
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
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Đăng nhập
          </Typography>
          <form
            className={classes.form}
            noValidate
            autoComplete="off"
            onSubmit={handleSubmit(onSubmit)}
          >
            <FormLabel>Tài Khoản</FormLabel>
            <TextField
              fullWidth
              id="email"
              name="username"
              placeholder="Nhập tài khoản"
              autoFocus
              {...register("username")}
            />
            <FormLabel className="mt-3">Mật Khẩu</FormLabel>
            <TextField
              fullWidth
              name="password"
              type="password"
              id="password"
              placeholder="Nhập mật khẩu"
              {...register("password")}
            />
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
                    // border: "1px solid white",
                  }}
                >
                  <ReCAPTCHA
                    sitekey="6LcbfFYcAAAAAFqgi4EMnLAnF70_s37R5pj2tGke"
                    onChange={onCaptchaChange}
                  />
                  
                </div>
              </Grid>
              <div className={`${classes.Anh} align-items-center`}>
                <img src={Google} alt="google" />
                <img src={Facebook} alt="Facebook" />
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
