import Loading from "components/Loading";
import React from "react";
import { useSelector } from "react-redux";
import { Redirect, Route } from "react-router";

export function PublicRoute({ component: Component, layout: Layout, ...rest }) {
  
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
