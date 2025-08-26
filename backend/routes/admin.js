
import express from 'express';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
const router = express.Router();


// Admin: Extend API key validity by 90 days
router.post('/extend-apikey/:id', async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).send('User not found');
  user.apiKeyExpiry = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);
  await user.save();
  res.send('API key validity extended by 90 days');
});
// Admin: Delete user
router.delete('/user/:id', async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).send('User not found');
  await user.deleteOne();
  res.send('User deleted');
});



// Helper: Send email
async function sendEmail(to, subject, text) {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  await transporter.sendMail({ from: process.env.EMAIL_USER, to, subject, text });
}

// Admin: Create default admin if not exists
router.post('/init-admin', async (req, res) => {
  const admin = await User.findOne({ role: 'admin' });
  if (admin) return res.status(200).send('Admin exists');
  const hashed = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
  await User.create({
    email: process.env.ADMIN_EMAIL,
    password: hashed,
    role: 'admin',
    status: 'active',
  });
  res.status(201).send('Admin created');
});

// User signup
router.post('/signup', async (req, res) => {
  const { email, password, firstName, lastName, affiliation } = req.body;
  const admin = await User.findOne({ role: 'admin' });
  if (admin.signupDisabled) return res.status(403).send('Signups disabled');
  if (!firstName || !lastName || !affiliation) {
    return res.status(400).send('All fields are required');
  }
  const exists = await User.findOne({ email });
  if (exists) return res.status(409).send('User exists');
  const hashed = await bcrypt.hash(password, 10);
  await User.create({ firstName, lastName, affiliation, email, password: hashed });
  res.status(201).send('Signup request submitted');
});

// Admin: Approve user
router.post('/approve/:id', async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).send('User not found');
  user.status = 'active';
  user.apiKey = jwt.sign({ id: user._id, email: user.email }, process.env.ADMIN_PASSWORD, { expiresIn: '90d' });
  user.apiKeyExpiry = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);
  await user.save();
  await sendEmail(user.email, 'API Key Approved', `Your API key: ${user.apiKey}`);
  res.send('User approved and API key sent');
});

// Admin: Deactivate/reactivate user
router.post('/deactivate/:id', async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).send('User not found');
  user.status = 'deactivated';
  await user.save();
  res.send('User deactivated');
});

router.post('/reactivate/:id', async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).send('User not found');
  user.status = 'active';
  user.apiKeyExpiry = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);
  await user.save();
  res.send('User reactivated');
});

// Admin: Disable/enable signups
router.post('/toggle-signups', async (req, res) => {
  const admin = await User.findOne({ role: 'admin' });
  admin.signupDisabled = !admin.signupDisabled;
  await admin.save();
  res.send(`Signups ${admin.signupDisabled ? 'disabled' : 'enabled'}`);
});

// Admin: List all users
router.get('/users', async (req, res) => {
  const users = await User.find({ role: 'user' });
  res.json(users);
});

export default router;
