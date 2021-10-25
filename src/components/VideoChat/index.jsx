import React, { createRef, useState, useEffect } from "react";
import { IconButton, Badge, Input, Button } from "@material-ui/core";
import VideocamIcon from "@material-ui/icons/Videocam";
import VideocamOffIcon from "@material-ui/icons/VideocamOff";
import MicIcon from "@material-ui/icons/Mic";
import MicOffIcon from "@material-ui/icons/MicOff";
import ScreenShareIcon from "@material-ui/icons/ScreenShare";
import StopScreenShareIcon from "@material-ui/icons/StopScreenShare";
import CallEndIcon from "@material-ui/icons/CallEnd";
import ChatIcon from "@material-ui/icons/Chat";
import Modal from "react-bootstrap/Modal";
import socket from "socket";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import "./VideoChat.scss";
import {abortTrading} from 'features/ChatRoom/ChatRoomSlice'
import Swal from "sweetalert2";

let connections = {};

// Link connect peer Server
const peerConnectionConfig = {
  iceServers: [
    // { 'urls': 'stun:stun.services.mozilla.com' },
    { urls: process.env.REACT_APP_STUN_URL },
  ],
};

let socketId = null;
let elms = 0;
let videoAvailable = false;
let audioAvailable = false;

export default function VideoChat() {
  const localVideoref = createRef();
  const history = useHistory();
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth);
  const {roomId, tradingId} = useSelector((state) => state.chatRoom);
  const [state, setState] = useState({
    video: false,
    audio: false,
    screen: false,
    showModal: false,
    screenAvailable: false,
    messages: [],
    message: "",
    newmessages: 0,
    askForUsername: true,
    // Random data
    username: user?.fullName,
  });
  console.log(state);

  //   Asked Media: Audio, Screen, Camera
  const getPermissions = async () => {
    try {
      //   Ask media from user.
      await navigator.mediaDevices
        .getUserMedia({ video: true })
        .then(() => (videoAvailable = true))
        .catch(() => (videoAvailable = false));

      //   Ask audio from user.
      await navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then(() => (audioAvailable = true))
        .catch(() => (audioAvailable = false));

      // Share screen from user.
      if (navigator.mediaDevices.getDisplayMedia) {
        setState({ ...state, screenAvailable: true });
      } else {
        setState({ ...state, screenAvailable: false });
      }

      if (videoAvailable || audioAvailable) {
        navigator.mediaDevices
          .getUserMedia({ video: videoAvailable, audio: audioAvailable })
          .then((stream) => {
            window.localStream = stream;
            localVideoref.current.srcObject = stream;
          })
          // .then((stream) => {})
          .catch((e) => console.log(e));
      }
    } catch (e) {
      console.log(e);
    }
  };

  //   Get message from RTC
  const gotMessageFromServer = (fromId, message) => {
    var signal = JSON.parse(message);
    if (fromId !== socketId) {
      if (signal.sdp) {
        connections[fromId]
          .setRemoteDescription(new RTCSessionDescription(signal.sdp))
          .then(() => {
            if (signal.sdp.type === "offer") {
              connections[fromId]
                .createAnswer()
                .then((description) => {
                  connections[fromId]
                    .setLocalDescription(description)
                    .then(() => {
                      socket.emit(
                        "signal",
                        fromId,
                        JSON.stringify({
                          sdp: connections[fromId].localDescription,
                        })
                      );
                    })
                    .catch((e) => console.log(e));
                })
                .catch((e) => console.log(e));
            }
          })
          .catch((e) => console.log(e));
      }

      if (signal.ice) {
        connections[fromId]
          .addIceCandidate(new RTCIceCandidate(signal.ice))
          .catch((e) => console.log(e));
      }
    }
  };

  //   Change CSS Layout
  const changeCssVideos = (main) => {
    let widthMain = main.offsetWidth;
    let minWidth = "30%";
    if ((widthMain * 30) / 100 < 300) {
      minWidth = "300px";
    }
    let minHeight = "40%";

    let height = String(100 / elms) + "%";
    let width = "";
    if (elms === 0 || elms === 1) {
      width = "100%";
      height = "100%";
    } else if (elms === 2) {
      width = "45%";
      height = "100%";
    } else if (elms === 3 || elms === 4) {
      width = "35%";
      height = "50%";
    } else {
      width = String(100 / elms) + "%";
    }

    let videos = main.querySelectorAll("video");
    for (let a = 0; a < videos.length; ++a) {
      videos[a].style.minWidth = minWidth;
      videos[a].style.minHeight = minHeight;
      videos[a].style.setProperty("width", width);
      videos[a].style.setProperty("height", height);
    }

    return { minWidth, minHeight, width, height };
  };
  const silence = () => {
    let ctx = new AudioContext();
    let oscillator = ctx.createOscillator();
    let dst = oscillator.connect(ctx.createMediaStreamDestination());
    oscillator.start();
    ctx.resume();
    return Object.assign(dst.stream.getAudioTracks()[0], { enabled: false });
  };

  const black = ({ width = 640, height = 480 } = {}) => {
    let canvas = Object.assign(document.createElement("canvas"), {
      width,
      height,
    });
    canvas.getContext("2d").fillRect(0, 0, width, height);
    let stream = canvas.captureStream();
    return Object.assign(stream.getVideoTracks()[0], { enabled: false });
  };
  //   Process joinroom by socket

  const getUserMediaSuccess = (stream) => {
    try {
      window.localStream.getTracks().forEach((track) => track.stop());
    } catch (e) {
      console.log(e);
    }

    window.localStream = stream;
    localVideoref.current.srcObject = stream;
    // Duyet qua tung cai id trong c
    for (let id in connections) {
      if (id === socketId) continue;

      connections[id].addStream(window.localStream);

      connections[id].createOffer().then((description) => {
        connections[id]
          .setLocalDescription(description)
          .then(() => {
            socket.emit(
              "signal",
              id,
              JSON.stringify({ sdp: connections[id].localDescription })
            );
          })
          .catch((e) => console.log(e));
      });
    }

    stream.getTracks().forEach(
      (track) =>
        (track.onended = () => {
          setState((prevState) => {
            try {
              let tracks = localVideoref.current.srcObject.getTracks();
              tracks.forEach((track) => track.stop());
            } catch (e) {
              console.log(e);
            }

            let blackSilence = (...args) =>
              new MediaStream([black(...args), silence()]);
            window.localStream = blackSilence();
            localVideoref.current.srcObject = window.localStream;

            for (let id in connections) {
              connections[id].addStream(window.localStream);

              connections[id].createOffer().then((description) => {
                connections[id]
                  .setLocalDescription(description)
                  .then(() => {
                    socket.emit(
                      "signal",
                      id,
                      JSON.stringify({
                        sdp: connections[id].localDescription,
                      })
                    );
                  })
                  .catch((e) => console.log(e));
              });
            }
            return { ...prevState, video: false, audio: false };
          });
        })
    );
  };

  const getUserMedia = () => {
    if ((state.video && videoAvailable) || (state.audio && audioAvailable)) {
      navigator.mediaDevices
        .getUserMedia({ video: state.video, audio: state.audio })
        .then(getUserMediaSuccess)
        .then((stream) => {})
        .catch((e) => console.log(e));
    } else {
      try {
        let tracks = localVideoref.current.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
      } catch (e) {}
    }
  };

  const getMedia = () => {
    setState((prevState) => {
      return { ...prevState, video: videoAvailable, audio: audioAvailable };
    });
  };

  const getDislayMediaSuccess = (stream) => {
    try {
      window.localStream.getTracks().forEach((track) => track.stop());
    } catch (e) {
      console.log(e);
    }

    window.localStream = stream;
    localVideoref.current.srcObject = stream;

    for (let id in connections) {
      if (id === socketId) continue;

      connections[id].addStream(window.localStream);

      connections[id].createOffer().then((description) => {
        connections[id]
          .setLocalDescription(description)
          .then(() => {
            socket.emit(
              "signal",
              id,
              JSON.stringify({ sdp: connections[id].localDescription })
            );
          })
          .catch((e) => console.log(e));
      });
    }

    stream.getTracks().forEach(
      (track) =>
        (track.onended = () => {
          setState((prevState) => {
            try {
              let tracks = localVideoref.current.srcObject.getTracks();
              tracks.forEach((track) => track.stop());
            } catch (e) {
              console.log(e);
            }

            let blackSilence = (...args) =>
              new MediaStream([black(...args), silence()]);
            window.localStream = blackSilence();
            localVideoref.current.srcObject = window.localStream;
            getUserMedia();
            return {
              ...prevState,
              screen: false,
            };
          });
        })
    );
  };

  const getDislayMedia = () => {
    if (state.screen) {
      if (navigator.mediaDevices.getDisplayMedia) {
        navigator.mediaDevices
          .getDisplayMedia({ video: true, audio: true })
          .then(getDislayMediaSuccess)
          .then((stream) => {})
          .catch((e) => console.log(e));
      }
    }
  };

  const handleVideo = () =>
    setState((prevState) => {
      return { ...prevState, video: !prevState.video };
    });

  const handleAudio = () => setState({ ...state, audio: !state.audio });

  const handleScreen = () =>
    setState((prevState) => {
      return {
        ...prevState,
        screen: !prevState.screen,
        video: false,
      };
    });

  const handleEndCall = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, abort it!',
      cancelButtonText: 'No, cancel!'
    }).then((result) => {
      if (result.isConfirmed) {
        try {
          let tracks = localVideoref.current.srcObject.getTracks();
          tracks.forEach((track) => track.stop());
        } catch (e) {}
        socket.emit('abort trading', tradingId, roomId, user.username)
      }
    })
  };

  const openChat = () =>
    setState({ ...state, showModal: true, newmessages: 0 });
  const closeChat = () => setState({ ...state, showModal: false });
  const handleMessage = (e) => setState({ ...state, message: e.target.value });
  console.log(state);
  const addMessage = (data, sender, socketIdSender) => {
    console.log(data, sender, socketIdSender);
    setState((prevState) => ({
      ...prevState,
      messages: [...prevState.messages, { sender: sender, data: data }],
    }));

    // setState({...state, messages: [...state.messages,  { sender: sender, data: data }] })
    if (socketIdSender !== socketId) {
      // setState({...state, newmessages: state.newmessages + 1 })
      setState((prevState) => ({
        ...prevState,
        newmessages: prevState.newmessages + 1,
      }));
    }
  };

  const sendMessage = () => {
    socket.emit("chat-message", state.message, state.username);
    setState({ ...state, message: "", sender: state.username });
  };

  const connect = () =>
    setState((prevState) => {
      getMedia();
      return { ...prevState, askForUsername: false };
    });

  // webcam and mic
  useEffect(() => {
    getUserMedia();
  }, [state.video, state.audio]);

  //ask permission
  useEffect(() => {
    getMedia();
    getPermissions();
  }, []);

  //share screen
  useEffect(() => {
    getDislayMedia();
  }, [state.screen]);

  /// processing socket
  useEffect(() => {
    socket.on("signal", gotMessageFromServer);
    socket.emit("join-call", roomId);
    socketId = socket.id;
    socket.on("chat-message", addMessage);

    
    const handleUserLeft = (id) => {
      console.log(`${id} has left`);
      let video = document.querySelector(`[data-socket="${id}"]`);
      if (video !== null) {
        elms--;
        video.parentNode.removeChild(video);
        let main = document.getElementById("main");
        delete connections[id]
        changeCssVideos(main);
      }
    };

    const handleUserJoin = (id, clients) => {
    console.log("🚀 ~ file: index.jsx ~ line 431 ~ handleUserJoin ~ id, clients", id, clients)
      
      clients.forEach((socketListId) => {
        connections[socketListId] = new RTCPeerConnection(peerConnectionConfig);
        // Wait for their ice candidate
        connections[socketListId].onicecandidate = function (event) {
          if (event.candidate != null) {
            socket.emit(
              "signal",
              socketListId,
              JSON.stringify({ ice: event.candidate })
            );
          }
        };

        // Wait for their video stream
        connections[socketListId].onaddstream = (event) => {
          // TODO mute button, full screen button
          var searchVidep = document.querySelector(
            `[data-socket="${socketListId}"]`
          );
          if (searchVidep !== null) {
            // if i don't do this check it make an empyt square
            searchVidep.srcObject = event.stream;
          } else {
            elms = clients.length;
            let main = document.getElementById("main");
            let cssMesure = changeCssVideos(main);

            let video = document.createElement("video");

            let css = {
              minWidth: cssMesure.minWidth,
              minHeight: cssMesure.minHeight,
              maxHeight: "100%",
              margin: "10px",
              borderStyle: "solid",
              borderColor: "#bdbdbd",
              objectFit: "fill",
            };
            for (let i in css) video.style[i] = css[i];

            video.style.setProperty("width", cssMesure.width);
            video.style.setProperty("height", cssMesure.height);
            video.setAttribute("data-socket", socketListId);
            video.srcObject = event.stream;
            video.autoplay = true;
            video.playsinline = true;
            main.appendChild(video);
          }
        };

        // Add the local video stream
        if (window.localStream !== undefined && window.localStream !== null) {
          connections[socketListId].addStream(window.localStream);
        } else {
          let blackSilence = (...args) =>
            new MediaStream([black(...args), silence()]);
          window.localStream = blackSilence();
          connections[socketListId].addStream(window.localStream);
        }
      });

      if (id === socketId) {
        for (let id2 in connections) {
          if (id2 === socketId) continue;

          try {
            connections[id2].addStream(window.localStream);
          } catch (e) {}

          connections[id2].createOffer().then((description) => {
            connections[id2]
              .setLocalDescription(description)
              .then(() => {
                socket.emit(
                  "signal",
                  id2,
                  JSON.stringify({ sdp: connections[id2].localDescription })
                );
        })
              .catch((e) => console.log(e));
          });
        }
      }
    };

    const handleAbortTrading = (data) => {
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: data,
        showConfirmButton: false,
        timer: 1000
      })
      dispatch(abortTrading())
      history.push('/')
    }
    
    socket.on("user-left", handleUserLeft);
    socket.on("user-joined", handleUserJoin);
    socket.on('abort trading', handleAbortTrading)
    return () => {
      socket.off("signal", gotMessageFromServer);
      socket.off("chat-message", addMessage);
      socket.off("user-left", handleUserLeft);
      socket.off("user-joined", handleUserJoin);
      socket.off('abort trading', handleAbortTrading)
    };
  }, []);

  return (
    <div>
      <div>
        <div
          className="btn-down"
          style={{
            backgroundColor: "whitesmoke",
            color: "whitesmoke",
            textAlign: "center",
          }}
        >
          <IconButton style={{ color: "#424242" }} onClick={handleVideo}>
            {state.video === true ? <VideocamIcon /> : <VideocamOffIcon />}
          </IconButton>

          <IconButton style={{ color: "#f44336" }} onClick={handleEndCall}>
            <CallEndIcon />
          </IconButton>

          <IconButton style={{ color: "#424242" }} onClick={handleAudio}>
            {state.audio === true ? <MicIcon /> : <MicOffIcon />}
          </IconButton>

          {state.screenAvailable === true ? (
            <IconButton style={{ color: "#424242" }} onClick={handleScreen}>
              {state.screen === true ? (
                <ScreenShareIcon />
              ) : (
                <StopScreenShareIcon />
              )}
            </IconButton>
          ) : null}

          <Badge
            badgeContent={state.newmessages}
            max={999}
            color="secondary"
            onClick={openChat}
          >
            <IconButton style={{ color: "#424242" }} onClick={openChat}>
              <ChatIcon />
            </IconButton>
          </Badge>
        </div>

        <Modal
          show={state.showModal}
          onHide={closeChat}
          style={{ zIndex: "999999" }}
        >
          <Modal.Header closeButton>
            <Modal.Title>Chat Room</Modal.Title>
          </Modal.Header>
          <Modal.Body
            style={{
              overflow: "auto",
              overflowY: "auto",
              height: "400px",
              textAlign: "left",
            }}
          >
            {state.messages.length > 0 ? (
              state.messages.map((item, index) => (
                <div key={index} style={{ textAlign: "left" }}>
                  <p style={{ wordBreak: "break-all" }}>
                    <b>{item.sender}</b>: {item.data}
                  </p>
                </div>
              ))
            ) : (
              <p>No message yet</p>
            )}
          </Modal.Body>
          <Modal.Footer className="div-send-msg">
            <Input
              placeholder="Message"
              value={state.message}
              onChange={(e) => handleMessage(e)}
            />
            <Button variant="contained" color="primary" onClick={sendMessage}>
              Send
            </Button>
          </Modal.Footer>
        </Modal>

        <div className="container-layout">
          <div
            id="main"
            className="flex-container"
            style={{ margin: 0, padding: 0 }}
          >
            <video
              id="my-video"
              ref={localVideoref}
              autoPlay
              muted
              style={{
                borderStyle: "solid",
                borderColor: "#bdbdbd",
                margin: "10px",
                objectFit: "fill",
                width: "100%",
                height: "100%",
              }}
            ></video>
          </div>
        </div>
      </div>
    </div>
  );
}
