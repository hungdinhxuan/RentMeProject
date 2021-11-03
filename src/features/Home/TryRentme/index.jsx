import React, {memo} from "react";
import "./TryRentme.scss";

function TryRentme() {
  return (
    <div className="container__content" id="try__rentme" data-aos="fade-up" data-aos-duration="1000">
      <div className="try__content">
        <div className="try__content--title">
          Trải nghiệm ngay RentMe với 3 bước dễ dàng
        </div>
        <div className="try__content--steps row">
          <div className="col-lg-4 col-sm-12">
            <div className="content__steps--items items__1">
              <div className="text">Chọn dịch vụ</div>
            </div>
          </div>
          <div className="col-lg-4 col-sm-12">
            <div className="content__steps--items items__2">
              <div className="text">Chọn thuê người chơi</div>
            </div>
          </div>
          <div className="col-lg-4 col-sm-12">
            <div className="content__steps--items items__3">
              <div className="text">Xác nhận giao dịch</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(TryRentme);
