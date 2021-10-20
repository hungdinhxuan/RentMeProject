import { Avatar, Badge, Dropdown, Menu, Modal, Button } from "antd";
import Logo from "assets/player-dou-a.jpg";
import React, { useEffect, useRef, useState } from "react";
import { getAllMessagesAsync, addNewMessage} from "features/Settings/MessageSlice";
import { Container, Nav, Navbar } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { NavLink, useHistory } from "react-router-dom";
import Drawler from "./Drawler";
import "./Header.scss";
import socket from "socket";

function Header() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { messages } = useSelector((state) => state.messages);
  const [userHeader, setUserHeader] = useState(true);
  const [visible, setVisible] = useState(false);
  const [navScroll, setnavSroll] = useState("");
  

  const navRef = useRef();
  navRef.current = navScroll;

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

  // Dropdown message
  // const message = "Giao dịch thành công từ: ...";
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [idModal, setIdModal] = useState("0");

  const handleSubmit = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const showModal = (id) => {
    // console.log(id.);
    setIsModalVisible(true);
    setIdModal(id.key);
  };
  const menu = (
    <Menu>
      {messages?.map((msg, index) => (
        <Menu.Item key={index} onClick={showModal}>
          <div>{msg?.content?.length >= 60 ? `${msg?.content?.slice(0, 40)}...`: msg?.content}</div>
        </Menu.Item>
      ))}
    </Menu>
  );

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

  useEffect(() => {
    dispatch(getAllMessagesAsync(user?._id));
    console.log(user);
    user ? setUserHeader(false) : setUserHeader(true);
  }, [dispatch, user]);

  useEffect(() => {
    socket.on("response renter", (data) => {
      console.log("Renter data: ", data);
      dispatch(addNewMessage(data))
    })
    socket.on("response player", (data) => {
      console.log("Player data: ", data);
      dispatch(addNewMessage(data))
    })
  }, [dispatch])

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
                  ChatRoom
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
                    <Dropdown overlay={menu} placement="bottomLeft" arrow>
                      <Badge count={1}>
                        <div className="message-icon">
                          <i className="bi bi-envelope"></i>
                        </div>
                      </Badge>
                    </Dropdown>
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
      <>
        <Modal
          title="Message Notification"
          visible={isModalVisible }
          onCancel={handleCancel}
          footer={[
            <Button className="submit-form" key="Submit" onClick={handleSubmit}>
              Submit
            </Button>,
            <Button key="Cancel" onClick={handleCancel}>
              Cancel
            </Button>,
          ]}
        >
          <p>
            {messages[idModal]?.content}
          </p>
        </Modal>
      </>
    </header>
  );
}

export default Header;
