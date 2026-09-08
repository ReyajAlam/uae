// frontend/src/pages/CategoryPage.jsx
import React, { useEffect, useState, useMemo } from 'react';
import { fetchProducts } from '../services/api';
import localDesksData from '../data/all_desks.json';

const SIDEBAR_CATEGORIES = [
  {
    name: 'Chairs',
    slug: 'chairs',
    subcategories: [
      { name: 'All Chairs', sub: null },
      { name: 'Executive Chairs', sub: 'Executive Chairs' },
      { name: 'Workstation Chairs', sub: 'Workstation Chairs' },
      { name: 'Visitor Chairs', sub: 'Visitor Chairs' },
      { name: 'Office Chairs', sub: 'Office Chairs' },
      { name: 'Meeting Room Chairs', sub: 'Meeting Room Chairs' },
      { name: 'Reception Chairs', sub: 'Reception Chairs' },
      { name: 'Gaming Chairs', sub: 'Gaming Chairs' },
      { name: 'Break Out Room', sub: 'Break Out Room' },
      { name: 'Stackable Chairs', sub: 'Stackable Chairs' },
      { name: 'Dining Chairs', sub: 'Dining Chairs' },
      { name: 'Sofas', sub: 'Sofas' },
      { name: 'Bar Stools', sub: 'Bar Stools' },
      { name: 'Training Room Chairs', sub: 'Training Room Chairs' }
    ]
  },
  {
    name: 'Desks',
    slug: 'desks',
    isOpenDefault: true,
    subcategories: [
      { name: 'All Desks', sub: null },
      { name: 'CEO Desks', sub: 'CEO Desks' },
      { name: 'Executive Desks', sub: 'Executive Desks' },
      { name: 'Workstation Desks', sub: 'Workstation Desks' },
      { name: 'Height Adjustable Desks', sub: 'Height Adjustable Desks' },
      { name: 'Pedestals', sub: 'Pedestals' },
      { name: 'Metal Pedestal', sub: 'Metal Pedestal' },
      {
        name: 'Accessories',
        sub: 'Accessories',
        hasChildren: true,
        children: [
          { name: 'Table Top Dividers', sub: 'Table Top Dividers' },
          { name: 'Power and Data', sub: 'Power and Data' },
          { name: 'Computer Accessories', sub: 'Computer Accessories' }
        ]
      }
    ]
  },
  {
    name: 'Storage',
    slug: 'storage',
    subcategories: [
      { name: 'All Storage', sub: null },
      { name: 'Bookcase', sub: 'Bookcase' },
      { name: 'Cabinets', sub: 'Cabinets' },
      { name: 'Executive Wardrobe', sub: 'Executive Wardrobe' },
      { name: 'Pedestals', sub: 'Pedestals' },
      { name: 'Metal Pedestals', sub: 'Metal Pedestals' },
      { name: 'Hanging Drawers', sub: 'Hanging Drawers' },
      { name: 'Filing Cabinets', sub: 'Filing Cabinets' },
      { name: 'Lockers', sub: 'Lockers' },
      { name: 'Mail Boxes', sub: 'Mail Boxes' }
    ]
  },
  {
    name: 'Meeting and Shared Spaces',
    slug: 'meeting-and-shared-spaces',
    subcategories: [
      { name: 'All Meeting and Shared Spaces', sub: null },
      { name: 'Height Adjustable Meeting Tables', sub: 'Height Adjustable Meeting Tables' },
      { name: 'Meeting Tables', sub: 'Meeting Tables' },
      { name: 'Multi-Purpose Tables', sub: 'Multi-Purpose Tables' },
      { name: 'E Meeting', sub: 'E Meeting' },
      { name: 'TV Units', sub: 'TV Units' },
      { name: 'Podium', sub: 'Podium' }
    ]
  },
  {
    name: 'Lounge and Reception Areas',
    slug: 'lounge-and-reception-areas',
    subcategories: [
      { name: 'All Lounge and Reception Areas', sub: null },
      { name: 'Designer Reception Desks', sub: 'Designer Reception Desks' },
      { name: 'Reception Desks', sub: 'Reception Desks' },
      { name: 'Sofas', sub: 'Sofas' },
      { name: 'Coffee Tables', sub: 'Coffee Tables' },
      { name: 'Art & Wall Decor', sub: 'Art & Wall Decor' }
    ]
  },
  {
    name: 'Pantries',
    slug: 'pantries',
    subcategories: [
      { name: 'All Pantries', sub: null },
      { name: 'Dining Tables', sub: 'Dining Tables' },
      { name: 'High Tables', sub: 'High Tables' }
    ]
  },
  {
    name: 'Office Accessories',
    slug: 'office-accessories',
    subcategories: [
      { name: 'All Office Accessories', sub: null },
      { name: "Power Distribution Units (PDU's)", sub: "Power Distribution Units (PDU's)" },
      { name: 'Cable Management', sub: 'Cable Management' },
      { name: 'Writing Boards', sub: 'Writing Boards' },
      { name: 'Safes', sub: 'Safes' },
      { name: 'Computer Accessories', sub: 'Computer Accessories' }
    ]
  },
  {
    name: 'Acoustic Solutions',
    slug: 'acoustic-solutions',
    subcategories: [
      { name: 'All Acoustic Solutions', sub: null },
      { name: 'London Phone Booth', sub: 'London Phone Booth' },
      { name: 'THE POD', sub: 'THE POD' }
    ]
  },
  {
    name: 'Decor',
    slug: 'decor',
    subcategories: [
      { name: 'All Decor', sub: null },
      { name: 'Art & Wall Decor', sub: 'Art & Wall Decor' }
    ]
  }
];

