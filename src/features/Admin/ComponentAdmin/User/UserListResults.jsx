import { Avatar, Card, gridClasses } from "@material-ui/core";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExport,
} from "@mui/x-data-grid";
import OfflineStatus from "assets/offlineStatus.png";
import OnlineStatus from "assets/onlineStatus.png";
import moment from "moment";
import PropTypes from "prop-types";
import { useCallback, useState } from "react";
import { softDeleteUsersAsync } from "features/Admin/AdminSlice";
import { useDispatch } from "react-redux";

import "./User.scss";
const role = {
  0: "admin",
  1: "streamer",
  2: "player",
  3: "user",
};
function CustomToolbar() {
  return (
    <GridToolbarContainer className={gridClasses.toolbarContainer}>
      <GridToolbarExport />
    </GridToolbarContainer>
  );
}

const UserListResults = ({ userList, ...rest }) => {
  const dispatch = useDispatch();
  const [editRows, setEditRows] = useState({});
  const [selectionModel, setSelectionModel] = useState([]);
  const handleClick = () => {
    console.log(selectionModel);
  };

  const handleEditRowsModelChange = useCallback((model) => {
    const temp = {};
    if (model && Object.entries(model).length !== 0) {
      let id = Object.entries(model)[0][0];

      for (let [key, value] of Object.entries(model[id])) {
        temp[key] = value.value;
      }
      temp._id = id;
    }
    setEditRows(temp);
  }, []);

  const columns = [
    {
      field: "avatar",
      headerName: "Avatar",
      width: 210,
      renderCell: (params) => {
        return (
          <div className="d-flex align-items-center">
            <Avatar src={params.row.avatar} sx={{ mr: 2 }} />
            {params.row.fullName}
          </div>
        );
      },
    },
    {
      field: "username",
      headerName: "Username",
      width: 140,
      editable: true,
    },
    {
      field: "email",
      headerName: "Email",
      width: 200,
      editable: true,
    },
    {
      field: "password",
      headerName: "Password",
      width: 150,
      editable: true,
    },
    {
      field: "role",
      headerName: "Role",
      width: 140,
      editable: true,
      renderCell: (params) => {
        return (
          <div className="d-flex align-items-center">
            {role[params.row.role]}
          </div>
        );
      },
    },
    {
      field: "province",
      headerName: "City",
      width: 140,
      editable: true,
    },
    {
      field: "isOnline",
      headerName: "Status",
      width: 140,
      renderCell: (params) => {
        return (
          <div>
            {params.row.isOnline ? (
              <img src={OnlineStatus} alt="online" />
            ) : (
              <img src={OfflineStatus} alt="offline" />
            )}
          </div>
        );
      },
    },
    {
      field: "createdAt",
      headerName: "Registration Date",
      width: 200,
      renderCell: (params) => {
        return <>{moment(params.row.createdAt).format("DD/MM/YYYY")}</>;
      },
    },
    {
      field: "action",
      headerName: "Action",
      width: 200,
      sortable: false,
      renderCell: () => {
        return (
          <>
            <button
              type="button"
              className="btn btn-outline-primary"
              onClick={handleClick}
            >
              Update
            </button>
            <button
              type="button"
              className=" mx-2 btn btn-outline-danger"
              onClick={() => {
                
                dispatch(softDeleteUsersAsync(selectionModel))
                console.log("🚀 ~ file: UserListResults.jsx ~ line 147 ~ UserListResults ~ selectionModel", selectionModel)
              }}
            >
              Delete
            </button>
          </>
        );
      },
    },
  ];
  return (
    <Card {...rest}>
      <div style={{ height: "80vh", width: "100%" }}>
        <DataGrid
          rows={userList}
          columns={columns}
          pageSize={12}
          rowsPerPageOptions={[5]}
          checkboxSelection
          disableSelectionOnClick
          getRowId={(row) => row._id}
          editMode="row"
          components={{ Toolbar: CustomToolbar }}
          onEditRowsModelChange={handleEditRowsModelChange}
          onSelectionModelChange={(id) => {
            setSelectionModel(id);
          }}
        />
      </div>
    </Card>
  );
};

UserListResults.propTypes = {
  userList: PropTypes.array.isRequired,
};

export default UserListResults;
