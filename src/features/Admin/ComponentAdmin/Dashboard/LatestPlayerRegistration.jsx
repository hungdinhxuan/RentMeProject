import {
  Button,
  Card,
  CardHeader, Divider
} from "@material-ui/core";
import { DataGrid } from "@mui/x-data-grid";
import { Avatar, Input, Modal } from "antd";
import { useState } from "react";
import socket from 'utils/socket'

const LatestPlayerRegistration = (props) => {
  const { items } = props;
  const { TextArea } = Input;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [playerDetail, setPlayerDetail] = useState();

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const handleViewClick = () => {
    setIsModalVisible(true);
  };
  const handleAccept = () => {
    console.log(playerDetail);
    socket.emit('handle register player', {
      player: playerDetail,
      status: 'Accepted'
    })
  };
  const handleDecline = () => {
    socket.emit('handle register player', {
      player: playerDetail,
      status: 'Rejected'
    })
  };
  const columns = [
    {
      field: "userId",
      headerName: "ID",
      width: 200,
    },
    {
      field: "nickname",
      headerName: "Nick Name",
      width: 200,
    },
    {
      field: "shortDesc",
      headerName: "Short Desc",
      width: 200,
    },
    {
      field: "pricePerHour",
      headerName: "Price",
      width: 150,
    },
    {
      field: "moreDetailed",
      headerName: "More Details",
      width: 150,
      sortable: false,
      renderCell: () => {
        return (
          <>
            <button
              type="button"
              className="btn btn-outline-warning"
              onClick={handleViewClick}
            >
              View
            </button>
          </>
        );
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
              onClick={handleAccept}
            >
              Accept
            </button>
            <button
              type="button"
              className=" mx-2 btn btn-outline-danger"
              onClick={handleDecline}
            >
              Decline
            </button>
          </>
        );
      },
    },
  ];

 
  return (
    <Card {...props}>
      <CardHeader title="Registration Players" />
      <Divider />
      <div style={{ height: "80vh", width: "100%" }}>
        <DataGrid
          rows={items}
          columns={columns}
          pageSize={12}
          rowsPerPageOptions={[5]}
          checkboxSelection
          disableSelectionOnClick
          getRowId={(row) => row._id}
          onSelectionModelChange={(id) => {
            setPlayerDetail(
              items.filter((item) => {
                return item._id === id[0];
              })[0]
            );
          }}
        />
      </div>

      {/* Modal detail */}
      <Modal
        title="Detail Request Player"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
        ]}
      >
        <div className="container">
          <div>
            <label htmlFor="nickname">Nickname</label>
          </div>
          <Input type="text" disabled value={playerDetail?.nickname} />
          <div>
            <label htmlFor="shortDesc">Short Describe</label>
          </div>
          <Input type="text" disabled value={playerDetail?.shortDesc} />

          <div>
            <label htmlFor="shortDesc">Long Describe</label>
          </div>
          <TextArea type="text" disabled value={playerDetail?.longDesc} />
          <div>
            <label htmlFor="pricePerHour">Price</label>
          </div>
          <Input className="price" disabled value={playerDetail?.pricePerHour} />
          <div>
            <label htmlFor="coverBackground">Cover Background</label>
          </div>
          <Avatar
            src={playerDetail?.coverBackground}
            alt="Anh"
            size={250}
            shape="square"
          />
          <div>
            <label htmlFor="albums">Albums</label>
          </div>
          {playerDetail?.albums.map((item, index) => {
            return (
              <Avatar
                src={item}
                alt="Anh"
                size={200}
                shape="square"
                key={index}
              />
            );
          })}
        </div>
      </Modal>
    </Card>
  );
};

export default LatestPlayerRegistration;
