import "antd/dist/antd.css";
import AOS from "aos";
import "aos/dist/aos.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { PrivateRoute } from "components/Layouts/PrivateRoute";
import { PublicRoute } from "components/Layouts/PublicRoute";
import Loading from "components/Loading";
import PageNotFound from "components/PageNotFound";
import routes from "constants/routes";
import { React, Suspense } from "react";
import MessengerCustomerChat from "react-messenger-customer-chat";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import socket from "socket";

AOS.init();
function App() {
  socket.on("connect", () => {
    console.log("ok");
  });

  const showLayout = (routes) => {
    if (routes && routes.length > 0) {
      return routes.map((route, index) => {
        if (
          route.path === "/signin" ||
          route.path === "/signup" ||
          route.path === "/forgot-password" ||
          route.path === "/"
        ) {
          return (
            <PublicRoute
              key={index}
              exact={route.exact}
              path={route.path}
              component={route.main}
              layout={route.layout}
            />
          );
        } else {
          // Private route yêu cầu authentication
          return (
            <PrivateRoute
              key={index}
              exact={route.exact}
              path={route.path}
              component={route.main}
              layout={route.layout}
            />
          );
        }
      });
    }
  };
  return (
    <div className="App">
      <Suspense fallback={<Loading />}>
        <BrowserRouter>
          <Switch>
            {showLayout(routes)}
            <Route path="*" component={PageNotFound} />
          </Switch>

          <MessengerCustomerChat
            pageId={process.env.REACT_APP_FACEBOOK_PAGE_ID}
            appId={process.env.REACT_APP_FACEBOOK_APP_ID}
            htmlRef={process.env.REACT_APP_FACEBOOK_HTML_REF}
          />
        </BrowserRouter>
      </Suspense>
    </div>
  );
}
export default App;
