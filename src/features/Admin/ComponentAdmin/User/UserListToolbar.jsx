import { Box, Button } from "@material-ui/core";
import RefreshIcon from "@material-ui/icons/Refresh";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsersAsync } from "features/Admin/AdminSlice";
import { Badge } from "antd";
import DeleteIcon from "@material-ui/icons/Delete";
import { getDeletedUsersAsync } from "../../AdminSlice";
import { useEffect } from "react";
import { Link } from "react-router-dom";

const UserListToolbar = (props) => {
  const { deletedUsers, userList } = useSelector((state) => state.admin);
  const dispatch = useDispatch();
  const handleRefresh = () => {
    dispatch(getAllUsersAsync());
  };
  useEffect(() => {
    dispatch(getDeletedUsersAsync());
  }, [dispatch, userList]);
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
        <Box sx={{ maxWidth: 500 }}>
          <Badge count={deletedUsers && deletedUsers.length}>
            <Link to="/admin/users/deleted">
              <DeleteIcon style={{ cursor: "pointer" }} />
            </Link>
          </Badge>
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

export default UserListToolbar;
