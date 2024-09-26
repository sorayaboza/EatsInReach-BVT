"use client";

import { useState } from 'react';
import { PiHeartStraightThin } from "react-icons/pi";
import { PiHeartStraightFill } from "react-icons/pi";
import Image from 'next/image'; 

export default function FavoritesCard({ restaurantId, userId, restaurantImg, restaurantTitle, removeFavorite }) {
  const [isFavorited, setIsFavorited] = useState(true);

  const handleIconClick = async () => {
    try {
      const response = await fetch(`/api/favorites`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: userId,
          restaurant_id: restaurantId, }),
      });

      if (response.ok) {
        setIsFavorited(false);
        removeFavorite(restaurantId); // Remove card after successful unfavorite
      } else {
        console.error("Failed to unfavorite the restaurant");
      }
    } catch (error) {
      console.error("Error unfavoriting the restaurant", error);
    }
  };

  return (
    <div>
      <div className="w-auto flex flex-col justify-center items-center">
      <Image
              src={restaurantImg}
              alt={restaurantTitle}
              width={300}
              height={200} // Adjust this height as needed for consistent aspect ratio
              className="w-[300px] h-[200px] object-cover rounded-md" // Fixed width and height
            />

        <div className="flex gap-2 w-full p-1">
          <p className="text-left text-lg">{restaurantTitle}</p>
          <div
            onClick={handleIconClick}
            className="cursor-pointer ml-auto text-2xl text-right"
          >
            {isFavorited ? (
              <PiHeartStraightFill className="text-red-500" />
            ) : (
              <PiHeartStraightThin />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
