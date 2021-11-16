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

import "./Player.scss";

// Export file CSV
function CustomToolbar() {
  return (
    <GridToolbarContainer className={gridClasses.toolbarContainer}>
      <GridToolbarExport
        csvOptions={{ fields: ["nickname", "longDesc"] }}
        printoptions={{ allColumns: true }}
      />
    </GridToolbarContainer>
  );
}

const PlayerListResults = ({ players, ...rest }) => {
  const [editRows, setEditRows] = useState({});
  const [selectionModel, setSelectionModel] = useState([]);
  const handleClick = () => {
    console.log(editRows);
  };
  const handleBanPlayers = () => {
    console.log(selectionModel);
  }

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
      field: "nickname",
      headerName: "Name",
      width: 200,
      editable: true,
      renderCell: (params) => {
        return (
          <div className="d-flex align-items-center">
            <Avatar src={params.row.coverBackground} sx={{ mr: 2 }} />
            {params.row.nickname}
          </div>
        );
      },
    },
    {
      field: "shortDesc",
      headerName: "Short Desc",
      width: 200,
      editable: true,
    },
    {
      field: "longDesc",
      headerName: "Long Desc",
      width: 200,
      editable: true,
    },
    {
      field: "isOnline",
      headerName: "Status",
      width: 140,
      renderCell: (params) => {
        
        return (
          <div>
            {params.row.user[0].isOnline ? (
              <img src={OnlineStatus} alt="online" />
            ) : (
              <img src={OfflineStatus} alt="offline" />
            )}
          </div>
        );
      },
    },
    {
      field: "status",
      headerName: "Account Status",
      width: 200,
      editable: true,
    },
    {
      field: "services",
      headerName: "Services",
      width: 200,
      renderCell: (params) => {
        return (
          <div>
            {params.row.services.map((item, index) => {
              return <p key={index}>{item.name}</p>;
            })}
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
              onClick={handleBanPlayers}
            >
              Ban
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
          rows={players}
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

PlayerListResults.propTypes = {
  players: PropTypes.array.isRequired,
};

export default PlayerListResults;
