import React from "react";
import SidebarSetting from "./MainSetting";
import './Settings.scss'

export default function Settings() {
  return (
    <div className="setting__main row">
      <div className="setting__main--menu col-12 col-xl-3 col-lg-3 col-md-12">
        <SidebarSetting />
      </div>
      <div className="col-xl-9 col-lg-9 col-md-12"></div>
    </div>
  );
}
