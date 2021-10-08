import Header from "components/Header";
import { AsyncLoadUser } from "features/Auth/AuthSlice";
import React, { Fragment, useEffect, useState } from "react";
import { useDispatch } from "react-redux";

export default function Applayout({ children, ...rest }) {
  const dispatch = useDispatch();
  useEffect(() => {
    if (localStorage.getItem("token")) {
      dispatch(AsyncLoadUser());
    }
  }, []);

  return (
    <Fragment>
      <Header />
      {children}
    </Fragment>
  );
}
