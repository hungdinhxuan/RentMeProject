import Footer from "components/Footer";
import Header from "components/Header";
import React from "react";
import CarouselHeader from "./Carousel";
import ContentHome from "./ContentHome";
import "./Home.scss";
import ListGame from "./ListGames";
import Stories from "./Stories";
import TryRentme from "./TryRentme";


function Home() {
  window.onunload = () => {
    window.scrollTo(0, 0);
  };

  return (
    <div className="home__main">
      <Header />
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