export const CategoryPage = ({ category = 'desks', subcategory: initialSubcat = null, onNavigate }) => {
  const [allProducts, setAllProducts] = useState(localDesksData || []);
  const [loading, setLoading] = useState(false);
  const [activeSubcat, setActiveSubcat] = useState(initialSubcat || null);
  const [sortOption, setSortOption] = useState('default');
  const [currentPage, setCurrentPage] = useState(1);
  
  // Track open accordion sections in sidebar
  const [openSections, setOpenSections] = useState({
    desks: true,
    chairs: false,
    storage: false,
    'meeting-and-shared-spaces': false,
    'lounge-and-reception-areas': false,
    pantries: false,
    'office-accessories': false,
    'acoustic-solutions': false,
    decor: false
  });

  const [openSubsections, setOpenSubsections] = useState({
    accessories: false
  });

  const toggleSection = (slug) => {
    setOpenSections(prev => ({
      ...prev,
      [slug]: !prev[slug]
    }));
  };

  const toggleSubsection = (key) => {
    setOpenSubsections(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  useEffect(() => {
    setActiveSubcat(initialSubcat || null);
    setCurrentPage(1);
    if (category) {
      setOpenSections(prev => ({
        ...prev,
        [category]: true
      }));
    }
  }, [category, initialSubcat]);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchProducts({ category });
        if (data && data.length > 0) {
          // Merge API data with local full collection, preserving valid CDN image URLs
          const map = new Map();
          localDesksData.forEach(p => map.set(p.name, p));
          data.forEach(p => {
            const existing = map.get(p.name);
            if (existing) {
              map.set(p.name, {
                ...existing,
                ...p,
                image_url: (p.image_url && p.image_url.startsWith('http')) ? p.image_url : (existing.image_url || p.image_url)
              });
            } else {
              map.set(p.name, p);
            }
          });
          setAllProducts(Array.from(map.values()));
        }
      } catch (err) {
        console.log('Using local desks data:', err);
      }
    }
    loadData();
  }, [category]);

  // Filter products by subcategory
  const filteredProducts = useMemo(() => {
    let list = [...allProducts];
    if (activeSubcat) {
      const target = activeSubcat.toLowerCase().trim();
      const matched = list.filter(p => {
        const sub = (p.subcategory || '').toLowerCase();
        const name = (p.name || '').toLowerCase();
        if (target.includes('ceo')) {
          return sub.includes('executive') || sub.includes('ceo') || name.includes('ceo') || name.includes('executive');
        }
        return sub === target || sub.includes(target) || name.includes(target);
      });
      if (matched.length > 0) {
        list = matched;
      }
    }

    // Sort
    if (sortOption === 'pricelh') {
      list.sort((a, b) => (parseFloat(a.price) || 0) - (parseFloat(b.price) || 0));
    } else if (sortOption === 'pricehl') {
      list.sort((a, b) => (parseFloat(b.price) || 0) - (parseFloat(a.price) || 0));
    } else if (sortOption === 'prod_az') {
      list.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOption === 'prod_za') {
      list.sort((a, b) => b.name.localeCompare(a.name));
    }

    return list;
  }, [allProducts, activeSubcat, sortOption]);

  // Pagination (21 items per page - 7 rows of 3 columns)
  const itemsPerPage = 21;
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const displayedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage]);

  const handleSubcatClick = (sub) => {
    setActiveSubcat(sub);
    setCurrentPage(1);
  };

  return (
    <div className="ob-category-page">
      {/* 1. Category Top Banner matching Image 2 */}
      <div className="inner-page-banner">
        <img
          className="desk-innerban"
          src="https://officebaseuae.b-cdn.net/assets/images/image-data/6970939319.jpg"
          alt="Office Desks Dubai | Executive, Ergonomic & Standing Desks"
        />
        <img
          className="mob-innerban"
          src="https://officebaseuae.b-cdn.net/assets/images/image-data/5265343074.jpg"
          alt="Office Desks Dubai | Executive, Ergonomic & Standing Desks"
        />
      </div>

      {/* 2. Breadcrumbs matching Image 2 & 3 */}
      <div className="breadcrumbs">
        <div className="container">
          <a href="/" onClick={(e) => { e.preventDefault(); onNavigate('home'); }}>Home</a>
          <span className="crumb-sep">&raquo;</span>
          <a
            href="/desks/"
            onClick={(e) => {
              e.preventDefault();
              setActiveSubcat(null);
              setCurrentPage(1);
            }}
          >
            Desks
          </a>
          {activeSubcat && (
            <>
              <span className="crumb-sep">&raquo;</span>
              <span className="active-crumb">{activeSubcat}</span>
            </>
          )}
        </div>
      </div>

      {/* 3. Main Content Container (2-column layout) */}
      <div className="container main-inner-container">
        <div className="ob-category-layout">
          {/* Left Column: Categories Tree Accordion matching Image 3 */}
          <aside className="menu-category">
            <h2>CATEGORIES</h2>
            <ul className="category-tree">
              {SIDEBAR_CATEGORIES.map((cat) => {
                const isOpen = openSections[cat.slug];
                const isCurrentCategory = cat.slug === category;

                return (
                  <li key={cat.slug} className={`tree-item ${isCurrentCategory ? 'current-cat-item' : ''}`}>
                    <div className="tree-header">
                      {cat.subcategories && cat.subcategories.length > 0 ? (
                        <button
                          type="button"
                          className="tree-symbol-btn"
                          onClick={() => toggleSection(cat.slug)}
                          aria-label={`Toggle ${cat.name}`}
                        >
                          <span className="tree-symbol-box">{isOpen ? '−' : '+'}</span>
                        </button>
                      ) : (
                        <span className="tree-symbol-placeholder" />
                      )}

                      <span
                        className={`tree-cat-name ${isCurrentCategory ? 'active-cat-name' : ''}`}
                        onClick={() => {
                          if (cat.slug === 'desks') {
                            setActiveSubcat(null);
                            setCurrentPage(1);
                          } else {
                            onNavigate('category', { category: cat.slug });
                          }
                        }}
                      >
                        {cat.name}
                      </span>
                    </div>

                    {/* Subcategories */}
                    {isOpen && cat.subcategories && (
                      <ul className="tree-sub-list">
                        {cat.subcategories.map((subItem, sIdx) => {
                          if (subItem.hasChildren) {
                            const isSubOpen = openSubsections[subItem.sub.toLowerCase()];
                            return (
                              <li key={sIdx} className="tree-sub-parent">
                                <div className="tree-sub-header">
                                  <button
                                    type="button"
                                    className="tree-symbol-btn"
                                    onClick={() => toggleSubsection(subItem.sub.toLowerCase())}
                                  >
                                    <span className="tree-symbol-box">{isSubOpen ? '−' : '+'}</span>
                                  </button>
                                  <span
                                    className={`tree-sub-link ${activeSubcat === subItem.sub ? 'active-sub' : ''}`}
                                    onClick={() => handleSubcatClick(subItem.sub)}
                                  >
                                    {subItem.name}
                                  </span>
                                </div>
                                {isSubOpen && (
                                  <ul className="tree-sub-sub-list">
                                    {subItem.children.map((child, cIdx) => (
                                      <li key={cIdx}>
                                        <span
                                          className={`tree-sub-link ${activeSubcat === child.sub ? 'active-sub' : ''}`}
                                          onClick={() => handleSubcatClick(child.sub)}
                                        >
                                          {child.name}
                                        </span>
                                      </li>
                                    ))}
                                  </ul>
                                )}
                              </li>
                            );
                          }

                          const isSubActive = subItem.sub
                            ? activeSubcat === subItem.sub
                            : (!activeSubcat && isCurrentCategory);

                          return (
                            <li key={sIdx}>
                              <span
                                className={`tree-sub-link ${isSubActive ? 'active-sub' : ''}`}
                                onClick={() => handleSubcatClick(subItem.sub)}
                              >
                                {subItem.name}
                              </span>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>
          </aside>

          {/* Right Column: Products Section matching Image 3 & 4 */}
          <main className="product-list-area">
            {/* Header Bar (pcat-title) */}
            <div className="pcat-title">
              <div className="ptitle">
                <h1>{activeSubcat ? activeSubcat.toUpperCase() : 'DESKS'}</h1>
              </div>
              <div className="presults">
                {filteredProducts.length} Products Found
              </div>
              <div className="sorting">
                <select
                  className="general_filter"
                  value={sortOption}
                  onChange={(e) => {
                    setSortOption(e.target.value);
                    setCurrentPage(1);
                  }}
                >
                  <option value="default">New Arrivals</option>
                  <option value="bestseller">Best Sellers</option>
                  <option value="pricehl">Price High to Low</option>
                  <option value="pricelh">Price Low to High</option>
                  <option value="prod_az">Sort Product A to Z</option>
                  <option value="prod_za">Sort Product Z to A</option>
                </select>
              </div>
            </div>

            {/* Products Grid: 3 Columns on Desktop, 2 on Mobile */}
            {loading ? (
              <div className="products-loading">
                Loading products...
              </div>
            ) : (
              <>
                <div className="ob-category-grid">
                  {displayedProducts.map((p) => (
                    <article key={p.id} className="ob-desk-card">
                      <div
                        className="ob-desk-card-image"
                        onClick={() => onNavigate('product', { id: p.id, slug: p.slug })}
                      >
                        <img loading="lazy" src={p.image_url} alt={p.name} />
                      </div>
                      <div className="ob-desk-card-body">
                        <h3 className="ob-desk-card-title">
                          <a
                            href={`/product/${p.slug}/${p.id}/`}
                            onClick={(e) => {
                              e.preventDefault();
                              onNavigate('product', { id: p.id, slug: p.slug });
                            }}
                          >
                            {p.name}
                          </a>
                        </h3>
                        <div className="ob-desk-card-price">
                          <span className="uae-symbol">AED</span> {parseFloat(p.price).toFixed(2)}
                        </div>
                      </div>
                    </article>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="ob-pagination">
                    <button
                      className="page-nav-btn"
                      disabled={currentPage === 1}
                      onClick={() => {
                        setCurrentPage(prev => Math.max(1, prev - 1));
                        window.scrollTo({ top: 350, behavior: 'smooth' });
                      }}
                    >
                      &laquo; Prev
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
                      <button
                        key={pageNum}
                        className={`page-num-btn ${currentPage === pageNum ? 'active' : ''}`}
                        onClick={() => {
                          setCurrentPage(pageNum);
                          window.scrollTo({ top: 350, behavior: 'smooth' });
                        }}
                      >
                        {pageNum}
                      </button>
                    ))}

                    <button
                      className="page-nav-btn"
                      disabled={currentPage === totalPages}
                      onClick={() => {
                        setCurrentPage(prev => Math.min(totalPages, prev + 1));
                        window.scrollTo({ top: 350, behavior: 'smooth' });
                      }}
                    >
                      Next &raquo;
                    </button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};
