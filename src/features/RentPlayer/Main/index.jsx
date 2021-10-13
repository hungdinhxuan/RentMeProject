import React, { useContext, useEffect } from "react";

import { Select } from "antd";
import "./RentPlayer.scss";
import CardList from "../Card/index";
import { AsyncLoadPlayer } from "../PlayerSlice";
import { useDispatch, useSelector } from "react-redux";
import { AsyncLoadUser } from "features/Auth/AuthSlice";
import { socketContext } from "socket";

function MainRentPlayer() {
  //   Select
  const { Option } = Select;
  const handleChange = (value) => {
    console.log(`selected ${value}`);
  };

  const { listPlayers } = useSelector((state) => state.players);
  const dispatch = useDispatch();
  const socket = useContext(socketContext);

  useEffect(() => {
    dispatch(AsyncLoadUser());
    dispatch(AsyncLoadPlayer());
    socket.on("refreshPlayerList", () => {
      console.log("ok");
      dispatch(AsyncLoadPlayer());
    });
  }, [dispatch, socket]);

  return (
    <div className="main__layout">
      <div className="wrapper">
        <div className="header__rent">
          <div className="header__container">
            <div className="header--title">Rent Player Rent Happy</div>
            <div className="header--filter">
              <div className="filter__search">
                <div className="filter__search--name filters">Filter</div>
                <div className="filter__search--items filters">
                  <Select
                    placeholder="Gender"
                    style={{ width: 90 }}
                    onChange={handleChange}
                    className="select"
                  >
                    <Option value="Male">Male</Option>
                    <Option value="Female">Female</Option>
                    <Option value="">None</Option>
                  </Select>
                </div>

                <div className="filter__search--items filters">
                  <Select
                    placeholder="All status"
                    style={{ width: 100 }}
                    onChange={handleChange}
                  >
                    <Option value="Online">Online</Option>
                    <Option value="Offline">Offline</Option>
                  </Select>
                </div>

                <div className="filter__search--items filters">
                  <Select
                    placeholder="Price"
                    style={{ width: 100 }}
                    onChange={handleChange}
                  >
                    <Option value="1">1-5</Option>
                    <Option value="5.01">5.01-10</Option>
                    <Option value="10.01">10.01-20</Option>
                    <Option value="20.01">20+</Option>
                  </Select>
                </div>

                <div className="filter__search--items filters">
                  <Select
                    placeholder="Age"
                    style={{ width: 80 }}
                    onChange={handleChange}
                  >
                    <Option value="25">18-25</Option>
                    <Option value="30">26-30</Option>
                    <Option value="30.01">30+</Option>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="card__rent">
          <div className="card__container">
            <div className="cardList row">
              {listPlayers &&
                listPlayers.map((item) => {
                  return <CardList item={item} key={item._id} />;
                })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainRentPlayer;
