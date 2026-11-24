import mongoose from 'mongoose';
import { FIELD_TYPES, FORM_STATUS } from '../constants/fieldTypes.js';

const fieldSchema = new mongoose.Schema(
  {
    key: { type: String, required: true },
    label: { type: String, required: true },
    type: { type: String, enum: FIELD_TYPES, required: true },
    placeholder: { type: String, default: '' },
    defaultValue: mongoose.Schema.Types.Mixed,
    required: { type: Boolean, default: false },
    options: { type: [String], default: [] },
    validation: {
      minLength: Number,
      maxLength: Number,
      min: Number,
      max: Number,
    },
  },
  { _id: false }
);

const formSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    status: { type: String, enum: FORM_STATUS, default: 'draft' },
    // Array order == render order
    fields: { type: [fieldSchema], default: [] },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

formSchema.index({ status: 1, updatedAt: -1 });
formSchema.index({ updatedAt: -1 });
formSchema.index({ name: 1 });

export const Form = mongoose.model('Form', formSchema);
