import jwt from 'jsonwebtoken';

export function generateToken(payload: object) {
  const secret = process.env.JWT_SECRET || 'Sweet_Shop_Secret@12679';
  return jwt.sign(payload, secret, { expiresIn: '7d' });
}
