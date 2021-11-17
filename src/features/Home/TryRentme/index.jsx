import React, { memo } from "react";
import "./TryRentme.scss";

function TryRentme() {
  return (
    <div
      className="container__content"
      id="try__rentme"
      data-aos="fade-up"
      data-aos-duration="1000"
    >
      <div className="try__content">
        <div className="try__content--title">
          Join RentMe now with 3 easy steps
        </div>
        <div className="try__content--steps row">
          <div className="col-lg-4 col-sm-12">
            <div className="content__steps--items items__1">
              
            </div>
          </div>
          <div className="col-lg-4 col-sm-12">
            <div className="content__steps--items items__2">
              
            </div>
          </div>
          <div className="col-lg-4 col-sm-12">
            <div className="content__steps--items items__3">
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(TryRentme);
