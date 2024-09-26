"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../../context/authContext";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "../../../../firebase";
import { UploadButton } from "../../../../libs/uploadthing";
import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";

export default function VendorSubmission() {
  const router = useRouter();
  const { currentUser, loading } = useAuth();
  const [role, setRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [priceRanges, setPriceRanges] = useState([]);
  const [foodTypes, setFoodTypes] = useState([]);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [approvedRestaurant, setApprovedRestaurant] = useState(false);
  const [pendingRestaurant, setPendingRestaurant] = useState(false);
  const [formData, setFormData] = useState({
    name: "Sample Restaurant",
    location: "123 Main St, Sample City",
    description: "A great place to enjoy delicious food!",
    website: "sample.com",
    phone_number: "123-456-7890",
    email: "sample@restaurant.com",
    price_range_id: "2",
    food_type_id: "1",
    image: "", // Single image input
    alt_text: "Image description", // Alt text for the image
    hours_of_operation: {
      monday: { open: "08:00", close: "17:00", closed: false },
      tuesday: { open: "08:00", close: "17:00", closed: false },
      wednesday: { open: "08:00", close: "17:00", closed: false },
      thursday: { open: "08:00", close: "17:00", closed: false },
      friday: { open: "08:00", close: "17:00", closed: false },
      saturday: { open: "08:00", close: "17:00", closed: false },
      sunday: { open: "08:00", close: "17:00", closed: false },
    },
  });
  const [imageURL, setImageURL] = useState("");
  const [isImageUploaded, setIsImageUploaded] = useState(false);

  useEffect(() => {
    const checkUserAndRedirect = async () => {
      if (!loading && !currentUser) {
        router.push("/");
        return;
      }

      if (currentUser) {
        try {
          const collections = ["users", "vendors", "admins"];
          let found = false;

          for (const collection of collections) {
            const userDoc = await getDoc(
              doc(firestore, collection, currentUser.uid)
            );

            if (userDoc.exists()) {
              const userData = userDoc.data();

              if (userData.role === "vendor") {
                const [pendingResponse, approvedResponse] = await Promise.all([
                  fetch(`/api/checkPendingRestaurant?uid=${currentUser.uid}`),
                  fetch(`/api/checkRestaurant?uid=${currentUser.uid}`),
                ]);

                const pendingResult = await pendingResponse.json();
                const approvedResult = await approvedResponse.json();

                setPendingRestaurant(pendingResult.hasRestaurant);
                setApprovedRestaurant(approvedResult.hasRestaurant);

                if (
                  pendingResult.hasRestaurant ||
                  approvedResult.hasRestaurant
                ) {
                  router.push("/Pages/VendorHome");
                  return;
                }
                found = true;
                setRole(userData.role);
              } else {
                router.push("/"); // Redirect if not a vendor
                return;
              }
            }
          }

          if (!found) {
            console.log(
              "User document does not exist in any of the collections."
            );
            setRole(null);
          }
        } catch (error) {
          console.error(`Error fetching user data:`, error);
        }
      }

      setIsLoading(false); // Set loading to false after fetching user data
    };

    checkUserAndRedirect();
  }, [currentUser, loading, router]);

  useEffect(() => {
    async function fetchFoodTypes() {
      try {
        const response = await fetch("/api/food-types");
        if (!response.ok) {
          throw new Error("Failed to fetch food types");
        }
        const data = await response.json();
        setFoodTypes(data);
      } catch (error) {
        console.error(error);
      }
    }

    async function fetchPriceRanges() {
      try {
        const response = await fetch("/api/price-ranges");
        if (!response.ok) {
          throw new Error("Failed to fetch price ranges");
        }
        const data = await response.json();
        setPriceRanges(data);
      } catch (error) {
        console.error(error);
      }
    }

    fetchFoodTypes();
    fetchPriceRanges();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleHoursChange = (e, day) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      hours_of_operation: {
        ...formData.hours_of_operation,
        [day]: {
          ...formData.hours_of_operation[day],
          [name]: value,
        },
      },
    });
  };

  const handleClosedChange = (day) => {
    setFormData({
      ...formData,
      hours_of_operation: {
        ...formData.hours_of_operation,
        [day]: {
          ...formData.hours_of_operation[day],
          closed: !formData.hours_of_operation[day].closed,
        },
      },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/vendor-submissions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          uid: currentUser.uid,
          image: imageURL, // Include the imageURL in the submission
          photo_type_id: 4,
          hours_of_operation: JSON.stringify(formData.hours_of_operation),
        }),
      });

      if (response.ok) {
        setSubmitStatus(
          "Submission successful! Your restaurant will be reviewed soon."
        );
        setFormData({
          name: "",
          location: "",
          description: "",
          website: "",
          phone_number: "",
          email: "",
          price_range_id: "",
          food_type_id: "",
          image: "",
          alt_text: "",
          hours_of_operation: {
            monday: { open: "", close: "", closed: false },
            tuesday: { open: "", close: "", closed: false },
            wednesday: { open: "", close: "", closed: false },
            thursday: { open: "", close: "", closed: false },
            friday: { open: "", close: "", closed: false },
            saturday: { open: "", close: "", closed: false },
            sunday: { open: "", close: "", closed: false },
          },
        });
        setImageURL(""); // Clear image URL after submission
        router.push("/Pages/VendorHome");
      } else {
        setSubmitStatus(
          "There was an error with your submission. Please try again."
        );
      }
    } catch (error) {
      console.error("Error submitting vendor:", error);
      setSubmitStatus(
        "There was an error with your submission. Please try again."
      );
    }
  };

  const daysOfWeek = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];

  // Show a loading indicator while checking auth state or role
  if (loading || isLoading) {
    return <div>Loading...</div>;
  }

  if (!currentUser || role !== "vendor") {
    return <div>Redirecting...</div>;
  }

  return (
    <div className="bg-Cream">
      <Navbar />
      <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg">
        <div className="flex justify-between place-items-center">
          <h1 className="text-2xl font-bold">Submit Your Restaurant</h1>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Restaurant Name</label>
            <input
              type="text"
              name="name"
              value={formData.name || ""}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location || ""}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700"> Hours of Operation</label>
            {daysOfWeek.map((day) => (
              <div key={day} className="mb-4">
                <label className="block text-gray-700 capitalize">{day}</label>
                <div className="flex items-center">
                  <input
                    type="time"
                    name="open"
                    value={formData.hours_of_operation[day].open}
                    onChange={(e) => handleHoursChange(e, day)}
                    disabled={formData.hours_of_operation[day].closed}
                    className="w-full p-2 border border-gray-300 rounded mr-2"
                    required={!formData.hours_of_operation[day].closed}
                  />
                  <input
                    type="time"
                    name="close"
                    value={formData.hours_of_operation[day].close}
                    onChange={(e) => handleHoursChange(e, day)}
                    disabled={formData.hours_of_operation[day].closed}
                    className="w-full p-2 border border-gray-300 rounded mr-2"
                    required={!formData.hours_of_operation[day].closed}
                  />
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.hours_of_operation[day].closed}
                      onChange={() => handleClosedChange(day)}
                      className="mr-2"
                    />
                    Closed
                  </label>
                </div>
              </div>
            ))}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Description</label>
            <textarea
              name="description"
              value={formData.description || ""}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            ></textarea>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Phone Number</label>
            <input
              type="tel"
              name="phone_number"
              value={formData.phone_number || ""}
              onChange={handleChange}
              pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email || ""}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Website</label>
            <input
              type="text"
              name="website"
              value={formData.website || ""}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Price Range</label>
            <select
              name="price_range_id"
              value={formData.price_range_id || ""}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="">Select Price Range</option>
              {priceRanges.map((pr) => (
                <option key={pr.price_range_id} value={pr.price_range_id}>
                  {pr.range}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Food Type</label>
            <select
              name="food_type_id"
              value={formData.food_type_id || ""}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="">Select Food Type</option>
              {foodTypes.map((ft) => (
                <option key={ft.food_type_id} value={ft.food_type_id}>
                  {ft.type_name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            {isImageUploaded ? (
              <div className="text-green-500">Image uploaded successfully!</div>
            ) : (
              <UploadButton
                endpoint="imageUploader"
                onClientUploadComplete={(res) => {
                  setImageURL(res[0].url);
                  setIsImageUploaded(true);
                }}
                onUploadError={(error) => {
                  console.log(`ERROR! ${error.message}`);
                }}
              />
            )}
          </div>
          <button type="submit" className="bg-[#125D35] text-white p-2 rounded">
            Submit
          </button>
        </form>
        {submitStatus && <p className="mt-4">{submitStatus}</p>}
      </div>
      <Footer />
    </div>
  );
}
