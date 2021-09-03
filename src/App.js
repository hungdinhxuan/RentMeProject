import Header from "components/Header";
import { lazy, React, Suspense } from "react";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import CarouselHeader from "features/Carousel";
function App() {
  return (
    <div className="App">
      <Suspense fallback={<div>Loading...</div>}>
        <BrowserRouter>
          {/* <Header /> */}
          <CarouselHeader/>
        </BrowserRouter>
      </Suspense>
    </div>
  );
}
export default App;
