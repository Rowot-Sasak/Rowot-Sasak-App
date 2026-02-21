import { useState } from 'react';
import { authService } from '../services/authService';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export const useAuth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault(); 
    setLoading(true);
    setError(null);
    try {
      const data = await authService.login(email, password);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      Cookies.set('token', data.token, { expires: 1 });
      
      router.push('/admin/budaya');
      return data;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      Cookies.remove('token');
      router.push('/login');
    } catch (err) {
      console.error("Gagal logout:", err);
    }
  };

  return { 
    email, 
    setEmail,
    password, 
    setPassword,
    login: handleLogin,
    logout: handleLogout,
    handleLogin, 
    loading, 
    error 
  };
};