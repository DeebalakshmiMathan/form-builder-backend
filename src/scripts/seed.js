import 'dotenv/config';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import { User } from '../models/User.js';
import { Form } from '../models/Form.js';

await connectDB();

const email = process.env.ADMIN_EMAIL;
const password = process.env.ADMIN_PASSWORD;
if (!email || !password) throw new Error('Set ADMIN_EMAIL and ADMIN_PASSWORD in .env');

let admin = await User.findOne({ email });
if (!admin) admin = await User.create({ name: 'Admin', email, password, role: 'admin' });

const exists = await Form.findOne({ name: 'Employee Registration' });
if (!exists) {
  await Form.create({
    name: 'Employee Registration',
    description: 'Starter form with the required default fields',
    status: 'published',
    createdBy: admin._id,
    fields: [
      { key: 'name', label: 'Name', type: 'text', required: true, placeholder: 'Full name', validation: { minLength: 2, maxLength: 100 } },
      { key: 'email', label: 'Email', type: 'email', required: true, placeholder: 'you@company.com' },
      { key: 'gender', label: 'Gender', type: 'radio', required: true, options: ['Male', 'Female', 'Other'] },
      { key: 'mobile', label: 'Mobile', type: 'phone', required: true, placeholder: '+91 98765 43210' },
      { key: 'description', label: 'Description', type: 'textarea', placeholder: 'Tell us about yourself', validation: { maxLength: 500 } },
      { key: 'department', label: 'Department', type: 'select', required: true, options: ['Engineering', 'HR', 'Finance', 'Sales'] },
      { key: 'designation', label: 'Designation', type: 'select', required: true, options: ['Intern', 'Developer', 'Team Lead', 'Manager'] },
      { key: 'role', label: 'Role', type: 'select', required: true, options: ['Admin', 'Manager', 'Employee'] },
    ],
  });
}
console.log(`Seed complete. Admin: ${email}`);
await mongoose.disconnect();
