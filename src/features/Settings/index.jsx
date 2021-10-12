import React from "react";
import { Route, Switch, useLocation } from "react-router";
import SidebarSetting from "./MainSetting";
import PrivacySetting from "./PrivacySetting";
import ProfileSetting from "./ProfileSetting";
import "./Settings.scss";

export default function Settings() {
  return (
    <div className="setting__main row">
      <div className="setting__main--menu col-sm-12 col-xl-2 col-lg-2 col-md-12">
        <SidebarSetting />
      </div>
      <div className="col-xl-10 col-lg-10 col-md-12">
        <Switch>
          <Route exact path="/setting/profile" component={ProfileSetting} />
          <Route exact path="/setting/privacy" component={PrivacySetting} />
        </Switch>
      </div>
    </div>
  );
}
