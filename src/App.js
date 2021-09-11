import Header from "components/Header";
import { lazy, React, Suspense } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import PageNotFound from "components/PageNotFound";
import NotFound from "components/NotFound";
import SignIn from "features/Auth/SignIn";
import "bootstrap/dist/css/bootstrap.min.css";
import SignUp from "features/Auth/SignUp";
const Home = lazy(() => import("features/Home/index.jsx"))

function App() {
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
          {/* <Route
            render={({ location }) => {
              if (
                location.pathname !== "/404" &&
                location.pathname !== "/signin" &&
                location.pathname !== "/signin"
              )
                return <Header />;
            }}
          /> */}
          
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/signin" component={SignIn} />
            <Route exact path="/signup" component={SignUp} />
            <Route exact path="/test" render={() => <h1>test</h1>} />
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
        </BrowserRouter>
      </Suspense>
    </div>
  );
}
export default App;
