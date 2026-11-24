import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { ApiError } from '../utils/ApiError.js';

const readToken = (req) => {
  const h = req.headers.authorization || '';
  return h.startsWith('Bearer ') ? h.slice(7) : null;
};

export const authenticate = (req, _res, next) => {
  const token = readToken(req);
  if (!token) return next(new ApiError(401, 'Authentication required'));
  try {
    const p = jwt.verify(token, env.JWT_SECRET);
    req.user = { id: p.sub, role: p.role };
    next();
  } catch {
    next(new ApiError(401, 'Invalid or expired token'));
  }
};

// Attaches req.user when a valid token exists, never blocks
export const optionalAuth = (req, _res, next) => {
  const token = readToken(req);
  if (token) {
    try {
      const p = jwt.verify(token, env.JWT_SECRET);
      req.user = { id: p.sub, role: p.role };
    } catch { /* treat as anonymous */ }
  }
  next();
};

export const authorize = (...roles) => (req, _res, next) =>
  roles.includes(req.user?.role) ? next() : next(new ApiError(403, 'Forbidden'));

export const adminOnly = [authenticate, authorize('admin')];
