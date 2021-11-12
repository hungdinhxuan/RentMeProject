import React, { useEffect, useState, useRef} from "react";
import { useHistory, useRouteMatch, useParams } from "react-router";
import { Image, Rate, Avatar } from "antd";
import "./Details.scss";
import { useDispatch, useSelector } from "react-redux";
import { AsyncLoadPlayerDetails, AsyncGetReviews, AsyncDonateMoney, AsyncFollowPlayer} from "../PlayerSlice";
import "./Details.scss";
import { Modal, Button, Select } from "antd";
import socket from "utils/socket";
import Swal from "sweetalert2";
import timeAgo from "utils/timeAgo"
import getRandomVideoYoutube from "utils/randomVideoYoutube";
import {addNewPrivateChat, loadConversations, setOther} from "features/PrivateChat/PrivateChatSlice";

export default function PlayerDetails() {
  const dispatch = useDispatch();
  const match = useRouteMatch();
  const params = useParams();
  const history = useHistory();
  const [visible, setVisible] = useState(false);
  const ref = useRef("EcZ1OCJECvY");
  const { Option } = Select;

  const { player, error, reviews } = useSelector((state) => state.players);
  const { user } = useSelector((state) => state.auth);
  const [moneyState, setMoneyState] = useState("");
  const [formRentPlayer, setformRentPlayer] = useState({
    renterId: "",
    playerId: "",
    money: "",
    time: 1,
  });

  if (error) {
    history.push("/error");
  }
  

  const handleDonate = async () => {
    let { value: money } =  await Swal.fire({
      title: 'Enter the amount you want to donate',
      input: 'text',
    })
    money = parseInt(money)
    if (money) {
      if(money > user.balance){
        Swal.fire({title: "You don't have enough money to donate", icon: "error"})
      }else{
        dispatch(AsyncDonateMoney({id: params.cardId, money}))
      }
    }else{
      Swal.fire({title: "Please input money valid", icon: "error"})
    }
  }
  // Modal rent player
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleSubmit = () => {
    if (user.balance > (moneyState || player?.pricePerHour)) {
      if (formRentPlayer.money && formRentPlayer.time) {
        console.log({
          ...formRentPlayer,
          renterId: user._id,
          playerId: player.user._id,
        });
        socket.emit("rent player", {
          ...formRentPlayer,
          renterId: user._id,
          playerId: player.user._id,
        });
      } else {
        socket.emit("rent player", {
          time: 1,
          money: player.pricePerHour,
          renterId: user._id,
          playerId: player.user._id,
        });
      }
    } else {
      Swal.fire({
        position: "center",
        icon: "info",
        title: "Not enough money",
        showConfirmButton: false,
        timer: 1000,
      });
    }
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleChangeHours = (values) => {
    setMoneyState(player?.pricePerHour * values);
    setformRentPlayer({
      ...formRentPlayer,
      time: values,
      money: player?.pricePerHour * values,
    });
  };

  const handleFollow = () => {
    dispatch(AsyncFollowPlayer(params.cardId))
  }

  const handleMoreAmount = () => {
    history.push("/setting/wallet");
  };

  const AverageRating = (data) => {
    const a = data.reduce((prev, current) => {
      return prev + current.rating;
    }, 0);
    const DecimalString = ((a / data.length) * 1.0).toString();
    if (DecimalString.split(".")[1] > 5) {
      return Math.ceil(a / data.length);
    } else {
      return Math.floor(a / data.length);
    }
  };

  const handleStartPrivateChat = () => {
    dispatch(addNewPrivateChat({
      otherId: player.user._id,
      otherAvatar: player.user.avatar,
      otherFullName: player.user.fullName
    }))
    dispatch(setOther({
      otherId: player.user._id,
      otherAvatar: player.user.avatar,
      otherFullName: player.user.fullName,
      isOnline: player.user.isOnline
    }))
    dispatch(loadConversations())
  }

  useEffect(() => {
    dispatch(AsyncLoadPlayerDetails(match.params.cardId));
  }, [dispatch, match.params.cardId], player?.user?.follower);

  // const test = AverageRating(reviews);
  // console.log(test);

  useEffect(() => {
    dispatch(AsyncGetReviews(params.cardId));
  }, [dispatch, params.cardId]);

  useEffect(() => {

    getRandomVideoYoutube().then((res) => {
      ref.current = res
    })    
  }, [])

  return (
    <div className="details">
      <div className="wrapper">
        <div className="details__container">
          <div className="player__items row">
            <div className="player__profile--left col-lg-3">
              <div className="avatar">
                <Image
                  preview={{ visible: false }}
                  width={260}
                  height={260}
                  style={{ objectFit: "cover", borderRadius: "10px" }}
                  src={player?.coverBackground}
                  onClick={() => setVisible(true)}
                />
                <div style={{ display: "none" }}>
                  <Image.PreviewGroup
                    preview={{
                      visible,
                      onVisibleChange: (vis) => setVisible(vis),
                    }}
                  >
                    {player?.albums?.map((item, index) => (
                      <Image key={index} src={item} />
                    ))}
                  </Image.PreviewGroup>
                </div>
              </div>
              <div className="rent-time">
                {player?.user.isOnline ? (
                  <p>I'm ready</p>
                ) : (
                  <p style={{ color: "red" }}>I'm offline</p>
                )}
              </div>
              <div className="social-icon">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="bi bi-facebook"></i>
                </a>
              </div>
              <div className="member-since">
                <span>Join Date: </span>
                <span>{new Date(player?.createdAt).toDateString()}</span>
              </div>
            </div>

            <div className="player__profile--right col-lg-3 order-lg-2">
              <p className="price-profile">{player?.pricePerHour}.00 USD/G</p>
              <div className="rate-profile">
                <Rate
                  value={AverageRating(reviews)}
                  count={5}
                  disabled
                  style={{ fontSize: "16px" }}
                />
              </div>
              <div className="action-profile">
                <button className="btn-style purple" onClick={showModal}>
                  Rent
                </button>
                <button className="btn-style white" onClick={handleDonate}>Donate</button>
                <button className="btn-style white" onClick={handleStartPrivateChat}>Chat</button>
              </div>
            </div>
            <div className="player__profile--main col-lg-6 order-lg-1">
              <div className="name-profile">
                <div className="center-item col-lg-12">
                  <span className="name__player">{player?.nickname} </span>
                  {player?.user?.follower?.indexOf(user._id) === -1 ?
                  <button className="btn-follow-player" onClick={handleFollow}>Following Me</button> : <button className="btn-follow-player" onClick={handleFollow}>Unfollowing me</button> 
                  }
                </div>
              </div>
              <div className="nav-player-profile row">
                <div className="col-lg-3 col-6">
                  <div className="nav__item-name">
                    <span>Followers</span>
                  </div>
                  <div className="nav__item-value">{player?.user?.follower?.length} people</div>
                </div>
                <div className="col-lg-3 col-6">
                  <div className="nav__item-name">
                    <span>Rented</span>
                  </div>
                  <div className="nav__item-value">1000 hours</div>
                </div>
                <div className="col-lg-3 col-6">
                  <div className="nav__item-name">
                    <span>Finish Time</span>
                  </div>
                  <div className="nav__item-value">100%</div>
                </div>
                <div className="col-lg-3 col-6">
                  <div className="nav__item-name">
                    <span>Recommended</span>
                  </div>
                  <div className="nav__item-value">100 people</div>
                </div>
              </div>
              <hr />
              <div className="title-player-profile">
                <span>Information</span>
              </div>
              <div className="content-player-profile">
                <p>
                  Thuê đi, nhìn cái gì. Ơ kìa 🌸.Hát hò, LOL, ĐTCL, Aram,
                  Business Tour, Call mess.
                  {player?.shortDesc}
                </p>
                <p>{player?.longDesc}</p>
              </div>
              <div className="video-player-profile title-player-profile row">
                <div className="col-12">
                  <iframe
                    width="100%"
                    height="350"
                    src={`https://www.youtube.com/embed/${ref.current}`}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
              <div className="title-player-profile">
                <span>Comment</span>
              </div>
              <div className="text-center comment-player-profile">
                {reviews?.map((review,index) => (
                  <div className="col-lg-12" key={review._id}>
                    <div className="fullsize">
                      <div className="comment-image">
                        <Avatar src={review.userId.avatar} size={40} />
                      </div>
                      <div className="comment-content">
                        <div className="review-content">
                          <p>{review.userId.fullName}</p>
                          <p className="review-time">
                            {timeAgo(new Date(review.createdAt))}
                          </p>
                          <p className="content-player-comment">
                            {review.content}
                          </p>
                        </div>
                        <div className="review-rating">
                          <Rate
                            value={review.rating}
                            count={5}
                            disabled
                            style={{ fontSize: "14px" }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal
        title="Rent Player"
        visible={isModalVisible}
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
        <table>
          <tr>
            <td>Player: </td>
            <td>{player?.nickname}</td>
          </tr>
          <tr>
            <td>Rent Time: </td>
            <td>
              <Select defaultValue="1" onChange={handleChangeHours}>
                {[...Array(25)].map((x, i) =>
                  i ? (
                    <Option value={i} key={i}>
                      {i}h
                    </Option>
                  ) : (
                    ""
                  )
                )}
              </Select>
            </td>
          </tr>
          <tr>
            <td>Final price: </td>
            <td>{moneyState || player?.pricePerHour} usd</td>
          </tr>
          <tr>
            <td>Current balance: </td>
            <td>
              <span className="total-amount">{user?.balance}usd</span>
              <span className="more-amount" onClick={handleMoreAmount}>
                +
              </span>
            </td>
          </tr>
        </table>
      </Modal>
    </div>
  );
}

// Responsive video youtube: height - 230px < 576px;
