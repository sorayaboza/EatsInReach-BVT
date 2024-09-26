"use client";

import Navbar from "./Components/Navbar";
import Link from "next/link";
import { Italiana } from "next/font/google";
import { useAuth } from "../../context/authContext";
import Footer from "@/Components/Footer";

const italiana = Italiana({
  subsets: ["latin"],
  weight: ["400"],
});

export default function Landing() {
  const { currentUser } = useAuth();

  // Example of hardcoded restaurant data (this would typically come from an API)
  const restaurants = [
    { name: "Toni's Courtyard cafe", image_url: "https://utfs.io/f/TnfuvTEmVxjlck1916M2BxEX4gp9VPDHA36Trh8aUvOY7zCs", restaurant_id: "1" },
    { name: "Joystiq", image_url: "https://utfs.io/f/TnfuvTEmVxjlyPXQfYDHhsbgP0vlOBIMWmEpy47rAJcGFfRk", restaurant_id: "2" },
    { name: "Kind Neighbor", image_url: "https://utfs.io/f/TnfuvTEmVxjl0l8UBuqEZ9v5FejB6oSg1MqUtTHkAzJibs8Y", restaurant_id: "3" },
    { name: "Oishi Teri Sushi Bar", image_url: "https://utfs.io/f/TnfuvTEmVxjl2HEoDoGMbIEUYnsuAjNdxG1SViXq6pFgmeKT", restaurant_id: "4" },
    { name: "El Palmar Taqueria", image_url: "https://utfs.io/f/TnfuvTEmVxjlaF7WYTOW4Mo9jEqKlJRn1gfb8De0PVZGsuc2", restaurant_id: "5" },
  ];

  return (
    <div className="">
      <Navbar />
    
      <div className="w-full flex flex-col items-center landing-page text-white bg-black bg-opacity-50 bg-blend-darken">
        <h1
          className={`p-4 text-6xl sm:text-8xl md:text-9xl landing-header ${italiana.className} mt-4 text-center`}
        >
          Eats in Reach
        </h1>
        <h2 className="text-2xl sm:text-4xl md:text-5xl">
          Reach for Flavor, Anytime
        </h2>
        {!currentUser && (
          <div className="mt-8 sm:mt-16 md:mt-20 drop-shadow-lg">
            <Link href="/Pages/Login">
              <button className="text-1xl text-black sm:text-2xl md:text-3xl bg-[#AAD15F] hover:bg-[#8A9C4C] p-3 sm:p-4 md:p-5 rounded-full border border-black">
                Login
              </button>
            </Link>
          </div>
        )}
        <h3 className="text-2xl text-black bg-Cream mt-10 mb-3 p-5 rounded-4xl rounded-2xl hover:-translate-y-1 cursor-pointer drop-shadow-md"
          onClick={() => {
            document.querySelector("#faves").scrollIntoView({
              behavior: "smooth",
            });
          }}
        >
          Our Favorites
        </h3>

        <img src="images/down_arrow.png" className="h-10 m-10 mt-44 "></img>

      </div>
      <div className=" flex flex-col items-center p-4 bg-Cream" id='faves'>
        <div className="w-[50vw]">
          <h3 className={`text-[3rem] text-black flex self-start pl-4  ${italiana.className}`}>Our Favorites</h3>
            <div className="bg-Cream grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 rounded-3xl gap-5 mt-4 scrollbar-hidden flex-wrap">
            {restaurants.slice(0, 5).map((restaurant, index) => (
              <Link
                href={`/Pages/Restaurants/${restaurant.restaurant_id}`}
                className="flg:w-1/2  group-hover:bg-slate-300 group-hover:translate-y-1"
                key={restaurant.restaurant_id}
              >
                <div className=" h-64 w-48 p-4 rounded-2xl cursor-pointer drop-shadow-md">
                  <img
                    src={`${restaurant.image_url}`}
                    alt={`Image of ${restaurant.name}`}
                    className="w-full h-40 object-cover rounded-xl"
                    loading="lazy"
                  />
                  <p className="w-full text-center bg-Yellow-Green mt-2 p-1.5 rounded-3xl hover:bg-Lime">
                    {restaurant.name}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
        
        
      </div>
      <Footer />
    </div>
  );
}
