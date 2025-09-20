import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  getSweets,
  createSweet,
  purchaseSweet,
  restockSweet,
  deleteSweet,
  searchSweets,
  updateSweet,
} from "../api/sweet";

type Sweet = {
  _id: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
};

export default function Sweets() {
  const { token, logout, isAdmin } = useAuth();
  const [sweets, setSweets] = useState<Sweet[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state for creating sweet
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");

  // Search state
  const [searchName, setSearchName] = useState("");
  const [searchCategory, setSearchCategory] = useState("");
  const [searchMinPrice, setSearchMinPrice] = useState("");
  const [searchMaxPrice, setSearchMaxPrice] = useState("");

  useEffect(() => {
    if (token) loadSweets();
  }, [token]);

  const loadSweets = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getSweets(token!);
      if (Array.isArray(data)) setSweets(data);
      else setError(data.message || "Failed to load sweets");
    } catch {
      setError("Failed to fetch sweets");
    }
    setLoading(false);
  };

  // --- CREATE ---
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    if (!name.trim() || !category.trim()) {
      setError("Name and Category cannot be empty or spaces only");
      return;
    }

    try {
      const newSweet = await createSweet(token, {
        name: name.trim(),
        category: category.trim(),
        price: Number(price),
        quantity: Number(quantity),
      });

      if (newSweet._id) {
        setSweets((prev) => [...prev, newSweet]);
        setName("");
        setCategory("");
        setPrice("");
        setQuantity("");
        setError(null);
      } else {
        setError(newSweet.message || "Failed to create sweet");
      }
    } catch {
      setError("Failed to create sweet");
    }
  };

  // --- PURCHASE ---
  const handlePurchase = async (id: string, qty: number) => {
    if (!token) return;
    try {
      const res = await purchaseSweet(token, id, qty);
      if (res.sweet)
        setSweets((prev) => prev.map((s) => (s._id === id ? res.sweet : s)));
      else setError(res.message || "Failed to purchase sweet");
    } catch {
      setError("Purchase failed");
    }
  };

  // --- RESTOCK (Admin only) ---
  const handleRestock = async (id: string, amount: number) => {
    if (!token || !isAdmin || amount <= 0) return;
    try {
      const res = await restockSweet(token, id, amount);
      if (res.sweet)
        setSweets((prev) => prev.map((s) => (s._id === id ? res.sweet : s)));
      else setError(res.message || "Restock failed");
    } catch {
      setError("Restock failed");
    }
  };

  // --- DELETE (Admin only) ---
  const handleDelete = async (id: string) => {
    if (!token || !isAdmin) return;
    try {
      const res = await deleteSweet(token, id);
      if (res.message === "Deleted")
        setSweets((prev) => prev.filter((s) => s._id !== id));
      else setError(res.message || "Delete failed");
    } catch {
      setError("Delete failed");
    }
  };

  // --- SEARCH ---
  const handleSearch = async () => {
    if (!token) return;

    // If all filters empty, reload all sweets
    if (!searchName && !searchCategory && !searchMinPrice && !searchMaxPrice) {
      loadSweets();
      return;
    }

    try {
      const data = await searchSweets(token, {
        name: searchName,
        category: searchCategory,
        minPrice: searchMinPrice,
        maxPrice: searchMaxPrice,
      });

      if (Array.isArray(data)) {
        setSweets(data);
        setError(null);
      } else {
        setError(data.message || "Search failed");
      }
    } catch {
      setError("Search failed");
    }
  };

  // --- Enter key search ---
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-pink-50 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Sweet Shop</h1>
        <button
          onClick={logout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-600 rounded">{error}</div>
      )}

      {/* Search Filters */}
      <div className="bg-white shadow-md rounded-lg p-4 mb-6 max-w-md space-y-2">
        <h2 className="text-lg font-semibold text-gray-700">Search Sweets</h2>
        <input
          type="text"
          placeholder="Name"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Category"
          value={searchCategory}
          onChange={(e) => setSearchCategory(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full border p-2 rounded"
        />
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min Price"
            value={searchMinPrice}
            onChange={(e) => setSearchMinPrice(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-1/2 border p-2 rounded"
          />
          <input
            type="number"
            placeholder="Max Price"
            value={searchMaxPrice}
            onChange={(e) => setSearchMaxPrice(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-1/2 border p-2 rounded"
          />
        </div>
        <button
          onClick={handleSearch}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Search
        </button>
      </div>

      {/* Create Sweet Form */}
      <form
        onSubmit={handleCreate}
        className="bg-white shadow-md rounded-lg p-6 mb-8 space-y-4 max-w-md"
      >
        <h2 className="text-xl font-semibold text-gray-700">Add a Sweet</h2>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="number"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Add Sweet
        </button>
      </form>

      {/* Sweets List */}
      {loading ? (
        <p>Loading sweets...</p>
      ) : (
        sweets.map((s) => (
          <SweetItem
            key={s._id}
            sweet={s}
            token={token!}
            isAdmin={isAdmin}
            setSweets={setSweets}
            setError={setError}
            handlePurchase={handlePurchase}
            handleRestock={handleRestock}
            handleDelete={handleDelete}
          />
        ))
      )}
    </div>
  );
}

// --- SweetItem component ---
type SweetItemProps = {
  sweet: Sweet;
  token: string;
  isAdmin: boolean;
  setSweets: React.Dispatch<React.SetStateAction<Sweet[]>>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  handlePurchase: (id: string, qty: number) => void;
  handleRestock: (id: string, amount: number) => void;
  handleDelete: (id: string) => void;
};

function SweetItem({
  sweet,
  token,
  isAdmin,
  setSweets,
  setError,
  handlePurchase,
  handleRestock,
  handleDelete,
}: SweetItemProps) {
  const [editName, setEditName] = useState(sweet.name);
  const [editCategory, setEditCategory] = useState(sweet.category);
  const [editPrice, setEditPrice] = useState(sweet.price.toString());
  const [editQuantity, setEditQuantity] = useState(sweet.quantity.toString());
  const [purchaseQty, setPurchaseQty] = useState(1);

  // Sync local state if sweet quantity changes externally
  useEffect(() => {
    setEditQuantity(sweet.quantity.toString());
  }, [sweet.quantity]);

  const handleUpdate = async () => {
    try {
      const updatedSweet = await updateSweet(token, sweet._id, {
        name: editName,
        category: editCategory,
        price: Number(editPrice),
        quantity: Number(editQuantity),
      });
      if (updatedSweet._id) {
        setSweets((prev) =>
          prev.map((s) => (s._id === sweet._id ? updatedSweet : s))
        );
        setError(null);
      } else setError(updatedSweet.message || "Update failed");
    } catch {
      setError("Update failed");
    }
  };

  const handlePurchaseClick = () => {
    const newQuantity = sweet.quantity - purchaseQty;
    handlePurchase(sweet._id, purchaseQty);
    setEditQuantity(newQuantity.toString());
    setPurchaseQty(1);
  };

  const handleRestockClick = (amount: number) => {
    handleRestock(sweet._id, amount);
    setEditQuantity((Number(editQuantity) + amount).toString());
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-4 flex flex-col md:flex-row md:justify-between md:items-center gap-2">
      <div className="flex flex-col gap-1">
        <input
          type="text"
          value={editName}
          onChange={(e) => setEditName(e.target.value)}
          className="border p-1 rounded"
        />
        <input
          type="text"
          value={editCategory}
          onChange={(e) => setEditCategory(e.target.value)}
          className="border p-1 rounded"
        />
        <input
          type="number"
          value={editPrice}
          onChange={(e) => setEditPrice(e.target.value)}
          className="border p-1 rounded"
        />
        <input
          type="number"
          value={editQuantity}
          onChange={(e) => setEditQuantity(e.target.value)}
          className="border p-1 rounded"
        />
        <p className="text-gray-800 font-medium">
          Current Stock: {sweet.quantity}
        </p>
      </div>

      <div className="flex gap-2 mt-2 md:mt-0 items-center">
        <button
          onClick={handleUpdate}
          className="bg-blue-600 text-white py-1 px-2 rounded hover:bg-blue-700"
        >
          Update
        </button>

        <input
          type="number"
          min={1}
          max={sweet.quantity}
          value={purchaseQty}
          onChange={(e) => setPurchaseQty(Number(e.target.value))}
          className="w-16 border rounded p-1 text-center"
        />
        <button
          onClick={handlePurchaseClick}
          className="bg-green-500 text-white py-1 px-2 rounded hover:bg-green-600"
        >
          Purchase
        </button>

        {isAdmin && (
          <>
            <button
              onClick={() => handleRestockClick(5)}
              className="bg-yellow-500 text-white py-1 px-2 rounded hover:bg-yellow-600"
            >
              Restock +5
            </button>
            <button
              onClick={() => handleDelete(sweet._id)}
              className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600"
            >
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
}
