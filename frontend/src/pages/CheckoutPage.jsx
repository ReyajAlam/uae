// frontend/src/pages/CheckoutPage.jsx
import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { createOrder } from '../services/api';
import { FoloosiModal } from '../components/payment/FoloosiModal';

const UAE_CITIES = [
  'Dubai',
  'Abu Dhabi',
  'Sharjah',
  'Ajman',
  'Ras Al Khaimah',
  'Fujairah',
  'Umm Al Quwain',
  'Al Ain',
  'Jebel Ali',
  'Khor Fakkan',
  'Hatta',
  'Dibba Al Fujairah'
];

const COUNTRIES = [
  'United Arab Emirates',
  'Saudi Arabia',
  'Oman',
  'Qatar',
  'Kuwait',
  'Bahrain',
  'United Kingdom',
  'United States',
  'India'
];

export const CheckoutPage = ({ onNavigate, onOrderSuccess }) => {
  const { cart, clearCart, showToast } = useCart();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    country: 'United Arab Emirates',
    city: 'Dubai',
    contact: '',
    address: '',
    company: '',
    trn: '',
  });

  const [sameAsShipping, setSameAsShipping] = useState(true);
  const [billingData, setBillingData] = useState({
    name: '',
    country: 'United Arab Emirates',
    city: 'Dubai',
    contact: '',
    address: '',
    company: '',
    trn: '',
  });

  const [couponCode, setCouponCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [collectSelf, setCollectSelf] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState('card');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFoloosiOpen, setIsFoloosiOpen] = useState(false);

  // Totals calculation
  const subtotal = cart.reduce((acc, item) => acc + (parseFloat(item.price) || 0) * (item.quantity || 1), 0);
  const shippingCost = collectSelf ? 0 : 0; // Free shipping standard
  const grandTotal = Math.max(0, subtotal - discountAmount + shippingCost);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    if (couponCode.trim().toUpperCase() === 'DL250') {
      setDiscountAmount(250);
      showToast('Coupon DL250 applied! AED 250 saved.');
    } else {
      showToast('Invalid coupon code.', 'error');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleBillingChange = (e) => {
    const { name, value } = e.target;
    setBillingData(prev => ({ ...prev, [name]: value }));
  };

  const executeOrderSubmission = async (paymentDetails = null) => {
    setIsSubmitting(true);

    const paymentMethodName = paymentDetails?.payment_method || (
      selectedPayment === 'card' ? 'Credit / Debit Card (Foloosi)' :
      selectedPayment === 'tabby' ? 'Tabby - Pay in 4' :
      selectedPayment === 'cod' ? 'Cash on Delivery' : 'Bank Wire Transfer'
    );

    const paymentStatusVal = paymentDetails?.payment_status || (
      selectedPayment === 'card' || selectedPayment === 'tabby' ? 'Paid' :
      selectedPayment === 'cod' ? 'Pending (COD)' : 'Pending (Bank Transfer)'
    );

    const transactionIdVal = paymentDetails?.transaction_id || (
      selectedPayment === 'card' ? '#FLSAPI000A6a9f37e60f4ac' :
      selectedPayment === 'tabby' ? 'TABBY-' + Math.floor(100000 + Math.random() * 900000) :
      'ORD-' + Math.floor(100000 + Math.random() * 900000)
    );

    const orderPayload = {
      customer: {
        name: paymentDetails?.customer?.name || formData.name,
        email: paymentDetails?.customer?.email || formData.email,
        phone: paymentDetails?.customer?.phone || formData.contact,
        emirate: formData.city,
        address: formData.address,
        country: formData.country,
        company: formData.company,
        trn: formData.trn
      },
      billing: sameAsShipping ? formData : billingData,
      items: cart.map(item => ({
        product_id: item.id,
        name: item.name,
        variant: item.variant,
        price: item.price,
        quantity: item.quantity
      })),
      coupon_code: discountAmount > 0 ? couponCode : null,
      discount: discountAmount,
      total: grandTotal,
      shipping_method: collectSelf ? 'Collect In Person' : 'Standard Delivery',
      payment_method: paymentMethodName,
      payment_status: paymentStatusVal,
      transaction_id: transactionIdVal
    };

    try {
      const res = await createOrder(orderPayload);
      setIsSubmitting(false);

      if (res && res.success && res.order) {
        clearCart();
        if (onOrderSuccess) onOrderSuccess(res.order);
        onNavigate('confirmation', { orderNumber: res.order.order_number, order: res.order });
      } else {
        clearCart();
        const fakeOrder = {
          order_number: 'OB-' + Math.floor(100000 + Math.random() * 900000),
          total: grandTotal,
          customer_name: formData.name,
          customer_email: formData.email,
          payment_method: paymentMethodName,
          payment_status: paymentStatusVal,
          transaction_id: transactionIdVal,
          items: orderPayload.items
        };
        if (onOrderSuccess) onOrderSuccess(fakeOrder);
        onNavigate('confirmation', { orderNumber: fakeOrder.order_number, order: fakeOrder });
      }
    } catch {
      setIsSubmitting(false);
      clearCart();
      const fakeOrder = {
        order_number: 'OB-' + Math.floor(100000 + Math.random() * 900000),
        total: grandTotal,
        customer_name: formData.name,
        customer_email: formData.email,
        payment_method: paymentMethodName,
        payment_status: paymentStatusVal,
        transaction_id: transactionIdVal,
        items: orderPayload.items
      };
      if (onOrderSuccess) onOrderSuccess(fakeOrder);
      onNavigate('confirmation', { orderNumber: fakeOrder.order_number, order: fakeOrder });
    }
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.contact.trim() || !formData.address.trim()) {
      showToast('Please fill all required shipping fields.', 'error');
      return;
    }

    if (cart.length === 0) {
      showToast('Your cart is empty. Please add items to checkout.', 'error');
      return;
    }

    // If Credit / Debit Card is selected, navigate to /ccpayment/
    if (selectedPayment === 'card') {
      onNavigate('ccpayment', { customerData: formData });
      return;
    }

    // Otherwise, directly place order (COD / Tabby / Bank) and save to MySQL
    executeOrderSubmission();
  };

  return (
    <div className="ob-checkout-wrapper">
      {/* 1. Step Navigation Bar matching live site with exact images */}
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
              <a aria-label="Cart Shopping Details" href="javascript:;" className="active">
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

      {/* 2. Main Checkout Form matching live site */}
      <div className="page-content main-inner-container checkout-page">
        <div className="container">
          <form id="checkout" onSubmit={handleSubmitOrder}>
            <div className="checkout-grid">
              {/* Left Column: Guest / Shipping & Billing Details */}
              <div className="checkout-left-col">
                <div className="rcust">
                  <svg style={{ width: '16px', height: '16px', verticalAlign: '-2px', marginRight: '6px' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  Returning customer? <a href="/login/?checkout" onClick={(e) => { e.preventDefault(); showToast('Login feature ready.'); }}>Click here to login</a>
                </div>

                <h2 className="htitle">Checkout As Guest</h2>
                <strong style={{ color: '#333', marginBottom: '14px', display: 'inline-block', fontSize: '15px' }}>
                  Shipping Details
                </strong>

                {/* Shipping Details Form */}
                <div className="form-details">
                  <div className="blk col-span-1">
                    <label>Name <span style={{ color: 'red' }}>*</span></label>
                    <input
                      type="text"
                      className="form-control required"
                      name="name"
                      id="guest_name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="blk col-span-1">
                    <label>Email Address <span style={{ color: 'red' }}>*</span></label>
                    <input
                      type="email"
                      className="form-control required email"
                      name="email"
                      id="guest_emailaddr"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="blk col-span-1">
                    <label>Country <span style={{ color: 'red' }}>*</span></label>
                    <select
                      name="country"
                      id="guest_country"
                      className="form-control required"
                      value={formData.country}
                      onChange={handleInputChange}
                    >
                      {COUNTRIES.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div className="blk col-span-1">
                    <label>City <span style={{ color: 'red' }}>*</span></label>
                    <select
                      name="city"
                      id="guest_city"
                      className="form-control required"
                      value={formData.city}
                      onChange={handleInputChange}
                    >
                      {UAE_CITIES.map(ct => (
                        <option key={ct} value={ct}>{ct}</option>
                      ))}
                    </select>
                  </div>

                  <div className="blk col-span-1">
                    <label>Contact Number <span style={{ color: 'red' }}>*</span></label>
                    <input
                      type="text"
                      className="form-control required"
                      name="contact"
                      id="guest_contactno"
                      placeholder="+971 50 000 0000"
                      value={formData.contact}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="blk col-span-2">
                    <label>Address <span style={{ color: 'red' }}>*</span></label>
                    <input
                      type="text"
                      className="form-control required"
                      name="address"
                      id="guest_address"
                      placeholder="Building, Street, Area"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="blk col-span-1">
                    <label>Company Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="company"
                      id="guest_companyname"
                      value={formData.company}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="blk col-span-1">
                    <label>TRN/VAT Number</label>
                    <input
                      type="text"
                      className="form-control"
                      name="trn"
                      id="guest_taxno"
                      value={formData.trn}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div style={{ margin: '20px 0 10px 0' }}>
                  <strong style={{ color: '#333', display: 'inline-block', fontSize: '15px' }}>Billing Details</strong>
                  &nbsp;&nbsp;&nbsp;
                  <label style={{ fontSize: '14px', cursor: 'pointer', color: '#444' }}>
                    <input
                      type="checkbox"
                      id="guest_sameasshipping"
                      checked={sameAsShipping}
                      onChange={(e) => setSameAsShipping(e.target.checked)}
                      style={{ width: '16px', height: '16px', verticalAlign: 'middle', marginRight: '6px' }}
                    />
                    Same as Shipping
                  </label>
                </div>

                {/* Optional Billing Details if unchecked */}
                {!sameAsShipping && (
                  <div className="form-details" style={{ marginTop: '14px' }}>
                    <div className="blk col-span-1">
                      <label>Name</label>
                      <input
                        type="text"
                        className="form-control"
                        name="name"
                        value={billingData.name}
                        onChange={handleBillingChange}
                      />
                    </div>
                    <div className="blk col-span-1">
                      <label>Contact Number</label>
                      <input
                        type="text"
                        className="form-control"
                        name="contact"
                        value={billingData.contact}
                        onChange={handleBillingChange}
                      />
                    </div>
                    <div className="blk col-span-1">
                      <label>Country</label>
                      <select
                        name="country"
                        className="form-control"
                        value={billingData.country}
                        onChange={handleBillingChange}
                      >
                        {COUNTRIES.map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                    <div className="blk col-span-1">
                      <label>City</label>
                      <select
                        name="city"
                        className="form-control"
                        value={billingData.city}
                        onChange={handleBillingChange}
                      >
                        {UAE_CITIES.map(ct => (
                          <option key={ct} value={ct}>{ct}</option>
                        ))}
                      </select>
                    </div>
                    <div className="blk col-span-2">
                      <label>Address</label>
                      <input
                        type="text"
                        className="form-control"
                        name="address"
                        value={billingData.address}
                        onChange={handleBillingChange}
                      />
                    </div>
                    <div className="blk col-span-1">
                      <label>Company Name</label>
                      <input
                        type="text"
                        className="form-control"
                        name="company"
                        value={billingData.company}
                        onChange={handleBillingChange}
                      />
                    </div>
                    <div className="blk col-span-1">
                      <label>TRN/VAT Number</label>
                      <input
                        type="text"
                        className="form-control"
                        name="trn"
                        value={billingData.trn}
                        onChange={handleBillingChange}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Order Summary matching live site */}
              <div className="checkout-right-col">
                <div className="ord-summary">
                  <h2>Order Summary</h2>

                  {/* Cart Items slabs */}
                  {cart.length > 0 && (
                    <div className="checkout-items-list" style={{ maxHeight: '240px', overflowY: 'auto', borderBottom: '2px solid #efefef' }}>
                      {cart.map(item => (
                        <div key={item.cartItemId} className="product-slabs">
                          <div className="product-image-s">
                            <img src={item.image} alt={item.name} />
                          </div>
                          <div className="product-name-s">
                            <a href="javascript:;">{item.name}</a>
                            {item.variant && <span>{item.variant}</span>}
                            <span className="product-price-s">
                              <span className="uae-symbol">Đ</span>{' '}
                              {parseFloat(item.price).toLocaleString('en-US', { minimumFractionDigits: 2 })} x {item.quantity}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Available Offers Banner */}
                  <div className="coupon-code">
                    <p style={{ textTransform: 'uppercase' }}>Available Offers</p>
                    <div className="offersections">
                      <div className="block1">
                        <span>LIMITED TIME OFFER</span>
                      </div>
                      <div className="block2">
                        <span>Coupon Code:</span> DL250
                      </div>
                      <div className="block3">
                        SAVE AED 250+VAT on Delivery
                      </div>
                    </div>
                  </div>

                  {/* Coupon Code Input */}
                  <div className="coupon-code">
                    <p>Enter Discount Voucher Code</p>
                    <div className="coupon-input-group">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        placeholder="Enter Coupon Code"
                      />
                      <button type="button" onClick={handleApplyCoupon}>
                        APPLY
                      </button>
                    </div>
                  </div>

                  {/* Order Pricing Breakdown */}
                  <div className="order-pricing">
                    <div className="pri-blk">
                      <span>Sub Total</span>
                      <span>
                        <span className="uae-symbol" style={{ fontWeight: 400 }}>Đ</span>{' '}
                        {subtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </span>
                    </div>

                    <div className="pri-blk">
                      <span>Shipping</span>
                      <span>
                        <span className="uae-symbol" style={{ fontWeight: 400 }}>Đ</span>{' '}
                        {shippingCost.toFixed(2)}
                      </span>
                    </div>

                    <div className="pri-blk">
                      <span>Discount</span>
                      <span>
                        <span className="uae-symbol" style={{ fontWeight: 400 }}>Đ</span>{' '}
                        {discountAmount.toFixed(2)}
                      </span>
                    </div>

                    <div className="pri-blk pri-total" style={{ borderTop: '1px solid #efefef', paddingTop: '8px', marginTop: '6px' }}>
                      <span style={{ fontSize: '15px', fontWeight: '800' }}>Grand Total</span>
                      <span style={{ fontSize: '16px', fontWeight: '800', color: '#845d32' }}>
                        <span className="uae-symbol" style={{ fontWeight: 400 }}>Đ</span>{' '}
                        {grandTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>

                  {/* Shipping Method */}
                  <div className="shipping-method">
                    <h3>Shipping Method</h3>
                    <label style={{ cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center' }}>
                      <input
                        type="checkbox"
                        checked={collectSelf}
                        onChange={(e) => setCollectSelf(e.target.checked)}
                        style={{ width: '18px', height: '18px', marginRight: '8px' }}
                      />
                      I will come and collect.
                    </label>
                  </div>

                  {/* Payment Options Section with Images */}
                  <div className="payment-method">
                    <h3 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '14px', color: '#111' }}>
                      Payment Options
                    </h3>

                    <div className="payment-options-list">
                      {/* 1. Credit / Debit Card */}
                      <div
                        className={`payment-option-card ${selectedPayment === 'card' ? 'selected' : ''}`}
                        onClick={() => setSelectedPayment('card')}
                      >
                        <div className="payment-option-header">
                          <div className="payment-option-left">
                            <input
                              type="radio"
                              name="payment_method"
                              value="card"
                              checked={selectedPayment === 'card'}
                              onChange={() => setSelectedPayment('card')}
                            />
                            <span className="payment-option-title">Credit / Debit Card</span>
                          </div>
                          <div className="payment-option-badges">
                            <img
                              src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg"
                              alt="Visa"
                              className="pay-badge-img"
                              style={{ height: '14px' }}
                            />
                            <img
                              src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg"
                              alt="Mastercard"
                              className="pay-badge-img"
                              style={{ height: '18px' }}
                            />
                          </div>
                        </div>
                        {selectedPayment === 'card' && (
                          <div className="payment-option-desc">
                            Pay securely with your credit/debit card. Fast & 100% encrypted checkout.
                          </div>
                        )}
                      </div>

                      {/* 2. Tabby - Pay in 4 */}
                      <div
                        className={`payment-option-card ${selectedPayment === 'tabby' ? 'selected' : ''}`}
                        onClick={() => setSelectedPayment('tabby')}
                      >
                        <div className="payment-option-header">
                          <div className="payment-option-left">
                            <input
                              type="radio"
                              name="payment_method"
                              value="tabby"
                              checked={selectedPayment === 'tabby'}
                              onChange={() => setSelectedPayment('tabby')}
                            />
                            <span className="payment-option-title">Tabby - Pay in 4</span>
                          </div>
                          <div className="payment-option-badges">
                            <span className="tabby-badge">tabby</span>
                          </div>
                        </div>
                        {selectedPayment === 'tabby' && (
                          <div className="payment-option-desc">
                            Split into 4 interest-free payments of <strong>Đ {(grandTotal / 4).toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong> / month. No fees.
                          </div>
                        )}
                      </div>

                      {/* 3. Cash on Delivery */}
                      <div
                        className={`payment-option-card ${selectedPayment === 'cod' ? 'selected' : ''}`}
                        onClick={() => setSelectedPayment('cod')}
                      >
                        <div className="payment-option-header">
                          <div className="payment-option-left">
                            <input
                              type="radio"
                              name="payment_method"
                              value="cod"
                              checked={selectedPayment === 'cod'}
                              onChange={() => setSelectedPayment('cod')}
                            />
                            <span className="payment-option-title">Cash on Delivery</span>
                          </div>
                        </div>
                        {selectedPayment === 'cod' && (
                          <div className="payment-option-desc">
                            Pay with cash or card upon delivery and installation by our professional team.
                          </div>
                        )}
                      </div>

                      {/* 4. Bank Wire Transfer */}
                      <div
                        className={`payment-option-card ${selectedPayment === 'bank' ? 'selected' : ''}`}
                        onClick={() => setSelectedPayment('bank')}
                      >
                        <div className="payment-option-header">
                          <div className="payment-option-left">
                            <input
                              type="radio"
                              name="payment_method"
                              value="bank"
                              checked={selectedPayment === 'bank'}
                              onChange={() => setSelectedPayment('bank')}
                            />
                            <span className="payment-option-title">Bank Wire Transfer</span>
                          </div>
                        </div>
                        {selectedPayment === 'bank' && (
                          <div className="payment-option-desc">
                            Direct bank deposit to OfficeBase UAE corporate account. Order processed upon payment confirmation.
                          </div>
                        )}
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="final-btn-submit"
                      disabled={isSubmitting}
                      style={{ marginTop: '12px' }}
                    >
                      {isSubmitting ? 'PROCESSING...' : selectedPayment === 'card' ? 'PROCEED TO PAYMENT' : 'PLACE ORDER'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

