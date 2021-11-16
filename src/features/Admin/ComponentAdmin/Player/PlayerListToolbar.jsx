import { Box, Button } from "@material-ui/core";
import RefreshIcon from "@material-ui/icons/Refresh";
import { useDispatch } from "react-redux";
import { getPlayersAsync } from "features/Admin/AdminSlice";

const PlayerListToolbar = (props) => {
  const dispatch = useDispatch();
  const handleRefresh = () => {
    dispatch(getPlayersAsync(
      {
        page: 1,
        limit: 50,
        status: "Accepted",

      }
    ));
  };

  return (
    <Box {...props}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <Box sx={{ maxWidth: 500 }}>
          <div
            onClick={handleRefresh}
            style={{ cursor: "pointer", marginTop: 5 }}
          >
            <RefreshIcon />
          </div>
        </Box>
        <Button>Import</Button>
      </Box>
    </Box>
  );
};

export default PlayerListToolbar;
