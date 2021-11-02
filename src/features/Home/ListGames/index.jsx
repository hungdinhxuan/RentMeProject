import React, {memo} from "react";

import Games from "constants/Games";
import shadow from "assets/ListGames/shadow.png";
import Slider from "react-slick";
import { NavLink } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./ListGames.scss";

const settings = {
  dots: false,
  className: "slider variable-width",
  infinite: true,
  slidesToShow: 3,
  slidesToScroll: 1,
  autoplay: true,
  speed: 2000,
  autoplaySpeed: 1000,
  cssEase: "linear",
  variableWidth: true,
};

const settings1 = {
  dots: false,
  className: "slider variable-width",
  infinite: true,
  slidesToShow: 3,
  slidesToScroll: -1,
  autoplay: true,
  speed: 2000,
  autoplaySpeed: 1000,
  cssEase: "linear",
  variableWidth: true,
};
function ListGame() {
  return (
    <div className="listgames" data-aos="fade-up" data-aos-duration="1000">
      <div className="listgames__content">
        <div className="list">
          <div className="swiperList">
            <img src={shadow} alt="Shadow" className="shadow--background" />
            <Slider {...settings}>
              {Games.map((values, index) => (
                <div key={index} style={{ width: 200 }}>
                  <NavLink to={`/${values.name}`}>
                    <img
                      src={values.img}
                      alt={values.name}
                      style={{
                        width: "120px",
                        height: "160px",
                        objectFit: "cover",
                      }}
                    />
                  </NavLink>
                </div>
              ))}
            </Slider>

            <img
              src={shadow}
              alt="Shadow"
              className="shadowRight--background"
            />
          </div>
          <div className="swiperList">
            <img src={shadow} alt="Shadow" className="shadow--background" />
            <Slider {...settings1}>
              {Games.map((values, index) => (
                <div key={index} style={{ width: 200 }}>
                  <NavLink to={`/${values.name}`}>
                    <img
                      src={values.img}
                      alt={values.name}
                      style={{
                        width: "120px",
                        height: "160px",
                        objectFit: "cover",
                      }}
                    />
                  </NavLink>
                </div>
              ))}
            </Slider>

            <img
              src={shadow}
              alt="Shadow"
              className="shadowRight--background"
            />
          </div>
        </div>
        <div className="footer__listgames ">
          <p className="text text-center">
            RentMe hiện đang có rất nhiều điều thú vị đang chờ bạn trải nghiệm
          </p>
        </div>
      </div>
    </div>
  );
}

export default memo(ListGame);
