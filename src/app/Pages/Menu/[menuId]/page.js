"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../../../context/authContext";
import Navbar from "@/Components/Navbar";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "../../../../../firebase";

export default function MenuItemPage({ params }) {
  const { menuId } = params;
  const menuTableId = menuId.split('-').pop();
  const router = useRouter();
  const { currentUser, loading } = useAuth();
  const [role, setRole] = useState(null);
  const [isRoleLoading, setIsRoleLoading] = useState(true);
  const [menuItems, setMenuItems] = useState([]);
  const [newItemName, setNewItemName] = useState("");
  const [newItemDesc, setNewItemDesc] = useState("");
  const [newItemPrice, setNewItemPrice] = useState("");
  const [editingItemId, setEditingItemId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loading && !currentUser) {
      console.log("No current user, redirecting...");
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
              console.log("User data found:", userData);
              if (userData.role !== "vendor") {
                console.log("User is not a vendor, redirecting...");
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
          console.log("User document does not exist in any collection.");
          setRole(null);
        }
        setIsRoleLoading(false);
      };

      fetchUserData();
    }
  }, [currentUser, loading, router]);

  useEffect(() => {
    async function fetchMenuItems() {
      if (!currentUser) {
        console.error("No current user found.");
        return; // Exit if there's no user
      }

      try {
        const res = await fetch("/api/menu-items", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            uid: currentUser.uid, // Pass the user's uid
            menuId: menuTableId,
          },
        });
        if (res.ok) {
          const data = await res.json();
          console.log("Fetched menu items:", data);
          setMenuItems(data);
        } else {
          console.error("Failed to fetch menu items");
        }
      } catch (error) {
        console.error("Error fetching menu items:", error);
      }
    }

    fetchMenuItems();
  }, [currentUser, menuId]);

  const resetForm = () => {
    setNewItemName("");
    setNewItemDesc("");
    setNewItemPrice("");
    setEditingItemId(null);
    setError("");
  };

  const addItem = async () => {
    console.log("Adding/updating item with:", {
      newItemName,
      newItemDesc,
      newItemPrice,
      editingItemId,
    });

    if (newItemName && newItemDesc && newItemPrice) {
      const parsedPrice = parseFloat(newItemPrice);
      if (isNaN(parsedPrice) || parsedPrice < 0) {
        setError("Price must be a valid number.");
        return;
      }

      const itemData = {
        item_name: newItemName,
        item_description: newItemDesc,
        item_price: parsedPrice,
        image_path: "/images/food-bg-images.jpg",
        alt_text: "",
      };

      const endpoint = editingItemId
        ? `/api/menu-items/update`
        : `/api/menu-items/submit`;
      if (editingItemId) {
        itemData.id = editingItemId;
        itemData.menu_id = menuTableId;
      }

      try {
        const res = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            uid: currentUser.uid, // Include the uid in headers
            menuId: menuTableId
          },
          body: JSON.stringify(itemData),
        });

        if (res.ok) {
          const updatedItem = await res.json();
          setMenuItems((prevItems) =>
            editingItemId
              ? prevItems.map((item) =>
                  item.item_id === editingItemId ? updatedItem : item
                )
              : [...prevItems, updatedItem]
          );
          resetForm();
        } else {
          const errorData = await res.json();
          setError(`Failed to add/update item: ${errorData.error}`);
        }
      } catch (error) {
        console.error("Failed to add/update item", error);
      }
    } else {
      setError("All fields are required");
    }
  };

  const removeItem = async (itemId) => {
    try {
      const res = await fetch("/api/menu-items/remove", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ item_id: itemId }),
      });

      if (res.ok) {
        setMenuItems((prevItems) =>
          prevItems.filter((item) => item.item_id !== itemId)
        );
      } else {
        const errorData = await res.json();
        setError(`Failed to remove item: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const fallbackImage = "/images/food-bg-images.jpg";

  // Show a loading indicator while checking auth state or role
  if (loading || isRoleLoading) {
    return <div>Loading...</div>;
  }

  if (!currentUser || role !== "vendor") {
    return <div>Redirecting...</div>;
  }

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center justify-center gap-4 bg-[#FDFBCE] min-h-[100vh] p-6 overflow-x-hidden">
        <h1 className="text-2xl font-bold">Modify Menu Item</h1>
        {error && <p className="text-red-500">{error}</p>}
        <div className="flex flex-col items-center justify-center gap-2">
          <input
            type="text"
            placeholder="Item Name"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            className="border p-2 rounded"
          />
          <input
            type="text"
            placeholder="Item Description"
            value={newItemDesc}
            onChange={(e) => setNewItemDesc(e.target.value)}
            className="border p-2 rounded"
          />
          <input
            type="text"
            placeholder="Item Price"
            value={newItemPrice}
            onChange={(e) => setNewItemPrice(e.target.value)}
            className="border p-2 rounded"
          />
          <button
            onClick={addItem}
            className="bg-blue-500 text-white p-2 rounded drop-shadow-md"
          >
            {editingItemId ? "Update Item" : "Add Item"}
          </button>
          {editingItemId && (
            <button
              onClick={resetForm}
              className="bg-gray-500 text-white p-2 rounded mt-2"
            >
              Cancel Edit
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-4">
          {menuItems.map((item) => (
            <div
              key={item.item_id}
              className="p-4 bg-Yellow-Green drop-shadow-md rounded-2xl flex flex-col"
            >
              <div className="rounded-2xl bg-gray-50 drop-shadow-md p-3 text-center ring-1 ring-inset ring-gray-900/5 flex flex-col justify-between h-full">
                <div className="flex flex-col justify-center items-center">
                  {editingItemId === item.item_id ? (
                    <>
                      <input
                        type="text"
                        value={newItemName}
                        onChange={(e) => setNewItemName(e.target.value)}
                        className="border p-1 mb-2 rounded w-full"
                      />
                      <textarea
                        value={newItemDesc}
                        onChange={(e) => setNewItemDesc(e.target.value)}
                        className="border p-1 mb-2 rounded w-full"
                      />
                      <input
                        type="text"
                        value={newItemPrice}
                        onChange={(e) => setNewItemPrice(e.target.value)}
                        className="border p-1 mb-2 rounded w-full"
                      />
                      <button
                        onClick={addItem}
                        className="bg-green-500 text-white p-2 rounded w-full drop-shadow-md"
                      >
                        Save
                      </button>
                      <button
                        onClick={resetForm}
                        className="bg-red-500 text-white p-2 rounded mt-2 w-full drop-shadow-md"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <img
                        src={item.image_path || fallbackImage}
                        alt={item.alt_text || "Default image"}
                        className="w-full object-cover rounded-2xl drop-shadow-md"
                      />
                      <p className="text-black font-bold py-2">
                        {item.item_name}
                      </p>
                      <div className="text-black py-2 w-full h-[60px] break-words overflow-auto">
                        {item.item_description}
                      </div>
                      <p className="text-black py-2">${item.item_price}</p>
                    </>
                  )}
                </div>
                <div className="flex flex-col w-full mt-2">
                  <button
                    onClick={() => {
                      setEditingItemId(item.item_id);
                      setNewItemName(item.item_name);
                      setNewItemDesc(item.item_description);
                      setNewItemPrice(item.item_price.toString());
                    }}
                    className="bg-yellow-500 text-white p-2 rounded w-full flex-grow drop-shadow-md"
                  >
                    Edit Item
                  </button>
                  <button
                    onClick={() => removeItem(item.item_id)}
                    className="bg-red-500 text-white p-2 rounded w-full mt-2 flex-grow drop-shadow-md"
                  >
                    Remove Item
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}