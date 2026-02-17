import { useMemo, useState } from "react";
import AliceCarousel from "react-alice-carousel";
import { ArrowLeft, ArrowRight } from "lucide-react";
import "react-alice-carousel/lib/alice-carousel.css";
import ProductCard from "../components/ProductCard"; // Make sure path is correct

const CartCarousel = ({ data, sectionName }) => {
    const [activeIndex, setActiveIndex] = useState(0);

    const responsive = {
        0: { items: 1 },
        720: { items: 3 },
        1024: { items: 4 },
    };

    const items = useMemo(() => {
        return data.slice(0, 20).map((item, index) => (
            <div className="mx-4">
                <ProductCard key={index} product={item} />
            </div>
        ));
    }, [data]);

    const slidePrev = () => {
        if (activeIndex > 0) setActiveIndex(activeIndex - 1);
    };

    const slideNext = () => {
        if (activeIndex < items.length - 1) setActiveIndex(activeIndex + 1);
    };

    const syncActiveIndex = ({ item }) => {
        setActiveIndex(item);
    };

    return (
        <div className="relative px-4 lg:px-8 border">
            <h2 className="text-2xl font-extrabold text-gray-800 py-5">
                {sectionName}
            </h2>

            <div className="relative p-5">
                <AliceCarousel
                    key={activeIndex}
                    items={items}
                    disableButtonsControls
                    responsive={responsive}
                    disableDotsControls
                    onSlideChanged={syncActiveIndex}
                    activeIndex={activeIndex}
                    animationType="fadeout"
                    animationDuration={800}
                />

                {/* NEXT BUTTON */}
                {activeIndex !== items.length - 5 && (
                    <button
                        onClick={slideNext}
                        className="absolute top-1/2 -right-4 z-50 transform -translate-y-1/2 p-3 bg-white rounded-md shadow-md hover:shadow-xl transition-all border border-gray-100"
                        aria-label="next"
                    >
                        <ArrowRight size={20} className="text-gray-800" />
                    </button>
                )}

                {/* PREV BUTTON */}
                {activeIndex !== 0 && (
                    <button
                        onClick={slidePrev}
                        className="absolute top-1/2 -left-4 z-50 transform -translate-y-1/2 p-3 bg-white rounded-md shadow-md hover:shadow-xl transition-all border border-gray-100"
                        aria-label="prev"
                    >
                        <ArrowLeft size={20} className="text-gray-800" />
                    </button>
                )}
            </div>
        </div>
    );
};

export default CartCarousel;
