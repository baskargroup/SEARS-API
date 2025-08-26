import Header from '../components/Header';

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import styles from './Login.module.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      let user = null;
      if (email === import.meta.env.VITE_REACT_APP_ADMIN_EMAIL) {
        user = { email, role: 'admin', status: 'active', apiKey: 'admin-key' };
      } else {
        const res = await axios.get('/admin/users');
        user = res.data.find(u => u.email === email);
      }
      if (!user) throw new Error('User not found');
      if (user.status !== 'active') throw new Error('User not active');
      localStorage.setItem('apiKey', user.apiKey);
      setMessage('Login successful');
      setTimeout(() => {
        navigate(user.role === 'admin' ? '/admin' : '/user');
      }, 500);
    } catch (err) {
      setMessage(err.message || 'Error');
    }
  };

  return (
    <>
      <Header />
      <div className={styles.loginContainer}>
      <h2 className={styles.loginTitle}>Login</h2>
      <form onSubmit={handleLogin} className={styles.loginForm}>
        <input className={styles.input} type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required />
        <input className={styles.input} type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required />
        <button className={styles.loginBtn} type="submit">Login</button>
      </form>
      <p className={styles.message}>{message}</p>
      <div className={styles.signupLink}>
        <Link to="/signup">Don't have an account? Sign Up</Link>
      </div>
      </div>
    </>
  );
}

export default Login;
