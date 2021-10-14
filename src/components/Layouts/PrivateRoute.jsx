import { useSelector } from "react-redux";
import { Redirect, Route, useLocation } from "react-router";
// import socket from "socket";

export function PrivateRoute({
  component: Component,
  layout: Layout,
  ...rest
}) {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const location = useLocation();

  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated ? (
          <Layout>
            <Component {...props} />
          </Layout>
        ) : (
          <Redirect
            to={{ pathname: "/signin", state: { referrer: location.pathname } }}
          />
        )
      }
    />
  );
}
