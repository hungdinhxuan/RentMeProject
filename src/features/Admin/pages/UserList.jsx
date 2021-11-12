import { Box, Container } from "@material-ui/core";
import { useEffect } from "react";
import { Helmet } from "react-helmet";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsersAsync } from "../AdminSlice";
import UserListResults from "../ComponentAdmin/User/UserListResults";
import UserListToolbar from "../ComponentAdmin/User/UserListToolbar";

const UserList = () => {
  const { userList } = useSelector((state) => state.admin);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getAllUsersAsync());
  }, [dispatch]);
  
  
  return (
    <>
      <Helmet>
        <title>List Users</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: "background.default",
          minHeight: "100%",
          py: 3,
        }}
      >
        <Container maxWidth={false}>
          <UserListToolbar />
          <Box sx={{ pt: 3 }}>
            {userList && <UserListResults userList={userList} />}
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default UserList;
