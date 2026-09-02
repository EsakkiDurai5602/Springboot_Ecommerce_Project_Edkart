import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { productService } from '../../services/ecommerceServices';
import { useCart } from '../../context/CartContext';
import { formatCurrency } from '../../utils/formatters';
import { CATEGORIES } from '../../utils/constants';
import { StarRating } from '../../components/ui/StarRating';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import {
  ShoppingBag,
  Filter,
  SlidersHorizontal,
  Search,
  Check,
  Grid,
  List,
  RotateCcw,
} from 'lucide-react';

export const ShopPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  const { addToCart, setIsCartDrawerOpen } = useCart();

  // Filters state
  const currentCategory = searchParams.get('category') || 'all';
  const currentKeyword = searchParams.get('keyword') || '';
  const [selectedCategory, setSelectedCategory] = useState(currentCategory);
  const [keywordInput, setKeywordInput] = useState(currentKeyword);
  const [priceMax, setPriceMax] = useState(350000);
  const [minRating, setMinRating] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState('featured');

  useEffect(() => {
    setSelectedCategory(searchParams.get('category') || 'all');
    setKeywordInput(searchParams.get('keyword') || '');
  }, [searchParams]);

  useEffect(() => {
    setLoading(true);
    productService
      .getProducts({
        category: selectedCategory,
        keyword: keywordInput,
        maxPrice: priceMax,
        rating: minRating,
        inStock: inStockOnly,
        sortBy,
      })
      .then((res) => {
        setProducts(res.products || []);
        setLoading(false);
      });
  }, [selectedCategory, keywordInput, priceMax, minRating, inStockOnly, sortBy]);

  const handleCategoryClick = (catId) => {
    setSelectedCategory(catId);
    const newParams = new URLSearchParams(searchParams);
    if (catId === 'all') {
      newParams.delete('category');
    } else {
      newParams.set('category', catId);
    }
    setSearchParams(newParams);
  };

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setKeywordInput('');
    setPriceMax(350000);
    setMinRating(0);
    setInStockOnly(false);
    setSortBy('featured');
    setSearchParams({});
  };

  const handleQuickAdd = (e, product) => {
    e.preventDefault();
    addToCart(product, 1);
    setIsCartDrawerOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Top Breadcrumbs & Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Flagship Electronics Store
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Showing <strong className="text-slate-800 dark:text-slate-200">{products.length}</strong> authenticated products
          </p>
        </div>

        {/* View Controls & Sorting */}
        <div className="flex items-center gap-3">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-xs font-semibold px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none"
          >
            <option value="featured">Sort by: Featured</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="rating">Top Customer Rated</option>
          </select>

          <div className="flex rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${viewMode === 'grid' ? 'bg-brand-600 text-white' : 'text-slate-500'}`}
              title="Grid View"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 ${viewMode === 'list' ? 'bg-brand-600 text-white' : 'text-slate-500'}`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Filters Sidebar + Products */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8">
        {/* Sidebar Filters */}
        <aside className="lg:col-span-3 space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-brand-500" />
                <span>Filters</span>
              </h3>
              <button
                onClick={handleResetFilters}
                className="text-[11px] text-slate-400 hover:text-brand-600 font-semibold flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>

            {/* Category Filter */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Category</label>
              <div className="space-y-1">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryClick(cat.id)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
                      selectedCategory === cat.id
                        ? 'bg-brand-500 text-white font-bold'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span>{cat.name}</span>
                    {selectedCategory === cat.id && <Check className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range Slider */}
            <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="flex justify-between items-center text-xs">
                <label className="font-bold uppercase tracking-wider text-slate-400">Max Price</label>
                <span className="font-mono font-bold text-brand-600 dark:text-amber-400">
                  {formatCurrency(priceMax)}
                </span>
              </div>
              <input
                type="range"
                min="5000"
                max="350000"
                step="5000"
                value={priceMax}
                onChange={(e) => setPriceMax(Number(e.target.value))}
                className="w-full accent-brand-600"
              />
            </div>

            {/* Minimum Star Rating */}
            <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-slate-800">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Customer Rating</label>
              <div className="space-y-1.5 text-xs">
                {[4, 3, 2].map((stars) => (
                  <label key={stars} className="flex items-center gap-2 text-slate-600 dark:text-slate-400 cursor-pointer">
                    <input
                      type="radio"
                      name="rating"
                      checked={minRating === stars}
                      onChange={() => setMinRating(stars)}
                      className="text-brand-600"
                    />
                    <div className="flex items-center gap-1">
                      <StarRating rating={stars} size="sm" />
                      <span className="text-[11px]">& Above</span>
                    </div>
                  </label>
                ))}
                <label className="flex items-center gap-2 text-slate-600 dark:text-slate-400 cursor-pointer">
                  <input
                    type="radio"
                    name="rating"
                    checked={minRating === 0}
                    onChange={() => setMinRating(0)}
                    className="text-brand-600"
                  />
                  <span className="text-[11px]">All Ratings</span>
                </label>
              </div>
            </div>

            {/* In-Stock Toggle */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="rounded text-brand-600"
                />
                <span>In Stock Items Only</span>
              </label>
            </div>
          </div>
        </aside>

        {/* Products Grid */}
        <main className="lg:col-span-9">
          {products.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mx-auto">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">No products found</h3>
              <p className="text-xs text-slate-500">Try adjusting your filters or search keywords.</p>
              <Button onClick={handleResetFilters} variant="primary" size="sm">
                Reset All Filters
              </Button>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((p) => (
                <div
                  key={p.id}
                  className="group rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:shadow-2xl hover:border-brand-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between overflow-hidden"
                >
                  <div>
                    {/* Thumbnail */}
                    <Link to={`/product/${p.id}`} className="relative block h-56 bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <img
                        src={p.images?.[0]?.url}
                        alt={p.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {p.badge && (
                        <div className="absolute top-3 left-3">
                          <Badge variant="warning" size="sm">
                            {p.badge}
                          </Badge>
                        </div>
                      )}
                    </Link>

                    {/* Content */}
                    <div className="p-5 space-y-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600 dark:text-amber-400">
                        {p.category}
                      </span>

                      <Link to={`/product/${p.id}`}>
                        <h3 className="font-extrabold text-sm text-slate-900 dark:text-white hover:text-brand-600 dark:hover:text-amber-400 transition-colors line-clamp-2">
                          {p.name}
                        </h3>
                      </Link>

                      <div className="flex items-center gap-1.5 text-xs">
                        <StarRating rating={p.rating} size="sm" />
                        <span className="font-bold text-slate-700 dark:text-slate-300">{p.rating}</span>
                        <span className="text-slate-400 text-[10px]">({p.numOfReviews})</span>
                      </div>

                      <div className="pt-2 flex items-baseline gap-2">
                        <span className="text-base font-black text-slate-900 dark:text-white">
                          {formatCurrency(p.price)}
                        </span>
                        {p.originalPrice && (
                          <span className="text-xs text-slate-400 line-through">
                            {formatCurrency(p.originalPrice)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="p-5 pt-0">
                    <Button
                      onClick={(e) => handleQuickAdd(e, p)}
                      variant="primary"
                      fullWidth
                      size="sm"
                      leftIcon={<ShoppingBag className="w-3.5 h-3.5" />}
                    >
                      Add to Cart
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* List View */
            <div className="space-y-4">
              {products.map((p) => (
                <div
                  key={p.id}
                  className="group p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row gap-6 items-center hover:shadow-xl transition-all"
                >
                  <Link to={`/product/${p.id}`} className="w-full sm:w-48 h-44 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 flex-shrink-0">
                    <img src={p.images?.[0]?.url} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  </Link>

                  <div className="flex-1 space-y-2 min-w-0">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600 dark:text-amber-400">{p.category}</span>
                    <Link to={`/product/${p.id}`}>
                      <h3 className="font-extrabold text-base text-slate-900 dark:text-white hover:text-brand-600 transition-colors">{p.name}</h3>
                    </Link>
                    <p className="text-xs text-slate-500 line-clamp-2">{p.description}</p>
                    <div className="flex items-center gap-1.5 text-xs">
                      <StarRating rating={p.rating} size="sm" />
                      <span className="font-bold text-slate-700 dark:text-slate-300">{p.rating}</span>
                      <span className="text-slate-400 text-[10px]">({p.numOfReviews} verified reviews)</span>
                    </div>
                  </div>

                  <div className="w-full sm:w-48 flex flex-col items-end justify-between self-stretch pt-2 sm:pt-0 sm:border-l sm:border-slate-100 sm:dark:border-slate-800 sm:pl-6 space-y-3">
                    <div className="text-right">
                      <span className="text-lg font-black text-slate-900 dark:text-white block">{formatCurrency(p.price)}</span>
                      {p.originalPrice && <span className="text-xs text-slate-400 line-through">{formatCurrency(p.originalPrice)}</span>}
                    </div>
                    <Button onClick={(e) => handleQuickAdd(e, p)} variant="primary" size="sm" fullWidth leftIcon={<ShoppingBag className="w-3.5 h-3.5" />}>
                      Add to Cart
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
