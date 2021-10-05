import { lazy, React, Suspense } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import PageNotFound from "components/PageNotFound";
import NotFound from "components/NotFound";
import SignIn from "features/Auth/SignIn";
import "bootstrap/dist/css/bootstrap.min.css";
import SignUp from "features/Auth/SignUp";
import "aos/dist/aos.css";
import "react-toastify/dist/ReactToastify.css";
import "antd/dist/antd.css";
import socket from "socket";
import MessengerCustomerChat from "react-messenger-customer-chat";
import Header from "components/Header";
import AOS from "aos";
import ProtectedRoute from "components/ProtectedRoute";
import Settings from "features/Settings";
import Applayout from "components/Applayout/index";

const Home = lazy(() => import("features/Home/index.jsx"));
const ForgotPassword = lazy(() =>
  import("features/Auth/ForgotPassword/index.jsx")
);
const RentPlayer = lazy(() => import("features/RentPlayer/index.jsx"));
AOS.init();
function App() {
  socket.on("connect", () => {
    console.log("ok");
  });
  return (
    <div className="App">
      <Suspense
        fallback={
          <div style={{ color: "white" }} className="text-center">
            Loading...
          </div>
        }
      >
        <BrowserRouter>
          <Route
            render={({ location }) => {
              if (
                location.pathname !== "/404" &&
                location.pathname !== "/signin" &&
                location.pathname !== "/signup"
              )
                return <Header />;
            }}
          />

          
            <Switch>
              <Route exact path="/" component={Home} />
              <Route exact path="/signin" component={SignIn} />
              <Route exact path="/signup" component={SignUp} />
              <Route exact path="/forgot-password" component={ForgotPassword} />
              <ProtectedRoute path="/playerdou" component={RentPlayer} />
              <ProtectedRoute path="/setting" component={Settings} />
              <Route exact path="/404" component={PageNotFound} />
              <Route path="*" component={NotFound} />
            </Switch>
          

          {/* <Applayout>
            <Switch>
              <Route exact path="/" component={CarouselHeader} />
              <Route exact path="/SignIn" component={SignIn} /> 
            </Switch>
          </Applayout>
          <Route path="*" component={PageNotFound} />  */}
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
