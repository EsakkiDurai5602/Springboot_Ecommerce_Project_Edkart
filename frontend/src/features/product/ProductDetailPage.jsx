import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { productService } from '../../services/ecommerceServices';
import { useCart } from '../../context/CartContext';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { StarRating } from '../../components/ui/StarRating';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Alert } from '../../components/ui/Alert';
import {
  ShoppingBag,
  Truck,
  ShieldCheck,
  RotateCcw,
  Plus,
  Minus,
  Check,
  Star,
  MessageSquarePlus,
  ArrowLeft,
  Share2,
  Heart,
} from 'lucide-react';

export const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, setIsCartDrawerOpen } = useCart();

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Review modal state
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewerName, setReviewerName] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);

  const loadProduct = async () => {
    setLoading(true);
    try {
      const data = await productService.getProductById(id);
      setProduct(data);
      setSelectedImage(0);
    } catch (err) {
      setError('Product not found or unavailable.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity);
    setIsCartDrawerOpen(true);
  };

  const handleBuyNow = () => {
    if (!product) return;
    addToCart(product, quantity);
    navigate('/checkout');
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;

    await productService.addReview(product.id, {
      user: reviewerName.trim() || 'Verified Shopper',
      rating: reviewRating,
      comment: reviewComment,
    });

    setIsReviewModalOpen(false);
    setReviewComment('');
    setReviewerName('');
    setReviewSuccess(true);
    await loadProduct();
    setTimeout(() => setReviewSuccess(false), 4000);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 flex items-center justify-center">
        <div className="w-12 h-12 rounded-2xl bg-brand-600 animate-bounce flex items-center justify-center text-white font-black">
          EK
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-black text-slate-900 dark:text-white">Product Not Found</h2>
        <p className="text-xs text-slate-500">The product you are looking for is currently unavailable or removed.</p>
        <Link to="/shop">
          <Button variant="primary" size="md">
            Return to Store
          </Button>
        </Link>
      </div>
    );
  }

  const inStock = product.stock > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
      {/* Back Breadcrumbs */}
      <div className="flex items-center justify-between text-xs text-slate-500">
        <Link to="/shop" className="hover:text-brand-600 flex items-center gap-1.5 font-bold">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Catalog</span>
        </Link>
        <span>Category: <strong className="text-slate-800 dark:text-slate-200">{product.category}</strong></span>
      </div>

      {reviewSuccess && (
        <Alert variant="success" onClose={() => setReviewSuccess(false)}>
          Thank you! Your verified review has been published.
        </Alert>
      )}

      {/* Main Product Hero Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Gallery */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-square rounded-3xl overflow-hidden bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl group">
            <img
              src={product.images?.[selectedImage]?.url || product.images?.[0]?.url}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {product.badge && (
              <div className="absolute top-4 left-4">
                <Badge variant="warning" size="md">
                  {product.badge}
                </Badge>
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border-2 flex-shrink-0 transition-all ${
                    selectedImage === idx
                      ? 'border-brand-600 dark:border-amber-400 scale-95 shadow-md'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img.url} alt={`Angle ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Product Details */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-2">
            <Badge variant="brand" size="sm">
              {product.category.toUpperCase()}
            </Badge>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {product.name}
            </h1>

            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1">
                <StarRating rating={product.rating} size="sm" />
                <span className="font-bold text-slate-900 dark:text-white ml-1">{product.rating}</span>
              </div>
              <span className="text-slate-400">•</span>
              <a href="#reviews" className="text-brand-600 dark:text-amber-400 font-semibold hover:underline">
                {product.numOfReviews} Customer Reviews
              </a>
              <span className="text-slate-400">•</span>
              <span className="text-slate-500">Seller: <strong className="text-slate-800 dark:text-slate-200">{product.seller}</strong></span>
            </div>
          </div>

          {/* Price Box */}
          <div className="p-5 rounded-3xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-black text-slate-900 dark:text-white">
                {formatCurrency(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-slate-400 line-through">
                  {formatCurrency(product.originalPrice)}
                </span>
              )}
            </div>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
              Inclusive of all taxes & free express insured shipping
            </p>
          </div>

          {/* Description */}
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            {product.description}
          </p>

          {/* Stock & Quantity */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700 dark:text-slate-300">Availability:</span>
              <Badge variant={inStock ? 'success' : 'danger'} size="sm" dot>
                {inStock ? `In Stock (${product.stock} units)` : 'Out of Stock'}
              </Badge>
            </div>

            {inStock && (
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-slate-300 dark:border-slate-700 rounded-2xl bg-white dark:bg-slate-900 overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3.5 py-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 font-bold text-sm font-mono text-slate-900 dark:text-white">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="px-3.5 py-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex-1 grid grid-cols-2 gap-3">
                  <Button
                    onClick={handleAddToCart}
                    variant="secondary"
                    size="lg"
                    fullWidth
                    leftIcon={<ShoppingBag className="w-4 h-4" />}
                  >
                    Add to Cart
                  </Button>

                  <Button
                    onClick={handleBuyNow}
                    variant="primary"
                    size="lg"
                    fullWidth
                  >
                    Buy Now
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Value Props */}
          <div className="grid grid-cols-3 gap-3 pt-6 border-t border-slate-200 dark:border-slate-800 text-center text-xs">
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <Truck className="w-5 h-5 text-brand-500 mx-auto mb-1" />
              <span className="font-bold text-slate-800 dark:text-slate-200 block text-[11px]">Free Shipping</span>
              <span className="text-[9px] text-slate-400">2-Day Express</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <ShieldCheck className="w-5 h-5 text-emerald-500 mx-auto mb-1" />
              <span className="font-bold text-slate-800 dark:text-slate-200 block text-[11px]">100% Genuine</span>
              <span className="text-[9px] text-slate-400">Brand Warranty</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <RotateCcw className="w-5 h-5 text-amber-500 mx-auto mb-1" />
              <span className="font-bold text-slate-800 dark:text-slate-200 block text-[11px]">30-Day Return</span>
              <span className="text-[9px] text-slate-400">Instant Refund</span>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Reviews Section */}
      <section id="reviews" className="pt-8 border-t border-slate-200 dark:border-slate-800 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Customer Reviews ({product.reviews?.length || 0})
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Verified purchaser ratings and feedback</p>
          </div>

          <Button
            onClick={() => setIsReviewModalOpen(true)}
            variant="primary"
            size="sm"
            leftIcon={<MessageSquarePlus className="w-4 h-4" />}
          >
            Write a Review
          </Button>
        </div>

        {/* Reviews List */}
        {product.reviews && product.reviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {product.reviews.map((rev) => (
              <div
                key={rev.id}
                className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">{rev.user}</h4>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                      <Check className="w-3 h-3" /> Verified Purchase
                    </span>
                  </div>
                  <StarRating rating={rev.rating} size="sm" />
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{rev.comment}</p>
                <span className="text-[10px] text-slate-400 block pt-1">{formatDate(rev.date)}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-10 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
            <p className="text-xs text-slate-500">No reviews yet for this product. Be the first to share your experience!</p>
            <Button onClick={() => setIsReviewModalOpen(true)} variant="secondary" size="sm">
              Write the First Review
            </Button>
          </div>
        )}
      </section>

      {/* Review Submission Modal */}
      <Modal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        title={`Review ${product.name}`}
        subtitle="Share your honest experience to help other tech buyers"
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleReviewSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1.5">
              Your Rating
            </label>
            <StarRating rating={reviewRating} size="lg" interactive onRatingChange={setReviewRating} />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1.5">
              Your Name / Handle
            </label>
            <input
              type="text"
              placeholder="e.g. Esakki Durai"
              value={reviewerName}
              onChange={(e) => setReviewerName(e.target.value)}
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1.5">
              Your Feedback & Experience
            </label>
            <textarea
              rows={4}
              required
              placeholder="How is the performance, build quality, and battery life?"
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              className="w-full text-xs p-3.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none"
            />
          </div>

          <Button type="submit" variant="primary" fullWidth size="lg">
            Submit Verified Review
          </Button>
        </form>
      </Modal>
    </div>
  );
};
