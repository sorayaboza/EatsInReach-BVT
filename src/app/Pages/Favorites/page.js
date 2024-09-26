"use client";

import Navbar from "@/Components/Navbar";
import FavoritesCard from "@/Components/FavoritesCard";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../../context/authContext";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "../../../../firebase";
import Footer from "@/Components/Footer";

export default function Favorites() {
  const router = useRouter();
  const { currentUser, loading } = useAuth();
  const [role, setRole] = useState(null);
  const [isRoleLoading, setIsRoleLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    if (!loading && !currentUser) {
      router.push("/");
      return;
    }

    const fetchUserRoleAndFavorites = async () => {
      if (currentUser) {
        try {
          const collections = ["users", "vendors", "admins"];
          let found = false;

          // Fetch user role
          for (const collection of collections) {
            if (found) break;

            try {
              const userDoc = await getDoc(
                doc(firestore, collection, currentUser.uid)
              );

              

              if (userDoc.exists()) {
                const userData = userDoc.data();
                if (userData.role !== "user") {
                  router.push("/");
                  return;
                }
                found = true;
                setRole(userData.role);
              }
            } catch (error) {
              console.error(
                `Error fetching user data from ${collection} collection:`,
                error
              );
            }
          }

          if (!found) {
            console.error(
              "User document does not exist in any of the collections."
            );
            setRole(null);
          }

          setIsRoleLoading(false);

          // Fetch favorite restaurants after user role validation
          if (currentUser && currentUser.uid) {
            try {
              const response = await fetch(
                `/api/favorites?user_id=${currentUser.uid}`
              );
              if (response.ok) {
                const data = await response.json();
                setFavorites(data);
              } else {
                console.error("Failed to fetch favorite restaurants");
              }
            } catch (error) {
              console.error("Error fetching favorite restaurants", error);
            }
          }
        } catch (error) {
          console.error("Error fetching user role or favorites", error);
        }
      }
    };

    fetchUserRoleAndFavorites();
  }, [currentUser, loading, router]);

  // Function to remove a favorite restaurant from the state
  const removeFavorite = (restaurantId) => {
    setFavorites((prevFavorites) =>
      prevFavorites.filter(
        (restaurant) => restaurant.restaurant_id !== restaurantId
      )
    );
  };

  // Show a loading indicator while checking auth state or role
  if (loading || isRoleLoading) {
    return <div>Loading...</div>; // You can replace this with a loading spinner if needed
  }

  if (!currentUser || role !== "user") {
    return <div>Redirecting...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <div>
        <Navbar />
        <div className="flex flex-col justify-center items-center">
          <div className="text-4xl font-semibold text-center w-full px-16 mt-12">
            Favorites
          </div>
          <div className="flex flex-wrap gap-6 justify-center max-w-screen mx-auto px-4 mt-8">
            {favorites.length > 0 ? (
              favorites.map((restaurant) => (
                <FavoritesCard
                  key={restaurant.restaurant_id}
                  restaurantId={restaurant.restaurant_id}
                  restaurantTitle={restaurant.name}
                  restaurantImg={restaurant.image_url}
                  userId={currentUser.uid}
                  removeFavorite={removeFavorite} // Pass removeFavorite function
                />
              ))
            ) : (
              <p>No favorites added yet.</p>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
