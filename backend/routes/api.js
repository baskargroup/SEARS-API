import express from 'express';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Middleware: API key validation
function apiKeyAuth(req, res, next) {
  const apiKey = req.headers['x-api-key'] || req.query.apiKey;
  if (!apiKey) return res.status(401).send('API key required');
  try {
    const decoded = jwt.verify(apiKey, process.env.ADMIN_PASSWORD);
    User.findById(decoded.id).then(user => {
      if (!user || user.status !== 'active' || new Date() > user.apiKeyExpiry) {
        return res.status(403).send('API key invalid or expired');
      }
      req.user = user;
      next();
    });
  } catch {
    return res.status(403).send('API key invalid');
  }
}

import mongoose from 'mongoose';
// GET: View Schema (sample document from productData)
router.get('/schema', apiKeyAuth, async (req, res) => {
  const ProductData = mongoose.connection.collection('productData');
  const doc = await ProductData.find({}).sort({ _id: -1 }).limit(1).toArray();
  if (!doc || doc.length === 0) return res.status(404).send('No documents found');
  res.json(doc[0]);
});

// GET: Search documents
router.get('/search', apiKeyAuth, async (req, res) => {
  const { criteria } = req.query;
  let query = {};
  if (criteria) {
    try {
      query = JSON.parse(criteria);
    } catch {
      return res.status(400).send('Invalid criteria');
    }
  }
  const ProductData = mongoose.connection.collection('productData');
  const docs = await ProductData.find(query).sort({ experiment_dt: -1 }).limit(50).toArray();
  // Save request history
  req.user.requestHistory.unshift({ endpoint: '/search', date: new Date(), criteria, response: docs });
  req.user.requestHistory = req.user.requestHistory.slice(0, 10);
  await req.user.save();
  res.json(docs);
});

// GET: User dashboard info
router.get('/dashboard', apiKeyAuth, async (req, res) => {
  res.json({
    apiKey: req.user.apiKey,
    apiKeyExpiry: req.user.apiKeyExpiry,
    requestHistory: req.user.requestHistory,
  });
});
  router.post('/dashboard', apiKeyAuth, async (req, res) => {
    try {
      if (req.body.requestHistory) {
        req.user.requestHistory = req.body.requestHistory;
        await req.user.save();
        return res.json({ success: true });
      }
      return res.status(400).json({ error: 'No requestHistory provided' });
    } catch (err) {
      return res.status(500).json({ error: 'Server error' });
    }
  });

export default router;
