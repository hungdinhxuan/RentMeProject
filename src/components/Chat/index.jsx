import React, { useState, useEffect } from "react";
import "./Chat.scss";
import { useDispatch, useSelector } from "react-redux";
import {
  getOthersConversationAsync,
  setShowPrivateChat,
  setOther,
  loadConversations,
  addNewMsgToConversations,
} from "features/PrivateChat/PrivateChatSlice";
import socket from "utils/socket";
import ScrollToBottom from "react-scroll-to-bottom";
import TimeAgo from "utils/timeAgo";
import InputEmoji from "react-input-emoji";

const Chat = () => {
  const dispatch = useDispatch();
  const { others, newContact, other, conversations } = useSelector(
    (state) => state.privateChat
  );
  const { user } = useSelector((state) => state.auth);

  const [currentMessage, setCurrentMessage] = useState("");
  // const sendMessage = () => {
  //   if (currentMessage.trim() !== "") {
  //     // console.log(currentMessage);
  //     socket.emit("private chat", {
  //       receiverId: other.otherId,
  //       content: currentMessage,
  //     });
  //     setCurrentMessage("");
  //   }
  // };
  const sendMessage = (text) => {
    if (text !== "") {
      socket.emit("private chat", {
        receiverId: other.otherId,
        content: text,
      });
    }
  };

  useEffect(() => {
    dispatch(getOthersConversationAsync());
  }, [dispatch]);

  useEffect(() => {
    const handleAddNewPrivateChat = (newMsg) =>
      dispatch(addNewMsgToConversations(newMsg));

    socket.on("private chat", handleAddNewPrivateChat);
    return () => {
      socket.off("private chat", handleAddNewPrivateChat);
    };
  }, [dispatch]);

  useEffect(() => {
    if (other) {
      dispatch(loadConversations({ userId: other.otherId }));
    }
  }, [dispatch, other]);

  return (
    <div className="center">
      <div className="contacts">
        <i className="fas fa-bars fa-2x"></i>
        <h2>Contacts</h2>

        {newContact &&
        !others.find((value) => value.otherId === newContact.otherId) ? (
          <>
            {newContact ? (
              <div
                className="contact"
                onClick={() => dispatch(setOther(newContact))}
              >
                <img className="pic" src={newContact.otherAvatar} alt="" />
                <div className="name">{newContact.otherFullName}</div>
                {/* <div className="badge">3</div> */}
                <div
                  className={
                    newContact.isOnline ? "badge online" : "badge offline"
                  }
                >
                  <div></div>
                </div>
                <div className="message">
                  Say Hi With {newContact.otherFullName}
                </div>
              </div>
            ) : null}
            {others?.map((value) => (
              <div
                className="contact"
                key={value.otherId}
                onClick={() => dispatch(setOther(value))}
              >
                <img className="pic" src={value.otherAvatar} alt="" />
                <div className="name">{value.otherFullName}</div>
                {/* <div className="badge">3</div> */}
                <div
                  className={value.isOnline ? "badge online" : "badge offline"}
                >
                  <div></div>
                </div>
                <div className="message">{value.lastestMessage}</div>
              </div>
            ))}
          </>
        ) : (
          <>
            {others?.map((value) => (
              <div
                className="contact"
                key={value.otherId}
                onClick={() => dispatch(setOther(value))}
              >
                <img className="pic" src={value.otherAvatar} alt="" />
                <div className="name">{value.otherFullName}</div>
                <div
                  className={value.isOnline ? "badge online" : "badge offline"}
                >
                  <div></div>
                </div>
                <div className="message">{value.lastestMessage}</div>
              </div>
            ))}
          </>
        )}
      </div>
      <div className="chat">
        <div className="contact bar">
          {/* <div className="pic sender"></div> */}
          {other ? (
            <>
              <img className="pic" src={other.otherAvatar} alt="avatar" />
              <div>
                <div className="name">{other.otherFullName}</div>
                <div
                  className={other.isOnline ? "badge online" : "badge offline"}
                >
                  <div></div>
                </div>
                <div className="seen">
                  {other.createdAt
                    ? TimeAgo(new Date(other.createdAt))
                    : "Just now"}
                </div>
              </div>
            </>
          ) : (
            <div style={{ width: "100%" }}></div>
          )}

          <div
            className="icon-close"
            onClick={() => dispatch(setShowPrivateChat())}
          >
            <i className="bi bi-x"></i>
          </div>
        </div>
        <ScrollToBottom className="messages" id="chat">
          {/* <div className="time">Today at 11:41</div>
          <div className="message receiver">
            Hey, man! What's up, Mr sender? 👋
          </div>
          <div className="message sender">Kid, where'd you come from?</div>
          <div className="message receiver">Field trip! 🤣</div>
          <div className="message receiver">
            Uh, what is this guy's problem, Mr. sender? 🤔
          </div>
          <div className="message sender">
            Uh, he's from space, he came here to steal a necklace from a wizard.
          </div> */}
          {conversations?.map((msg) => (
            <div
              className={
                user._id === msg.senderId
                  ? "message receiver"
                  : "message sender"
              }
              key={msg._id}
              id="message-time-ago"
            >
              {msg.content}
              <div className="time-ago">{TimeAgo(new Date(msg.createdAt))}</div>
            </div>
          ))}

          {/* <div className="message sender">
            <div className="typing typing-1"></div>
            <div className="typing typing-2"></div>
            <div className="typing typing-3"></div>
          </div> */}
        </ScrollToBottom>
        <div className="input">
          <i className="fas fa-camera"></i>
          <i className="far fa-laugh-beam"></i>
          {/* <input
            placeholder="Type your message here!"
            type="text"
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            onKeyPress={(event) => {
              event.key === "Enter" && sendMessage();
            }}
          /> */}
          <InputEmoji
            value={currentMessage}
            onChange={setCurrentMessage}
            cleanOnEnter
            onEnter={sendMessage}
          />
          <i className="fas fa-microphone"></i>
        </div>
      </div>
    </div>
  );
};

export default Chat;
