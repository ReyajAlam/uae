// frontend/src/components/common/Header.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useCart } from '../../context/CartContext';
import { fetchProducts } from '../../services/api';

const MEGA_CATEGORIES = [
  { name: 'Chairs', slug: 'chairs', img: 'https://www.officebase.ae/assets/images/image-data/6374782371.webp' },
  { name: 'Desks', slug: 'desks', img: 'https://www.officebase.ae/assets/images/image-data/5070366126.webp' },
  { name: 'Storage', slug: 'storage', img: 'https://www.officebase.ae/assets/images/image-data/4328270562.webp' },
  { name: 'Meeting And Shared Spaces', slug: 'meeting-and-shared-spaces', img: 'https://www.officebase.ae/assets/images/image-data/7936905474.webp' },
  { name: 'Lounge And Reception Areas', slug: 'lounge-and-reception-areas', img: 'https://www.officebase.ae/assets/images/image-data/8831986750.webp' },
  { name: 'Pantries', slug: 'pantries', img: 'https://www.officebase.ae/assets/images/image-data/683519101.webp' },
  { name: 'Office Accessories', slug: 'office-accessories', img: 'https://www.officebase.ae/assets/images/image-data/7245863393.webp' },
  { name: 'Acoustic Solutions', slug: 'acoustic-solutions', img: 'https://www.officebase.ae/assets/images/image-data/7331674415.webp' },
  { name: 'Decor', slug: 'decor', img: 'https://www.officebase.ae/assets/images/image-data/3237230023.webp' }
];

const PRODUCTS_MEGA_COLUMNS = [
  {
    title: 'Chairs',
    slug: 'chairs',
    items: ['Executive Chairs', 'Workstation Chairs', 'Visitor Chairs', 'Office Chairs']
  },
  {
    title: 'Desks',
    slug: 'desks',
    items: ['CEO Desks', 'Executive Desks', 'Workstation Desks', 'Height Adjustable Desks']
  },
  {
    title: 'Storage',
    slug: 'storage',
    items: ['Bookcase', 'Cabinets', 'Executive Wardrobe', 'Pedestals']
  },
  {
    title: 'Meeting And Shared Spaces',
    slug: 'meeting-and-shared-spaces',
    items: ['Height Adjustable Meeting Tables', 'Meeting Tables', 'Multi-Purpose Tables', 'E Meeting']
  },
  {
    title: 'Lounge And Reception Areas',
    slug: 'lounge-and-reception-areas',
    items: ['Designer Reception Desks', 'Reception Desks', 'Sofas', 'Coffee Tables']
  },
  {
    title: 'Pantries',
    slug: 'pantries',
    items: ['Dining Tables', 'High Tables']
  },
  {
    title: 'Office Accessories',
    slug: 'office-accessories',
    items: ["Power Distribution Units (PDU's)", 'Cable Management', 'Writing Boards', 'Safes']
  },
  {
    title: 'Acoustic Solutions',
    slug: 'acoustic-solutions',
    items: ['London Phone Booth', 'THE POD']
  }
];

