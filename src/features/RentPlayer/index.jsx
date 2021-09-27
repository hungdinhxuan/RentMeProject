import React from "react";
import { useLocation } from "react-router";
import { Select } from "antd";
import "./RentPlayer.scss";

function RentPlayer() {
  const location = useLocation();
  console.log(location);

  //   Select
  const { Option } = Select;
  const handleChange = (value) => {
    console.log(`selected ${value}`);
  };

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
                    defaultValue="Gender"
                    style={{ width: 100 }}
                    onChange={handleChange}
                  >
                    <Option value="Male">Male</Option>
                    <Option value="Female">Female</Option>
                    <Option value="">None</Option>
                  </Select>
                </div>

                <div className="filter__search--items filters">
                  <Select
                    defaultValue="All status"
                    style={{ width: 100 }}
                    onChange={handleChange}
                  >
                    <Option value="Online">Online</Option>
                    <Option value="Offline">Offline</Option>
                  </Select>
                </div>

                <div className="filter__search--items filters">
                  <Select
                    defaultValue="Price"
                    style={{ width: 110 }}
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
                    defaultValue="Age"
                    style={{ width: 110 }}
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
      </div>
    </div>
  );
}

export default RentPlayer;
