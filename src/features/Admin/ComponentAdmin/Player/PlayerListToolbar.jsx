import { Box, Button } from "@material-ui/core";
import RefreshIcon from "@material-ui/icons/Refresh";
import { useDispatch } from "react-redux";
import { AsyncLoadPlayer } from "features/RentPlayer/PlayerSlice";

const PlayerListToolbar = (props) => {
  const dispatch = useDispatch();
  const handleRefresh = () => {
    dispatch(AsyncLoadPlayer());
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
