import React from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import "./SignUp.scss";
import Google from "assets/google.png";
import Facebook from "assets/facebook.png";
import { FormLabel } from "@material-ui/core";
import AnhBackGround from "assets/acct_creation_bg.jpg";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

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
    // padding: "90px 0",
    padding: "40px 0",
  },

  paper: {
    margin: theme.spacing(1, 4),
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
    username: yup.string().min(6,"Tài khoản phải trên 6 ký tự").required(),
    password: yup.string().min(8, "Mật khẩu phải ít nhất 8 ký tự").required(),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password"), null], "Mật khẩu không trùng khớp")
      .required("Không được để trống"),
    fullName: yup
      .string()
      .matches(/^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\s\W|_]/g, "Họ tên không hợp lệ")
      .min(5, "Tên quá ngắn")
      .max(50, "Tên quá dài")
      .required(),
    email: yup
      .string()
      .email("Không đúng định dạng email")
      .required("Không được để trống"),
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
  const onSubmit = (data) => {
    console.log(data);
    reset();
  };
 

  return (
    <Grid container component="main" maxwidth="xs" className={classes.root}>
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
            Đăng Ký
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
              id="username"
              name="username"
              placeholder="Nhập tài khoản"
              autoFocus
              {...register("username")}
            />
            {errors.username && <p>{errors.username.message}</p>}
            <FormLabel className="mt-3">Họ Tên</FormLabel>
            <TextField
              fullWidth
              name="fullName"
              type="text"
              id="fullName"
              placeholder="Nhập họ tên"
              {...register("fullName")}
            />
            {errors.fullName && <p>{errors.fullName.message}</p>}

            <FormLabel className="mt-3">Mật Khẩu</FormLabel>
            <TextField
              fullWidth
              name="password"
              type="password"
              id="password"
              placeholder="Nhập mật khẩu"
              {...register("password")}
            />
            {errors.password && <p>{errors.password.message}</p>}

            <FormLabel className="mt-3">Xác Nhận Mật Khẩu</FormLabel>
            <TextField
              fullWidth
              name="confirmPassword"
              type="password"
              id="confirmPassword"
              placeholder="Xác nhận mật khẩu"
              {...register("confirmPassword")}
            />
            {errors.confirmPassword && <p>{errors.confirmPassword.message}</p>}

            <FormLabel className="mt-3">Email</FormLabel>
            <TextField
              fullWidth
              name="email"
              type="text"
              id="email"
              placeholder="Nhập email"
              {...register("email")}
            />
            {errors.email && <p>{errors.email.message}</p>}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              className={classes.submit}
            >
              Đăng Ký
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
                  to="/signin"
                  variant="body2"
                  style={{ color: "#AF93EF" }}
                  className={classes.Hover}
                >
                  {"Đã có tài khoản? Đăng nhập"}
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
