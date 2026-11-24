import rateLimit from 'express-rate-limit';

const make = (windowMs, limit, message) =>
  rateLimit({ windowMs, limit, standardHeaders: true, legacyHeaders: false, message: { success: false, message } });

export const apiLimiter = make(15 * 60 * 1000, 1000, 'Too many requests, please try again later');
export const authLimiter = make(15 * 60 * 1000, 20, 'Too many login attempts, please try again later');
export const submissionLimiter = make(60 * 1000, 30, 'Too many submissions, slow down');
