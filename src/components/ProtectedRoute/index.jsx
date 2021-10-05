import React, { useEffect } from "react";
import { Redirect, Route } from "react-router";
import { useSelector } from "react-redux";
export default function ProtectedRoute({ component: Component, ...rest }) {
  const { isAuthenticated } = useSelector((state) => state.auth);
  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated ? (
          <>
            <Component {...rest} {...props} />
          </>
        ) : (
          <Redirect to="/signin" />
        )
      }
    />
  );
}
