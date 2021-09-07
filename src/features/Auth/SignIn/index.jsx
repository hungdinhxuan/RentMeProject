import React from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
// import Link from "@material-ui/core/Link";
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
import { FormLabel } from '@material-ui/core';


function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Thuộc sở hữu © "}
      <Link color="inherit" href="https://material-ui.com/">
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
  },
  image: {
    backgroundImage: "url(https://source.unsplash.com/random)",
    backgroundRepeat: "no-repeat",
    backgroundColor:
      theme.palette.type === "light"
        ? theme.palette.grey[50]
        : theme.palette.grey[900],
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    color: "#fff",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
    "& label": {
      color: "#a7a7c6",
    },
    "& input": {
      color: "#fff",
      border: "1px solid #4F4E60",
    },
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
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
  },
}));

export default function SignIn() {
  const classes = useStyles();

  return (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid item xs={false} sm={4} md={7} className={classes.image} />
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
            Sign in
          </Typography>
          <form className={classes.form} noValidate>
            <FormLabel>Tài Khoản</FormLabel>
            <TextField
              margin="normal"
              fullWidth
              id="email"
              name="username"
              placeholder="Nhập tài khoản"
              autoFocus
            />
            <FormLabel>Mật Khẩu</FormLabel>
            <TextField
              margin="normal"
              fullWidth
              name="password"
              type="password"
              id="password"
              autoComplete="current-password"
              placeholder="Nhập mật khẩu"
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Đăng nhập
            </Button>
            <Grid container>
              <Grid item xs>
                <Link to="/" style={{ color: "#AF93EF" }}>
                  Trở về Trang Chủ
                </Link>
              </Grid>
              <Grid item>
                <Link to="/SignUp" variant="body2">
                  {"Đăng ký tài khoản"}
                </Link>
              </Grid>
            </Grid>
            <hr />
            <Grid container>
              <Grid item xs>
                <Typography>Hoặc</Typography>
              </Grid>
              <div className={classes.Anh}>
                <img src={Google} alt="google" />
                <img src={Facebook} alt="Facebook" />
              </div>
            </Grid>
            <Box mt={5}>
              <Copyright />
            </Box>
          </form>
        </div>
      </Grid>
    </Grid>
  );
}
