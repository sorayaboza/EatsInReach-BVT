"use client"

import { useState } from "react";
import Link from "next/link";
import Navbar from "../../Components/Navbar";
import Footer from "../../Components/Footer";
import LearnMoreCard from "../../Components/LearnMoreCard";
import LearnMoreInfoCard from "../../Components/LearnMoreInfoCard";
import IconMapMarker from "@/Components/IconMapMarker";
import IconBxDonateHeart from "@/Components/IconBxDonateHeart";
import IconStars from "@/Components/IconStars";

const cardData = [
    {
        icon: <IconMapMarker/>,
        title: "Discover Local Gems",
        description: (
            <>
            Explore a diverse range of food vendors right from your device. Whether you’re craving a gourmet food truck meal, 
            a home-cooked specialty, or a unique dish from a small, family-owned eatery, we’ve got you covered.
            </>
        ),
        info: (
            <>
            Dive into a vibrant tapestry of local flavors and hidden treasures right at your fingertips. 
            Our platform brings the diverse culinary landscape of your community to life, offering you 
            seamless access to a wide array of food vendors, from trendy food trucks to beloved family-owned eateries. <br/><br/>
            Whether you’re in the mood for a gourmet meal from a renowned food truck, a comforting dish from a time-honored
            family recipe, or an adventurous bite from a boutique eatery, you can find it all through our app. Each vendor
            is carefully curated to ensure you experience the best that your local food scene has to offer.
            Our easy-to-navigate interface allows you to browse vendor profile and view enticing photos of their dishes. <br/><br/>
            With detailed vendor information, discovering your next favorite meal has never been more convenient. 
            From discovering new local hotspots to revisiting old favorites, our platform is your gateway to a richer, more flavorful food adventure.
            </>
        )
    },
    {
        icon: <IconBxDonateHeart/>,
        title: "Support Small Businesses",
        description: (
            <>
            Our platform helps local vendors reach a broader audience, giving them the exposure they deserve and helping them thrive. 
            Your support directly contributes to the growth and sustainability of these cherished community businesses.
            </>
        ),
        info: (
            <>At the heart of our platform lies a commitment to amplifying the voices of small businesses. By connecting local vendors with a wider audience,
            we help them thrive and bring unique, quality products and services to your community.<br/><br/>
            When you choose to shop with small businesses featured on our platform, you’re doing more than just making a purchase; 
            you’re investing in the growth and sustainability of local entrepreneurs. Our service is designed to enhance their visibility and reach, 
            offering them the tools they need to showcase their offerings to a broader audience.
            </>
        ),
    },
    {
        icon: <IconStars/>,
        title: "Access Unique Offerings",
        description: (
            <>
            Find and enjoy distinctive culinary experiences that you won’t find in mainstream restaurants. Our app features real-time updates,
            allowing you to locate vendors, view their menus, and get notifications about their special promotions.
            </>
        ),
        info: (
            <>
            Unleash your taste buds and explore a world of unique culinary delights that stand out from the mainstream. Our platform is designed
            to connect you with distinctive food offerings and memorable dining experiences that you won’t find anywhere else.
            </>
        ),
    }
  ];

export default function About() {

    const [ learnMoreToggle, setLearnMoreToggle ] = useState(false);
    const [ selectedCard, setSelectedCard ] = useState(null);

    function handleLearnMoreToggle() {
        return setLearnMoreToggle((show) => !show);
    }

    function handleClickedLearnMore(cardIndex) {
        setSelectedCard(cardIndex);
        handleLearnMoreToggle();
    }
    return (
        <>
        <div className={learnMoreToggle ? "blur-md" : "blur-none"}>
            <Navbar/>
            <div className="flex flex-col items-center bg-[#AAD15F] p-12">
                <h1 className="text-3xl text-center font-bold pb-8">
                    Find eats in your reach!
                </h1>
                <p className="text-center pb-20 min-w-80 max-w-[500px]">
                    Welcome to Eats in Reach! We’re thrilled to connect you with the hidden culinary gems in rural areas. 
                    Our platform bridges the gap between small, local food vendors and a wider audience eager to discover
                    and support unique offerings.
                </p>
                <div>
                    <button className="bg-[#FDE4CE] hover:bg-orange-300 w-36 h-12 rounded-lg shadow-md">
                        <Link href="/Pages/Restaurants"> Get Started </Link>
                    </button>
                </div>
            </div>
            <div className="flex flex-col bg-[#FDE4CE] text-black p-12">
                <>
                    <h1 className="font-bold text-2xl mb-8"> 
                        What We Do
                    </h1>
                    <div className="flex flex-col md:flex-row md:gap-8 lg:gap-44 xl:gap-52 items-center md:items-start justify-center mx-auto lg:max-w-[1200px]">
                        {cardData.map((card, index) => (
                            <LearnMoreCard
                            key={index}
                            icon={card.icon}
                            title={card.title}
                            description={card.description}
                            effect={()=>handleClickedLearnMore(card.info)}
                            />
                        ))}
                    </div>
                </>
                <hr className="border-[#FF670E] border-solid border-2"></hr>
                <h1 className="text-2xl text-center font-semibold p-16 lg:pb-24"> 
                    Provided By 
                </h1>
                <div className="flex flex-col lg:flex-row items-center justify-center pb-14">
                    <img src="https://www.modbee.com/latest-news/cwnnig/picture253156058/alternates/LANDSCAPE_1140/bayvalleytech2_KK.JPG"
                    className="md:h-96 m-6"/>
                    <div>
                        <h2 className="text-3xl text-center pb-9 font-bold"> 
                            <a href="https://www.bayvalleytech.com/"> Bay Valley Tech </a>
                        </h2>
                        <p className="max-w-[620px]">
                            Bay Valley Tech is a fast-growing tech incubator, tech community and digital workforce training program. 
                            We believe that enabling hardworking individuals to attain lucrative technology-based careers can be 
                            transformative for their families and their communities. In addition to providing high quality digital
                            talent to help companies grow, Bay Valley Tech offers two free, highly effective digital skills training
                            programs. A digital skills academy and a coding academy. 
                        </p>
                    </div>
                </div>
                </div>
                <Footer/>
        </div>
        <div className={learnMoreToggle ? "visible" : "hidden"}>
            <LearnMoreInfoCard
            effect={handleLearnMoreToggle}
            info={selectedCard}/>
        </div>
        </>
    );
}