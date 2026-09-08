// frontend/src/pages/ConfirmationPage.jsx
import React, { useEffect, useState } from 'react';
import { fetchOrder } from '../services/api';

export const ConfirmationPage = ({ orderNumber, orderData, onNavigate }) => {
  const [order, setOrder] = useState(orderData || null);
  const [loading, setLoading] = useState(!orderData && !!orderNumber);

  useEffect(() => {
    if (!orderData && orderNumber) {
      async function load() {
        const o = await fetchOrder(orderNumber);
        if (o) setOrder(o);
        setLoading(false);
      }
      load();
    }
  }, [orderNumber, orderData]);

  const displayOrderNumber = order?.order_number || orderNumber || 'OB-' + Math.floor(100000 + Math.random() * 900000);
  const displayTotal = parseFloat(order?.total || 11479.50).toLocaleString('en-US', { minimumFractionDigits: 2 });
  const displaySubtotal = parseFloat(order?.subtotal || (order?.total ? order.total / 1.05 : 10932.86)).toLocaleString('en-US', { minimumFractionDigits: 2 });
  const displayVat = parseFloat(order?.vat || (order?.total ? order.total - (order.total / 1.05) : 546.64)).toLocaleString('en-US', { minimumFractionDigits: 2 });
  const customerName = order?.customer_name || 'Valued Customer';
  const customerEmail = order?.customer_email || '-';
  const customerPhone = order?.customer_phone || '-';
  const customerAddress = order?.address || '-';
  const customerEmirate = order?.emirate || 'Dubai';
  const transactionRef = order?.transaction_id || '#FLSAPI000A6a9f37e60f4ac';

  const orderDateFormatted = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="ob-confirmation-wrapper">
      {/* 1. Shopping Steps Header Bar matching OfficeBase exact design */}
      <section className="shopping-steps" style={{ paddingTop: '28px', paddingBottom: '20px' }}>
        <div className="container">
          <ul id="shopping-steps01">
            <li>
              <a
                aria-label="Cart Home Icon"
                href="/"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('home');
                }}
              >
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
              <a
                aria-label="Cart Shopping Cart"
                href="/cart/"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('cart');
                }}
              >
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
              <a aria-label="Cart Confirmation" href="javascript:;" className="active">
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

      {/* 2. Main Confirmation Content */}
      <div className="page-content main-inner-container confirmation-page-ob">
        <div className="container">
          {/* Success Banner */}
          <div className="ob-confirm-banner">
            <div className="ob-confirm-banner-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2e7d32" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <div className="ob-confirm-banner-text">
              <h3>Thank you, your order has been received and confirmed!</h3>
              <p>
                An order confirmation and tax invoice have been dispatched to <strong>{customerEmail}</strong>.
                Our operations team in Dubai is processing your office furniture order.
              </p>
            </div>
          </div>

          <div className="ob-confirm-grid">
            {/* Left Column: Order details & Item slabs */}
            <div className="ob-confirm-left">
              <h2 className="htitle" style={{ fontSize: '24px', marginBottom: '16px' }}>Order Details</h2>

              {/* Order Meta Info Box */}
              <div className="address-box-det" style={{ background: '#fcfcfc', marginBottom: '24px' }}>
                <div className="ob-meta-two-col">
                  <div className="ob-meta-col">
                    <strong style={{ color: '#845d32', fontSize: '15px' }}>Order Information</strong>
                    <div className="ob-meta-row">
                      <span className="ob-lbl">Order Number:</span>
                      <span className="ob-val" style={{ fontWeight: '700', color: '#9d260c' }}>{displayOrderNumber}</span>
                    </div>
                    <div className="ob-meta-row">
                      <span className="ob-lbl">Date:</span>
                      <span className="ob-val">{orderDateFormatted}</span>
                    </div>
                    <div className="ob-meta-row">
                      <span className="ob-lbl">Payment Method:</span>
                      <span className="ob-val">{order?.payment_method || 'Credit / Debit Card (Foloosi)'}</span>
                    </div>
                    <div className="ob-meta-row">
                      <span className="ob-lbl">Transaction Ref:</span>
                      <span className="ob-val" style={{ fontFamily: 'monospace', color: '#1863d6' }}>{transactionRef}</span>
                    </div>
                    <div className="ob-meta-row">
                      <span className="ob-lbl">Payment Status:</span>
                      <span className="ob-paid-badge">Paid</span>
                    </div>
                  </div>

                  <div className="ob-meta-col">
                    <strong style={{ color: '#845d32', fontSize: '15px' }}>Delivery Address</strong>
                    <div className="ob-meta-row">
                      <span className="ob-lbl">Customer:</span>
                      <span className="ob-val">{customerName}</span>
                    </div>
                    <div className="ob-meta-row">
                      <span className="ob-lbl">Contact:</span>
                      <span className="ob-val">{customerPhone}</span>
                    </div>
                    <div className="ob-meta-row">
                      <span className="ob-lbl">Address:</span>
                      <span className="ob-val">{customerAddress}, {customerEmirate}, UAE</span>
                    </div>
                    <div className="ob-meta-row">
                      <span className="ob-lbl">Delivery Schedule:</span>
                      <span className="ob-val" style={{ color: '#2e7d32', fontWeight: '600' }}>7 - 8 Working Days</span>
                    </div>
                    <div className="ob-meta-row">
                      <span className="ob-lbl">Installation:</span>
                      <span className="ob-val">Free Professional Assembly Included</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Items Ordered List matching OfficeBase .product-slabs style */}
              <h2 className="htitle" style={{ fontSize: '20px', marginBottom: '14px' }}>Items Purchased</h2>
              <div className="ord-summary" style={{ background: '#ffffff', border: '1px solid #efefef', borderRadius: '6px', marginBottom: '25px' }}>
                {(order?.items && order.items.length > 0 ? order.items : [
                  {
                    product_name: 'IVORY L Shape Desk (White Frame)',
                    variant: 'W1600 X D1450 X H750 MM',
                    quantity: 3,
                    price: 3739,
                    total: 11217,
                    image: 'https://officebaseuae.b-cdn.net/assets/images/image-data/3307947144.webp'
                  }
                ]).map((item, idx) => (
                  <div key={idx} className="product-slabs" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '14px 18px', borderBottom: '1px solid #efefef' }}>
                    <div className="product-image-s" style={{ width: '70px', height: '70px', flexShrink: 0, overflow: 'hidden', borderRadius: '4px', background: '#f5f5f5' }}>
                      <img
                        src={item.image || 'https://officebaseuae.b-cdn.net/assets/images/image-data/3307947144.webp'}
                        alt={item.product_name || item.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                    <div className="product-name-s" style={{ flex: 1 }}>
                      <a href="javascript:;" style={{ fontSize: '14px', fontWeight: '600', color: '#111' }}>
                        {item.product_name || item.name}
                      </a>
                      {item.variant && (
                        <span style={{ fontSize: '12.5px', color: '#666', display: 'block', marginTop: '2px' }}>
                          Dimension: {item.variant}
                        </span>
                      )}
                      <span className="product-price-s" style={{ marginTop: '4px', fontSize: '13px', color: '#444' }}>
                        AED {parseFloat(item.price).toLocaleString('en-US', { minimumFractionDigits: 2 })} &times; {item.quantity}
                      </span>
                    </div>
                    <div style={{ textAlign: 'right', fontWeight: '700', fontSize: '15px', color: '#9d260c' }}>
                      AED {parseFloat(item.total || (item.price * item.quantity)).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="ob-confirm-actions">
                <button
                  type="button"
                  className="ob-btn-print"
                  onClick={() => window.print()}
                >
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '6px', verticalAlign: '-2px' }}>
                    <polyline points="6 9 6 2 18 2 18 9"></polyline>
                    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
                    <rect x="6" y="14" width="12" height="8"></rect>
                  </svg>
                  PRINT TAX INVOICE
                </button>

                <button
                  type="button"
                  className="ob-btn-continue"
                  onClick={() => onNavigate('category', { category: 'desks' })}
                >
                  CONTINUE SHOPPING
                </button>
              </div>
            </div>

            {/* Right Column: Order Summary Pricing breakdown matching OfficeBase */}
            <div className="ob-confirm-right">
              <div className="ord-summary" style={{ background: '#fbfbfb', border: '1px solid #ebebeb', borderRadius: '7px' }}>
                <h2 style={{ fontSize: '17px', padding: '12px 18px', borderBottom: '2px solid #efefef', margin: 0, fontWeight: '700', color: '#222' }}>
                  Summary of Charges
                </h2>

                <div className="order-pricing" style={{ padding: '16px 18px' }}>
                  <div className="pri-blk" style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: '13.5px' }}>
                    <span style={{ color: '#444' }}>Sub Total</span>
                    <span style={{ fontWeight: '600' }}>AED {displaySubtotal}</span>
                  </div>

                  <div className="pri-blk" style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: '13.5px' }}>
                    <span style={{ color: '#444' }}>Standard Delivery</span>
                    <span style={{ color: '#2e7d32', fontWeight: '700' }}>FREE</span>
                  </div>

                  <div className="pri-blk" style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: '13.5px' }}>
                    <span style={{ color: '#444' }}>Professional Assembly</span>
                    <span style={{ color: '#2e7d32', fontWeight: '700' }}>FREE</span>
                  </div>

                  <div className="pri-blk" style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: '13.5px' }}>
                    <span style={{ color: '#444' }}>UAE VAT (5%)</span>
                    <span style={{ fontWeight: '600' }}>AED {displayVat}</span>
                  </div>

                  <div className="pri-blk" style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 0 6px 0', marginTop: '10px', borderTop: '2px solid #efefef', fontSize: '16px', fontWeight: '700' }}>
                    <span style={{ color: '#111' }}>Total Amount Paid</span>
                    <span style={{ color: '#845d32', fontSize: '17px' }}>AED {displayTotal}</span>
                  </div>
                </div>

                {/* Assurance Box */}
                <div style={{ padding: '14px 18px', background: '#f4f6f8', borderTop: '1px solid #efefef', fontSize: '12px', color: '#555', lineHeight: '1.5' }}>
                  <strong>OfficeBase Guarantee:</strong><br />
                  Limited Lifetime Warranty on frame and 1-year warranty on hardware. For delivery inquiries, contact <strong>+971 4 32 41 420</strong>.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
