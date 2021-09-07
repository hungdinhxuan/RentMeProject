import Header from "components/Header";
import { lazy, React, Suspense } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import PageNotFound from "components/PageNotFound";
import Applayout from "components/Applayout";
import NotFound from "components/NotFound";
import SignIn from "features/Auth/SignIn";
import "bootstrap/dist/css/bootstrap.min.css";

const CarouselHeader = lazy(() => import("features/Home/Carousel"));
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
          <Route
            render={({ location }) => {
              if (
                location.pathname !== "/404" &&
                location.pathname !== "/Login"
              )
                return <Header />;
            }}
          />
          {/* <Header/> */}
          <Switch>
            <Route exact path="/" component={CarouselHeader} />
            <Route exact path="/Login" component={SignIn} />
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
