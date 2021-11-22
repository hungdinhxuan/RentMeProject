import React from "react";
import "./Footer.scss";
import LogoFooter from "assets/footer.png";

export default function Footer() {
  return (
    <footer>
      <div className="footer__container">
        <div className="intro">
          <div className="intro--content">
            <img src="/rentme.png" alt="Logo" className="logo__footer" />
            <div className="desc">
              <div className="title">RENTME FOUNDED</div>
              <p>Product © 2021 </p>
              Co-founder: Xuân Hùng, Đình Khang
            </div>
          </div>
        </div>
        <div className="logo ">
          <div className="logo__img">
            <img src={LogoFooter} alt="Logo" />
          </div>
        </div>
      </div>
    </footer>
  );
}
