// frontend/src/context/CartContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('officebase_cart');
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      return parsed.map(item => ({
        ...item,
        price: isNaN(parseFloat(item.price)) ? 3739 : parseFloat(item.price)
      }));
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem('officebase_cart', JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [cart]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  const addToCart = (product, selectedVariant = null, quantity = 1) => {
    const variantValue = selectedVariant?.variant_value || (product.variants?.[0]?.variant_value || 'Standard');
    let unitPrice = 0;
    if (selectedVariant?.price !== undefined && !isNaN(parseFloat(selectedVariant.price))) {
      unitPrice = parseFloat(selectedVariant.price);
    } else if (product.price !== undefined && !isNaN(parseFloat(product.price))) {
      unitPrice = parseFloat(product.price);
    }
    const cartItemId = `${product.id}-${variantValue}`;

    setCart(prev => {
      const existing = prev.find(item => item.cartItemId === cartItemId);
      if (existing) {
        return prev.map(item =>
          item.cartItemId === cartItemId
            ? { ...item, quantity: item.quantity + quantity, price: unitPrice || item.price }
            : item
        );
      }
      return [
        ...prev,
        {
          cartItemId,
          id: product.id,
          name: product.name,
          slug: product.slug,
          image: product.image_url || product.image,
          price: unitPrice,
          variant: variantValue,
          quantity: quantity,
        }
      ];
    });

    showToast(`Added "${product.name}" to cart!`);
    setIsCartOpen(true);
  };

  const updateQuantity = (cartItemId, delta) => {
    setCart(prev =>
      prev
        .map(item => {
          if (item.cartItemId === cartItemId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const removeFromCart = (cartItemId) => {
    setCart(prev => prev.filter(item => item.cartItemId !== cartItemId));
    showToast('Item removed from cart', 'info');
  };

  const clearCart = () => {
    setCart([]);
  };

  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const vat = Math.round(subtotal * 0.05 * 100) / 100; // 5% UAE VAT
  const deliveryFee = 0; // Free delivery in UAE
  const total = subtotal + vat + deliveryFee;

  return (
    <CartContext.Provider
      value={{
        cart,
        itemCount,
        subtotal,
        vat,
        deliveryFee,
        total,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        toast,
        showToast
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
