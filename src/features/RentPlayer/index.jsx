import React from "react";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import PlayerDetails from "./Details";
import MainRentPlayer from "./Main";

function RentPlayer() {
  const match = useRouteMatch();
  
  return (
    <Switch>
      <Route
        exact
        path={match.url}
        component={MainRentPlayer}
      />
      <Route path={`${match.url}/:cardId`} component={PlayerDetails} />
    </Switch>
  );
}

export default RentPlayer;
