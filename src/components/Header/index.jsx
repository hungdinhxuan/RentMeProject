import { Avatar, Badge, Button, Dropdown, Menu, Modal } from "antd";
import Logo from "assets/player-dou-a.jpg";
import {
  addNewMessage,
  removeMessage,
  getAllMessagesAsync,
  updateMessageAsync,
  removeMessageAsync,
  updateMessage,
} from "features/Settings/MessageSlice";
import React, { useEffect, useRef, useState } from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useHistory } from "react-router-dom";
import socket from "utils/socket";
import Drawler from "./Drawler";
import "./Header.scss";
import Swal from "sweetalert2";
import { ToastSweet } from "components/SweetAlert2";
import PrivateChat from "components/Chat";
import {
  setShowPrivateChat,
  addNewMsgToConversations,
  setCountNewMessagesIncrease,
} from "features/PrivateChat/PrivateChatSlice";

function Header() {
  const { user } = useSelector((state) => state.auth);
  const { showPrivateChat, countNewMessages } = useSelector(
    (state) => state.privateChat
  );
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

  const handleShowPrivateChat = () => {
    dispatch(setShowPrivateChat());
  };

  const handleDeleteMessage = () => {
    setIsModalVisible(false);

    //messages[idModal].content.match(/^Trading [a-z 0-9]* accepted by .* Room ID: .* Room Password: .*/g)[0] === messages[idModal].content
    const checker = messages[idModal].content.match(
      /^Trading [a-z 0-9]* accepted by .*\s Room ID: .*, Room Password: .*/g
    );
    const checker2 = messages[idModal].content.match(
      /^You are accepted [a-z 0-9]* with .*\s Room ID: .*, Room Password: .*/g
    );
    if (
      (checker && checker[0] === messages[idModal].content) ||
      (checker2 && checker2[0] === messages[idModal].content)
    ) {
      Swal.fire({
        title: "Are you sure?",
        text: "This message contain infomation about Room ID as well as Room Password. Please consider before making decision. You won't be able to revert this! ",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then((result) => {
        if (result.isConfirmed) {
          dispatch(
            removeMessageAsync({
              userId: user._id,
              messageId: messages[idModal]._id,
            })
          );
        }
      });
    } else {
      dispatch(
        removeMessageAsync({
          userId: user._id,
          messageId: messages[idModal]._id,
        })
      );
    }
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
    socket.emit("confirm rent", messages[idModal]);
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleDecline = () => {
    socket.emit("decline rent", messages[idModal]);
    setIsModalVisible(false);
  };
  const showModal = (id) => {
    dispatch(
      updateMessageAsync({ userId: user?._id, messageId: messages[id.key]._id })
    );
    setIsModalVisible(true);
    setIdModal(id.key);
  };
  const menu = (
    <Menu>
      {messages?.map((msg, index) => (
        <Menu.Item key={index} onClick={showModal}>
          <div
            style={
              msg.status === "unread"
                ? { fontWeight: "600" }
                : { fontWeight: "normal" }
            }
          >
            {msg?.content?.length >= 60
              ? `${msg?.content?.slice(0, 40)}...`
              : msg?.content}
          </div>
        </Menu.Item>
      ))}
    </Menu>
  );

  // Check message.

  // Life-cycle
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
    user ? setUserHeader(false) : setUserHeader(true);
  }, [dispatch, user]);

  useEffect(() => {
    const loadData = (data) => {
      if (data === "this player is offline") {
        ToastSweet("error", "this player is offline");
      } else {
        dispatch(addNewMessage(data));
      }
    };

    const confirmRentMsg = (data) => {
      if (data.updatedMessage) {
        dispatch(updateMessage(data.updatedMessage));
      }
      dispatch(addNewMessage(data.message));
    };

    const declineMsg = (data) => {
      Swal.fire({
        position: "center",
        icon: "error",
        title: data.message,
        showConfirmButton: false,
        timer: 1000,
      });
      if (data.msgId) {
        return dispatch(removeMessage(data.msgId));
      }
    };

    const errorMsg = (data) => {
      Swal.fire({
        position: "center",
        icon: "error",
        title: data,
        showConfirmButton: false,
        timer: 1000,
      });
    };

    const handleExpireRentPlayer = (data) => {
      ToastSweet("warning", data);
    };

    const handleTradingError = (data) => {
      ToastSweet("error", data);
    };

    const handleResponseDonateMoneyForPlayer = (data) => {
      ToastSweet("success", data);
    };

    const handleFollowPlayer = (data) => {
      ToastSweet("success", data);
    };

    const handlePrivateChatForReceiver = (newMsg) => {
      dispatch(addNewMsgToConversations(newMsg));
      dispatch(setCountNewMessagesIncrease());
    };

    socket.on("response renter", loadData);
    socket.on("response player", loadData);
    socket.on("response confirm rent", confirmRentMsg);
    socket.on("response error renter", errorMsg);
    socket.on("response decline rent", declineMsg);
    socket.on("expire rent player", handleExpireRentPlayer);
    socket.on("trading error", handleTradingError);
    socket.on(
      "response donate money player",
      handleResponseDonateMoneyForPlayer
    );
    socket.on("follow player", handleFollowPlayer);

    socket.on("private chat receiver", handlePrivateChatForReceiver);
    // Note: Clear socket when change state.
    return () => {
      socket.off("response decline rent", declineMsg);
      socket.off("response renter", loadData);
      socket.off("response player", loadData);
      socket.off("response confirm rent", confirmRentMsg);
      socket.off("response error renter", errorMsg);
      socket.off("expire rent player", handleExpireRentPlayer);
      socket.off("trading error", handleTradingError);
      socket.off(
        "response donate money player",
        handleResponseDonateMoneyForPlayer
      );
      socket.off("follow player", handleFollowPlayer);
      socket.off("private chat receiver", handlePrivateChatForReceiver);
    };
  }, [dispatch]);

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
                  to="/chat-room"
                  className="nav__item"
                  activeClassName="nav__item--active"
                >
                  ChatRoom
                </NavLink>
              </Nav.Link>
              <Nav.Link href="#">
                <NavLink
                  to="/privacy"
                  className="nav__item"
                  activeClassName="nav__item--active"
                >
                  Privacy Policy
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
                  <div
                    className="message__badge"
                    onClick={handleShowPrivateChat}
                    style={{ marginRight: "5px" }}
                  >
                    <Badge count={countNewMessages}>
                      <div className="message-icon">
                        <i className="bi bi-chat"></i>
                      </div>
                    </Badge>
                  </div>

                  <div className="message__badge">
                    <Dropdown overlay={menu} placement="bottomLeft" arrow>
                      <Badge
                        count={
                          messages.filter(
                            (mess, index) => mess.status === "unread"
                          ).length
                        }
                      >
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
          visible={isModalVisible}
          onCancel={handleCancel}
          footer={
            messages[idModal]?.content &&
            messages[idModal]?.content.includes("Current trading ID:")
              ? [
                  <Button
                    className="submit-form"
                    key="Submit"
                    onClick={handleSubmit}
                  >
                    Confirm
                  </Button>,
                  <Button key="Decline" onClick={handleDecline}>
                    Decline
                  </Button>,
                ]
              : [
                  <Button
                    key="Delete"
                    onClick={handleDeleteMessage}
                    style={{ color: "red", borderColor: "red" }}
                  >
                    Delete
                  </Button>,
                  <Button key="Cancel" onClick={handleCancel}>
                    Cancel
                  </Button>,
                ]
          }
        >
          <p>{messages[idModal]?.content}</p>
        </Modal>
      </>
      {showPrivateChat ? <PrivateChat /> : null}
    </header>
  );
}

export default Header;
