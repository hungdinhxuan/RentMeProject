import Footer from "components/Footer";
import Header from "components/Header";
import React, { useEffect } from "react";
import CarouselHeader from "./Carousel";
import ContentHome from "./ContentHome";
import "./Home.scss";
import ListGame from "./ListGames";
import Stories from "./Stories";
import TryRentme from "./TryRentme";
import { useDispatch, useSelector } from "react-redux";


function Home() {

  window.onunload = () => {
    window.scrollTo(0, 0);
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
    </div>
  );
}

export default Home;
