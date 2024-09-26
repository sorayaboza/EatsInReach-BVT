"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";
import { getDoc, doc } from "firebase/firestore";
import { firestore } from "../../../../firebase";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../../context/authContext";

export default function ReviewSubmissions() {
  const router = useRouter();
  const { currentUser, loading } = useAuth();
  const [role, setRole] = useState(null);
  const [isRoleLoading, setIsRoleLoading] = useState(true);
  const [submissions, setSubmissions] = useState([]);
  const [error, setError] = useState(null);

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
              if (userData.role !== "admin") {
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

  useEffect(() => {
    async function fetchSubmissions() {
      try {
        const response = await fetch("/api/vendor-submissions");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        setSubmissions(data);
        console.log(data);
      } catch (err) {
        console.error("Failed to fetch submissions:", err);
        setError("Failed to load submissions. Please try again later.");
      }
    }

    fetchSubmissions();
  }, []);

  const handleAction = async (submissionId, actionType) => {
    const confirmation = window.confirm(
      `Are you sure you want to ${actionType} this submission?`
    );

    if (!confirmation) return;

    try {
      let response;
      if (actionType === "accept") {
        response = await fetch("/api/vendor-submissions/accept", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ submissionId }),
        });
      } else if (actionType === "reject") {
        response = await fetch("/api/vendor-submissions/reject", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ submissionId }),
        });
      }

      if (!response.ok) {
        throw new Error("Network response was not ok.");
      }

      setSubmissions(
        submissions.filter((submission) => submission.uid !== submissionId)
      );
    } catch (error) {
      console.error(`Failed to ${actionType} submission:`, error);
      alert("Failed to perform the action. Please try again later.");
    }
  };

  if (error) {
    return <div>{error}</div>;
  }

  const formatTime = (time) => {
    const [hour, minute] = time.split(":");
    const hour12 = hour % 12 || 12; // Convert to 12-hour format
    const ampm = hour < 12 ? "AM" : "PM"; // Determine AM/PM
    return `${hour12}:${minute} ${ampm}`; // Return formatted time
  };

  // Show a loading indicator while checking auth state or role
  if (loading || isRoleLoading) {
    return <div>Loading...</div>; // You can replace this with a loading spinner if needed
  }

  if (!currentUser || role !== "admin") {
    return <div>Redirecting...</div>;
  }

  return (
    <div className="bg-[#FDE4CE] min-h-screen flex flex-col">
      <Navbar />
      <div className="m-5 min-h-min items-center max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg">
        <h1 className="text-2xl font-bold mb-6">Review Submissions</h1>
        {submissions.length > 0 ? (
          <ul>
            {submissions.map((submission) => (
              <li
                key={submission.uid}
                className="mb-4 p-4 border border-gray-300 rounded"
              >
                <h2 className="text-xl font-bold">{submission.name}</h2>
                <p>
                  <strong>Location:</strong> {submission.location}
                </p>
                <p>
                  <strong>Hours of Operation:</strong> <br />
                  {Object.entries(
                    JSON.parse(submission.hours_of_operation)
                  ).map(([day, hours]) => (
                    <span key={day}>
                      {day.charAt(0).toUpperCase() + day.slice(1)}:{" "}
                      {hours.closed
                        ? "Closed"
                        : `${formatTime(hours.open)} - ${formatTime(
                            hours.close
                          )}`}
                      <br />
                    </span>
                  ))}
                </p>
                <p>
                  <strong>Description:</strong> {submission.description}
                </p>
                <p>
                  <strong>Website:</strong> {submission.website}
                </p>
                <p>
                  <strong>Phone Number:</strong> {submission.phone_number}
                </p>
                <p>
                  <strong>Email:</strong> {submission.email}
                </p>
                <p>
                  <strong>Price Range:</strong> {submission.price_range}
                </p>
                <p>
                  <strong>Food Type:</strong> {submission.food_type}
                </p>

                {/* Display the image */}
                {submission.image_url && (
                  <div className="my-4">
                    <img
                      src={submission.image_url}
                      alt={submission.name}
                      className="w-full max-h-64 object-cover"
                    />
                  </div>
                )}

                <div className="flex justify-center">
                  <button
                    onClick={() => handleAction(submission.uid, "accept")}
                    className="rounded-full font-thin bg-[#AAD15F] px-4 py-1 mx-1 my-2 hover:bg-[#627937]"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleAction(submission.uid, "reject")}
                    className="rounded-full font-thin bg-[#D22701] px-4 py-1 mx-1 my-2 hover:bg-[#963a25]"
                  >
                    Reject
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No submissions to review at this time.</p>
        )}
        <Link href="/">
          <button className="rounded-full font-thin bg-[#D9D9D9] px-4 py-1 border border-gray-300">
            Home
          </button>
        </Link>
      </div>
      <Footer />
    </div>
  );
}