const MOBILE_CATEGORIES = [
  {
    name: 'Chairs',
    slug: 'chairs',
    subcategories: [
      { name: 'All Chairs', slug: 'chairs', isAll: true },
      { name: 'Executive Chairs', slug: 'executive-chairs' },
      { name: 'Workstation Chairs', slug: 'workstation-chairs' },
      { name: 'Visitor Chairs', slug: 'visitor-chairs' },
      { name: 'Office Chairs', slug: 'office-chairs' },
      { name: 'Meeting Room Chairs', slug: 'meeting-room-chairs' },
      { name: 'Reception Chairs', slug: 'reception-chairs' },
      { name: 'Gaming Chairs', slug: 'gaming-chairs' },
      { name: 'Break Out Room', slug: 'break-out-room' },
      { name: 'Stackable Chairs', slug: 'stackable-chairs' },
      { name: 'Dining Chairs', slug: 'dining-chairs' },
      { name: 'Sofas', slug: 'sofas' },
      { name: 'Bar Stools', slug: 'bar-stools' },
      { name: 'Training Room Chairs', slug: 'training-room-chairs' }
    ]
  },
  {
    name: 'Desks',
    slug: 'desks',
    subcategories: [
      { name: 'All Desks', slug: 'desks', isAll: true },
      { name: 'CEO Desks', slug: 'ceo-desks' },
      { name: 'Executive Desks', slug: 'executive-desks' },
      { name: 'Workstation Desks', slug: 'workstation-desks' },
      { name: 'Height Adjustable Desks', slug: 'height-adjustable-desks' },
      { name: 'Pedestals', slug: 'pedestals' },
      { name: 'Metal Pedestal', slug: 'metal-pedestal' },
      { name: 'Hanging Drawers', slug: 'hanging-drawers' },
      { name: 'Accessories', slug: 'accessories' }
    ]
  },
  {
    name: 'Storage',
    slug: 'storage',
    subcategories: [
      { name: 'All Storage', slug: 'storage', isAll: true },
      { name: 'Bookcase', slug: 'bookcase' },
      { name: 'Cabinets', slug: 'cabinets' },
      { name: 'Executive Wardrobe', slug: 'executive-wardrobe' },
      { name: 'Pedestals', slug: 'pedestals' },
      { name: 'Metal Pedestals', slug: 'metal-pedestals' },
      { name: 'Hanging Drawers', slug: 'hanging-drawers' },
      { name: 'Filing Cabinets', slug: 'filing-cabinets' },
      { name: 'Metal Filing Cabinets', slug: 'metal-filing-cabinets' },
      { name: 'Filing Cabinet with Planter', slug: 'filing-cabinet-with-planter' },
      { name: 'Lateral Filing', slug: 'lateral-filing' },
      { name: 'Lockers', slug: 'lockers' },
      { name: 'Mail Boxes', slug: 'mail-boxes' }
    ]
  },
  {
    name: 'Meeting And Shared Spaces',
    slug: 'meeting-and-shared-spaces',
    subcategories: [
      { name: 'All Meeting and Shared Spaces', slug: 'meeting-and-shared-spaces', isAll: true },
      { name: 'Height Adjustable Meeting Tables', slug: 'height-adjustable-meeting-tables' },
      { name: 'Meeting Tables', slug: 'meeting-tables' },
      { name: 'Multi-Purpose Tables', slug: 'multi-purpose-tables' },
      { name: 'E Meeting', slug: 'e-meeting' },
      { name: 'TV Units', slug: 'tv-units' },
      { name: 'Podium', slug: 'podium' }
    ]
  },
  {
    name: 'Lounge And Reception Areas',
    slug: 'lounge-and-reception-areas',
    subcategories: [
      { name: 'All Lounge and Reception Areas', slug: 'lounge-and-reception-areas', isAll: true },
      { name: 'Designer Reception Desks', slug: 'designer-reception-desks' },
      { name: 'Reception Desks', slug: 'reception-desks' },
      { name: 'Sofas', slug: 'sofas' },
      { name: 'Coffee Tables', slug: 'coffee-tables' },
      { name: 'Art & Wall Decor', slug: 'art-wall-decor' }
    ]
  },
  {
    name: 'Pantries',
    slug: 'pantries',
    subcategories: [
      { name: 'All Pantries', slug: 'pantries', isAll: true },
      { name: 'Dining Tables', slug: 'dining-tables' },
      { name: 'High Tables', slug: 'high-tables' }
    ]
  },
  {
    name: 'Office Accessories',
    slug: 'office-accessories',
    subcategories: [
      { name: 'All Office Accessories', slug: 'office-accessories', isAll: true },
      { name: 'Power Distribution Units (PDU\'s)', slug: 'power-distribution-units-pdu-s' },
      { name: 'Cable Management', slug: 'cable-management' },
      { name: 'Writing Boards', slug: 'writing-boards' },
      { name: 'Safes', slug: 'safes' },
      { name: 'Computer Accessories', slug: 'computer-accessories' }
    ]
  },
  {
    name: 'Acoustic Solutions',
    slug: 'acoustic-solutions',
    subcategories: [
      { name: 'All Acoustic Solutions', slug: 'acoustic-solutions', isAll: true },
      { name: 'London Phone Booth', slug: 'london-phone-booth' },
      { name: 'THE POD', slug: 'the-pod' }
    ]
  },
  {
    name: 'Decor',
    slug: 'decor',
    subcategories: [
      { name: 'All Decor', slug: 'decor', isAll: true },
      { name: 'Art & Wall Decor', slug: 'art-wall-decor' }
    ]
  }
];

