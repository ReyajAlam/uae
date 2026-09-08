// frontend/src/pages/OrderSuccessPage.jsx
import React, { useEffect, useState } from 'react';
import { fetchOrder } from '../services/api';
import { CheckIcon, TruckIcon, ShieldIcon, PhoneIcon } from '../components/icons/Icons';

export const OrderSuccessPage = ({ orderNumber, orderData, onNavigate }) => {
  const [order, setOrder] = useState(orderData || null);
  const [loading, setLoading] = useState(!orderData);

  useEffect(() => {
    if (!orderData && orderNumber) {
      async function load() {
        const o = await fetchOrder(orderNumber);
        setOrder(o);
        setLoading(false);
      }
      load();
    }
  }, [orderNumber, orderData]);

  if (loading) {
    return (
      <div className="container" style={{ padding: '80px 0', textAlign: 'center', color: '#64748b' }}>
        <h2>Loading your order confirmation...</h2>
      </div>
    );
  }

  return (
    <div className="container" style={{ maxWidth: '800px', padding: '60px 20px 100px' }}>
      <div style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '16px',
        padding: '40px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
        textAlign: 'center'
      }}>
        {/* Animated Check */}
        <div style={{
          width: '72px',
          height: '72px',
          borderRadius: '50%',
          background: '#ecfdf5',
          color: '#10b981',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px',
          boxShadow: '0 0 0 10px rgba(16, 185, 129, 0.1)'
        }}>
          <CheckIcon size={36} />
        </div>

        <span style={{ fontSize: '13px', fontWeight: '700', color: '#10b981', textTransform: 'uppercase', letterSpacing: '1px' }}>
          Order Confirmed & Placed
        </span>

        <h1 style={{ fontSize: '32px', fontWeight: '800', marginTop: '6px', color: '#0f172a' }}>
          Thank You For Your Order!
        </h1>

        <p style={{ color: '#64748b', fontSize: '15px', marginTop: '10px' }}>
          We have received your order and our logistics team will contact you shortly to coordinate white-glove delivery and assembly.
        </p>

        {/* Order Meta Card */}
        <div style={{
          background: '#f8fafc',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          padding: '20px',
          margin: '32px 0',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '16px',
          textAlign: 'left'
        }}>
          <div>
            <span style={{ fontSize: '12px', color: '#64748b', display: 'block' }}>Order Reference:</span>
            <strong style={{ fontSize: '15px', color: '#9d260c' }}>{order?.order_number || orderNumber}</strong>
          </div>

          <div>
            <span style={{ fontSize: '12px', color: '#64748b', display: 'block' }}>Payment Method:</span>
            <strong style={{ fontSize: '14px', textTransform: 'uppercase' }}>{order?.payment_method || 'Card'}</strong>
            {order?.payment_status && (
              <span style={{ display: 'inline-block', marginLeft: '6px', fontSize: '11px', background: '#ecfdf5', color: '#059669', padding: '1px 6px', borderRadius: '4px', fontWeight: '700' }}>
                {order.payment_status}
              </span>
            )}
          </div>

          <div>
            <span style={{ fontSize: '12px', color: '#64748b', display: 'block' }}>Transaction Ref:</span>
            <strong style={{ fontSize: '13px', color: '#1665d8', fontFamily: 'monospace' }}>
              {order?.transaction_id || '#FLSAPI000A6a9f37e60f4ac'}
            </strong>
          </div>

          <div>
            <span style={{ fontSize: '12px', color: '#64748b', display: 'block' }}>Delivery Location:</span>
            <strong style={{ fontSize: '14px' }}>{order?.emirate || 'Dubai'}, UAE</strong>
          </div>
        </div>

        {/* Items Purchased */}
        {order?.items && order.items.length > 0 && (
          <div style={{ textAlign: 'left', marginBottom: '32px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '14px', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' }}>
              Ordered Items
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {order.items.map((it, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px dashed #f1f5f9' }}>
                  <div>
                    <strong style={{ fontSize: '14px', color: '#0f172a' }}>{it.product_name}</strong>
                    {it.variant && <span style={{ display: 'block', fontSize: '12px', color: '#64748b' }}>Size: {it.variant} (Qty: {it.quantity})</span>}
                  </div>
                  <span style={{ fontSize: '14px', fontWeight: '700', color: '#9d260c' }}>
                    AED {parseFloat(it.total).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              ))}
            </div>

            {/* Receipt Breakdown */}
            <div style={{ marginTop: '20px', background: '#f8fafc', padding: '16px', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <span style={{ color: '#64748b' }}>Subtotal:</span>
                <span>AED {parseFloat(order.subtotal).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <span style={{ color: '#64748b' }}>UAE VAT (5%):</span>
                <span>AED {parseFloat(order.vat).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <span style={{ color: '#64748b' }}>Delivery & Installation:</span>
                <span style={{ color: '#166534', fontWeight: '700' }}>FREE</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px', fontWeight: '800', borderTop: '1px solid #e2e8f0', paddingTop: '8px', marginTop: '4px' }}>
                <span>Total Paid:</span>
                <span style={{ color: '#9d260c' }}>AED {parseFloat(order.total).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
          <button
            onClick={() => onNavigate('home')}
            style={{
              background: '#9d260c',
              color: 'white',
              padding: '12px 28px',
              borderRadius: '8px',
              fontSize: '15px',
              fontWeight: '700'
            }}
          >
            Return to Homepage
          </button>

          <button
            onClick={() => onNavigate('category', { category: 'desks' })}
            style={{
              background: '#f1f5f9',
              color: '#1e293b',
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '15px',
              fontWeight: '600'
            }}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};
