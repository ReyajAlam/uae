// frontend/src/components/cart/CartDrawer.jsx
import React, { useEffect } from 'react';
import { useCart } from '../../context/CartContext';

export const CartDrawer = ({ onNavigate }) => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart
  } = useCart();

  // Prevent background scroll when cart drawer is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isCartOpen]);

  // Total cart calculation
  const cartTotal = cart.reduce((acc, item) => acc + (parseFloat(item.price) || 0) * (item.quantity || 1), 0);

  return (
    <>
      {/* Dark backdrop overlay */}
      <div
        className={`cart-drawer-overlay ${isCartOpen ? 'active' : ''}`}
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer panel sliding in from right */}
      <div className={`cart-drawer-panel ${isCartOpen ? 'open' : ''}`}>
        {/* Header matching user image: Dark bar, YOUR CART, White Cross */}
        <div className="cart-drawer-header">
          <h3 className="cart-drawer-title">YOUR CART</h3>
          <button
            type="button"
            className="cart-drawer-close"
            onClick={() => setIsCartOpen(false)}
            aria-label="Close Cart"
          >
            <svg
              viewBox="0 0 24 24"
              width="18"
              height="18"
              stroke="#ffffff"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Content Area */}
        <div className="cart-drawer-content">
          {cart.length === 0 ? (
            <div className="cart-empty-box">
              <img
                src="https://officebaseuae.b-cdn.net/assets/images/root/icons/empty-cart.png?v1"
                width="46"
                height="46"
                alt="Empty Cart"
                className="cart-empty-icon"
              />
              <p className="cart-empty-text">Your Cart is Empty</p>
              <button
                type="button"
                className="cart-continue-btn"
                onClick={() => {
                  setIsCartOpen(false);
                  onNavigate('category', { category: 'desks' });
                }}
              >
                CONTINUE SHOPPING
              </button>
            </div>
          ) : (
            <>
              {/* Product items list */}
              <div className="cart-items-list">
                {cart.map((item) => (
                  <div key={item.cartItemId} className="cart-item-card">
                    <div className="cart-item-image">
                      <img src={item.image} alt={item.name} />
                    </div>
                    <div className="cart-item-details">
                      <div className="cart-item-name-row">
                        <h4 className="cart-item-title">{item.name}</h4>
                        <button
                          type="button"
                          className="cart-item-remove"
                          onClick={() => removeFromCart(item.cartItemId)}
                          title="Remove item"
                          aria-label="Remove item"
                        >
                          &times;
                        </button>
                      </div>
                      {item.variant && (
                        <div className="cart-item-variant">{item.variant}</div>
                      )}
                      <div className="cart-item-price-qty">
                        <span className="cart-curr-symbol">Đ</span>{' '}
                        {parseFloat(item.price).toLocaleString('en-US', { minimumFractionDigits: 2 })}{' '}
                        x {item.quantity}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom total and actions */}
              <div className="cart-drawer-bottom">
                <div className="cart-total-row">
                  <span className="cart-total-label">TOTAL</span>
                  <span className="cart-total-value">
                    <span className="cart-curr-symbol">Đ</span>{' '}
                    {cartTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>

                <div className="cart-action-buttons">
                  <button
                    type="button"
                    className="cart-btn-view"
                    onClick={() => {
                      setIsCartOpen(false);
                      onNavigate('cart');
                    }}
                  >
                    VIEW CART
                  </button>
                  <button
                    type="button"
                    className="cart-btn-checkout"
                    onClick={() => {
                      setIsCartOpen(false);
                      onNavigate('checkout');
                    }}
                  >
                    CHECKOUT
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};
