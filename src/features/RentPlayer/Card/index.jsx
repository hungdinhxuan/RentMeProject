import React from "react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router";
import { Avatar, Space, Rate } from "antd";
import Ha from "assets/Ha.jpg";
import OnlineStatus from "assets/onlineStatus.png";
import PriceCard from "assets/priceCard.png";
import "./CardList.scss";

function CardList() {
  const handleAudio = (e) => {
    e.preventDefault();
    console.log("open audio");
  };

  return (
    <div className="card__details col-xl-3 col-md-6 col-12">
      <Link to="/playerdou/details">
        <div className="card__items">
          <div className="profile">
            <Avatar shape="square" size={100} src={Ha} />
            <div className="status">
              <Avatar shape="square" size={12} src={OnlineStatus} />
            </div>
          </div>
          <div className="box">
            <div className="box__container">
              <div className="title">Hello kitty</div>
              <div className="intro">
                <div className="games">
                  <Space size={4} style={{ flexWrap: "wrap" }}>
                    <div className="categories">League of Legends</div>
                    <div className="categories">Wild rift</div>
                  </Space>
                </div>
                <div className="desc">
                  <div className="text">
                    Hi! I'm Ha. If you're looking to get carried I might not be
                    the right person. But, we can play and have fun. I usually
                    play Heimerdinger. Well not usually, I always play Heimer.
                    Yes? That's a smol potato clip of me playing league but yes.
                    Also, if we lose, you get one game on the house. xD
                  </div>
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
                      <i class="bi bi-play"></i>
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
                      <span>5</span>
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
