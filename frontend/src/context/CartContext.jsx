import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { COUPONS } from '../utils/constants';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('edkart_cart');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('edkart_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = useCallback((product, quantity = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.productId === product.id);
      if (existing) {
        return prev.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          name: product.name,
          price: product.price,
          originalPrice: product.originalPrice || product.price * 1.15,
          imageUrl: product.images?.[0]?.url || 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=800&auto=format&fit=crop&q=80',
          category: product.category,
          stock: product.stock,
          seller: product.seller,
          quantity: quantity,
        },
      ];
    });
  }, []);

  const updateQuantity = useCallback((productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      )
    );
  }, []);

  const removeFromCart = useCallback((productId) => {
    setCartItems((prev) => prev.filter((item) => item.productId !== productId));
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
    setAppliedCoupon(null);
  }, []);

  const applyCoupon = useCallback((code) => {
    const upper = code.trim().toUpperCase();
    if (COUPONS[upper]) {
      setAppliedCoupon(COUPONS[upper]);
      return { success: true, message: `${COUPONS[upper].discountPercent}% discount applied!` };
    }
    return { success: false, message: 'Invalid coupon code.' };
  }, []);

  const removeCoupon = useCallback(() => {
    setAppliedCoupon(null);
  }, []);

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discountAmount = appliedCoupon ? (subtotal * appliedCoupon.discountPercent) / 100 : 0;
  const shippingFee = subtotal > 1000 || subtotal === 0 ? 0 : 99.0;
  const totalAmount = Math.max(0, subtotal - discountAmount + shippingFee);

  const value = {
    cartItems,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    totalItems,
    subtotal,
    discountAmount,
    shippingFee,
    totalAmount,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    isCartDrawerOpen,
    setIsCartDrawerOpen,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
