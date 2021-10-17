import React from "react";
import { Link } from "react-router-dom";
import { Avatar, Space, Rate } from "antd";
import OnlineStatus from "assets/onlineStatus.png";
import OfflineStatus from "assets/offlineStatus.png";
import PriceCard from "assets/priceCard.png";
import "./CardList.scss";

function CardList({ item }) {
  const handleAudio = (e) => {
    e.preventDefault();
    console.log("open audio");
  };

  return (
    <div className="card__details col-xl-3 col-md-6 col-12">
      <Link to={`/playerdou/${item._id}`}>
        <div className="card__items">
          <div className="profile">
            <Avatar shape="square" size={100} src={item.coverBackground} />
            <div className="status">
              {item.user[0].isOnline ? (
                <Avatar shape="square" size={12} src={OnlineStatus} />
              ) : (
                <Avatar shape="square" size={12} src={OfflineStatus} />
              )}
            </div>
          </div>
          <div className="box">
            <div className="box__container">
              <div className="title">{item.nickname}</div>
              <div className="intro">
                <div className="games">
                  <Space size={4} style={{ flexWrap: "wrap" }}>
                    {/* <div className="categories">League of Legends</div>
                    <div className="categories">Wild rift</div> */}
                    {item?.services.map((val, index) => <div className="categories" key={index}>{val.name}</div>)}
                  </Space>
                </div>
                <div className="desc">
                  <div className="text">{item.shortDesc}</div>
                </div>
              </div>
              <div className="corner">
                <Space size={8}>
                  <div className="shape" onClick={handleAudio}>
                    <div className="shape--left">
                      <div></div>
                      <div></div>
                      <div></div>
                    </div>
                    <div className="shape--right">
                      <i className="bi bi-play"></i>
                      <audio src=""></audio>
                    </div>
                  </div>
                </Space>
              </div>
            </div>
            <div className="box__footer">
              <div className="prices">
                <Space size={8} direction="vertical">
                  <Space size={4}>
                    <div className="prices--icon">
                      <Avatar src={PriceCard} size={16} />
                    </div>
                    <div className="prices--details">
                      <span>{item.pricePerHour}</span>
                      <span>. 00</span>
                      <span>/USD</span>
                    </div>
                  </Space>
                </Space>
              </div>
              <div className="rate">
                <Space size={8}>
                  <div className="rateStar">
                    <Rate
                      value={5}
                      count={5}
                      disabled
                      style={{ fontSize: "16px" }}
                    />
                  </div>
                </Space>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default CardList;
