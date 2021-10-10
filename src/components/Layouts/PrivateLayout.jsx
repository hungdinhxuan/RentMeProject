import Header from "components/Header";
import Loading from "components/Loading";
import { AsyncLoadUser } from "features/Auth/AuthSlice";
import React, { Fragment, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

export function PrivateLayout({ children }) {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);

  // useEffect(() => {
  //   if (localStorage.getItem("token")) {
  //     dispatch(AsyncLoadUser());
  //   }
  // }, []);

  // if (loading) {
  //   return <Loading />;
  // }

  return (
    <Fragment>
      <Header />
      {children}
    </Fragment>
  );
}
