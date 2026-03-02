const API_URL = 'http://77.222.35.84/api';


export const api = {
  // Товары
  getProducts: async () => {
    const res = await fetch(`${API_URL}/products`);
    return res.json();
  },

  getProduct: async (id) => {
    const res = await fetch(`${API_URL}/products/${id}`);
    return res.json();
  },

  // Авторизация
  register: async (userData) => {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    return res.json();
  },

  login: async (credentials) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    return res.json();
  },

  // Пользователь
  getUser: async (email) => {
    const res = await fetch(`${API_URL}/users/${email}`);
    return res.json();
  },

  addBalance: async (email, amount) => {
    const res = await fetch(`${API_URL}/users/${email}/balance`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount })
    });
    return res.json();
  },

  // Заказы
  createOrder: async (orderData) => {
    const res = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });
    return res.json();
  },

  getUserOrders: async (email) => {
    const res = await fetch(`${API_URL}/orders/${email}`);
    return res.json();
  }
};