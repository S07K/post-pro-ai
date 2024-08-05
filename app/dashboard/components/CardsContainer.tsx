import PostCard from "./Card";

const Cards = [
    {
        id: 1,
        caption: "🌄✨ Just when you think you've seen it all, nature unveils its masterpiece! This breathtaking view captures the grandeur of towering peaks, their snow-capped summits glistening under the golden rays of the sun.",
        image: "https://plus.unsplash.com/premium_photo-1676218968741-8179dd7e533f?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        likes: 10,
        comments: 3,
        shares: 4
    },
    {
        id: 2,
        caption: "🌊✨ Dive into the captivating beauty of the sea! This stunning photo captures the shimmering waves as they dance under the sun, creating a mesmerizing palette of blues and greens.",
        image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2973&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        likes: 10,
        comments: 3,
        shares: 4
    },
    {
        id: 3,
        caption: "🏔️✨ Standing atop this majestic mountain, I'm greeted by a breathtaking panorama that stretches as far as the eye can see. The crisp mountain air fills my lungs, invigorating my spirit as I take in the stunning landscape below. ",
        image: "https://plus.unsplash.com/premium_photo-1676139859069-c67c27d3abb9?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        likes: 10,
        comments: 3,
        shares: 4
    },
    {
        id: 4,
        caption: "Times Square, the iconic intersection of Broadway, 7th Avenue, and 42nd Street in New York City, is a must-visit destination for anyone exploring the Big Apple.",
        image: "https://images.unsplash.com/photo-1564715474218-1c628825ffc2?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        likes: 10,
        comments: 3,
        shares: 4
    },
    {
        id: 5,
        caption: "🏔️❄️ Imagine a world blanketed in pristine white, where the only sounds are the crunch of snow beneath your feet and the gentle whisper of the wind.",
        image: "https://images.unsplash.com/photo-1526991757821-1307bf7800f6?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        likes: 10,
        comments: 3,
        shares: 4
    }
]

const CardsContainer: React.FC = () => {
    return (
        <div className="flex overflow-auto hide-scroll gap-6 pt-4">
            {
                Cards.map((card) => (
                    <PostCard key={card.id} cardDetails={card} />
                ))
            }
        </div>
    );
};

export default CardsContainer;