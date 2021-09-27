import PageNotFound from "components/PageNotFound";
import React, { useState, useRef, useEffect } from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
import { NavLink, useHistory, useLocation } from "react-router-dom";
import "./Header.scss";
import { Badge, Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";
import Drawler from "./Drawler";
import { Drawer, Button, Space, Radio } from "antd";

function Header() {
  const [header, setHeader] = useState(false);
  const [user, setUser] = useState(false);
  const [visible, setVisible] = useState(false);
  const [navScroll, setnavSroll] = useState("");

  const navRef = useRef();
  navRef.current = navScroll;

  useEffect(() => {
    const handleScroll = () => {
      const show = window.scrollY > 10;
      if (show) {
        setnavSroll("header__scroll");
      } else {
        setnavSroll("");
      }
    };
    document.addEventListener("scroll", handleScroll);
    if (userInfo) {
      setUser(false);
    }

    return () => {
      document.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleShowDrawler = () => {
    setVisible(true);
  };

  

  const handleClose = () => {
    setVisible(false);
  };

  const history = useHistory();

  const handleLogin = () => {
    history.push("/signin");
  };

  const handleSignUp = () => {
    history.push("/signup");
  };

  const userInfo = localStorage.getItem("token");

  return (
    <header className={navScroll}>
      <Navbar expand="lg">
        <Container>
          <NavLink exact to="/" className="header__nav">
            <img
              alt="Logo Home"
              src="/player-dou-a.jpg"
              width="50"
              height="50"
              className="d-inline-block align-top"
            />{" "}
            <span style={{ color: "orange" }}>Rent Me</span>
          </NavLink>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="#">
                <NavLink
                  to="/streamhub"
                  className="nav__item"
                  activeClassName="nav__item--active"
                >
                  StreamHub
                </NavLink>
              </Nav.Link>
              <Nav.Link href="#">
                <NavLink
                  to="/news"
                  className="nav__item"
                  activeClassName="nav__item--active"
                >
                  News
                </NavLink>
              </Nav.Link>
              <Nav.Link href="#">
                <NavLink
                  to="/playerdou"
                  className="nav__item"
                  activeClassName="nav__item--active"
                >
                  Thuê người chơi
                </NavLink>
              </Nav.Link>
              <Nav.Link href="#">
                <NavLink
                  to="/bxh"
                  className="nav__item"
                  activeClassName="nav__item--active"
                >
                  BXH
                </NavLink>
              </Nav.Link>
              <Nav.Link href="#">
                <button
                  className="nav__item user__mobile"
                  activeclassname="nav__item--active"
                  onClick={handleShowDrawler}
                >
                  Thông tin cá nhân
                </button>
                <hr />
              </Nav.Link>
            </Nav>
            <div className="justify-content-end">
              <button className="button__login" onClick={handleLogin}>
                Log in
              </button>
              <button
                style={{ marginLeft: "12px" }}
                className="button__signup"
                onClick={handleSignUp}
              >
                Sign up
              </button>

              {/* <div className="message d-flex align-items-center">
                <div className="message__badge">
                  <Badge count={1}>
                    <div className="message-icon">
                      <i class="bi bi-envelope"></i>
                    </div>
                  </Badge>
                </div>
                <div className="user__icon" onClick={handleShowDrawler}>
                  <Avatar size={28} icon={<UserOutlined />} />
                </div>
              </div> */}
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Drawler visible={visible} Close={handleClose} />
    </header>
  );
}

export default Header;
