// frontend/src/pages/CartPage.jsx
import React from 'react';
import { useCart } from '../context/CartContext';

export const CartPage = ({ onNavigate }) => {
  const { cart, removeFromCart, updateQuantity } = useCart();

  const subtotal = cart.reduce((acc, item) => acc + (parseFloat(item.price) || 0) * (item.quantity || 1), 0);

  return (
    <div className="ob-cart-page-wrapper">
      {/* 1. Step Navigation Bar with Step 2 (Shopping Cart) Active */}
      <section className="shopping-steps" style={{ paddingTop: '28px', paddingBottom: '20px' }}>
        <div className="container">
          <ul id="shopping-steps01">
            <li>
              <a aria-label="Cart Home Icon" href="/" onClick={(e) => { e.preventDefault(); onNavigate('home'); }}>
                <img
                  src="https://officebaseuae.b-cdn.net/assets/images/root/icons/cart-home.png?v1"
                  width="24"
                  height="24"
                  alt="Cart Home Icon"
                  style={{ verticalAlign: 'middle' }}
                />
              </a>
            </li>
            <li>
              <a aria-label="Cart Shopping Cart" href="/cart/" className="active">
                <img
                  src="https://officebaseuae.b-cdn.net/assets/images/root/icons/cart-shopping-cart.png?v1"
                  width="24"
                  height="24"
                  alt="Cart Shopping Cart"
                  style={{ verticalAlign: 'middle' }}
                />
                <span className="hide-brdcrumb">Shopping Cart</span>
              </a>
            </li>
            <li>
              <a
                aria-label="Cart Shopping Details"
                href="/checkout/"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('checkout');
                }}
              >
                <img
                  src="https://officebaseuae.b-cdn.net/assets/images/root/icons/cart-details1.png?v3"
                  width="24"
                  height="24"
                  alt="Cart Shopping Details"
                  style={{ verticalAlign: 'middle' }}
                />
                <span className="hide-brdcrumb">Checkout</span>
              </a>
            </li>
            <li>
              <a aria-label="Cart Payment Details" href="javascript:;">
                <img
                  src="https://officebaseuae.b-cdn.net/assets/images/root/icons/cart-ccimage.png?v3"
                  width="24"
                  height="24"
                  alt="Cart Payment Details"
                  style={{ verticalAlign: 'middle' }}
                />
                <span className="hide-brdcrumb">Payment</span>
              </a>
            </li>
            <li>
              <a aria-label="Cart Confirmation" href="javascript:;">
                <img
                  src="https://officebaseuae.b-cdn.net/assets/images/root/icons/cart-confirmation.png?v1"
                  width="24"
                  height="24"
                  alt="Cart Confirmation"
                  style={{ verticalAlign: 'middle' }}
                />
                <span className="hide-brdcrumb">Confirmation</span>
              </a>
            </li>
          </ul>
        </div>
      </section>

      {/* 2. Main Cart Content */}
      <div className="container" style={{ paddingBottom: '60px' }}>
        {cart.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <h1 style={{ color: '#333', fontSize: '24px', marginBottom: '16px' }}>
              Your cart is currently empty.
            </h1>
            <button
              type="button"
              className="final-btn-submit"
              style={{ maxWidth: '280px', margin: '0 auto', display: 'block' }}
              onClick={() => onNavigate('category', { category: 'desks' })}
            >
              CONTINUE SHOPPING
            </button>
          </div>
        ) : (
          <div className="checkout-grid" style={{ marginTop: '10px' }}>
            {/* Left: Cart Items Table */}
            <div style={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '6px', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13.5px' }}>
                <thead>
                  <tr style={{ background: '#776d6d', color: '#ffffff', textTransform: 'uppercase', height: '42px', textAlign: 'left' }}>
                    <th style={{ padding: '8px 16px', fontWeight: '600' }}>Item</th>
                    <th style={{ padding: '8px 16px', fontWeight: '600' }}>Description</th>
                    <th style={{ padding: '8px 16px', fontWeight: '600' }}>Unit Price</th>
                    <th style={{ padding: '8px 16px', fontWeight: '600', textAlign: 'center' }}>Qty</th>
                    <th style={{ padding: '8px 16px', fontWeight: '600', textAlign: 'right' }}>Total</th>
                    <th style={{ padding: '8px 16px', width: '40px' }}></th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map(item => (
                    <tr key={item.cartItemId} style={{ borderBottom: '1px solid #eeeeee' }}>
                      <td style={{ padding: '14px 16px', width: '80px' }}>
                        <img
                          src={item.image}
                          alt={item.name}
                          style={{ width: '70px', height: '70px', objectFit: 'cover', borderRadius: '3px', border: '1px solid #eee' }}
                        />
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ fontWeight: '600', color: '#111', textTransform: 'uppercase', lineHeight: '1.35' }}>{item.name}</div>
                        {item.variant && <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>{item.variant}</div>}
                      </td>
                      <td style={{ padding: '14px 16px', color: '#222' }}>
                        <span className="uae-symbol">Đ</span> {parseFloat(item.price).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', border: '1px solid #ccc', borderRadius: '3px' }}>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.cartItemId, -1)}
                            style={{ padding: '4px 10px', background: '#f5f5f5', border: 'none', cursor: 'pointer', fontWeight: '700' }}
                          >
                            −
                          </button>
                          <span style={{ padding: '0 12px', fontWeight: '600' }}>{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.cartItemId, 1)}
                            style={{ padding: '4px 10px', background: '#f5f5f5', border: 'none', cursor: 'pointer', fontWeight: '700' }}
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'right', fontWeight: '700', color: '#111' }}>
                        <span className="uae-symbol">Đ</span> {(parseFloat(item.price) * item.quantity).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.cartItemId)}
                          style={{ color: '#999', fontSize: '18px', background: 'transparent', border: 'none', cursor: 'pointer' }}
                          title="Remove"
                        >
                          &times;
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', background: '#fafafa' }}>
                <button
                  type="button"
                  onClick={() => onNavigate('category', { category: 'desks' })}
                  style={{ background: '#4f4747', color: '#fff', border: 'none', padding: '10px 20px', fontSize: '13px', fontWeight: '600', borderRadius: '3px', cursor: 'pointer' }}
                >
                  &larr; CONTINUE SHOPPING
                </button>
              </div>
            </div>

            {/* Right: Cart Summary Box */}
            <div>
              <div className="ord-summary">
                <h2>Cart Summary</h2>
                <div className="order-pricing">
                  <div className="pri-blk">
                    <span>Sub Total</span>
                    <span>
                      <span className="uae-symbol">Đ</span> {subtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="pri-blk">
                    <span>Delivery & Assembly</span>
                    <span style={{ color: '#166534' }}>FREE</span>
                  </div>
                  <div className="pri-blk pri-total" style={{ borderTop: '1px solid #efefef', paddingTop: '10px', marginTop: '8px' }}>
                    <span style={{ fontSize: '16px', fontWeight: '800' }}>Total</span>
                    <span style={{ fontSize: '17px', fontWeight: '800', color: '#845d32' }}>
                      <span className="uae-symbol">Đ</span> {subtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                <div className="payment-method">
                  <button
                    type="button"
                    className="final-btn-submit"
                    onClick={() => onNavigate('checkout')}
                  >
                    PROCEED TO CHECKOUT &rarr;
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
