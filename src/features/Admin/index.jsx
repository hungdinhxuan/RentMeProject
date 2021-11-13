import React from "react";
import { useSelector } from "react-redux";
import { Redirect, Route, Switch, useLocation } from "react-router-dom";
import "./Admin.scss";
import Dashboard from "./pages/Dashboard";
import PlayerList from "./pages/PlayerList";
import UserList from "./pages/UserList";
import BannedPlayers from './pages/BannedPlayers'
import DeletedUers from "./pages/DeletedUsers";

export default function Admin() {
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();
  if (user?.role !== 0) {
    return <Redirect to="/" />;
  }

  if (location.pathname === "/admin") {
    return <Redirect to="/admin/dashboard" />;
  }

  return (
    <Switch>
      <Route path="/admin/dashboard" component={Dashboard} />
      <Route path="/admin/players/banned" component={BannedPlayers} />
      <Route path="/admin/players" component={PlayerList} />
      <Route exact path="/admin/users" component={UserList} />
      <Route path="/admin/users/deleted" component={DeletedUers} />
      <Route path="/admin/users/:action" component={Dashboard} />

    </Switch>
  );
}
