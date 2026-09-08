// frontend/src/pages/ProductDetailPage.jsx
import React, { useEffect, useState } from 'react';
import { fetchProduct } from '../services/api';
import { useCart } from '../context/CartContext';

const PDP_IMAGES = [
  'https://officebaseuae.b-cdn.net/assets/images/image-data/5638315749%2Ewebp?1',
  'https://officebaseuae.b-cdn.net/assets/images/image-data/6163583096%2Ewebp?1'
];

const DIMENSION_VARIANTS = [
  { id: 1, name: 'W1600 X D1450 X H750 MM', price: 3739 },
  { id: 2, name: 'W1800 X D1550 X H750 MM', price: 3949 },
  { id: 3, name: 'W2000 X D1550 X H750 MM', price: 4159 },
  { id: 4, name: 'W2200 X D1550 X H750 MM', price: 4369 }
];

const SEATING_CHAIRS = [
  {
    id: 'chair-milano',
    name: 'Milano Executive High Back PU Leather Chair',
    price: 1179,
    image: 'https://officebaseuae.b-cdn.net/assets/images/image-data/2888333243.webp'
  },
  {
    id: 'chair-ambassador',
    name: 'Ambassador Executive High Back PU Leather Chair',
    price: 1259,
    image: 'https://officebaseuae.b-cdn.net/assets/images/image-data/9748550750.webp'
  },
  {
    id: 'chair-monarque',
    name: 'Monarque Executive High Back PU Leather Chair',
    price: 1009,
    image: 'https://officebaseuae.b-cdn.net/assets/images/image-data/5230254879.webp'
  }
];

