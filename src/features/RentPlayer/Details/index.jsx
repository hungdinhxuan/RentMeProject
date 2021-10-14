import React, { useEffect, useState } from "react";
import { useHistory, useRouteMatch } from "react-router";
import { Image, Rate, Avatar } from "antd";
import "./Details.scss";
import Ha from "assets/Ha.jpg";
import { useDispatch, useSelector } from "react-redux";
import { AsyncLoadPlayerDetails } from "../PlayerSlice";
import "./Details.scss";

export default function PlayerDetails() {
  const match = useRouteMatch();
  const history = useHistory();
  const [visible, setVisible] = useState(false);

  // console.log(location);
  const { player, error } = useSelector((state) => state.players);

  if (error) {
    history.push("/error");
  }
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(AsyncLoadPlayerDetails(match.params.cardId));
  }, [dispatch, match.params.cardId]);

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
                    {player?.albums.map((item, index) => (
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
                  <i class="bi bi-facebook"></i>
                </a>
              </div>
              <div className="member-since">
                <span>Join Date: </span>
                <span>1/3/2021</span>
              </div>
            </div>

            <div className="player__profile--right col-lg-3 order-lg-2">
              <p className="price-profile">{player?.pricePerHour}.00 USD/G</p>
              <div className="rate-profile">
                <Rate
                  value={5}
                  count={5}
                  disabled
                  style={{ fontSize: "16px" }}
                />
              </div>
              <div className="action-profile">
                <button className="btn-style purple">Rent</button>
                <button className="btn-style white">Donate</button>
                <button className="btn-style white">Chat</button>
              </div>
            </div>
            <div className="player__profile--main col-lg-6 order-lg-1">
              <div className="name-profile">
                <div className="center-item col-lg-12">
                  <span className="name__player">{player?.nickname} </span>
                  <button className="btn-follow-player">Follow Me</button>
                </div>
              </div>
              <div className="nav-player-profile row">
                <div className="col-lg-3 col-6">
                  <div className="nav__item-name">
                    <span>Followers</span>
                  </div>
                  <div className="nav__item-value">82 people</div>
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
                    src="https://www.youtube.com/embed/1WLSitEnnCg"
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
                <div className="col-lg-12">
                  <div className="fullsize">
                    <div className="comment-image">
                      <Avatar src={Ha} size={40} />
                    </div>
                    <div className="comment-content">
                      <div className="review-content">
                        <p>Aix</p>
                        <p className="review-time">23:47:55, 1/10/2021</p>
                        <p className="content-player-comment">
                          You are the number one.
                        </p>
                      </div>
                      <div className="review-rating">
                        <Rate
                          value={5}
                          count={5}
                          disabled
                          style={{ fontSize: "14px" }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-12"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Responsive video youtube: height - 230px < 576px;
