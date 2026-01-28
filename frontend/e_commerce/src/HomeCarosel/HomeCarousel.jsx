import React from "react"
import AliceCarousel from "react-alice-carousel"
import "react-alice-carousel/lib/alice-carousel.css"
import carouselData from "../pages/CarouselData"

const items = carouselData.map(item => (

    <img
        key={item.id}
        className="cursor-pointer w-full h-[40vh] sm:h-[50vh] md:h-[60vh] lg:h-[80vh] object-cover object-top"
        role="presentation"
        src={item.image}
        alt="carousel"
    // Change: Removed inline styles (height: 100vh) which were causing zooming/cutting issues.
    // Reason: Used responsive Tailwind classes (h-[40vh] to lg:h-[80vh]) to adjust height based on screen size,
    // and 'object-cover object-top' to ensure the image fills the area while keeping the important top part visible.
    />

))
console.log(items);

const HomeCarousel = () => (
    <AliceCarousel

        infinite
        autoPlay
        autoPlayInterval={1400}
        disableButtonsControls
        items={items}
    />
)

export default HomeCarousel
