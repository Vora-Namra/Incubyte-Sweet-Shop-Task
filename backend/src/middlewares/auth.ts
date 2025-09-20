import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const protect = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: 'Not authorized, no token' });
    }

    const token = authHeader.startsWith('Bearer ')
      ? authHeader.split(' ')[1]
      : authHeader;
    console.log('Token:', token);
    const secret = process.env.JWT_SECRET || '';
    const decoded: any = jwt.verify(token, secret);

    (req as any).user = { id: decoded.id, isAdmin: decoded.isAdmin };

    next();
  } catch (err) {
    console.error('JWT error:', err);
    return res.status(401).json({ message: 'Not authorized, invalid token' });
  }
};

export const adminOnly = (req: Request, res: Response, next: NextFunction) => {
  const user = (req as any).user;
  if (!user || !user.isAdmin) {
    return res.status(403).json({ message: 'Admin only' });
  }
  next();
};
