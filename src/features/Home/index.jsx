import Header from 'components/Header'
import React from 'react'
import CarouselHeader from './Carousel'
import ContentHome from './ContentHome'
import './Home.scss'

function Home() {
    return (
        <div className="home__main">
            <Header/>
            <CarouselHeader/>
            <ContentHome/>
        </div>
    )
}

export default Home
