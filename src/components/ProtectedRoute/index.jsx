import Loading from "components/Loading";
import React from "react";
import { useSelector } from "react-redux";
import { Redirect, Route, useLocation } from "react-router";
export default function ProtectedRoute({ component: Component, ...rest }) {
  const { loading, isAuthenticated } = useSelector((state) => state.auth);
  const location = useLocation();

  if (loading) {
    return <Loading />;
  }

  console.log(rest);
  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated ? (
          <>
            <Component {...props} />
          </>
        ) : (
          <Redirect
            to={{ pathname: "/signin", state: { referrer: location.pathname } }}
          />
        )
      }
    />
  );
}
