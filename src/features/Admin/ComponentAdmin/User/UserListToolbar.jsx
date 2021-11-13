import { Box, Button } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import RefreshIcon from "@material-ui/icons/Refresh";
import { Badge } from "antd";
import { getAllUsersAsync } from "features/Admin/AdminSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getDeletedUsersAsync } from "../../AdminSlice";
import { useState } from "react";
import { Modal } from "antd";
import AddUsersResults from "./AddUsersResults";

const UserListToolbar = (props) => {
  const { deletedUsers, userList } = useSelector((state) => state.admin);
  const dispatch = useDispatch();
  const [visible, setVisible] = useState(false);

  const handleRefresh = () => {
    dispatch(getAllUsersAsync());
  };

  // Submit modal

  // Cancel submit
  const handleCancel = () => {
    setVisible(!visible);
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
        <Box
          sx={{ maxWidth: 500 }}
          style={{ display: "flex", alignItems: "center" }}
        >
          <Badge count={deletedUsers && deletedUsers.length}>
            <Link to="/admin/users/deleted">
              <DeleteIcon style={{ cursor: "pointer", color: "black" }} />
            </Link>
          </Badge>
        </Box>
        <Button>Import</Button>

        <Button
          color="primary"
          variant="contained"
          onClick={() => {
            setVisible(!visible);
          }}
        >
          Add User Accounts
        </Button>
      </Box>
      <Modal
        visible={visible}
        title="Add user account"
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Cancel
          </Button>,
          
        ]}
      >
        <AddUsersResults setVisible={setVisible}/>
      </Modal>
    </Box>
  );
};

export default UserListToolbar;
