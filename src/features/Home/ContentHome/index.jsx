import React from "react";
import { useHistory } from "react-router";
import "./ContentHome.scss";
// import AOS from "aos";

function ContentHome() {
  const history = useHistory();
  return (
    <div className="container__content" data-aos="fade-up" data-aos-duration="1000">
      <div className="content__services">
        <div className="main__services">
          <div className="main__services--title">
            Personalized service for both in-game and life
          </div>
          <div className="main__services--content row">
            <div className="left__items col-6">
              <div>
                <div className="left__items--games mb-3">
                  <div className="game__title">* Trò chơi</div>
                  <div className="games__infor mt-2">
                    <p>1 on 1, Coaching, Matching, Team up, Streamer</p>
                    <div className="d-flex align-items-center">
                      <div className="game__infor--items">
                        <div>DUNGEON CRAWL</div>
                      </div>
                      <div className="game__infor--items">
                        <div>GRINDING RANKED</div>
                      </div>
                      <div className="game__infor--items">
                        <div>LOOT AND SHOOT</div>
                      </div>
                      <div className="game__infor--items">
                        <div>TANK DAMAGE FOR YOU</div>
                      </div>
                      <div className="game__infor--items">
                        <div>YOUR POCKET HEALER</div>
                      </div>
                      <div className="game__infor--items">
                        <div>HARD CARRY</div>
                      </div>
                      <div className="game__infor--items">
                        <div>PERFECT TEAMWORK</div>
                      </div>
                      <div className="game__infor--items">
                        <div>GREAT CONVERSATION</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="left__items--lifestyle mb-3">
                  <div className="game__title">* Phong cách</div>
                  <div className="games__infor mt-2">
                    <p>Find ePals to carry and enrich your life</p>
                    <div className="d-flex align-items-center">
                      <div className="game__infor--items">
                        <div>VOICE CHAT</div>
                      </div>
                      <div className="game__infor--items">
                        <div>KARAOKE</div>
                      </div>
                      <div className="game__infor--items">
                        <div>WATCH MOVIES TOGETHER</div>
                      </div>
                      <div className="game__infor--items">
                        <div>RELATIONSHIP ADVICE</div>
                      </div>
                      <div className="game__infor--items">
                        <div>EMOTIONAL SUPPORT</div>
                      </div>
                      <div className="game__infor--items">
                        <div>WAKE-UP CALL</div>
                      </div>
                      <div className="game__infor--items">
                        <div>SLEEP CALL</div>
                      </div>
                      <div className="game__infor--items">
                        <div>ASMR</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="button__search">
                <button
                  className="button-purple"
                  onClick={() => {
                    history.push("/signin");
                  }}
                >
                  <span>Try it out now</span>
                </button>
              </div>
            </div>
            <div className="right__items col-6">
              <div className="video">
                <iframe
                  width="640"
                  height="360"
                  src="https://www.youtube.com/embed/En-BbdqsNmQ"
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="youtube__video"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContentHome;
