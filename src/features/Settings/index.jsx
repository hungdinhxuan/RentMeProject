import SignUp from "features/Auth/SignUp";
import React from "react";
import { Redirect, Route, Switch, useHistory, useLocation } from "react-router";
import SidebarSetting from "./MainSetting";
import "./Settings.scss";

export default function Settings() {
  const location = useLocation();
  console.log(location.pathname);
  return (
    <div className="setting__main row">
      <div className="setting__main--menu col-sm-12 col-xl-2 col-lg-2 col-md-12">
        <SidebarSetting />
      </div>
      <div className="col-xl-10 col-lg-10 col-md-12">
        <Switch>
          <Route  path="/setting/profile" component={SignUp} />
        </Switch>
      </div>
    </div>
  );
}