export const Header = ({ onNavigate, currentRoute }) => {
  const { itemCount, setIsCartOpen } = useCart();
  const [isMegaOpen, setIsMegaOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileSearch, setMobileSearch] = useState('');
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const searchRef = useRef(null);
  const megaTimerRef = useRef(null);
  const megaMenuRef = useRef(null);
  const megaBtnRef = useRef(null);

  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const productsTimerRef = useRef(null);
  const productsMenuRef = useRef(null);
  const productsBtnRef = useRef(null);

  const toggleMobileCategory = (slug) => {
    setExpandedCategory(prev => prev === slug ? null : slug);
  };

  const handleMobileSearchSubmit = (e) => {
    e.preventDefault();
    if (mobileSearch.trim()) {
      setIsMobileMenuOpen(false);
      onNavigate('category', { search: mobileSearch.trim() });
    }
  };

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const handleMouseEnter = () => {
    if (megaTimerRef.current) clearTimeout(megaTimerRef.current);
    if (productsTimerRef.current) clearTimeout(productsTimerRef.current);
    setIsProductsOpen(false);
    setIsMegaOpen(true);
  };

  const handleMouseLeave = () => {
    if (megaTimerRef.current) clearTimeout(megaTimerRef.current);
    megaTimerRef.current = setTimeout(() => {
      setIsMegaOpen(false);
    }, 180);
  };

  const handleToggleClick = (e) => {
    e.stopPropagation();
    if (megaTimerRef.current) clearTimeout(megaTimerRef.current);
    if (productsTimerRef.current) clearTimeout(productsTimerRef.current);
    setIsProductsOpen(false);
    setIsMegaOpen(prev => !prev);
  };

  const handleProductsEnter = () => {
    if (productsTimerRef.current) clearTimeout(productsTimerRef.current);
    if (megaTimerRef.current) clearTimeout(megaTimerRef.current);
    setIsMegaOpen(false);
    setIsProductsOpen(true);
  };

  const handleProductsLeave = () => {
    if (productsTimerRef.current) clearTimeout(productsTimerRef.current);
    productsTimerRef.current = setTimeout(() => {
      setIsProductsOpen(false);
    }, 180);
  };

  const handleProductsClick = (e) => {
    e.stopPropagation();
    if (productsTimerRef.current) clearTimeout(productsTimerRef.current);
    if (megaTimerRef.current) clearTimeout(megaTimerRef.current);
    setIsMegaOpen(false);
    setIsProductsOpen(prev => !prev);
  };

  useEffect(() => {
    const handleDocClick = (e) => {
      if (
        megaMenuRef.current &&
        !megaMenuRef.current.contains(e.target) &&
        megaBtnRef.current &&
        !megaBtnRef.current.contains(e.target)
      ) {
        setIsMegaOpen(false);
      }
      if (
        productsMenuRef.current &&
        !productsMenuRef.current.contains(e.target) &&
        productsBtnRef.current &&
        !productsBtnRef.current.contains(e.target)
      ) {
        setIsProductsOpen(false);
      }
    };
    if (isMegaOpen || isProductsOpen) {
      document.addEventListener('click', handleDocClick);
    }
    return () => {
      document.removeEventListener('click', handleDocClick);
    };
  }, [isMegaOpen, isProductsOpen]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      const res = await fetchProducts({ search: searchQuery });
      setSearchResults(res.slice(0, 5));
    }, 200);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  return (
    <header className="ob-header">
      <div className="ob-header-container">
        {/* Left: OfficeBase Logo Image */}
        <div className="ob-logo">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('home');
            }}
          >
            <img
              src="https://officebaseuae.b-cdn.net/assets/images/root/officebase-logo-300x44.png"
              alt="OFFICEBASE"
            />
          </a>
        </div>

        {/* Right: Top Utilities & Main Navigation Bar */}
        <div className="ob-header-right">
          {/* Top Utility Icons (Search, User, Cart) */}
          <div className="ob-util-row">
            {/* Search Popover */}
            <div className="hide-mobile" ref={searchRef} style={{ position: 'relative' }}>
              <button
                className="ob-util-icon-link"
                onClick={() => setSearchOpen(!searchOpen)}
                aria-label="Search"
              >
                <img
                  src="https://officebaseuae.b-cdn.net/assets/images/root/icons/search.png?v5"
                  alt="Search"
                />
              </button>

              {searchOpen && (
                <div style={{
                  position: 'absolute',
                  top: '32px',
                  right: 0,
                  width: '320px',
                  background: '#ffffff',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  padding: '10px',
                  zIndex: 999999
                }}>
                  <input
                    type="text"
                    placeholder="Search Entire Store..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                      fontSize: '13px'
                    }}
                  />
                  {searchResults.length > 0 && (
                    <div style={{ marginTop: '8px', borderTop: '1px solid #eee', paddingTop: '6px' }}>
                      {searchResults.map(item => (
                        <div
                          key={item.id}
                          onClick={() => {
                            onNavigate('product', { id: item.id, slug: item.slug });
                            setSearchOpen(false);
                            setSearchQuery('');
                          }}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '6px 0',
                            cursor: 'pointer'
                          }}
                        >
                          <img src={item.image_url} alt="" style={{ width: '32px', height: '32px', objectFit: 'contain' }} />
                          <div style={{ fontSize: '12px' }}>
                            <div style={{ fontWeight: '600', color: '#111' }}>{item.name}</div>
                            <div style={{ color: '#894b13', fontWeight: '700' }}>AED {parseFloat(item.price).toFixed(2)}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* User Icon */}
            <button
              className="ob-util-icon-link hide-mobile"
              onClick={() => onNavigate('home')}
              aria-label="User Account"
            >
              <img
                src="https://officebaseuae.b-cdn.net/assets/images/root/icons/user.png?v1"
                alt="My Account"
              />
            </button>

            {/* Shopping Cart Icon with Red Badge */}
            <button
              className="ob-util-icon-link"
              onClick={() => setIsCartOpen(true)}
              aria-label="Shopping Cart"
            >
              <img
                src="https://officebaseuae.b-cdn.net/assets/images/root/icons/shopping-cart.png?v2"
                alt="Cart"
              />
              <span className="ob-cart-badge">{itemCount}</span>
            </button>

            {/* Hamburger Menu for Mobile */}
            <button
              className="ob-mobile-menu-btn"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle Menu"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>
          </div>

          {/* Main Navigation for Desktop (Aligned to Right beneath Icons) */}
          <ul className="ob-nav-menu">
            <li className={`ob-nav-item ${currentRoute === 'home' && !isMegaOpen ? 'active' : ''}`}>
              <button
                className={`ob-nav-btn ${currentRoute === 'home' && !isMegaOpen ? 'active' : ''}`}
                onClick={() => {
                  setIsMegaOpen(false);
                  onNavigate('home');
                }}
              >
                HOME
              </button>
            </li>

            {/* Shop By Category Mega Menu */}
            <li
              ref={megaBtnRef}
              className={`ob-nav-item ${isMegaOpen ? 'mega-active' : ''}`}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button
                className={`ob-nav-btn ${isMegaOpen ? 'mega-active' : ''}`}
                onClick={handleToggleClick}
              >
                SHOP BY CATEGORY
              </button>
            </li>

            <li
              ref={productsBtnRef}
              className={`ob-nav-item ${isProductsOpen ? 'mega-active' : ''}`}
              onMouseEnter={handleProductsEnter}
              onMouseLeave={handleProductsLeave}
            >
              <button
                className={`ob-nav-btn ${isProductsOpen || (currentRoute === 'category' && !isMegaOpen) ? 'active' : ''}`}
                onClick={handleProductsClick}
              >
                PRODUCTS
                <svg
                  style={{ marginLeft: '5px', verticalAlign: 'middle', transform: isProductsOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
                  viewBox="0 0 24 24"
                  width="13"
                  height="13"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  fill="none"
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>
            </li>

            <li className="ob-nav-item">
              <button
                className="ob-nav-btn"
                onClick={() => {
                  setIsMegaOpen(false);
                  onNavigate('home');
                }}
              >
                PROJECT GALLERY
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Exact Mega Menu Overlay Matching User Image (Desktop) */}
      {isMegaOpen && (
        <div
          ref={megaMenuRef}
          className="ob-mega-menu"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="ob-mega-wrapper">
            {/* Left Box: Dark Charcoal / Black Panel with Text */}
            <div className="ob-mega-left">
              <p>
                Your office reflects your business's identity. The interior design, including the colors and style of your furniture, establishes the ambiance of your office and shapes the impression you leave on your stakeholders.
              </p>
              <p>
                We prioritize our customers and are dedicated to offering exceptional design and high-quality furniture at competitive prices!
              </p>
            </div>

            {/* Right Box: Light Grey Panel with 9 Categories Grid */}
            <div className="ob-mega-right">
              <div className="ob-mega-grid">
                {MEGA_CATEGORIES.map(cat => (
                  <div
                    key={cat.slug}
                    className="ob-mega-item"
                    onClick={() => {
                      setIsMegaOpen(false);
                      onNavigate('category', { category: cat.slug });
                    }}
                  >
                    <figure>
                      <img src={cat.img} alt={cat.name} />
                      <figcaption>{cat.name}</figcaption>
                    </figure>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Products Mega Dropdown Overlay Matching Image 1 (Desktop) */}
      {isProductsOpen && (
        <div
          ref={productsMenuRef}
          className="ob-products-mega-dropdown"
          onMouseEnter={handleProductsEnter}
          onMouseLeave={handleProductsLeave}
        >
          <div className="ob-products-mega-grid">
            {PRODUCTS_MEGA_COLUMNS.map((col) => (
              <div key={col.slug} className="ob-prod-mega-col">
                <h3
                  className="ob-prod-mega-title"
                  onClick={() => {
                    setIsProductsOpen(false);
                    onNavigate('category', { category: col.slug });
                  }}
                >
                  {col.title}
                </h3>
                <ul className="ob-prod-mega-list">
                  {col.items.map((item, idx) => (
                    <li key={idx}>
                      <span
                        className="ob-prod-mega-link"
                        onClick={() => {
                          setIsProductsOpen(false);
                          onNavigate('category', { category: col.slug, subcategory: item });
                        }}
                      >
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
                <div
                  className="ob-prod-mega-viewall"
                  onClick={() => {
                    setIsProductsOpen(false);
                    onNavigate('category', { category: col.slug });
                  }}
                >
                  View All &raquo;
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mobile Offcanvas Drawer Modal matching exact HTML & Screenshot */}
      <div
        className={`ob-offcanvas-backdrop ${isMobileMenuOpen ? 'show' : ''}`}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      <div className={`offcanvas__area ${isMobileMenuOpen ? 'show' : ''}`} id="offCanvasModal">
        <div className="offcanvas__wrapper">
          {/* Top Logo & Close Button */}
          <div className="offcanvas__top">
            <div className="logo">
              <a
                href="/"
                onClick={(e) => {
                  e.preventDefault();
                  setIsMobileMenuOpen(false);
                  onNavigate('home');
                }}
              >
                <img
                  src="https://officebaseuae.b-cdn.net/assets/images/root/officebase-logo.png"
                  alt="OFFICEBASE"
                />
              </a>
            </div>
            <div className="offcanvas__close">
              <button
                className="offcanvas__close-btn"
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
          </div>

          {/* Search Input */}
          <div className="sidebar__search">
            <form onSubmit={handleMobileSearchSubmit}>
              <input
                type="text"
                name="q"
                placeholder="What are you searching for?"
                value={mobileSearch}
                onChange={(e) => setMobileSearch(e.target.value)}
              />
              <button type="submit" aria-label="Submit search">
                <svg
                  style={{ width: '19px', height: '19px' }}
                  viewBox="0 0 512 512"
                >
                  <path fill="currentColor" d="M141.367,116.518c-7.384-7.39-19.364-7.39-26.748,0c-27.416,27.416-40.891,65.608-36.975,104.79 c0.977,9.761,9.2,17.037,18.803,17.037c0.631,0,1.267-0.032,1.898-0.095c10.398-1.04,17.983-10.316,16.943-20.707 c-2.787-27.845,6.722-54.92,26.079-74.278C148.757,135.882,148.757,123.901,141.367,116.518z"></path>
                  <path fill="currentColor" d="M216.276,0C97.021,0,0,97.021,0,216.276s97.021,216.276,216.276,216.276s216.276-97.021,216.276-216.276 S335.53,0,216.276,0z M216.276,394.719c-98.396,0-178.443-80.047-178.443-178.443S117.88,37.833,216.276,37.833 c98.39,0,178.443,80.047,178.443,178.443S314.672,394.719,216.276,394.719z"></path>
                  <path fill="currentColor" d="M506.458,479.71L368.999,342.252c-7.39-7.39-19.358-7.39-26.748,0c-7.39,7.384-7.39,19.364,0,26.748L479.71,506.458 c3.695,3.695,8.531,5.542,13.374,5.542c4.843,0,9.679-1.847,13.374-5.542C513.847,499.074,513.847,487.094,506.458,479.71z"></path>
                </svg>
              </button>
            </form>
          </div>

          {/* Navigation Menu List */}
          <div className="sidebar-mobile-menu-c">
            <ul className="menu level-1">
              {MOBILE_CATEGORIES.map(cat => {
                const isOpen = expandedCategory === cat.slug;
                return (
                  <li key={cat.slug} className={`menu-item ${isOpen ? 'active-submenu' : ''}`}>
                    <div
                      className="menu-link-wrapper"
                      onClick={() => toggleMobileCategory(cat.slug)}
                    >
                      <span className="category-title">{cat.name}</span>
                      <svg
                        className={`chevron-icon ${isOpen ? 'rotated' : ''}`}
                        viewBox="0 0 24 24"
                      >
                        <path fill="currentColor" d="m17.414 10.586-8-8a2 2 0 0 0 -2.828 2.828l6.586 6.586-6.586 6.586a2 2 0 0 0 2.828 2.828l8-8a2 2 0 0 0 0-2.828z"></path>
                      </svg>
                    </div>

                    {/* Subcategories (Level 2) */}
                    {isOpen && cat.subcategories && (
                      <ul className="sub-menu level-2">
                        {cat.subcategories.map((sub, idx) => (
                          <li key={idx}>
                            <a
                              href={`/${cat.slug}/${sub.slug !== cat.slug ? sub.slug + '/' : ''}`}
                              onClick={(e) => {
                                e.preventDefault();
                                setIsMobileMenuOpen(false);
                                onNavigate('category', { category: cat.slug });
                              }}
                              className={sub.isAll ? 'strong-all' : ''}
                            >
                              {sub.isAll ? <strong>{sub.name}</strong> : sub.name}
                            </a>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              })}

              {/* Project Gallery */}
              <li className="menu-item">
                <div
                  className="menu-link-wrapper"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onNavigate('home');
                  }}
                >
                  <span className="category-title">Project Gallery</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
};
