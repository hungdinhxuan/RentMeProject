import { Avatar, Badge } from "antd";
import { UserOutlined } from "@ant-design/icons";
import Logo from "assets/player-dou-a.jpg";
import React, { useEffect, useRef, useState } from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
import { useSelector } from "react-redux";
import { NavLink, useHistory, useLocation } from "react-router-dom";
import Drawler from "./Drawler";
import "./Header.scss";
import Ha from "assets/Ha.jpg";
import Loading from "components/Loading";

function Header() {
  const { user, loading, error } = useSelector((state) => state.auth);

  const [header, setHeader] = useState(false);
  const [userHeader, setUserHeader] = useState(true);
  const [visible, setVisible] = useState(false);
  const [navScroll, setnavSroll] = useState("");

  const navRef = useRef();
  navRef.current = navScroll;
  const location = useLocation();

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

  useEffect(() => {
    user ? setUserHeader(false) : setUserHeader(true);
  }, [user]);

  return (
    <header className={navScroll}>
      <Navbar expand="lg">
        <Container>
          <NavLink exact to="/" className="header__nav">
            <img
              alt="Logo Home"
              src={Logo}
              width="50"
              height="50"
              className="d-inline-block align-top"
            />{" "}
            <span style={{ color: "orange" }}>Rent Me</span>
          </NavLink>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto align-items-center">
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
              {userHeader ? (
                <>
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
                </>
              ) : (
                <div className="message d-flex align-items-center">
                  <div className="message__badge">
                    <Badge count={1}>
                      <div className="message-icon">
                        <i class="bi bi-envelope"></i>
                      </div>
                    </Badge>
                  </div>
                  <div className="user__icon" onClick={handleShowDrawler}>
                    <Avatar size={28} src={user.avatar} />
                  </div>
                </div>
              )}
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Drawler visible={visible} Close={handleClose} avatar={user?.avatar} />
    </header>
  );
}

export default Header;
