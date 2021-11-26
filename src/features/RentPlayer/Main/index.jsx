import React, { useEffect, useState } from "react";

import { Select } from "antd";
import "./RentPlayer.scss";
import CardList from "../Card/index";
import { AsyncLoadPlayer } from "../PlayerSlice";
import { useDispatch, useSelector } from "react-redux";
import { AsyncLoadUser } from "features/Auth/AuthSlice";
import socket from "utils/socket";

function MainRentPlayer() {
  //   Select
  const { Option } = Select;
  const [filterValues, setFilterValues] = useState({
    page: 1,
    limit: 50,
    status: "",
    minAge: 16,
    maxAge: 30,
    minPrice: 1,
    maxPrice: 1000,
    gender: "",
  });

  const { listPlayers } = useSelector((state) => state.players);

  const dispatch = useDispatch();

  const handleChangeGender = (value) => {
    setFilterValues({ ...filterValues, gender: value });
  };
  const handleChangePrice = (value) => {
    switch (value) {
      case "5":
        setFilterValues({
          ...filterValues,
          minPrice: 1,
          maxPrice: 5,
        });
        break;
      case "5.01":
        setFilterValues({
          ...filterValues,
          minPrice: 5.01,
          maxPrice: 10,
        });
        break;
      case "10.01":
        setFilterValues({
          ...filterValues,
          minPrice: 10.01,
          maxPrice: 20,
        });
        break;
      case "20.01":
        setFilterValues({
          ...filterValues,
          minPrice: 20.01,
          maxPrice: 1000,
        });
        break;
      default:
        setFilterValues({
          ...filterValues,
          minPrice: 1,
          maxPrice: 1000,
        });
        break;
    }
  };
  const handleChangeStatus = (value) => {
    // if (value === "") {
    //   setFilterValues({ ...filterValues, status: false });
    // } else setFilterValues({ ...filterValues, status: value });
    console.log(value);
    setFilterValues({ ...filterValues, status: value });
  };
  const handleChangeAge = (value) => {
    switch (value) {
      case "25":
        setFilterValues({
          ...filterValues,
          minAge: 16,
          maxAge: 25,
        });
        break;
      case "30":
        setFilterValues({
          ...filterValues,
          minAge: 26,
          maxAge: 30,
        });
        break;
      case "30.01":
        setFilterValues({
          ...filterValues,
          minAge: 31,
          maxAge: 50,
        });
        break;
      default:
        setFilterValues({
          ...filterValues,
          minAge: 1,
          maxAge: 50,
        });
        break;
    }
  };

  // Price
  // Filter gender

  useEffect(() => {
    dispatch(AsyncLoadUser());
    dispatch(AsyncLoadPlayer(filterValues));
  }, [dispatch, filterValues]);

  useEffect(() => {
    // Chỉ được gọi khi socket kiểm tra online, offline
    const handleRefresh = () => {
      dispatch(AsyncLoadPlayer(filterValues));
    };
    socket.on("refreshPlayerList", handleRefresh);

    return () => {
      socket.off("refreshPlayerList", handleRefresh);
    };
  }, [dispatch, filterValues]);

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
                    onChange={handleChangeGender}
                    className="select"
                  >
                    <Option value="male">Male</Option>
                    <Option value="female">Female</Option>
                    <Option value="">None</Option>
                  </Select>
                </div>

                <div className="filter__search--items filters">
                  <Select
                    placeholder="All status"
                    style={{ width: 100 }}
                    onChange={handleChangeStatus}
                  >
                    <Option value="true">Online</Option>
                    <Option value="false">Offline</Option>
                    <Option value="">Default</Option>
                  </Select>
                </div>

                <div className="filter__search--items filters">
                  <Select
                    placeholder="Price"
                    style={{ width: 100 }}
                    onChange={handleChangePrice}
                  >
                    <Option value="5">1-5</Option>
                    <Option value="5.01">5.01-10</Option>
                    <Option value="10.01">10.01-20</Option>
                    <Option value="20.01">20+</Option>
                    <Option value="">Default</Option>
                  </Select>
                </div>

                <div className="filter__search--items filters">
                  <Select
                    placeholder="Age"
                    style={{ width: 80 }}
                    onChange={handleChangeAge}
                  >
                    <Option value="25">18-25</Option>
                    <Option value="30">26-30</Option>
                    <Option value="30.01">30+</Option>
                    <Option value="">Default</Option>
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
                listPlayers?.map((item) => {
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
