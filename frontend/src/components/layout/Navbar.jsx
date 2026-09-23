import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, NavLink } from 'react-router-dom';
import {
  ShoppingBag,
  Search,
  Sun,
  Moon,
  User,
  ShieldCheck,
  Menu,
  X,
  ChevronDown,
  Sparkles,
  Package,
  Layers,
  LogOut,
  Tag,
  ArrowRight,
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { CATEGORIES } from '../../utils/constants';
import { productService } from '../../services/ecommerceServices';
import { formatCurrency, getProductImageUrl, CATEGORY_FALLBACK_IMAGES, getCategorySvgFallback } from '../../utils/formatters';

export const Navbar = () => {
  const { totalItems, setIsCartDrawerOpen } = useCart();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [keyword, setKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // Live search suggestion state
  const [suggestions, setSuggestions] = useState([]);
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false);
  const [allProductsCache, setAllProductsCache] = useState([]);
  const searchContainerRef = useRef(null);
  const mobileSearchRef = useRef(null);

  const navigate = useNavigate();

  // Load products for instant suggestion matching
  useEffect(() => {
    productService.getProducts().then((res) => {
      setAllProductsCache(res.products || []);
    }).catch(() => {});
  }, []);

  // Filter suggestions dynamically on keyword/category change
  useEffect(() => {
    const q = keyword.trim().toLowerCase();
    if (!q) {
      setSuggestions([]);
      setIsSuggestionsOpen(false);
      return;
    }

    const filtered = allProductsCache.filter((p) => {
      const matchCat = selectedCategory === 'all' || p.category?.toLowerCase() === selectedCategory.toLowerCase();
      const matchText = p.name?.toLowerCase().includes(q) || p.category?.toLowerCase().includes(q) || p.seller?.toLowerCase().includes(q);
      return matchCat && matchText;
    }).slice(0, 6);

    setSuggestions(filtered);
    setIsSuggestionsOpen(true);
  }, [keyword, selectedCategory, allProductsCache]);

  // Click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target) &&
        mobileSearchRef.current &&
        !mobileSearchRef.current.contains(e.target)
      ) {
        setIsSuggestionsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setIsSuggestionsOpen(false);
    if (keyword.trim() || selectedCategory !== 'all') {
      const params = new URLSearchParams();
      if (keyword.trim()) params.set('keyword', keyword.trim());
      if (selectedCategory !== 'all') params.set('category', selectedCategory);
      navigate(`/shop?${params.toString()}`);
    } else {
      navigate('/shop');
    }
  };

  const handleSelectSuggestion = (prod) => {
    setIsSuggestionsOpen(false);
    setKeyword('');
    navigate(`/product/${prod.id}`);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Category trigger */}
          <div className="flex items-center gap-6 flex-shrink-0">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-brand-600 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-brand-500/20 group-hover:scale-105 transition-transform">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <span className="font-black text-xl tracking-tight text-slate-900 dark:text-white block">
                  Ed<span className="text-brand-600 dark:text-amber-400">Kart</span>
                </span>
                <span className="text-[9px] uppercase font-bold tracking-widest text-slate-400 block -mt-1">
                  Premium Electronics
                </span>
              </div>
            </Link>

            <Link
              to="/shop"
              className="hidden lg:flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-brand-600 dark:hover:text-amber-400 px-3 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Layers className="w-4 h-4 text-brand-500" />
              <span>Explore Catalog</span>
            </Link>
          </div>

          {/* Desktop Search Bar with Category Selector & Live Suggestions */}
          <div ref={searchContainerRef} className="hidden md:flex flex-1 max-w-xl relative">
            <form onSubmit={handleSearch} className="w-full">
              <div className="flex w-full rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 overflow-hidden focus-within:ring-2 focus-within:ring-brand-500 focus-within:border-brand-500 transition-all shadow-sm">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="bg-transparent text-xs font-semibold text-slate-700 dark:text-slate-300 border-r border-slate-300 dark:border-slate-700 px-3 py-2.5 focus:outline-none cursor-pointer"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id} className="bg-white dark:bg-slate-900">
                      {cat.name}
                    </option>
                  ))}
                </select>

                <input
                  type="text"
                  placeholder="Search 100+ Flagships, MacBooks, Audio, PS5, Watches..."
                  value={keyword}
                  onFocus={() => {
                    if (suggestions.length > 0) setIsSuggestionsOpen(true);
                  }}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="flex-1 bg-transparent px-3.5 py-2.5 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none"
                />

                {keyword && (
                  <button
                    type="button"
                    onClick={() => {
                      setKeyword('');
                      setIsSuggestionsOpen(false);
                    }}
                    className="px-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}

                <button
                  type="submit"
                  className="px-4 bg-brand-600 hover:bg-brand-700 text-white flex items-center justify-center transition-colors"
                >
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </form>

            {/* Live Autocomplete Suggestions Dropdown */}
            {isSuggestionsOpen && suggestions.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-50 animate-scale-in">
                <div className="p-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3">
                  <span>Suggested Products ({suggestions.length})</span>
                  <span className="text-brand-600 dark:text-amber-400 font-semibold">Instant Live Results</span>
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
                  {suggestions.map((prod) => (
                    <button
                      key={prod.id}
                      type="button"
                      onClick={() => handleSelectSuggestion(prod)}
                      className="w-full flex items-center gap-3 p-2.5 text-left hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors group"
                    >
                      <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 overflow-hidden flex-shrink-0 border border-slate-200 dark:border-slate-700">
                        <img
                          src={getProductImageUrl(prod, 0)}
                          alt={prod.name}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = CATEGORY_FALLBACK_IMAGES[prod.category] || getCategorySvgFallback(prod.category, prod.name);
                          }}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold uppercase text-brand-600 dark:text-amber-400 bg-brand-50 dark:bg-slate-800 px-1.5 py-0.5 rounded-md">
                            {prod.category}
                          </span>
                          {prod.stock <= 0 ? (
                            <span className="text-[9px] font-bold text-rose-500">Out of Stock</span>
                          ) : (
                            <span className="text-[9px] text-emerald-600 font-medium">★ {prod.rating || 4.8}</span>
                          )}
                        </div>
                        <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate mt-0.5 group-hover:text-brand-600 dark:group-hover:text-amber-400">
                          {prod.name}
                        </h4>
                      </div>

                      <div className="text-right flex-shrink-0">
                        <span className="text-xs font-black text-slate-900 dark:text-white font-mono block">
                          {formatCurrency(prod.price)}
                        </span>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-brand-600 dark:group-hover:text-amber-400 ml-auto mt-0.5 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </button>
                  ))}
                </div>

                <div className="p-2 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 text-center">
                  <button
                    type="button"
                    onClick={handleSearch}
                    className="text-xs font-bold text-brand-600 dark:text-amber-400 hover:underline flex items-center justify-center gap-1.5 mx-auto"
                  >
                    <span>View all search results for &ldquo;{keyword}&rdquo;</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Toggle Day / Night Mode"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            {/* Orders Link */}
            <Link
              to="/orders"
              className="hidden sm:flex items-center gap-1 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-brand-600 px-2.5 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Package className="w-4 h-4 text-slate-500" />
              <span>Orders</span>
            </Link>

            {/* Shopping Cart Drawer Trigger */}
            <button
              onClick={() => setIsCartDrawerOpen(true)}
              className="relative p-2.5 rounded-xl bg-brand-50 dark:bg-slate-800 text-brand-600 dark:text-amber-400 hover:bg-brand-100 dark:hover:bg-slate-700 transition-colors flex items-center"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[10px] font-black h-5 min-w-[20px] px-1 rounded-full flex items-center justify-center shadow-md animate-scale-in">
                  {totalItems}
                </span>
              )}
            </button>

            {/* User Profile / Admin Menu */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <div className="w-7 h-7 rounded-lg bg-brand-600 text-white font-black text-xs flex items-center justify-center">
                    {user?.fullName?.charAt(0) || 'U'}
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl py-2 z-50 text-xs animate-scale-in">
                    <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                      <p className="font-bold text-slate-900 dark:text-white truncate">{user?.fullName}</p>
                      <p className="text-[10px] text-slate-400 truncate">{user?.email}</p>
                    </div>

                    {isAdmin && (
                      <Link
                        to="/admin/dashboard"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-amber-600 dark:text-amber-400 font-bold hover:bg-amber-50 dark:hover:bg-amber-950/30"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        <span>Admin Console</span>
                      </Link>
                    )}

                    <Link
                      to="/orders"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      <Package className="w-4 h-4" />
                      <span>My Orders</span>
                    </Link>

                    <button
                      onClick={() => {
                        logout();
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-left font-semibold"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="text-xs font-bold px-3.5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white shadow-md shadow-brand-500/20 transition-colors"
              >
                Sign In
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar & Live Suggestions */}
        <div ref={mobileSearchRef} className="md:hidden pb-3 relative">
          <form onSubmit={handleSearch} className="flex rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 overflow-hidden">
            <input
              type="text"
              placeholder="Search tech products..."
              value={keyword}
              onFocus={() => {
                if (suggestions.length > 0) setIsSuggestionsOpen(true);
              }}
              onChange={(e) => setKeyword(e.target.value)}
              className="flex-1 bg-transparent px-3 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-none"
            />
            <button type="submit" className="px-3 bg-brand-600 text-white">
              <Search className="w-3.5 h-3.5" />
            </button>
          </form>

          {isSuggestionsOpen && suggestions.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden z-50">
              <div className="max-h-60 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                {suggestions.map((prod) => (
                  <button
                    key={prod.id}
                    type="button"
                    onClick={() => handleSelectSuggestion(prod)}
                    className="w-full flex items-center gap-2.5 p-2 text-left hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    <img
                      src={getProductImageUrl(prod, 0)}
                      alt={prod.name}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = CATEGORY_FALLBACK_IMAGES[prod.category] || getCategorySvgFallback(prod.category, prod.name);
                      }}
                      className="w-8 h-8 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">{prod.name}</p>
                      <p className="text-[10px] text-brand-600 dark:text-amber-400 font-mono">{formatCurrency(prod.price)}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
