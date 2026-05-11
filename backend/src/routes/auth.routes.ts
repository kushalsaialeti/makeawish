import { Router } from 'express';
import jwt from 'jsonwebtoken';

const router = Router();

// Replace this with a proper secret in production
const JWT_SECRET = process.env.JWT_SECRET || 'makeawish-super-secret-key-2026';
const CORRECT_PIN = '12162005';

router.post('/verify-pin', (req, res) => {
  const { pin } = req.body;
  
  if (pin === CORRECT_PIN) {
    const token = jwt.sign({ authenticated: true }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ success: true, token });
  } else {
    res.status(401).json({ success: false, message: 'Invalid PIN' });
  }
});

router.post('/validate-token', (req, res) => {
  const { token } = req.body;
  try {
    jwt.verify(token, JWT_SECRET);
    res.json({ valid: true });
  } catch (err) {
    res.json({ valid: false });
  }
});

export default router;
