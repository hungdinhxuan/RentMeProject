import React, { useEffect } from "react";
import { Redirect, Route, useLocation } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { AsyncLoadUser } from "features/Auth/AuthSlice";
export default function ProtectedRoute({ component: Component, ...rest }) {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const location = useLocation();

  const dispatch = useDispatch();

  // useEffect(() => {
  //   dispatch(AsyncLoadUser());
  // }, []);

  useEffect(() => {
    !isAuthenticated && localStorage.getItem('token') && dispatch(AsyncLoadUser());
  }, [isAuthenticated, dispatch]);

  console.log(isAuthenticated);
  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated ? (
          <>
            <Component {...rest} {...props} />
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
