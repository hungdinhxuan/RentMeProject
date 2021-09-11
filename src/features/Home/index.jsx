import Header from "components/Header";
import React from "react";
import CarouselHeader from "./Carousel";
import ContentHome from "./ContentHome";
import "./Home.scss";
import Stories from "./Stories";

function Home() {
  return (
    <div className="home__main">
      <Header />
      <div className="home__body">
        <CarouselHeader />
        <ContentHome />
        <Stories />
        <div className="bg__home"></div>
      </div>
    </div>
  );
}

export default Home;
