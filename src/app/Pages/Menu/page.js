"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../../../context/authContext";
import Navbar from "@/Components/Navbar";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "../../../../firebase";

export default function MenuPage() {
  const router = useRouter();
  const { currentUser, loading } = useAuth();
  const [role, setRole] = useState(null);
  const [menus, setMenus] = useState([]);
  const [isloading, setIsLoading] = useState(true);
  const [isRoleLoading, setIsRoleLoading] = useState(true);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    menuName: "",
    description: "",
  });

  // Fetch user role and ensure it's a vendor
  useEffect(() => {
    if (!loading && !currentUser) {
      router.push("/");
    } else if (currentUser) {
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
              } else {
                found = true;
                setRole(userData.role);
              }
            }
          } catch (error) {
            console.error(
              `Error fetching user data from ${collection}:`,
              error
            );
          }
        }

        if (!found) {
          setRole(null);
        }
        setIsRoleLoading(false);
      };

      fetchUserData();
    }
  }, [currentUser, loading, router]);

  // Fetch menus
  useEffect(() => {
    const fetchMenus = async () => {
      try {
        setIsLoading(true);

        const response = await fetch(`/api/menus?uid=${currentUser.uid}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
          const { error } = await response.json();
          setError(error || "Failed to fetch menus");
        } else {
          const data = await response.json();
          setMenus(data.menus); // Update to data.menus (if this is how the data is returned)
          setError("");
        }
      } catch (error) {
        setError("Failed to fetch menus");
      } finally {
        setIsLoading(false);
      }
    };

    if (currentUser?.uid) {
      fetchMenus();
    }
  }, [currentUser]);

  const updateForm = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/menus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          menuName: formData.menuName,
          description: formData.description,
          uid: currentUser.uid,
        }),
      });

      if (!response.ok) {
        const { error } = await response.json();
        setError(error || "Failed to create menu");
      } else {
        const newMenu = await response.json(); // New menu returned by API
        setError("");
        setFormData({ menuName: "", description: "" });

        // Add the new menu to the menus array
        setMenus((prevMenus) => [...prevMenus, newMenu.menu]);

        console.log("Menu created successfully");
      }
    } catch (error) {
      setError("Failed to submit menu");
    }
  };

  if (loading || isRoleLoading) {
    return <div>Loading...</div>;
  }

  if (!currentUser || role !== "vendor") {
    return <div>Redirecting...</div>;
  }

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center gap-4 bg-[#FDFBCE] min-h-[100vh] p-6 overflow-x-hidden">
        <h1 className="text-2xl font-bold">Create Menu</h1>
        {error && <p className="text-red-500">{error}</p>}
        <div className="flex flex-col items-center gap-2">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col w-3/4 pt-6 gap-2"
          >
            <input
              type="text"
              placeholder="Menu Name"
              name="menuName"
              value={formData.menuName}
              onChange={updateForm}
              className="border p-2 rounded"
            />
            <textarea
              placeholder="Menu Description"
              name="description"
              value={formData.description}
              onChange={updateForm}
              className="border p-2 rounded"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded drop-shadow-md"
            >
              Submit Menu
            </button>
          </form>
        </div>
        <div>
          <h2 className="text-xl font-bold mt-8 text-center p-2 mb-2">
            Menu List
          </h2>
          <div className="flex flex-wrap gap-4">
            {menus.length > 0 ? (
              menus.map((menu) => (
                <div key={menu.menu_id}>
                  <Link href={`/Pages/Menu/${currentUser.uid}-${menu.menu_id}`}>
                    <button className="bg-yellow-500 text-white hover:bg-yellow-600 px-8 py-4 text-lg font-bold rounded-full shadow-xl transition-transform transform hover:scale-110">
                      {menu.name}
                    </button>
                  </Link>
                </div>
              ))
            ) : (
              <p className="text-center text-lg text-black">
                No created Menus.
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
