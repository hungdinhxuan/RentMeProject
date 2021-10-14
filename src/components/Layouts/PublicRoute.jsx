
import { AsyncLoadUser } from "features/Auth/AuthSlice";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import {  Route } from "react-router";


export function PublicRoute({ component: Component, layout: Layout, ...rest }) {
  const dispatch = useDispatch();
  
  useEffect(() => {
    if (localStorage.getItem("token")) {
      dispatch(AsyncLoadUser());
      
    }
  }, [dispatch]);

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
