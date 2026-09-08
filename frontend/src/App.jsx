// frontend/src/App.jsx
import React, { useState, useEffect } from 'react';
import { CartProvider, useCart } from './context/CartContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { CartDrawer } from './components/cart/CartDrawer';
import { HomePage } from './pages/HomePage';
import { CategoryPage } from './pages/CategoryPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { CCPaymentPage } from './pages/CCPaymentPage';
import { ConfirmationPage } from './pages/ConfirmationPage';
import { WhatsAppIcon } from './components/icons/Icons';

function getInitialRoute() {
  const path = window.location.pathname.toLowerCase();
  if (
    path.includes('/desks') ||
    path.includes('/chairs') ||
    path.includes('/storage') ||
    path.includes('/meeting') ||
    path.includes('/lounge') ||
    path.includes('/pantries') ||
    path.includes('/accessories')
  ) {
    const cleanPath = path.replace(/^\/|\/$/g, '');
    const parts = cleanPath.split('/');
    const cat = parts[0] || 'desks';
    const subcat = parts[1] ? parts[1].replace(/-/g, ' ') : null;
    return { route: 'category', params: { category: cat, subcategory: subcat } };
  }
  if (path.includes('/product/')) {
    const parts = path.split('/').filter(Boolean);
    const id = parts[parts.length - 1] || 63824;
    return { route: 'product', params: { id } };
  }
  if (path.includes('/ccpayment')) return { route: 'ccpayment', params: {} };
  if (path.includes('/confirmation') || path.includes('/order-success')) return { route: 'confirmation', params: {} };
  if (path.includes('/checkout')) return { route: 'checkout', params: {} };
  return { route: 'home', params: {} };
}

function AppContent() {
  const initial = getInitialRoute();
  const [currentRoute, setCurrentRoute] = useState(initial.route);
  const [routeParams, setRouteParams] = useState(initial.params);
  const [lastOrder, setLastOrder] = useState(null);
  const { toast } = useCart();

  useEffect(() => {
    const onPopState = () => {
      const r = getInitialRoute();
      setCurrentRoute(r.route);
      setRouteParams(r.params);
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const handleNavigate = (route, params = {}) => {
    setCurrentRoute(route);
    setRouteParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (route === 'home') {
      window.history.pushState({}, '', '/');
    } else if (route === 'category') {
      const cat = params.category || 'desks';
      const sub = params.subcategory ? `${params.subcategory.toLowerCase().replace(/\s+/g, '-')}/` : '';
      window.history.pushState({}, '', `/${cat}/${sub}`);
    } else if (route === 'checkout') {
      window.history.pushState({}, '', '/checkout/');
    } else if (route === 'ccpayment') {
      window.history.pushState({}, '', '/ccpayment/');
    } else if (route === 'confirmation' || route === 'order-success') {
      const ordSlug = params.orderNumber ? `?order=${params.orderNumber}` : '';
      window.history.pushState({}, '', `/confirmation/${ordSlug}`);
    } else if (route === 'product') {
      const pSlug = params.slug || 'ivory-l-shape-desk-white-frame';
      const pId = params.id || 63824;
      window.history.pushState({}, '', `/product/${pSlug}/${pId}/`);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f8fafc', width: '100%', maxWidth: '100%', overflowX: 'clip' }}>
      {/* Header (hidden on full-screen /ccpayment/ view) */}
      {currentRoute !== 'ccpayment' && (
        <Header onNavigate={handleNavigate} currentRoute={currentRoute} />
      )}

      {/* Main Content Router */}
      <div style={{ flex: 1 }}>
        {currentRoute === 'home' && (
          <HomePage onNavigate={handleNavigate} />
        )}

        {currentRoute === 'category' && (
          <CategoryPage
            category={routeParams.category || 'desks'}
            subcategory={routeParams.subcategory}
            onNavigate={handleNavigate}
          />
        )}

        {currentRoute === 'product' && (
          <ProductDetailPage
            productId={routeParams.id || 63824}
            onNavigate={handleNavigate}
          />
        )}

        {currentRoute === 'checkout' && (
          <CheckoutPage
            onNavigate={handleNavigate}
            onOrderSuccess={(order) => setLastOrder(order)}
          />
        )}

        {currentRoute === 'ccpayment' && (
          <CCPaymentPage
            onNavigate={handleNavigate}
            onOrderSuccess={(order) => setLastOrder(order)}
            initialCustomerData={routeParams.customerData}
          />
        )}

        {(currentRoute === 'confirmation' || currentRoute === 'order-success') && (
          <ConfirmationPage
            orderNumber={routeParams.orderNumber}
            orderData={routeParams.order || lastOrder}
            onNavigate={handleNavigate}
          />
        )}
      </div>

      {/* Cart Drawer */}
      <CartDrawer onNavigate={handleNavigate} />

      {/* Footer (hidden on full-screen /ccpayment/ view) */}
      {currentRoute !== 'ccpayment' && (
        <Footer onNavigate={handleNavigate} />
      )}



      {/* Toast Notification */}
      {toast && (
        <div className="toast-notice">
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <CartProvider>
      <AppContent />
    </CartProvider>
  );
}
