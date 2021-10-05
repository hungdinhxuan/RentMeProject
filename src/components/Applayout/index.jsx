import React, { Fragment, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AsyncLoadUser } from "features/Auth/AuthSlice";

export default function Applayout({ children, ...rest }) {
  // const dispatch = useDispatch();

  // useEffect(() => {
  //   if (localStorage.getItem("token")) {
  //     dispatch(AsyncLoadUser());
  //   }
  // }, []);

  return <Fragment>{children}</Fragment>;
}
