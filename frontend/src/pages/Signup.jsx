import Footer from '../components/Footer';
import Header from '../components/Header';
import styles from './Signup.module.css';

import React, { useState } from 'react';
import axios from 'axios';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Input } from '../components/Input';

function Signup() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [affiliation, setAffiliation] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/admin/signup', { firstName, lastName, affiliation, email, password });
      setMessage('Signup successful! Await admin approval.');
    } catch (err) {
      setMessage(err.response?.data || 'Signup failed');
    }
  };

  return (
    <>
      <Header />
      <div className={styles.signupCard}>
        <h2 className={styles.title}>Sign Up</h2>
        <form onSubmit={handleSignup} className={styles.form}>
          <input className={styles.input} type="text" value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="First Name" required />
          <input className={styles.input} type="text" value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Last Name" required />
          <input className={styles.input} type="text" value={affiliation} onChange={e => setAffiliation(e.target.value)} placeholder="Affiliation" required />
          <input className={styles.input} type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required />
          <input className={styles.input} type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required />
          <button className={styles.signupBtn} type="submit">Sign Up</button>
        </form>
        <div style={{marginTop:12}}>
          <span>Already have an account? <a href="/login">Login</a></span>
        </div>
        {message && <div style={{color:'#d32f2f', marginTop:8}}>{message}</div>}
      </div>
      <Footer />
    </>
  );
}

export default Signup;
