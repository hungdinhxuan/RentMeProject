import Header from "components/Header";
import { lazy, React, Suspense } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import PageNotFound from "components/PageNotFound";
import Applayout from "components/Applayout";
import NotFound from "components/NotFound";
import SignIn from "features/Auth/SignIn";

const CarouselHeader = lazy(() => import("features/Home/Carousel"));
function App() {
  return (
    <div className="App">
      <Suspense fallback={<div>Loading...</div>}>
        <BrowserRouter>
          <Route
            render={({ location }) => {
              console.log(location.pathname);
              if (location.pathname !== "/404") return <Header />;
            }}
          />
          <Switch>
            <Route exact path="/" component={CarouselHeader} />
            <Route exact path="/Signin" component={SignIn} />
            <Route exact path="/404" component={PageNotFound} />
            <Route path="*" component={NotFound} />
          </Switch>
        </BrowserRouter>
      </Suspense>
    </div>
  );
}
export default App;
