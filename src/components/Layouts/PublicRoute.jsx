
import { AsyncLoadUser } from "features/Auth/AuthSlice";
import React, { useEffect, useContext } from "react";
import { useDispatch } from "react-redux";
import {  Route } from "react-router";

import socket, { socketContext, socketAuth } from "socket";
export function PublicRoute({ component: Component, layout: Layout, ...rest }) {
  const dispatch = useDispatch();
  
  // const socket = useContext(socketContext)
  useEffect(() => {
    if (localStorage.getItem("token")) {
      dispatch(AsyncLoadUser());
      console.log('called socketAuth');
      socketAuth()
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
