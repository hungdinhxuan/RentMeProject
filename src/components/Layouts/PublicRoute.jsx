import { AsyncLoadUser } from "features/Auth/AuthSlice";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route } from "react-router";
<<<<<<< HEAD


export function PublicRoute({ component: Component, layout: Layout, ...rest }) {
  const dispatch = useDispatch();

=======

export function PublicRoute({ component: Component, layout: Layout, ...rest }) {
  const dispatch = useDispatch();
>>>>>>> a2402c92580dd5f19a1f7895fde93057addb14c8
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
