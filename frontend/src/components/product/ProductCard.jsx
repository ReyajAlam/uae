// frontend/src/components/product/ProductCard.jsx
import React from 'react';

export const ProductCard = ({ product, onNavigate }) => {
  const formattedPrice = parseFloat(product.price).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <div className="product__item-3 product-box mb-40">
      <div
        className="product__thumb-3 product-image fix p-relative w-img"
        onClick={() => onNavigate('product', { id: product.id, slug: product.slug })}
        style={{ cursor: 'pointer' }}
      >
        <img
          loading="lazy"
          src={product.image_url || product.image}
          alt={product.name}
        />
      </div>

      <div className="product__content-3">
        <h3 className="product__title-3 product-title">
          <a
            href={`/product/${product.slug}/${product.id}/`}
            onClick={(e) => {
              e.preventDefault();
              onNavigate('product', { id: product.id, slug: product.slug });
            }}
          >
            {product.name}
          </a>
        </h3>

        <div className="product__price-3 fix" style={{ height: '24px' }}>
          <strong className="prd-price">
            <span className="uae-symbol">&#x00EA;</span>
            {formattedPrice}
          </strong>
        </div>
      </div>
    </div>
  );
};
