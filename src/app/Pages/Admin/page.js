"use client";

import Navbar from "@/Components/Navbar";
import Link from "next/link";
import Footer from "@/Components/Footer";
import { useEffect, useState } from "react";
import {
  collection,
  setDoc,
  getDocs,
  getDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { firestore } from "../../../../firebase";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../../context/authContext";

export default function Admin() {
  const router = useRouter();
  const { currentUser, loading } = useAuth();
  const [role, setRole] = useState(null);
  const [isRoleLoading, setIsRoleLoading] = useState(true);
  const [selectedUserData, setSelectedUserData] = useState({});
  const [selectedUser, setSelectedUser] = useState({});
  const [error, setError] = useState(null);
  const [tableData, setTableData] = useState([
    {
      title: "Users",
      users: [],
    },
    {
      title: "Vendors",
      users: [],
    },
    {
      title: "Admin",
      users: [],
    },
  ]);

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
    fetchData();
  }, []);

  const fetchData = async () => {
    const users = await fetchAllUsers();
    const vendors = await fetchAllVendors();
    const admins = await fetchAllAdmins();

    // Update the tableData with the fetched users for the first object (Users)
    setTableData((prevTableData) => {
      return prevTableData.map((data, index) => {
        if (index === 0) {
          return {
            ...data,
            users: users,
          };
        }
        if (index === 1) {
          return {
            ...data,
            users: vendors,
          };
        }
        if (index === 2) {
          return {
            ...data,
            users: admins,
          };
        }
        return data; // Keep the other objects unchanged
      });
    });
  };

  const fetchAllUsers = async () => {
    try {
      // Reference to the users collection
      const usersCollectionRef = collection(firestore, "users"); // Using 'firestore'

      // Fetch all documents in the collection
      const querySnapshot = await getDocs(usersCollectionRef);

      // Map over each document and return the user data
      const users = querySnapshot.docs.map((doc) => ({
        id: doc.id, // document ID
        ...doc.data(), // spread the user data
      }));

      return users;
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchAllVendors = async () => {
    try {
      // Reference to the users collection
      const vendorsCollectionRef = collection(firestore, "vendors"); // Using 'firestore'

      // Fetch all documents in the collection
      const querySnapshot = await getDocs(vendorsCollectionRef);

      // Map over each document and return the user data
      const vendors = querySnapshot.docs.map((doc) => ({
        id: doc.id, // document ID
        ...doc.data(), // spread the user data
      }));

      return vendors;
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchAllAdmins = async () => {
    try {
      // Reference to the users collection
      const adminsCollectionRef = collection(firestore, "admins"); // Using 'firestore'

      // Fetch all documents in the collection
      const querySnapshot = await getDocs(adminsCollectionRef);

      // Map over each document and return the user data
      const admins = querySnapshot.docs.map((doc) => ({
        id: doc.id, // document ID
        ...doc.data(), // spread the user data
      }));

      return admins;
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleCheckboxChange = (user) => {
    setSelectedUserData(user);
    setSelectedUser(user.id);
  };

  const handlePromoteUser = async (user) => {
    try {
      if (!user || !user.id) {
        setError("No user was selected for promotion!");
        return;
      }
      if (user.role !== "user") {
        setError("Only users can be promoted to Admin!");
        return;
      }

      const confirmation = window.confirm(
        `Are you sure you want to promote ${user.userName} to an admin?`
      );

      if (!confirmation) return;

      const userDocRef = doc(firestore, "users", user.id);
      const adminDocRef = doc(firestore, "admins", user.id);

      await setDoc(adminDocRef, { ...user, role: "admin" });

      await deleteDoc(userDocRef);

      // Postgres part
      const response = await fetch("/api/updateUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: user.id, role: "admin" }),
      });

      const result = await response.json();
      if (!response.ok) {
        setError(result.message || "Failed to update user role in Postgres");
        return;
      }

      setSelectedUserData({});
      setSelectedUser({});
      setError(null);
      await fetchData();

      console.log(`${user.userName} has been promoted to admin.`);
    } catch (error) {
      console.error("Error promoting user:", error);
    }
  };

  const handleDemoteAdmin = async (user) => {
    try {
      if (!user || !user.id) {
        setError("No user was selected for demotion!");
        return;
      }
      if (user.role !== "admin") {
        setError("Only Admins can be demoted!");
        return;
      }
      if (user.id === currentUser.uid) {
        setError("You can't demote yourself!");
        return;
      }

      const adminCount =
        tableData.find((table) => table.title === "Admin")?.users.length || 0;

      if (adminCount <= 4) {
        setError("Minimum of four admins to demote an admin!");
        return;
      }

      const confirmation = window.confirm(
        `Are you sure you want to demote ${user.userName} to a user?`
      );

      if (!confirmation) return;

      const userDocRef = doc(firestore, "users", user.id);
      const adminDocRef = doc(firestore, "admins", user.id);

      await setDoc(userDocRef, { ...user, role: "user" });

      await deleteDoc(adminDocRef);

      // Postgres part
      const response = await fetch("/api/updateUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: user.id, role: "user" }),
      });

      const result = await response.json();
      if (!response.ok) {
        setError(result.message || "Failed to update user role in Postgres");
        return;
      }

      setSelectedUserData({});
      setSelectedUser({});
      setError(null);
      await fetchData();
      console.log(`${user.userName} has been demoted to user.`);
    } catch (error) {
      console.error("Error demoting admin:", error);
    }
  };

  const handleDelete = async (user) => {
    try {
      // Validate if the user object exists and has an ID
      if (!user || !user.id) {
        setError("No user was selected for deletion!");
        return;
      }

      // Prevent deletion of admins
      if (user.role === "admin") {
        setError("Admins can't be deleted");
        return;
      }

      // Confirm the deletion
      const confirmation = window.confirm(
        `Are you sure you want to delete ${user.userName}'s account?`
      );
      if (!confirmation) return;

      // Call the API to delete the user from Firebase
      const deleteUserRes = await fetch("/api/deleteUser", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          role: user.role,
        }),
      });

      // Parse the response from Firebase
      const deleteUserData = await deleteUserRes.json();

      if (deleteUserRes.ok) {
        // Call the API to delete the user from PostgreSQL
        const deleteFromPostgresRes = await fetch(
          "/api/deleteUserFromPostgres",
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userId: user.id,
            }),
          }
        );

        const deleteFromPostgresData = await deleteFromPostgresRes.json();

        if (deleteFromPostgresRes.ok) {
          // Reset state on successful deletion
          setSelectedUserData({});
          setSelectedUser({});
          setError(null);
          await fetchData(); // Refresh the data
          console.log(
            `${user.userName} has been deleted from both Firebase and PostgreSQL.`
          );
        } else {
          // Set the error from the response
          setError(
            deleteFromPostgresData.error ||
              "Error deleting user from PostgreSQL"
          );
        }
      } else {
        // Set the error from the Firebase response
        setError(deleteUserData.error || "Error deleting user from Firebase");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      setError("Failed to delete user");
    }
  };

  // Show a loading indicator while checking auth state or role
  if (loading || isRoleLoading) {
    return <div>Loading...</div>; // You can replace this with a loading spinner if needed
  }

  if (!currentUser || role !== "admin") {
    return <div>Redirecting...</div>;
  }

  return (
    <div className="bg-Cream min-h-screen flex flex-col justify-between">
      <Navbar />
      {error && (
        <div className="flex bg-red-500 justify-center items-center h-11">
          <p className="text-black">{error}</p>
        </div>
      )}
      <div className="flex flex-col justify-between w-full">
        <div className="text-3xl font-bold block mx-auto my-6">
          <h1>Welcome Admin</h1>
        </div>

        <div className="flex justify-center gap-2">
          <Link href="/Pages/ReviewSubmissions">
            <button className="shadow border bg-[#4E070C] text-Cream rounded-full px-4 py-2 hover:opacity-90">
              Review Submissions
            </button>
          </Link>

          <Link href="/">
            <button className="shadow border bg-[#4E070C] text-Cream rounded-full px-4 py-2 hover:opacity-90">
              Home
            </button>
          </Link>
        </div>

        <div className="flex justify-center max-xl:grid grid-cols-[3fr,1fr] max-md:flex max-md:flex-col-reverse">
          <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-2">
            {tableData.map((td, index) => (
              <div key={index} className="m-4 text-center overflow-x-auto">
                <table className="items-start shadow border-collapse border border-Buff rounded-lg w-1/4 max-xl:w-full">
                  <thead>
                    <tr>
                      <th className="p-2">{td.title}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-Buff text-sm">ID</td>
                      <td className="border border-Buff text-sm">Username</td>
                      <td className="border border-Buff text-sm">Email</td>
                      <td className="border border-Buff text-sm">Check</td>
                    </tr>

                    {td.users.map((user, idx) => (
                      <tr key={idx}>
                        <td className="border border-Buff text-sm">
                          {user.id}
                        </td>
                        <td className="border border-Buff text-sm">
                          {user.userName || "-"}
                        </td>
                        <td className="border border-Buff text-sm">
                          {user.email}
                        </td>
                        <td className="border border-Buff text-sm">
                          <input
                            type="checkbox"
                            checked={selectedUser === user.id}
                            onChange={() => handleCheckboxChange(user)}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>

          <div className="flex flex-col items-start m-4 p-4 space-y-2 max-xl:mx-0 max-md:flex-row max-md:justify-center max-md:space-y-0">
            <button
              className="shadow border bg-[#AAD15F] rounded-full w-auto px-4 py-2 max-xl:text-xs hover:opacity-90"
              onClick={() => handlePromoteUser(selectedUserData)}
            >
              Promote to Admin
            </button>

            <button
              className="shadow border bg-[#FF670E] rounded-full w-auto px-4 py-2 max-xl:text-xs hover:opacity-90"
              onClick={() => handleDemoteAdmin(selectedUserData)}
            >
              Demote Admin
            </button>

            <button
              className="shadow border bg-[#D22701] rounded-full w-auto px-4 py-2 max-xl:text-xs hover:opacity-90"
              onClick={() => handleDelete(selectedUserData)}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
