import Loading from "components/Loading";
import { AsyncLoadUser } from "features/Auth/AuthSlice";
import React, { useEffect, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, Route } from "react-router";
import socket from "socket";

export function PublicRoute({ component: Component, layout: Layout, ...rest }) {
  const dispatch = useDispatch();
  useEffect(() => {
    if (localStorage.getItem("token")) {
      dispatch(AsyncLoadUser());
    }
  }, [dispatch, socket]);

  return (
    <Route
      {...rest}
      render={(props) => (
        <Layout>
          <Component {...props} />
        </Layout>
      )}
    />
  );
}
