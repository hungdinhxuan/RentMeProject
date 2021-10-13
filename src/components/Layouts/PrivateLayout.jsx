import Header from "components/Header";
import React, { Fragment } from "react";
export function PrivateLayout({ children }) {
  return (
    <Fragment>
      <Header />
      {children}
    </Fragment>
  );
}
