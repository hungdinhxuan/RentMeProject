import { Box, Container } from "@material-ui/core";
import { useEffect } from "react";
import { Helmet } from "react-helmet";
import { useDispatch, useSelector } from "react-redux";
import { getDeletedUsersAsync } from "../AdminSlice";
import DeletedUersResults from "../ComponentAdmin/User/DeletedUersResults";

const DeletedUers = () => {
  const { deletedUsers} = useSelector((state) => state.admin);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getDeletedUsersAsync());
  }, [dispatch]);
  
  return (
    <>
      <Helmet>
        <title>List Deleted Users</title>
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
            {deletedUsers && <DeletedUersResults users={deletedUsers} />}
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default DeletedUers;
