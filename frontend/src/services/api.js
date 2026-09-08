// frontend/src/services/api.js

const API_BASE = import.meta.env.VITE_API_BASE_URL 
  || (typeof window !== 'undefined' && window.location.hostname !== 'localhost' 
      ? '/backend/api' 
      : 'http://localhost/uae/backend/api');

export async function fetchCategories() {
  try {
    const res = await fetch(`${API_BASE}/categories`);
    const data = await res.json();
    return data.data || [];
  } catch (err) {
    console.error('Error fetching categories:', err);
    return [];
  }
}

export async function fetchProducts(params = {}) {
  try {
    const query = new URLSearchParams();
    if (params.category) query.append('category', params.category);
    if (params.subcategory) query.append('subcategory', params.subcategory);
    if (params.search) query.append('search', params.search);
    if (params.sort) query.append('sort', params.sort);

    const queryString = query.toString();
    const url = `${API_BASE}/products${queryString ? '?' + queryString : ''}`;
    const res = await fetch(url);
    const data = await res.json();
    return data.data || [];
  } catch (err) {
    console.error('Error fetching products:', err);
    return [];
  }
}

export async function fetchProduct(idOrSlug) {
  try {
    const res = await fetch(`${API_BASE}/products/${idOrSlug}`);
    const data = await res.json();
    if (!data.success) throw new Error(data.message || 'Product not found');
    return {
      product: data.data,
      related: data.related || []
    };
  } catch (err) {
    console.error('Error fetching product:', err);
    return null;
  }
}

export async function createOrder(orderPayload) {
  try {
    const res = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderPayload),
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.error('Error creating order:', err);
    return { success: false, message: err.message };
  }
}

export async function fetchOrder(orderNumber) {
  try {
    const res = await fetch(`${API_BASE}/orders/${orderNumber}`);
    const data = await res.json();
    return data.order || null;
  } catch (err) {
    console.error('Error fetching order:', err);
    return null;
  }
}
