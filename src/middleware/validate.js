import mongoose from 'mongoose';
import { ApiError } from '../utils/ApiError.js';

export const validateBody = (schema) => (req, _res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) return next(result.error);
  req.body = result.data;
  next();
};

export const validateObjectId = (...params) => (req, _res, next) => {
  for (const p of params) {
    if (!mongoose.isValidObjectId(req.params[p])) return next(new ApiError(400, `Invalid ${p}`));
  }
  next();
};
