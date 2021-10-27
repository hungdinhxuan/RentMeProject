import React from "react";
import { useSelector } from "react-redux";
import { Redirect } from "react-router";
import './Admin.scss'

export default function Admin() {
  const { user } = useSelector((state) => state.auth);
  if(user?.role !== 0){
      return <Redirect to="/"/>
  }

  return <div className="admin">
      Hello Admin
  </div>;
}
