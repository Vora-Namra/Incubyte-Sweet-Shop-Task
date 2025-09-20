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
import { 
  Plus, 
  Search, 
  ShoppingCart, 
  Package, 
  Trash2, 
  Edit3, 
  LogOut, 
  Sparkles, 
  Filter,
  X,
  Save,
  RefreshCw,
  AlertCircle,
  Crown,
  TrendingUp,
  DollarSign,
  Star
} from "lucide-react";

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
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showSearchFilters, setShowSearchFilters] = useState(false);

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
        setShowCreateForm(false);
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
    if (!confirm("Are you sure you want to delete this sweet?")) return;
    
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

  // Calculate stats
  const totalSweets = sweets.length;
  const totalValue = sweets.reduce((sum, sweet) => sum + (sweet.price * sweet.quantity), 0);
  const lowStockItems = sweets.filter(sweet => sweet.quantity < 10).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/60 backdrop-blur-xl border-b border-pink-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl rotate-12 transform"></div>
                <Sparkles className="absolute inset-0 w-6 h-6 text-white m-auto rotate-12" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                  SweetShop
                </h1>
                {isAdmin && (
                  <div className="flex items-center space-x-1">
                    <Crown className="w-3 h-3 text-yellow-500" />
                    <span className="text-xs text-gray-600 font-medium">Admin Panel</span>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-4">
              {/* Mobile menu toggle */}
              <div className="flex items-center space-x-2 lg:hidden">
                <button
                  onClick={() => setShowSearchFilters(!showSearchFilters)}
                  className="p-2 text-gray-600 hover:text-pink-600 transition-colors"
                >
                  <Filter className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setShowCreateForm(!showCreateForm)}
                  className="p-2 text-gray-600 hover:text-pink-600 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>

              {/* Desktop actions */}
              <div className="hidden lg:flex items-center space-x-3">
                <button
                  onClick={() => setShowSearchFilters(!showSearchFilters)}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-pink-600 transition-colors"
                >
                  <Filter className="w-4 h-4" />
                  <span>Filter</span>
                </button>
                <button
                  onClick={() => setShowCreateForm(!showCreateForm)}
                  className="flex items-center space-x-2 bg-gradient-to-r from-pink-500 to-rose-600 text-white px-4 py-2 rounded-xl hover:from-pink-600 hover:to-rose-700 transition-all duration-300 transform hover:scale-105"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Sweet</span>
                </button>
              </div>

              <button
                onClick={logout}
                className="flex items-center space-x-2 text-gray-700 hover:text-red-600 transition-colors p-2"
              >
                <LogOut className="w-5 h-5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p>{error}</p>
            <button 
              onClick={() => setError(null)}
              className="ml-auto text-red-600 hover:text-red-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 border border-pink-100">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-2xl flex items-center justify-center">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Total Products</p>
                <p className="text-2xl font-bold text-gray-800">{totalSweets}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 border border-pink-100">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Total Value</p>
                <p className="text-2xl font-bold text-gray-800">${totalValue.toFixed(2)}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 border border-pink-100">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Low Stock Items</p>
                <p className="text-2xl font-bold text-gray-800">{lowStockItems}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Search Filters */}
            <div className={`bg-white/60 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 overflow-hidden transition-all duration-300 ${showSearchFilters ? 'block' : 'hidden lg:block'}`}>
              <div className="bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 px-6 py-4 text-white">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold flex items-center space-x-2">
                    <Search className="w-5 h-5" />
                    <span>Search Filters</span>
                  </h2>
                  <button 
                    onClick={() => setShowSearchFilters(false)}
                    className="lg:hidden text-white/80 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    placeholder="Search by name..."
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="w-full bg-white/50 border-2 border-pink-200 rounded-xl px-4 py-3 focus:outline-none focus:border-pink-500 transition-colors"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                  <input
                    type="text"
                    placeholder="Search by category..."
                    value={searchCategory}
                    onChange={(e) => setSearchCategory(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="w-full bg-white/50 border-2 border-pink-200 rounded-xl px-4 py-3 focus:outline-none focus:border-pink-500 transition-colors"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Min Price</label>
                    <input
                      type="number"
                      placeholder="$0"
                      value={searchMinPrice}
                      onChange={(e) => setSearchMinPrice(e.target.value)}
                      onKeyDown={handleKeyDown}
                      className="w-full bg-white/50 border-2 border-pink-200 rounded-xl px-4 py-3 focus:outline-none focus:border-pink-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Max Price</label>
                    <input
                      type="number"
                      placeholder="$999"
                      value={searchMaxPrice}
                      onChange={(e) => setSearchMaxPrice(e.target.value)}
                      onKeyDown={handleKeyDown}
                      className="w-full bg-white/50 border-2 border-pink-200 rounded-xl px-4 py-3 focus:outline-none focus:border-pink-500 transition-colors"
                    />
                  </div>
                </div>
                
                <button
                  onClick={handleSearch}
                  className="w-full bg-gradient-to-r from-pink-500 to-rose-600 text-white py-3 rounded-xl hover:from-pink-600 hover:to-rose-700 transition-all duration-300 transform hover:scale-105 font-semibold flex items-center justify-center space-x-2"
                >
                  <Search className="w-4 h-4" />
                  <span>Search Sweets</span>
                </button>
                
                <button
                  onClick={() => {
                    setSearchName("");
                    setSearchCategory("");
                    setSearchMinPrice("");
                    setSearchMaxPrice("");
                    loadSweets();
                  }}
                  className="w-full border-2 border-pink-200 text-pink-600 py-3 rounded-xl hover:bg-pink-50 transition-colors font-semibold flex items-center justify-center space-x-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Clear Filters</span>
                </button>
              </div>
            </div>

            {/* Create Sweet Form */}
            <div className={`bg-white/60 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 overflow-hidden transition-all duration-300 ${showCreateForm ? 'block' : 'hidden lg:block'}`}>
              <div className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-600 px-6 py-4 text-white">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold flex items-center space-x-2">
                    <Plus className="w-5 h-5" />
                    <span>Add New Sweet</span>
                  </h2>
                  <button 
                    onClick={() => setShowCreateForm(false)}
                    className="lg:hidden text-white/80 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <form onSubmit={handleCreate} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Name *</label>
                  <input
                    type="text"
                    placeholder="Sweet name..."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-white/50 border-2 border-pink-200 rounded-xl px-4 py-3 focus:outline-none focus:border-pink-500 transition-colors"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Category *</label>
                  <input
                    type="text"
                    placeholder="Category..."
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-white/50 border-2 border-pink-200 rounded-xl px-4 py-3 focus:outline-none focus:border-pink-500 transition-colors"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Price *</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full bg-white/50 border-2 border-pink-200 rounded-xl px-4 py-3 focus:outline-none focus:border-pink-500 transition-colors"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Quantity *</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full bg-white/50 border-2 border-pink-200 rounded-xl px-4 py-3 focus:outline-none focus:border-pink-500 transition-colors"
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 font-semibold flex items-center justify-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Sweet</span>
                </button>
              </form>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <div className="text-center">
                  <div className="w-12 h-12 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-600 font-medium">Loading sweets...</p>
                </div>
              </div>
            ) : sweets.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-gradient-to-br from-pink-400 to-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No sweets found</h3>
                <p className="text-gray-600 mb-6">Start by adding some delicious sweets to your inventory!</p>
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="bg-gradient-to-r from-pink-500 to-rose-600 text-white px-6 py-3 rounded-xl hover:from-pink-600 hover:to-rose-700 transition-all duration-300 transform hover:scale-105 font-semibold"
                >
                  Add Your First Sweet
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {sweets.map((sweet) => (
                  <SweetItem
                    key={sweet._id}
                    sweet={sweet}
                    token={token!}
                    isAdmin={isAdmin}
                    setSweets={setSweets}
                    setError={setError}
                    handlePurchase={handlePurchase}
                    handleRestock={handleRestock}
                    handleDelete={handleDelete}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
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
  const [isEditing, setIsEditing] = useState(false);
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
        setIsEditing(false);
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

  const getCategoryColor = (category: string) => {
    const colors = {
      chocolate: "from-amber-400 to-orange-500",
      candy: "from-pink-400 to-rose-500",
      gummy: "from-purple-400 to-violet-500",
      lollipop: "from-green-400 to-emerald-500",
      default: "from-blue-400 to-cyan-500"
    };
    const key = category.toLowerCase() as keyof typeof colors;
    return colors[key] || colors.default;
  };

  const isLowStock = sweet.quantity < 10;
  const isOutOfStock = sweet.quantity === 0;

  return (
    <div className="bg-white/60 backdrop-blur-sm rounded-3xl shadow-lg border border-white/20 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105">
      {/* Card Header */}
      <div className={`bg-gradient-to-r ${getCategoryColor(sweet.category)} px-6 py-4 text-white relative`}>
        <div className="flex items-center justify-between">
          {isEditing ? (
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="bg-white/20 border border-white/30 rounded-lg px-3 py-1 text-white placeholder-white/70 text-lg font-semibold"
              placeholder="Sweet name..."
            />
          ) : (
            <h3 className="text-lg font-semibold truncate">{sweet.name}</h3>
          )}
          
          <div className="flex items-center space-x-2">
            {isLowStock && (
              <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
            )}
            <Star className="w-4 h-4 text-white/60" />
          </div>
        </div>
        
        {isEditing ? (
          <input
            type="text"
            value={editCategory}
            onChange={(e) => setEditCategory(e.target.value)}
            className="bg-white/20 border border-white/30 rounded-lg px-3 py-1 text-white placeholder-white/70 text-sm mt-2"
            placeholder="Category..."
          />
        ) : (
          <p className="text-white/80 text-sm capitalize">{sweet.category}</p>
        )}
      </div>

      {/* Card Body */}
      <div className="p-6">
        {/* Price and Quantity */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="text-xs text-gray-600 font-semibold uppercase tracking-wider">Price</label>
            {isEditing ? (
              <input
                type="number"
                step="0.01"
                value={editPrice}
                onChange={(e) => setEditPrice(e.target.value)}
                className="w-full bg-white/50 border-2 border-pink-200 rounded-lg px-3 py-2 mt-1 text-lg font-bold text-gray-800 focus:outline-none focus:border-pink-500"
              />
            ) : (
              <p className="text-2xl font-bold text-gray-800">${sweet.price.toFixed(2)}</p>
            )}
          </div>
          
          <div>
            <label className="text-xs text-gray-600 font-semibold uppercase tracking-wider">Stock</label>
            {isEditing ? (
              <input
                type="number"
                value={editQuantity}
                onChange={(e) => setEditQuantity(e.target.value)}
                className="w-full bg-white/50 border-2 border-pink-200 rounded-lg px-3 py-2 mt-1 text-lg font-bold text-gray-800 focus:outline-none focus:border-pink-500"
              />
            ) : (
              <div className="flex items-center space-x-2">
                <p className={`text-2xl font-bold ${isOutOfStock ? 'text-red-500' : isLowStock ? 'text-yellow-500' : 'text-gray-800'}`}>
                  {sweet.quantity}
                </p>
                {isLowStock && !isOutOfStock && (
                  <div className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                    Low
                  </div>
                )}
                {isOutOfStock && (
                  <div className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                    Out
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Purchase Section */}
        {!isEditing && (
          <div className="mb-4">
            <label className="text-xs text-gray-600 font-semibold uppercase tracking-wider mb-2 block">Purchase Quantity</label>
            <div className="flex items-center space-x-3">
              <input
                type="number"
                min={1}
                max={sweet.quantity}
                value={purchaseQty}
                onChange={(e) => setPurchaseQty(Number(e.target.value))}
                className="w-20 bg-white/50 border-2 border-pink-200 rounded-lg px-3 py-2 text-center font-semibold focus:outline-none focus:border-pink-500"
                disabled={isOutOfStock}
              />
              <button
                onClick={handlePurchaseClick}
                disabled={isOutOfStock || purchaseQty > sweet.quantity}
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-2 px-4 rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300 font-semibold flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Purchase</span>
              </button>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between space-x-2">
          {isEditing ? (
            <div className="flex space-x-2 w-full">
              <button
                onClick={handleUpdate}
                className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-600 text-white py-2 px-4 rounded-lg hover:from-blue-600 hover:to-cyan-700 transition-all duration-300 font-semibold flex items-center justify-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>Save</span>
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditName(sweet.name);
                  setEditCategory(sweet.category);
                  setEditPrice(sweet.price.toString());
                  setEditQuantity(sweet.quantity.toString());
                }}
                className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <Edit3 className="w-4 h-4" />
                <span className="hidden sm:inline">Edit</span>
              </button>

              {isAdmin && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleRestockClick(5)}
                    className="flex items-center space-x-2 bg-gradient-to-r from-yellow-500 to-orange-600 text-white py-2 px-3 rounded-lg hover:from-yellow-600 hover:to-orange-700 transition-all duration-300 font-semibold text-sm"
                  >
                    <Package className="w-4 h-4" />
                    <span className="hidden sm:inline">+5</span>
                  </button>
                  <button
                    onClick={() => handleDelete(sweet._id)}
                    className="flex items-center space-x-2 bg-gradient-to-r from-red-500 to-red-600 text-white py-2 px-3 rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 font-semibold text-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="hidden sm:inline">Delete</span>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Stock Status Indicator */}
      <div className={`h-1 w-full ${isOutOfStock ? 'bg-red-500' : isLowStock ? 'bg-yellow-500' : 'bg-green-500'}`}></div>
    </div>
  );
}