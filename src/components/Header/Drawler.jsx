import { Avatar, Drawer, Space, Card, Switch  } from "antd";
import AvatarProfile from "assets/default_avatar.png";
import OnlineStatus from "assets/onlineStatus.png";
import React from "react";
import "./Drawer.scss";

import Wallet from "assets/wallet.png";
import Coupon from "assets/coupon.png";
import EpalPlus from "assets/EpalPlus.png";
function Drawler(props) {
  const { visible, Close } = props;

  return (
    <>
      <Drawer
        placement="right"
        width={320}
        visible={visible}
        onClose={Close}
        closable={false}
      >
        <div id="sidebarList">
          <div className="userInfo__drawer">
            <div className="cardInfo d-flex">
              <div className="avatar">
                <Avatar size={40} src={AvatarProfile} />
              </div>
              <div className="box">
                <div className="title">
                  <div className="text">User Profile</div>
                </div>
              </div>
            </div>
          </div>
          <div className="status__drawer">
            <Space>
              <Avatar size={12} src={OnlineStatus} />
              <span
                style={{
                  color: "#fff",
                  fontSize: "14px",
                  fontWeight: "500",
                  lineHeight: "1",
                }}
              >
                ONLINE
              </span>
            </Space>
            <i
              style={{ fontSize: "16px", color: "#fff" }}
              class="bi bi-caret-right"
            ></i>
          </div>
          <div className="detailInfo__drawer">
            <div className="detailInfo--card">
              <div className="card__items">
                <div className="num">0</div>
                <div className="text">Followers</div>
              </div>
            </div>
            <div className="detailInfo--card">
              <div className="card__items">
                <div className="num">1</div>
                <div className="text">Followings</div>
              </div>
            </div>
            <div className="detailInfo--card">
              <div className="card__items">
                <div className="num">0</div>
                <div className="text">Visitors</div>
              </div>
            </div>
            <div className="detailInfo--card">
              <div className="card__items">
                <div className="num">0</div>
                <div className="text">Ranks</div>
              </div>
            </div>
          </div>
          <div className="options__drawer">
            <div className="options--card">
              <div className="title">
                <img src={Wallet} alt="wallet" />
              </div>
              <div className="text">Wallet</div>
            </div>
            <div className="options--card">
              <div className="title">
                <img src={Coupon} alt="coupon" />
              </div>
              <div className="text">Coupon</div>
            </div>
          </div>
          <div className="operateList__drawer">
            <div className="line"></div>
            <div className="operateList--plus">
              <div className="desc--plus">
                Subscribe to receive up to more 211.00 free buff/year
              </div>
            </div>
            <div className="operateList--plus player">
              <div className="desc--plus">Become to a Professional Player</div>
              <div className="text">Earn extra cash by gaming with others.</div>
            </div>
            <div className="line"></div>
            <div className="option__items">
              <Space size={0} style={{ padding: "10px" }}>
                <div className="left d-flex">
                  <div className="icon">
                    <i class="bi bi-headset"></i>
                  </div>
                  <div className="text--item">Live Support</div>
                </div>
              </Space>
            </div>
            <div className="option__items">
              <Space size={0} style={{ padding: "10px" }}>
                <div className="left d-flex">
                  <div className="icon">
                    <i class="bi bi-flag"></i>
                  </div>
                  <div className="text--item">Report</div>
                </div>
              </Space>
            </div>
            <div className="option__items">
              <Space size={0} style={{ padding: "10px" }}>
                <div className="left d-flex">
                  <div className="icon">
                    <i class="bi bi-headset"></i>
                  </div>
                  <div className="text--item">Light Mode</div>
                </div>
                <div className="right">
                <Switch defaultChecked />
                </div>
              </Space>
            </div>
            <div className="option__items">
              <Space size={0} style={{ padding: "10px" }}>
                <div className="left d-flex">
                  <div className="icon">
                    <i class="bi bi-gear"></i>
                  </div>
                  <div className="text--item">Settings</div>
                </div>
              </Space>
            </div>
          </div>
        </div>
      </Drawer>
    </>
  );
}

export default Drawler;
