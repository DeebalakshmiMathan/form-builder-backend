import jwt from "jsonwebtoken";
import { z } from "zod";
import { env } from "../config/env.js";
import { User } from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1),
});

export const login = asyncHandler(async (req, res) => {
  
    const { email, password } = req.body;
  const user = await User.findOne({ email: email.toLowerCase() }).select(
    "+password",
  );

  
  

  if (!user || !(await user.comparePassword(password)))
    throw new ApiError(401, "Invalid email or password");
  const token = jwt.sign({ role: user.role }, env.JWT_SECRET, {
    subject: String(user._id),
    expiresIn: env.JWT_EXPIRES_IN,
  });
  res.json({
    success: true,
    data: {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    },
  });
});


export const me = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).lean();
  if (!user) throw new ApiError(404, 'User not found');
  res.json({ success: true, data: { id: user._id, name: user.name, email: user.email, role: user.role } });
});
