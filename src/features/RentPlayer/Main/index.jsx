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
  const [filterValues, setFilterValues] = useState('false');
  const [filterPriceValues, setFilterPriceValues] = useState();
  const { listPlayers } = useSelector((state) => state.players);
  const [filters, setFilters] = useState({
    gender: "",
    status: "",
    price: "",
    age: "",
  });

  const dispatch = useDispatch();

  const handleChange = (value) => {
    setFilterValues(value);
  };

  // Price
  const handleChangePrice = (value) => {
    setFilterPriceValues(value);
  };

  // Filter gender
  const filterData = listPlayers.filter((item) => {
    return item.user[0]?.gender.toLowerCase() === filterValues?.toLowerCase();
  });

  // Filter status online or offline
  const filterStatus = listPlayers.filter((item) => {
    return item.user[0]?.isOnline.toString() === filterValues;
  });

  const filterPrice = listPlayers.filter((item) => {
    switch (filterValues) {
      case "5":
        return item.pricePerHour <= 5;
      case "10.01":
        return item.pricePerHour > 10;
      case "10.01":
        return item.pricePerHour > 10;
      case "20.01":
        return item.pricePerHour > 20;
      default:
        return item.pricePerHour > 5;
    }
  });

  const filterAll = () => {
    if (filterValues) {
      return listPlayers.filter((item) => {
        return item.user[0]?.isOnline.toString() === filterValues;
      });
    } else {
      return filterValues?.filter((item) => {
        switch (filterPriceValues) {
          case "5":
            return item.pricePerHour <= 5;
          case "10.01":
            return item.pricePerHour > 10;
          case "20.01":
            return item.pricePerHour > 20;
          default:
            return item.pricePerHour > 5;
        }
      });
    }
  };

  console.log(filterAll());

  useEffect(() => {
    dispatch(AsyncLoadUser());
    dispatch(AsyncLoadPlayer());
  }, [dispatch]);

  useEffect(() => {
    const handleRefresh = () => {
      dispatch(AsyncLoadPlayer());
    };
    socket.on("refreshPlayerList", handleRefresh);

    return () => {
      socket.off("refreshPlayerList", handleRefresh);
    };
  }, [dispatch]);

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
                    <Option value="true">Online</Option>
                    <Option value="false">Offline</Option>
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
              {/* {listPlayers &&
                listPlayers.map((item) => {
                  return <CardList item={item} key={item._id} />;
                })} */}
              {filterValues
                ? filterAll()?.map((item) => {
                    return <CardList item={item} key={item._id} />;
                  })
                : listPlayers?.map((item) => {
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
