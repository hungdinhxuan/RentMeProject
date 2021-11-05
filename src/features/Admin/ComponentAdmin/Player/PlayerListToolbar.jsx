import {
  Box,
  Button
} from "@material-ui/core";
import RefreshIcon from "@material-ui/icons/Refresh";
import { useDispatch } from "react-redux";
import { AsyncLoadPlayer } from "features/RentPlayer/PlayerSlice";
import { Badge } from 'antd';
import DeleteIcon from '@material-ui/icons/Delete';
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
          <Badge count={99}>
            <DeleteIcon />
          </Badge>
          </div>
        </Box>
        <Button>Import</Button>
        <Button sx={{ mx: 1 }}>Export</Button>
        <Button color="primary" variant="contained">
          Add Players
        </Button>
      </Box>
    </Box>
  );
};

export default PlayerListToolbar;
