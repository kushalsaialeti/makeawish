import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { supabase } from '../config/supabase';

const JWT_SECRET = process.env.JWT_SECRET || 'makeawish_jwt_secret_key_72hrs_timeout_2026_super_secure';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email?: string;
    name?: string;
    avatar?: string;
    user_metadata?: any;
    [key: string]: any;
  };
}

export const authMiddleware = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Authentication required. Please sign in to continue.' });
      return;
    }

    const token = authHeader.split(' ')[1];
    if (!token || token === 'undefined' || token === 'null') {
      res.status(401).json({ error: 'Authentication token missing. Please sign in.' });
      return;
    }

    // 1. Try verifying with Backend JWT (72-hour token)
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      if (decoded && decoded.id) {
        req.user = {
          id: decoded.id,
          email: decoded.email,
          name: decoded.name,
          avatar: decoded.avatar,
          role: decoded.role || 'user',
        };
        return next();
      }
    } catch (jwtErr) {
      // Not a backend custom JWT or expired, try Supabase fallback
    }

    // 2. Fallback: Verify with Supabase Auth
    try {
      const { data: { user }, error } = await supabase.auth.getUser(token);
      if (!error && user) {
        req.user = {
          id: user.id,
          email: user.email,
          name: user.user_metadata?.full_name || user.user_metadata?.name || 'Dreamer',
          avatar: user.user_metadata?.avatar_url || '',
          user_metadata: user.user_metadata,
        };
        return next();
      }
    } catch (sbErr) {
      // Ignore
    }

    res.status(401).json({ error: 'Session expired or invalid token. Please sign in again.' });
  } catch (err: any) {
    console.error('[Auth Middleware Error]:', err);
    res.status(401).json({ error: 'Authentication failed.' });
  }
};