export const ProductDetailPage = ({ productId = 63824, onNavigate }) => {
  const { addToCart } = useCart();
  const [selectedImage, setSelectedImage] = useState(PDP_IMAGES[0]);
  const [selectedVariant, setSelectedVariant] = useState(DIMENSION_VARIANTS[0]);
  const [dimensionDropdownOpen, setDimensionDropdownOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [chairScrollIndex, setChairScrollIndex] = useState(0);

  // Accordion state: only one open at a time ('desc' open by default)
  const [activeAccordion, setActiveAccordion] = useState('desc');

  const toggleAccordion = (key) => {
    setActiveAccordion(prev => (prev === key ? null : key));
  };

  const handlePrevImage = () => {
    const idx = PDP_IMAGES.indexOf(selectedImage);
    const newIdx = (idx - 1 + PDP_IMAGES.length) % PDP_IMAGES.length;
    setSelectedImage(PDP_IMAGES[newIdx]);
  };

  const handleNextImage = () => {
    const idx = PDP_IMAGES.indexOf(selectedImage);
    const newIdx = (idx + 1) % PDP_IMAGES.length;
    setSelectedImage(PDP_IMAGES[newIdx]);
  };

  const handleAddToCart = () => {
    const productItem = {
      id: 63824,
      name: 'IVORY L Shape Desk (White Frame)',
      price: selectedVariant.price,
      image_url: selectedImage,
      slug: 'ivory-l-shape-desk-white-frame'
    };
    addToCart(productItem, { variant_value: selectedVariant.name, price: selectedVariant.price }, quantity);
  };

  const handleAddChairToCart = (chair) => {
    const chairItem = {
      id: chair.id,
      name: chair.name,
      price: chair.price,
      image_url: chair.image,
      slug: chair.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    };
    addToCart(chairItem, null, 1);
  };

  return (
    <div className="ob-pdp-page">
      {/* 1. Breadcrumbs matching Image 2 */}
      <div className="breadcrumbs pdp-breadcrumbs">
        <div className="container">
          <a href="/" onClick={(e) => { e.preventDefault(); onNavigate('home'); }}>Home</a>
          <span className="crumb-sep">&raquo;</span>
          <a href="/desks/" onClick={(e) => { e.preventDefault(); onNavigate('category', { category: 'desks' }); }}>Desks</a>
          <span className="crumb-sep">&raquo;</span>
          <a href="/desks/ceo-desks/" onClick={(e) => { e.preventDefault(); onNavigate('category', { category: 'desks', subcategory: 'CEO Desks' }); }}>CEO Desks</a>
        </div>
      </div>

      {/* 2. Main PDP Content */}
      <div className="container pdp-main-container">
        <div className="pdp-layout-grid">
          {/* Left Column: Gallery & Thumbnails & Disclaimer */}
          <div className="pdp-left-col">
            <div className="gallery-container layout-left">
              {/* Main Display Image */}
              <div className="main-display">
                <div className="zoom-container">
                  <img
                    id="mainImage"
                    src={selectedImage}
                    alt="IVORY L Shape Desk (White Frame) | W1600 X D1450 X H750 MM"
                    className="pdp-main-img"
                  />
                  <button
                    type="button"
                    className="nav-arrow prev-arrow"
                    onClick={handlePrevImage}
                    aria-label="Previous Image"
                  >
                    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#fff" strokeWidth="2.5">
                      <polyline points="15 18 9 12 15 6"></polyline>
                    </svg>
                  </button>
                  <button
                    type="button"
                    className="nav-arrow next-arrow"
                    onClick={handleNextImage}
                    aria-label="Next Image"
                  >
                    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#fff" strokeWidth="2.5">
                      <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                  </button>
                </div>

                {/* Disclaimer */}
                <div className="pdp-disclaimer">
                  <p>
                    <strong>Disclaimer (E&amp;OE):</strong><br />
                    Images are for representative purposes only actual product colors and finishes may vary. We reserve the right to change designs and specifications without notice to ensure continuous product improvement.
                  </p>
                </div>
              </div>

              {/* Thumbnail Column on Left */}
              <div className="thumbnail-gallery thumbnail-left">
                {PDP_IMAGES.map((imgUrl, i) => (
                  <div
                    key={i}
                    className={`thumbnail-item ${selectedImage === imgUrl ? 'active' : ''}`}
                    onClick={() => setSelectedImage(imgUrl)}
                  >
                    <img src={imgUrl} alt={`Thumbnail ${i + 1}`} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Title, Price, Qty/ATC, Dimensions, Seating, Accordions */}
          <div className="pdp-right-col">
            <div className="pdp-info-wrapper">
              <h1 className="pdp-title">IVORY L Shape Desk (White Frame)</h1>

              <div className="pdp-price">
                <span className="uae-symbol">AED</span> {selectedVariant.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>

              {/* Quantity Selector & ADD TO CART Button matching Image 2 */}
              <div className="pdp-action-row">
                <div className="quantity-selector">
                  <button
                    type="button"
                    className="qty-btn minus"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    −
                  </button>
                  <input
                    type="text"
                    className="qty-input"
                    value={quantity}
                    readOnly
                  />
                  <button
                    type="button"
                    className="qty-btn plus"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    +
                  </button>
                </div>

                <button
                  type="button"
                  className="add-to-cart-btn"
                  onClick={handleAddToCart}
                >
                  ADD TO CART
                </button>
              </div>

              {/* Dimension Selection Accordion matching Image 2 & 3 */}
              <div className="pdp-selection-ob">
                <div className="accordion-item">
                  <div
                    className={`dimension-header ${dimensionDropdownOpen ? 'open' : ''}`}
                    onClick={() => setDimensionDropdownOpen(!dimensionDropdownOpen)}
                  >
                    <div className="dim-header-left">
                      <span className="dim-label">Select Desk Dimensions</span>
                      <span className="dim-selected-val">{selectedVariant.name}</span>
                    </div>
                    <span className="dim-arrow-icon">
                      <svg
                        viewBox="0 0 24 24"
                        width="18"
                        height="18"
                        stroke="currentColor"
                        strokeWidth="2"
                        fill="none"
                        style={{ transform: dimensionDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}
                      >
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </span>
                  </div>

                  {dimensionDropdownOpen && (
                    <div className="dimension-body">
                      <div className="dimension-pills-wrap">
                        {DIMENSION_VARIANTS.map(v => (
                          <button
                            key={v.id}
                            type="button"
                            className={`size-box ${selectedVariant.id === v.id ? 'selected' : ''}`}
                            onClick={() => setSelectedVariant(v)}
                          >
                            {v.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Seating Addons Cross-Sell Module matching Image 2, 3, 4 */}
              <div className="pdp-addons-module">
                <div className="pdp-addons-card">
                  <div className="addons-nav-header">
                    <span className="addon-tab-title active">Seating</span>
                  </div>

                  <div className="addons-carousel-wrap">
                    <div className="addons-cards-grid">
                      {SEATING_CHAIRS.map((chair) => (
                        <div key={chair.id} className="addon-chair-card">
                          <div className="addon-img-box">
                            <img src={chair.image} alt={chair.name} />
                          </div>
                          <div className="addon-info-box">
                            <h3 className="addon-title">{chair.name}</h3>
                            <div className="addon-price">
                              <span className="uae-symbol">AED</span> {chair.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            </div>
                            <button
                              type="button"
                              className="addon-atc-btn"
                              onClick={() => handleAddChairToCart(chair)}
                            >
                              Add To Cart
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Custom Accordions matching Image 4 & 5 */}
              <div className="pdp-info-accordions">
                {/* Description */}
                <div className="pdp-acc-item">
                  <div
                    className={`pdp-acc-header ${activeAccordion === 'desc' ? 'active' : ''}`}
                    onClick={() => toggleAccordion('desc')}
                  >
                    <span className="pdp-acc-title">Description</span>
                    <span className="pdp-acc-toggle">{activeAccordion === 'desc' ? '×' : '+'}</span>
                  </div>
                  {activeAccordion === 'desc' && (
                    <div className="pdp-acc-body">
                      <p>
                        The IVORY L Shape Desk combines contemporary elegance with smart functionality. Crafted from sustainable E1-grade particle board with a premium imported melamine finish, it features precision-engineered aluminum connectors for enhanced stability and a refined look. The password-lockable drawer offers secure, smooth storage, while the reversible side extension provides flexible configuration for different workspaces.
                      </p>
                    </div>
                  )}
                </div>

                {/* Technical Specification */}
                <div className="pdp-acc-item">
                  <div
                    className={`pdp-acc-header ${activeAccordion === 'specs' ? 'active' : ''}`}
                    onClick={() => toggleAccordion('specs')}
                  >
                    <span className="pdp-acc-title">Technical Specification</span>
                    <span className="pdp-acc-toggle">{activeAccordion === 'specs' ? '×' : '+'}</span>
                  </div>
                  {activeAccordion === 'specs' && (
                    <div className="pdp-acc-body">
                      <p style={{ color: '#27ae60', fontWeight: '700', marginBottom: '10px' }}>Key Features:</p>
                      <table className="pdp-specs-table">
                        <tbody>
                          <tr>
                            <td>Color</td>
                            <td>DB01 White + DB03 Ash Gray</td>
                          </tr>
                          <tr>
                            <td>Table-top Dimension</td>
                            <td>W1400 X D700 X H25 MM</td>
                          </tr>
                          <tr>
                            <td>Sideboard Dimension</td>
                            <td>W1400 X D400 X H665 MM</td>
                          </tr>
                          <tr>
                            <td>Eco-Friendly Build</td>
                            <td>Sustainable E1-grade particle board topped with a premium imported melamine finish.</td>
                          </tr>
                          <tr>
                            <td>Seamless Joinery</td>
                            <td>Exclusive precision-engineered aluminum connectors securely bind the tabletop and legs.</td>
                          </tr>
                          <tr>
                            <td>Secure Storage</td>
                            <td>Lockable drawer featuring a user-friendly password lock, sleek aluminum handle, and full-extension three-fold ball-bearing slides.</td>
                          </tr>
                          <tr>
                            <td>Reversible Layout</td>
                            <td>Side extension can be installed on the left or right side before assembly.</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* Additional Information */}
                <div className="pdp-acc-item">
                  <div
                    className={`pdp-acc-header ${activeAccordion === 'info' ? 'active' : ''}`}
                    onClick={() => toggleAccordion('info')}
                  >
                    <span className="pdp-acc-title">Additional Information</span>
                    <span className="pdp-acc-toggle">{activeAccordion === 'info' ? '×' : '+'}</span>
                  </div>
                  {activeAccordion === 'info' && (
                    <div className="pdp-acc-body">
                      <table className="pdp-specs-table pdp-info-table">
                        <tbody>
                          <tr>
                            <td className="info-th">Warranty</td>
                            <td>Limited Lifetime Warranty. 1-year warranty on hardware furniture.</td>
                          </tr>
                          <tr>
                            <td className="info-th">Delivery Time</td>
                            <td>7 - 8 Working Days from order confirmation.</td>
                          </tr>
                          <tr>
                            <td className="info-th">Country of Origin</td>
                            <td>Made in China</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
