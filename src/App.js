import Header from "components/Header";
import { lazy, React, Suspense } from "react";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Suspense fallback={<div>Loading...</div>}>
        <BrowserRouter>
          <Header />
        </BrowserRouter>
      </Suspense>
    </div>
  );
}
export default App;
