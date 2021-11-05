import { Helmet } from "react-helmet";
import { Box, Container } from "@material-ui/core";
import BannedPlayersResults from "../ComponentAdmin/Player/BannedPlayersResults";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getBannedPlayersAsync } from "features/Admin/AdminSlice";

const BannedPlayers = () => {
  const { bannedPlayers } = useSelector((state) => state.admin);
  const dispatch = useDispatch();
  useEffect(() => {
      dispatch(getBannedPlayersAsync());
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
          <Box sx={{ pt: 3 }}>
            {bannedPlayers && <BannedPlayersResults players={bannedPlayers} />}
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default BannedPlayers;
