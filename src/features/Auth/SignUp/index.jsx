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
import { makeStyles } from "@material-ui/styles";
import { Link } from "react-router-dom";
import "./SignUp.scss";
import { FormLabel } from "@material-ui/core";
import AnhBackGround from "assets/acct_creation_bg.jpg";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { AsyncSignup, resetRedirectLogin} from "../AuthSlice";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
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
      {"Copyright © "}
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
    height: "1000px",
    justifyContent: "center",
    backgroundImage: `url(${AnhBackGround})`,

    padding: "40px 0",
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

export default function SignUp() {

  const classes = useStyles();

  // Form
  const initialValues = {
    username: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    email: "",
  };
  const schema = yup.object().shape({
    username: yup.string().min(6, "Account with at least 6 characters").required(),
    password: yup.string().min(8, "Password must be at least 8 characters").required(),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password"), null], "Password does not match")
      .required("Cannot be empty"),
    fullName: yup
      .string()
      .matches(
        /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\s\W]*$/,
        "Your name is error"
      )
      .min(5, "Name is too short")
      .max(50, "Name is too long")
      .required(),
    email: yup
      .string()
      .email("Must be a valid email")
      .required("Cannot be empty"),
  });
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: initialValues,
    mode: "onChange",
  });

  // Redux register
  const { isAuthenticated, redirectLogin } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const history = useHistory();

  if(redirectLogin) {
    history.push("/signin");
    dispatch(resetRedirectLogin())
  }


  const onSubmit = (data) => {
    dispatch(AsyncSignup(data));
    // if (!error) {
    //   history.push("/signin");
    // }
    reset();
  };

  if (isAuthenticated) {
    history.push("/");
  }

  return (
    <Grid
      container
      component="main"
      maxwidth="xs"
      className={`${classes.root} signUp`}
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
            Sign Up
          </Typography>
          <form
            className={classes.form}
            style={{ marginTop: 8 }}
            noValidate
            autoComplete="off"
            onSubmit={handleSubmit(onSubmit)}
          >
            <FormLabel>Username</FormLabel>
            <TextField
              fullWidth
              id="username"
              name="username"
              placeholder="Input username"
              autoFocus
              {...register("username")}
            />
            {errors.username && <p>{errors.username.message}</p>}
            <FormLabel className="mt-3">Full Name</FormLabel>
            <TextField
              fullWidth
              name="fullName"
              type="text"
              id="fullName"
              placeholder="Input full name"
              {...register("fullName")}
            />
            {errors.fullName && <p>{errors.fullName.message}</p>}

            <FormLabel className="mt-3">Password</FormLabel>
            <TextField
              fullWidth
              name="password"
              type="password"
              id="password"
              placeholder="Input password"
              {...register("password")}
            />
            {errors.password && <p>{errors.password.message}</p>}

            <FormLabel className="mt-3">Confirm Password</FormLabel>
            <TextField
              fullWidth
              name="confirmPassword"
              type="password"
              id="confirmPassword"
              placeholder="Confirm password"
              {...register("confirmPassword")}
            />
            {errors.confirmPassword && <p>{errors.confirmPassword.message}</p>}

            <FormLabel className="mt-3">Email</FormLabel>
            <TextField
              fullWidth
              name="email"
              type="text"
              id="email"
              placeholder="Input email"
              {...register("email")}
            />
            {errors.email && <p>{errors.email.message}</p>}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              className={classes.submit}
              style={{ margin: "24px 0 16px" }}
            >
              Register
            </Button>
            <Grid container>
              <Grid item xs>
                <Link
                  to="/"
                  style={{ color: "#AF93EF" }}
                  className={classes.Hover}
                >
                  Back to Home
                </Link>
              </Grid>
              <Grid item>
                <Link
                  to="/signin"
                  variant="body2"
                  style={{ color: "#AF93EF" }}
                  className={classes.Hover}
                >
                  {"Already have an account? Signin"}
                </Link>
              </Grid>
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
