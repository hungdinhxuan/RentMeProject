import Header from "components/Header";
import { lazy, React, Suspense } from "react";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import CarouselHeader from "features/Home/Carousel";
import PageNotFound from "components/PageNotFound";

function App() {
  return (
    <div className="App">
      <Suspense fallback={<div>Loading...</div>}>
        <BrowserRouter>
          {/* <Header /> */}
          <Switch>
            <Route exact path="/" component={CarouselHeader} />
            <Route path="*" component={PageNotFound} />
          </Switch>
        </BrowserRouter>
      </Suspense>
    </div>
  );
}
export default App;
