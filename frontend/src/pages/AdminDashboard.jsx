import Header from '../components/Header';
import Footer from '../components/Footer';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './AdminDashboard.module.css';

function AdminDashboard() {
  const handleExtendApiKey = async (id) => {
    await axios.post(`/admin/extend-apikey/${id}`);
    fetchUsers();
  };
  const handleDeleteUser = async (id) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      await axios.delete(`/admin/user/${id}`);
      fetchUsers();
    }
  };
  const [users, setUsers] = useState([]);
  const [signupDisabled, setSignupDisabled] = useState(false);
  const [showSignupWarning, setShowSignupWarning] = useState(false);
  const navigate = useNavigate();

  const fetchUsers = async () => {
    const res = await axios.get('/admin/users');
    setUsers(res.data);
    setSignupDisabled(res.data.signupDisabled || false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleApprove = async (id) => {
    await axios.post(`/admin/approve/${id}`);
    fetchUsers();
  };
  const handleDeactivate = async (id) => {
    await axios.post(`/admin/deactivate/${id}`);
    fetchUsers();
  };
  const handleReactivate = async (id) => {
    await axios.post(`/admin/reactivate/${id}`);
    fetchUsers();
  };
  const handleToggleSignups = async () => {
    await axios.post('/admin/toggle-signups');
    setSignupDisabled(!signupDisabled);
    if (!signupDisabled) {
      setShowSignupWarning(true);
    } else {
      setShowSignupWarning(false);
    }
  };
  const handleSignOut = () => {
    localStorage.removeItem('apiKey');
    navigate('/login');
  };

  return (
    <>
      <Header onSignOut={handleSignOut} />
      <div className={styles.dashboard}>
        <div className={styles.header}>
          <h2 className={styles.title} style={{display:'inline-block', marginRight:16}}>Admin Dashboard</h2>
          <button className={`${styles.toggleBtn} ${signupDisabled ? styles.enabled : ''}`} onClick={handleToggleSignups} style={{verticalAlign:'middle'}}>
            {signupDisabled ? 'Enable Signups' : 'Disable Signups'}
          </button>
        </div>
        {showSignupWarning && (
          <div style={{background:'#fff3cd', color:'#856404', border:'1px solid #ffeeba', borderRadius:6, padding:'10px 16px', margin:'16px 0', fontWeight:500}}>
            <span>Warning: New user signups are now disabled. Users will not be able to register until you enable signups again.</span>
          </div>
        )}
        <h3 style={{ color: '#333', marginBottom: 16 }}>API Users</h3>
        <div className={styles.userGrid}>
          {users.map(user => (
            <div key={user._id} className={styles.userCard}>
              <div className={styles.userEmail}><b>Email:</b> {user.email}</div>
              <div><b>First Name:</b> {user.firstName}</div>
              <div><b>Last Name:</b> {user.lastName}</div>
              <div><b>Affiliation:</b> {user.affiliation}</div>
              <div className={styles.userStatus}>Status: <b>{user.status}</b></div>
              <div><b>API Key Expires:</b> {user.apiKeyExpiry ? new Date(user.apiKeyExpiry).toLocaleString() : 'N/A'}</div>
              <div className={styles.actionBtns}>
                {user.status === 'pending' && <button className={`${styles.btn} ${styles.approveBtn}`} onClick={() => handleApprove(user._id)}>Approve</button>}
                {user.status === 'active' && <button className={`${styles.btn} ${styles.deactivateBtn}`} onClick={() => handleDeactivate(user._id)}>Deactivate</button>}
                {user.status === 'deactivated' && <button className={`${styles.btn} ${styles.reactivateBtn}`} onClick={() => handleReactivate(user._id)}>Reactivate</button>}
                <button className={`${styles.btn} ${styles.deleteBtn}`} style={{background:'#d32f2f', marginLeft:8}} onClick={() => handleDeleteUser(user._id)}>Delete</button>
                <button className={`${styles.btn} ${styles.extendBtn}`} style={{background:'#388e3c', marginLeft:8}} onClick={() => handleExtendApiKey(user._id)}>Extend API Key</button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default AdminDashboard;
