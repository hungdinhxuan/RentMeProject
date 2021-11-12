import { Helmet } from "react-helmet";
import { Box, Container } from "@material-ui/core";
import PlayerListResults from "../ComponentAdmin/Player/PlayerListResults";
import PlayerListToolbar from "../ComponentAdmin/Player/PlayerListToolbar";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AsyncLoadPlayer } from "features/RentPlayer/PlayerSlice";

const PlayerList = () => {
  const { listPlayers } = useSelector((state) => state.players);
  const dispatch = useDispatch();
  useEffect(() => {
      dispatch(AsyncLoadPlayer());
  },[dispatch])
  return (
    <>
      <Helmet>
        <title>List Players</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: "background.default",
          minHeight: "100%",
          py: 3,
        }}
      >
        <Container maxWidth={false}>
          <PlayerListToolbar />
          <Box sx={{ pt: 3 }}>
            {listPlayers && <PlayerListResults players={listPlayers} />}
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default PlayerList;
