
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import styles from './UserDashboard.module.css';

function UserDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [schema, setSchema] = useState(null);
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);
  const [searchError, setSearchError] = useState('');
  const [apiKey, setApiKey] = useState('');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const handleSignOut = () => {
    localStorage.removeItem('apiKey');
    navigate('/login');
  };

  useEffect(() => {
    const key = localStorage.getItem('apiKey');
    setApiKey(key || '');
    if (key) {
      fetchDashboard(key);
    }
  }, []);

  const fetchDashboard = async (key) => {
    try {
      const dashRes = await axios.get('/api/dashboard', { headers: { 'x-api-key': key } });
      setDashboard(dashRes.data);
      const schemaRes = await axios.get('/api/schema', { headers: { 'x-api-key': key } });
      setSchema(schemaRes.data);
    } catch (err) {
      // handle error if needed
    }
  };

  const handleSearch = async () => {
    setSearchError('');
    setLoading(true);
    if (!apiKey) return;
    let criteria = search;
    try {
      criteria = JSON.stringify(JSON.parse(search));
    } catch (err) {
      setSearchError('Invalid JSON');
      setLoading(false);
      return;
    }
    try {
      const res = await axios.get('/api/search', {
        headers: { 'x-api-key': apiKey },
        params: { criteria }
      });
      setResults(res.data);
      await fetchDashboard(apiKey); // auto-refresh dashboard
    } catch (err) {
      setSearchError('Search failed');
    }
    setLoading(false);
  };

  const handleDeleteRequest = async (idx) => {
    if (!dashboard || !dashboard.requestHistory) return;
    const newHistory = dashboard.requestHistory.filter((_, i) => i !== idx);
    try {
      await axios.post('/api/dashboard', { requestHistory: newHistory }, { headers: { 'x-api-key': apiKey } });
      await fetchDashboard(apiKey);
    } catch (err) {
      // handle error if needed
    }
  };

  return (
    <>
      <Header onSignOut={handleSignOut} />
      <div className={styles.dashboard}>
        <div style={{display:'flex', flexDirection:'column', alignItems:'center', marginBottom:16}}>
          <h2 className={styles.title} style={{textAlign:'center'}}>API Dashboard</h2>
        </div>
        {dashboard && (
          <div className={styles.keyDetailsCard}>
            <h3 className={styles.keyDetailsTitle}>Key Details</h3>
            <div className={styles.keyDetailsContent}>
              <div style={{display:'flex', alignItems:'center', gap:8, marginBottom:8}}>
                <b>API Key:</b>
                <span className={styles.apiKey}>{dashboard.apiKey}</span>
                <button
                  style={{padding:'4px 10px', background:'#1976d2', color:'#fff', border:'none', borderRadius:4, fontWeight:500, cursor:'pointer', fontSize:'0.95rem'}}
                  onClick={() => {
                    navigator.clipboard.writeText(dashboard.apiKey);
                  }}
                  title="Copy API Key to clipboard"
                >Copy</button>
              </div>
              <div><b>Expires:</b> {new Date(dashboard.apiKeyExpiry).toLocaleString()}</div>
            </div>
          </div>
        )}
        <div className={styles.schemaCard}>
          <h3 style={{fontWeight:600, marginBottom:8}}>Schema Example</h3>
          <pre className={styles.results}>{JSON.stringify(schema, null, 2)}</pre>
        </div>
        <div className={styles.searchCard}>
          <div style={{display:'flex', alignItems:'center', marginBottom:8}}>
            <h3 style={{fontWeight:600, margin:0}}>Specify Query Filter</h3>
            <a href="https://www.mongodb.com/docs/compass/query/filter/" target="_blank" rel="noopener noreferrer" style={{marginLeft:8, textDecoration:'none'}} title="Learn how to write a query filter">
              <span style={{display:'inline-block', width:22, height:22, borderRadius:'50%', background:'#1976d2', color:'#fff', textAlign:'center', fontWeight:700, fontSize:'1.1rem', lineHeight:'22px', cursor:'pointer'}}>i</span>
            </a>
          </div>
          <div className={styles.searchRow}>
            <input className={styles.searchInput} value={search} onChange={e => setSearch(e.target.value)} placeholder='JSON search criteria' />
            <button className={styles.searchBtn} onClick={handleSearch} disabled={loading}>Search</button>
          </div>
          {loading && <div style={{textAlign:'center', margin:'12px 0'}}><span className="spinner" style={{display:'inline-block', width:24, height:24, border:'3px solid #1976d2', borderTop:'3px solid #fff', borderRadius:'50%', animation:'spin 1s linear infinite'}}></span></div>}
          <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
          {searchError && <div style={{color:'#d32f2f', marginBottom:8}}>{searchError}</div>}
          <h4 style={{fontWeight:500, marginBottom:4}}>Results</h4>
          <pre className={styles.results}>{JSON.stringify(results, null, 2)}</pre>
        </div>
        <h3 style={{fontWeight:600, marginBottom:8}}>Last 10 Requests</h3>
        <div className={styles.requestsGrid}>
          {dashboard && dashboard.requestHistory && dashboard.requestHistory.map((req, idx) => (
            <div key={idx} className={styles.requestCard}>
              <div><b>Endpoint:</b> {req.endpoint}</div>
              <div><b>Date:</b> {new Date(req.date).toLocaleString()}</div>
              <div><b>Criteria:</b> <span style={{fontFamily:'monospace', fontSize:'0.95rem'}}>{JSON.stringify(req.criteria)}</span></div>
              <button style={{marginTop:8, padding:'6px 12px', background:'#d32f2f', color:'#fff', border:'none', borderRadius:6, fontWeight:500, cursor:'pointer'}} onClick={() => handleDeleteRequest(idx)}>Delete</button>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default UserDashboard;
