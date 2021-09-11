import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Navigation } from "swiper";
import "swiper/swiper.min.css";

// // swiper core styles

// // modules styles
import "swiper/components/navigation/navigation.min.css";
// import "swiper/components/pagination/pagination.min.css";
import "./Stories.scss";
import Bee from "assets/Bee.jpg";

SwiperCore.use([Navigation]);
// SwiperCore.use([Navigation]);

function Stories() {
  return (
    <div className="container__content" style={{ color: "#fff" }} data-aos="fade-up" data-aos-duration="1000">
      <div className="stories">
        <div className="stories__title">Cảm nhận của người sử dụng</div>
        <div className="stories__content ">
          <Swiper navigation={false} className="mySwiper">
            <SwiperSlide>
              <div className="stories__card">
                <div className="card__content">
                  <div className="stories__card--avatar">
                    <div>
                      <img src={Bee} alt="Bee" className="img-stories" />
                    </div>
                  </div>
                  <div className="stories__card--infor">
                    <div className="infor__name">💗Bee Bee💗</div>
                    <div className="infor__desc">
                      Tôi không bao giờ mong đợi internet là một nơi tuyệt vời,
                      ấm áp và thoải mái như vậy. Rentme.games đã cho tôi cơ hội
                      để cảm thấy mình là một phần của một cộng đồng lớn và dễ
                      chịu ngay cả trong thời gian sinh hoạt. Tôi chắc chắn có
                      thể nói rằng tôi đã tìm thấy gia đình chơi game của mình ở
                      đây, họ đã chào đón tôi với vòng tay rộng mở.
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>Slide 2</SwiperSlide>
            <SwiperSlide>Slide 3</SwiperSlide>
            <SwiperSlide>Slide 4</SwiperSlide>
          </Swiper>
          <div className="arrow-prev"></div>
          <div className="arrow-next"></div>
        </div>
      </div>
    </div>
  );
}

export default Stories;
