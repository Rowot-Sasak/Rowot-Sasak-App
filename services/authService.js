import Cookies from 'js-cookie';

export const authService = {
  login: async (email, password) => {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Login failed');
    return data;
  },

  logout: () => {
    localStorage.removeItem('token');
    Cookies.remove('token');
    window.location.href = '/login';
  }
};