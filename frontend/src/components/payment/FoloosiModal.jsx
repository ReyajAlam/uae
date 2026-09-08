// frontend/src/components/payment/FoloosiModal.jsx
import React, { useState } from 'react';

export const FoloosiModal = ({
  isOpen,
  onClose,
  totalAmount,
  customerData,
  onPaymentSuccess
}) => {
  if (!isOpen) return null;

  const [step, setStep] = useState('details'); // 'details' | 'card' | 'processing'
  const [email, setEmail] = useState(customerData?.email || '');
  const [name, setName] = useState(customerData?.name || '');
  const [phone, setPhone] = useState(customerData?.phone ? customerData.phone.replace(/^\+971\s*/, '') : '');
  const [phoneError, setPhoneError] = useState('');

  // Card fields
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  // Reference ID matching screenshot
  const referenceId = '#FLSAPI000A6a9f37e60f4ac';

  const formattedAmount = parseFloat(totalAmount || 0).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  const handleProceedToPay = (e) => {
    e.preventDefault();
    if (!phone || phone.trim().length < 7) {
      setPhoneError('Phone Number Invalid');
      return;
    }
    setPhoneError('');
    setStep('card');
  };

  const handleFinalCardPay = (e) => {
    e.preventDefault();
    setStep('processing');

    setTimeout(() => {
      onPaymentSuccess({
        transaction_id: referenceId,
        payment_method: 'Credit / Debit Card (Foloosi)',
        payment_status: 'Paid',
        customer: {
          name,
          email,
          phone: `+971 ${phone}`
        }
      });
    }, 1400);
  };

  return (
    <div className="foloosi-overlay">
      {/* Top right close button */}
      <button
        type="button"
        className="foloosi-modal-close"
        onClick={onClose}
        aria-label="Close"
      >
        <svg viewBox="0 0 24 24" width="22" height="22" stroke="#ffffff" strokeWidth="2.5" fill="none">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>

      {/* Main Payment Card */}
      <div className="foloosi-card">
        {/* Blue Header */}
        <div className="foloosi-header">
          <div className="foloosi-store-icon">
            <svg width="44" height="44" viewBox="0 0 48 48" fill="none">
              {/* Awning stripes */}
              <rect x="6" y="8" width="36" height="12" rx="3" fill="#e53935" />
              <path d="M12 8H18V20H12V8Z" fill="#ffffff" />
              <path d="M24 8H30V20H24V8Z" fill="#ffffff" />
              <path d="M36 8H42V20H36V8Z" fill="#ffffff" />
              {/* Scallop drops */}
              <circle cx="9" cy="20" r="3" fill="#e53935" />
              <circle cx="15" cy="20" r="3" fill="#ffffff" />
              <circle cx="21" cy="20" r="3" fill="#e53935" />
              <circle cx="27" cy="20" r="3" fill="#ffffff" />
              <circle cx="33" cy="20" r="3" fill="#e53935" />
              <circle cx="39" cy="20" r="3" fill="#ffffff" />
              {/* Store body */}
              <rect x="8" y="20" width="32" height="20" fill="#90caf9" />
              {/* Store door & window */}
              <rect x="12" y="25" width="10" height="15" rx="1" fill="#ffffff" opacity="0.9" />
              <rect x="26" y="25" width="10" height="10" rx="1" fill="#ffffff" opacity="0.9" />
            </svg>
          </div>
          <div className="foloosi-header-text">
            <div className="foloosi-amount-text">
              Amount Payable: AED {formattedAmount}
            </div>
            <div className="foloosi-ref-text">
              {referenceId}
            </div>
          </div>
        </div>

        {/* Card Body */}
        <div className="foloosi-body">
          {step === 'details' && (
            <form onSubmit={handleProceedToPay}>
              <div className="foloosi-section-label">YOUR DETAILS</div>

              <div className="foloosi-field">
                <input
                  type="email"
                  className="foloosi-input-gray"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email Address"
                  required
                />
              </div>

              <div className="foloosi-field">
                <input
                  type="text"
                  className="foloosi-input-gray"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full Name"
                  required
                />
              </div>

              <div className="foloosi-field">
                <div className={`foloosi-phone-wrap ${phoneError ? 'error' : ''}`}>
                  <div className="foloosi-flag-box">
                    <span className="foloosi-flag">🇦🇪</span>
                    <span className="foloosi-arrow">▾</span>
                    <span className="foloosi-prefix">+971</span>
                  </div>
                  <input
                    type="tel"
                    className="foloosi-phone-input"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      if (phoneError) setPhoneError('');
                    }}
                    placeholder="50 123 4567"
                    required
                  />
                </div>
                {phoneError && (
                  <div className="foloosi-error-text">{phoneError}</div>
                )}
              </div>

              <button type="submit" className="foloosi-btn-proceed">
                Proceed To Pay
              </button>
            </form>
          )}

          {step === 'card' && (
            <form onSubmit={handleFinalCardPay}>
              <div className="foloosi-section-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>CARD INFORMATION</span>
                <button
                  type="button"
                  onClick={() => setStep('details')}
                  style={{ background: 'none', border: 'none', color: '#1665d8', fontSize: '11px', cursor: 'pointer', fontWeight: '600' }}
                >
                  &larr; Back to Details
                </button>
              </div>

              <div className="foloosi-field">
                <label className="foloosi-sublabel">Card Number</label>
                <div className="foloosi-card-num-box">
                  <input
                    type="text"
                    className="foloosi-input-card"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="4242 4242 4242 4242"
                    required
                  />
                  <div className="foloosi-card-type-icon">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" style={{ height: '14px' }} />
                  </div>
                </div>
              </div>

              <div className="foloosi-row-2">
                <div className="foloosi-field">
                  <label className="foloosi-sublabel">Expires (MM/YY)</label>
                  <input
                    type="text"
                    className="foloosi-input-card"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    placeholder="MM/YY"
                    required
                  />
                </div>
                <div className="foloosi-field">
                  <label className="foloosi-sublabel">Security CVV</label>
                  <input
                    type="password"
                    maxLength="4"
                    className="foloosi-input-card"
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value)}
                    placeholder="CVV"
                    required
                  />
                </div>
              </div>

              <button type="submit" className="foloosi-btn-proceed" style={{ marginTop: '8px' }}>
                PAY AED {formattedAmount}
              </button>
            </form>
          )}

          {step === 'processing' && (
            <div className="foloosi-processing-box">
              <div className="foloosi-spinner"></div>
              <h4 style={{ margin: '14px 0 6px', fontSize: '15px', fontWeight: '700', color: '#1e293b' }}>
                3D Secure Verification
              </h4>
              <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>
                Contacting issuing bank via Foloosi Gateway...
              </p>
            </div>
          )}
        </div>

        {/* Gray Footer with Gateway Badges matching user image */}
        <div className="foloosi-footer">
          <div className="foloosi-badge-item">
            {/* Foloosi logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <div style={{ width: '18px', height: '18px', background: '#0284c7', borderRadius: '3px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '11px', fontWeight: '900' }}>
                F
              </div>
              <div style={{ lineHeight: '1', textAlign: 'left' }}>
                <span style={{ fontSize: '9px', color: '#0f766e', display: 'block', fontWeight: '700' }}>فلوسي</span>
                <span style={{ fontSize: '10px', color: '#0369a1', fontWeight: '800' }}>foloosi</span>
              </div>
            </div>
          </div>

          <div className="foloosi-badge-item">
            {/* The Emirates */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
              <div style={{ display: 'flex', gap: '1px', height: '14px', alignItems: 'flex-end' }}>
                <div style={{ width: '2.5px', height: '14px', background: '#00732f' }}></div>
                <div style={{ width: '2.5px', height: '12px', background: '#ffffff', border: '0.5px solid #ccc' }}></div>
                <div style={{ width: '2.5px', height: '10px', background: '#000000' }}></div>
                <div style={{ width: '2.5px', height: '14px', background: '#ff0000' }}></div>
              </div>
              <div style={{ fontSize: '8px', lineHeight: '1', fontWeight: '700', color: '#1e293b' }}>
                <span>الإمارات</span><br />
                <span>THE EMIRATES</span>
              </div>
            </div>
          </div>

          <div className="foloosi-badge-item">
            <span style={{ fontSize: '8.5px', fontWeight: '700', color: '#059669', border: '1px solid #10b981', padding: '1px 3px', borderRadius: '2px' }}>
              PCI DSS
            </span>
          </div>

          <div className="foloosi-badge-item">
            <span style={{ fontSize: '10.5px', fontWeight: '900', color: '#1a1f71', fontStyle: 'italic' }}>VISA</span>
          </div>

          <div className="foloosi-badge-item">
            {/* Mastercard circles */}
            <div style={{ display: 'inline-flex', alignItems: 'center' }}>
              <span style={{ width: '11px', height: '11px', background: '#eb001b', borderRadius: '50%', display: 'inline-block' }}></span>
              <span style={{ width: '11px', height: '11px', background: '#f79e1b', borderRadius: '50%', display: 'inline-block', marginLeft: '-5px', opacity: 0.9 }}></span>
            </div>
          </div>

          <div className="foloosi-badge-item">
            <span style={{ fontSize: '8px', fontWeight: '800', background: '#006fcf', color: '#fff', padding: '1px 3px', borderRadius: '2px' }}>
              AMEX
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
