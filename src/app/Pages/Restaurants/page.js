"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/Components/Navbar";
import Slider from "react-slick";
import Footer from "@/Components/Footer";
import { Italiana } from "next/font/google"; 
// Import css files for react-slick
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const italiana = Italiana({
  subsets: ["latin"],
  weight: ["400"],
});

export default function RestaurantPage() {
  const [restaurants, setRestaurants] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [sortBy, setSortBy] = useState("");

  useEffect(() => {
    async function fetchRestaurants() {
      const res = await fetch("/api/restaurants");
      const data = await res.json();
      setRestaurants(data);
    }

    fetchRestaurants();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true, // This pauses autoplay when hovered
  };

  // Handle search query and filter the restaurants based on name, location, etc.
  useEffect(() => {
    const filtered = restaurants.filter(
      (restaurant) =>
        restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        restaurant.location.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredRestaurants(filtered);
  }, [searchQuery, restaurants]);

  useEffect(() => {
    let sortedRestaurants = [...restaurants];
    if (sortBy === "Price_asc") {
      sortedRestaurants.sort(
        (a, b) => a.price_range.length - b.price_range.length
      );
    }
    if (sortBy === "Price_desc") {
      sortedRestaurants.sort(
        (a, b) => b.price_range.length - a.price_range.length
      );
    }
    if (sortBy === "Food_Type") {
      sortedRestaurants.sort((a, b) => a.food_type.localeCompare(b.food_type)); //a.food_type.localeCompare(b.food_type))
    }
    if (sortBy === "Name") {
      sortedRestaurants.sort((a, b) => a.name.localeCompare(b.name)); //a.food_type.localeCompare(b.food_type))
    }
    setFilteredRestaurants(sortedRestaurants);
  }, [sortBy]);

  return (
    <div className="min-h-screen bg-[#FDFBCE]">
      <Navbar />
      <div className="rounded-[84px]">
        <div className="container mx-auto my-16 px-[3rem] pt-3 pb-[2rem] max-sm:px-4 max-sm:py-2 rounded-[100px] max-sm:rounded-[24px] bg-Yellow-Green w-4/6 max-sm:w-11/12 drop-shadow-md">
          <Slider {...settings} className="container mt-4">
            {restaurants.slice(0, 5).map((restaurant) => (
              <div
                key={restaurant.restaurant_id}
                className="rounded-[84px] max-sm:rounded-[24px] overflow-hidden"
              >
                <img
                  src={restaurant.image_url}
                  alt={`Image of ${restaurant.name}`}
                  className="w-full h-64 object-cover rounded-t-[84px] max-sm:rounded-t-[24px] drop-shadow-md"
                />
                <div className="bg-white p-4 rounded-b-[84px] max-sm:rounded-b-[24px] pl-16 drop-shadow-md">
                  <h2 className="text-xl font-semibold">{restaurant.name}</h2>
                  <p>{restaurant.food_type}</p>
                  <p>{restaurant.price_range}</p>
                </div>
              </div>
            ))}
          </Slider>
        </div>
        <div className="flex items-center max-w-sm mx-auto mt-8">
          <label htmlFor="simple-search" className="sr-only">
            Search
          </label>

          <div className="relative w-full">
            <div className="absolute inset-y-0 -start-0 flex items-center ps-3">
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#000000"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="4" y1="21" x2="4" y2="14"></line>
                  <line x1="4" y1="10" x2="4" y2="3"></line>
                  <line x1="12" y1="21" x2="12" y2="12"></line>
                  <line x1="12" y1="8" x2="12" y2="3"></line>
                  <line x1="20" y1="21" x2="20" y2="16"></line>
                  <line x1="20" y1="12" x2="20" y2="3"></line>
                  <line x1="1" y1="14" x2="7" y2="14"></line>
                  <line x1="9" y1="8" x2="15" y2="8"></line>
                  <line x1="17" y1="16" x2="23" y2="16"></line>
                </svg>

                {isDropdownOpen && (
                  <div className="absolute bg-white shadow-md rounded-md mt-2 w-48">
                    <ul className="py-2">
                      <li
                        className="px-4 py-2 hover:bg-gray-100"
                        onClick={() => setSortBy("Price_asc")}
                      >
                        Sort prices low to high
                      </li>
                      <li
                        className="px-4 py-2 hover:bg-gray-100"
                        onClick={() => setSortBy("Price_desc")}
                      >
                        {" "}
                        Sort prices high to low
                      </li>
                      <li
                        className="px-4 py-2 hover:bg-gray-100"
                        onClick={() => setSortBy("Food_type")}
                      >
                        {" "}
                        Order by cuisine
                      </li>
                      <li
                        className="px-4 py-2 hover:bg-gray-100"
                        onClick={() => setSortBy("Name")}
                      >
                        {" "}
                        Order by Name
                      </li>
                    </ul>
                  </div>
                )}
              </button>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              id="simple-search"
              className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5"
              placeholder="Search..."
              required
            />
          </div>
          <button
            type="submit"
            className="p-2.5 ms-2 text-sm font-medium text-Yellow-Green bg-Almond rounded-lg border hover:bg-Kobicha hover:text-rosey-brown focus:ring-4 focus:outline-none"
          >
            <svg
              className="w-4 h-4"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
            <span className="sr-only">Search</span>
          </button>
        </div>
        <h2 className={`text-[3rem] my-4 px-16  ${italiana.className}`}>
          All Restaurants
        </h2>
        <div className="grid grid-col-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 px-14 ">
          {filteredRestaurants.length > 0 ? (
            filteredRestaurants.map((restaurant) => (
              <div key={restaurant.restaurant_id} className="transition ease-in-out hover:-translate-y-1 hover:scale-100 duration-200">
                <Link href={`/Pages/Restaurants/${restaurant.restaurant_id}`}>
                  <div className="bg-white flex flex-col md:flex-row shadow-xl rounded-xl overflow-hidden">
                    <div className="flex-shrink-0 w-full md:w-36 h-40 overflow-hidden">
                      <img
                        src={restaurant.image_url}
                        alt={`Image of ${restaurant.name}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex flex-col gap-1 p-4">
                      <p className="font-bold text-lg md:text-xl truncate">
                        {restaurant.name}
                      </p>
                      <p className="text-sm md:text-base truncate">
                        {restaurant.food_type} ({restaurant.price_range})
                      </p>
                      <p className="text-sm md:text-base text-ellipsis">
                        {restaurant.location}
                      </p>
                    </div>
                  </div>
                </Link>
              </div>
            ))
          ) : (
            <p className="text-center text-lg text-black">
              No restaurants match your search.
            </p>
          )}
        </div>

        <div className="px-16 py-8">
          <Link
            href="/"
            className="bg-Kobicha text-rosey-brown rounded-lg hover:bg-Chocolate-cosmos hover:text-white mt-4 inline-block px-6 py-3 text-sm font-semibold shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition-transform transform hover:-translate-y-1 scale-105"
          >
            Home
          </Link>
        </div>
      </div>
      <Footer></Footer>
    </div>
  );
}
