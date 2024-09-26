"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../../context/authContext";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "../../../../firebase";
import NavBar from "../../Components/Navbar";
import Footer from "../../Components/Footer";

const VendorHomePage = () => {
  const router = useRouter();
  const { currentUser, loading } = useAuth();
  const [role, setRole] = useState(null);
  const [isRoleLoading, setIsRoleLoading] = useState(true);
  const [approvedRestaurant, setApprovedRestaurant] = useState(false);
  const [pendingRestaurant, setPendingRestaurant] = useState(false);

  const goToVendorSubmission = () => {
    router.push("/Pages/VendorSubmission");
  };

  const goToAddMenuItems = () => {
    router.push("/Pages/Menu");
  };

  useEffect(() => {
    // Redirect to the landing page if the user is not logged in
    if (!loading && !currentUser) {
      router.push("/");
    }
    if (currentUser) {
      const fetchUserData = async () => {
        const collections = ["users", "vendors", "admins"];
        let found = false;

        for (const collection of collections) {
          if (found) break;

          try {
            const userDoc = await getDoc(
              doc(firestore, collection, currentUser.uid)
            );

            if (userDoc.exists()) {
              const userData = userDoc.data();
              if (userData.role !== "vendor") {
                router.push("/");
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
          console.log(
            "User document does not exist in any of the collections."
          );
          setRole(null);
        }
        setIsRoleLoading(false);
      };

      fetchUserData();
    }
  }, [currentUser, loading, router]);

  // This useEffect checks if the vendor has an associated restaurant
  useEffect(() => {
    const checkVendorRestaurant = async () => {
      if (!currentUser) return;

      try {
        // Send a request to your API route to check if the vendor has a restaurant
        const response = await fetch(
          `/api/checkRestaurant?uid=${currentUser.uid}`
        );
        const result = await response.json();

        if (result.hasRestaurant) {
          setApprovedRestaurant(true);
        } else {
          setApprovedRestaurant(false);
        }
      } catch (error) {
        console.error("Error checking vendor restaurant:", error);
      }
    };

    checkVendorRestaurant();
  }, [currentUser]);

  // This useEffect checks if the vendor has a pending restaurant
  useEffect(() => {
    const checkVendorPendingRestaurant = async () => {
      if (!currentUser) return;

      try {
        // Send a request to your API route to check if the vendor has a restaurant
        const response = await fetch(
          `/api/checkPendingRestaurant?uid=${currentUser.uid}`
        );
        const result = await response.json();

        if (result.hasRestaurant) {
          setPendingRestaurant(true);
        } else {
          setPendingRestaurant(false);
        }
      } catch (error) {
        console.error("Error checking vendor restaurant:", error);
      }
    };

    checkVendorPendingRestaurant();
  }, [currentUser]);

  // Show a loading indicator while checking auth state or role
  if (loading || isRoleLoading) {
    return <div>Loading...</div>; // You can replace this with a loading spinner if needed
  }

  if (!currentUser || role !== "vendor") {
    return <div>Redirecting...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-orange-100 to-yellow-100">
      <NavBar />

      <main className="flex-grow container mx-auto text-center py-10 px-8">
        <h1 className="text-5xl text-red-700 font-bold mb-6 tracking-wide">
          Welcome, Vendor!
        </h1>

        <p className="text-orange-700 mb-10 text-lg">
          Manage your restaurant, add menu items, and more!
        </p>

        <div className="flex justify-center gap-8 mb-12">
          {approvedRestaurant ? (
            <button
              onClick={goToAddMenuItems}
              className="bg-yellow-500 text-white hover:bg-yellow-600 px-8 py-4 text-lg font-bold rounded-full shadow-xl transition-transform transform hover:scale-110"
            >
              Add Menus
            </button>
          ) : pendingRestaurant ? (
            <p className="text-orange-700 mb-10 text-lg">
              Restaurant pending review from admin
            </p>
          ) : (
            <button
              onClick={goToVendorSubmission}
              className="bg-red-500 text-white hover:bg-red-600 px-8 py-4 text-lg font-bold rounded-full shadow-xl transition-transform transform hover:scale-110"
            >
              Submit Restaurant
            </button>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default VendorHomePage;
