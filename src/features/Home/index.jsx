import Footer from "components/Footer";
import CarouselHeader from "./Carousel";
import ContentHome from "./ContentHome";
import "./Home.scss";
import ListGame from "./ListGames";
import Stories from "./Stories";
import TryRentme from "./TryRentme";

import { Modal, Button, Rate } from "antd";
import { useState } from "react";
function Home() {
  window.onunload = () => {
    window.scrollTo(0, 0);
  };
  const [visible, setVisible] = useState(true);
  const [rate, setRate] = useState(5);
  const handleOk = () => {};

  const handleCancel = () => {};
  const handleChange = (value) => {
    setRate(value);
    
  };

  return (
    <div className="home__main">
      <div className="home__body">
        <CarouselHeader />
        <ContentHome />
        <Stories />
        <TryRentme />
        <ListGame />
        <div className="bg__home"></div>
      </div>
      <Footer />
      <Modal
        title="Experience yourself"
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Rate onChange={handleChange} value={rate} />
        <textarea className="text-center" style={{display: "block"}} onChange={(e) => console.log(e.target.value)}/>
      </Modal>
    </div>
  );
}

export default Home;
