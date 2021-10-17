import React from "react";
import { Link } from "react-router-dom";
import "./PageNotFound.scss";
export default function PageNotFound() {
  
  return (
    <div id="notfound">
      <div className="notfound">
        <div className="notfound-404">
          <h1>Oops!</h1>
        </div>
        <h2>404 - Trang không tồn tại</h2>
        <p>Nội dung này đã bị gỡ hoặc không tồn tại.</p>
        <Link to="/">Trang chủ</Link>
      </div>
    </div>
  );
}
