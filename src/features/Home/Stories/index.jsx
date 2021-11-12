import React, {memo} from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Navigation,Autoplay } from "swiper";
import "swiper/swiper.min.css";

// // swiper core styles

// // modules styles
import "swiper/components/navigation/navigation.min.css";
// import "swiper/components/pagination/pagination.min.css";
import "./Stories.scss";
import Hiu from "assets/Hiu.jpg";
import Ha from "assets/Ha.jpg";
import Khoa from "assets/Khoa.jpg";
import TeacherBa from "assets/TeacherBa.jpg";

SwiperCore.use([Navigation,Autoplay]);
// SwiperCore.use([Navigation]);

function Stories() {
  return (
    <div
      className="container__content"
      style={{ color: "#fff" }}
      data-aos="fade-up"
      data-aos-duration="1000"
    >
      <div className="stories">
        <div className="stories__title">Cảm nhận của người sử dụng</div>
        <div className="stories__content ">
          <Swiper
            navigation={false}
            className="mySwiper"
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
          >
            <SwiperSlide>
              <div className="stories__card">
                <div className="card__content">
                  <div className="stories__card--avatar">
                    <div>
                      <img
                        src={TeacherBa}
                        alt="TeacherBa"
                        className="img-stories"
                      />
                    </div>
                  </div>
                  <div className="stories__card--infor">
                    <div className="infor__name">Teacher Ba</div>
                    <div className="infor__desc">
                      💘 Đây là 1 trang web thú vị. Nó giúp mọi người gắn kết
                      với nhau hơn, hãy tin Thầy rồi các em sẽ có những trải
                      nghiệm tốt nhất.Chúng ta hãy chung tay để xây dựng 1 cộng
                      đồng games lớn mạnh.💘
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="stories__card">
                <div className="card__content">
                  <div className="stories__card--avatar">
                    <div>
                      <img src={Ha} alt="Ha" className="img-stories" />
                    </div>
                  </div>
                  <div className="stories__card--infor">
                    <div className="infor__name">💗Khánh Hà💗</div>
                    <div className="infor__desc">
                      Rentme cho tôi một tương lai để mong đợi. Một tương lai mà
                      Pg được nhiều người biết đến và tôn trọng vì thời gian và
                      công sức mà tôi đã bỏ ra, giống như những người khác. Mục
                      tiêu của tôi là có thể giúp đỡ bố mẹ về mặt tài chính khi
                      tôi ở xa họ.
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="stories__card">
                <div className="card__content">
                  <div className="stories__card--avatar">
                    <div>
                      <img src={Khoa} alt="Khoa" className="img-stories" />
                    </div>
                  </div>
                  <div className="stories__card--infor">
                    <div className="infor__name">Chị Đại ^^</div>
                    <div className="infor__desc">
                      Đây là một trong những cách mà bạn có thể kiếm được cho
                      mình những khoảng thu nhập hàng tháng. Rentme.games là 1
                      trang web đáng để sử dụng.
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="stories__card">
                <div className="card__content">
                  <div className="stories__card--avatar">
                    <div>
                      <img src={Hiu} alt="Hiu" className="img-stories" />
                    </div>
                  </div>
                  <div className="stories__card--infor">
                    <div className="infor__name">💗Hiu Hiu💗</div>
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
          </Swiper>
          <div className="arrow-prev"></div>
          <div className="arrow-next"></div>
        </div>
      </div>
    </div>
  );
}

export default memo(Stories);
