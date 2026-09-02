import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productService } from '../../services/ecommerceServices';
import { useCart } from '../../context/CartContext';
import { formatCurrency } from '../../utils/formatters';
import { CATEGORIES } from '../../utils/constants';
import { StarRating } from '../../components/ui/StarRating';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import {
  ShoppingBag,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Flame,
  Zap,
  ShieldCheck,
  Truck,
  RotateCcw,
  Check,
} from 'lucide-react';

export const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart, setIsCartDrawerOpen } = useCart();

  useEffect(() => {
    productService.getProducts().then((res) => {
      setProducts(res.products || []);
      setLoading(false);
    });
  }, []);

  const featuredProducts = products.slice(0, 4);
  const flashDeals = products.slice(2, 6);

  const handleQuickAdd = (e, product) => {
    e.preventDefault();
    addToCart(product, 1);
    setIsCartDrawerOpen(true);
  };

  return (
    <div className="space-y-12 sm:space-y-16 pb-16">
      {/* Hero Showcase Banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Hero Text */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-bold">
              <Flame className="w-4 h-4 text-amber-400" />
              <span>NEXT-GEN FLAGSHIP TECH LAUNCH 2026</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
              Unleash the Power of{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-brand-400 to-cyan-400">
                Pure Innovation.
              </span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Explore India's largest curated destination for Apple iPhones, M3 Max MacBooks, Sony Hi-Res Audio, and Next-Gen PS5 Gaming.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link to="/shop">
                <Button variant="primary" size="lg" className="w-full sm:w-auto text-sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Shop Flagship Catalog
                </Button>
              </Link>
              <Link to="/shop?category=Smartphones">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto text-sm bg-white/10 hover:bg-white/20 text-white border-white/20">
                  Explore Smartphones
                </Button>
              </Link>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-800/80 max-w-md mx-auto lg:mx-0 text-left">
              <div>
                <span className="font-black text-lg sm:text-2xl text-white block">100%</span>
                <span className="text-[11px] text-slate-400">Genuine Tech</span>
              </div>
              <div>
                <span className="font-black text-lg sm:text-2xl text-amber-400 block">2-Day</span>
                <span className="text-[11px] text-slate-400">Express Delivery</span>
              </div>
              <div>
                <span className="font-black text-lg sm:text-2xl text-emerald-400 block">4.9★</span>
                <span className="text-[11px] text-slate-400">Customer Rating</span>
              </div>
            </div>
          </div>

          {/* Hero Featured Visual */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative w-full max-w-md aspect-square rounded-3xl overflow-hidden shadow-2xl shadow-brand-500/20 border border-slate-700 group">
              <img
                src="https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=1000&auto=format&fit=crop&q=80"
                alt="iPhone 16 Pro Max"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent flex flex-col justify-end p-6">
                <Badge variant="warning" size="sm" className="self-start mb-2">
                  FLAGSHIP OF THE YEAR
                </Badge>
                <h3 className="font-extrabold text-xl text-white">Apple iPhone 16 Pro Max</h3>
                <p className="text-xs text-slate-300 mt-1">Starting at ₹1,44,900 with Zero Cost EMI</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Grid Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Browse Top Categories
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Engineered for creators, pros, and gamers</p>
          </div>
          <Link to="/shop" className="text-xs font-bold text-brand-600 dark:text-amber-400 hover:underline flex items-center gap-1">
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {CATEGORIES.filter((c) => c.id !== 'all').map((cat) => (
            <Link
              key={cat.id}
              to={`/shop?category=${cat.id}`}
              className="group p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-brand-500 dark:hover:border-amber-500 hover:shadow-xl transition-all"
            >
              <div className="h-12 w-12 rounded-2xl bg-brand-50 dark:bg-slate-800 text-brand-600 dark:text-amber-400 flex items-center justify-center font-black group-hover:scale-110 transition-transform mb-3">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-amber-400 transition-colors">
                {cat.name}
              </h3>
              <span className="text-[11px] text-slate-400 block mt-1">Explore Products →</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500 fill-amber-500" />
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                Featured Tech Drops
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">Top-rated bestsellers handpicked by our specialists</p>
          </div>
          <Link to="/shop" className="text-xs font-bold text-brand-600 dark:text-amber-400 hover:underline">
            Browse All ({products.length})
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((p) => (
            <div
              key={p.id}
              className="group rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:shadow-2xl hover:border-brand-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between overflow-hidden"
            >
              <div>
                {/* Product Thumbnail */}
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

                {/* Info */}
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

              {/* Add to Cart Footer */}
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
      </section>

      {/* Special Offer Promotional Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-amber-500 via-brand-600 to-indigo-900 text-white p-8 sm:p-12 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl text-center md:text-left z-10">
            <span className="text-xs uppercase font-extrabold tracking-wider bg-white/20 px-3 py-1 rounded-full">
              LIMITED TIME FESTIVE PROMO
            </span>
            <h2 className="text-2xl sm:text-4xl font-black leading-tight">
              Get 10% Instant Cash Discount with Coupon <span className="font-mono underline">EDKART10</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-100">
              Applicable on all MacBooks, PlayStation 5, and Flagship Smart Audio. Free 2-Day Express Home Delivery included.
            </p>
            <Link to="/shop">
              <Button variant="secondary" size="lg" className="mt-2 bg-white text-slate-900 hover:bg-slate-100 font-bold">
                Redeem Promo Now
              </Button>
            </Link>
          </div>

          <div className="w-48 h-48 rounded-full bg-white/10 flex items-center justify-center font-black text-6xl text-white/40 select-none">
            %
          </div>
        </div>
      </section>
    </div>
  );
};
