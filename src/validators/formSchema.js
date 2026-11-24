import { z } from 'zod';
import { FIELD_TYPES, OPTION_TYPES, FORM_STATUS } from '../constants/fieldTypes.js';

const num = z.number().finite().optional();

const fieldSchema = z
  .object({
    key: z.string().trim().regex(/^[a-zA-Z][a-zA-Z0-9_]{0,49}$/, 'Key must start with a letter and contain only letters, numbers or _'),
    label: z.string().trim().min(1, 'Label is required').max(100),
    type: z.string().transform((s) => s.toLowerCase()).pipe(z.enum(FIELD_TYPES)),
    placeholder: z.string().max(200).default(''),
    defaultValue: z.union([z.string(), z.number(), z.boolean(), z.array(z.string())]).optional(),
    required: z.boolean().default(false),
    options: z.array(z.string().trim().min(1).max(100)).max(50).default([]),
    validation: z.object({ minLength: num, maxLength: num, min: num, max: num }).default({}),
  })
  .superRefine((f, ctx) => {
    if ((f.type === 'select' || f.type === 'radio') && f.options.length === 0) {
      ctx.addIssue({ code: 'custom', path: ['options'], message: `${f.type} fields need at least one option` });
    }
    if (!OPTION_TYPES.includes(f.type) && f.options.length) f.options = [];
    if (new Set(f.options).size !== f.options.length) {
      ctx.addIssue({ code: 'custom', path: ['options'], message: 'Options must be unique' });
    }
  });

const baseForm = z.object({
  name: z.string().trim().min(1, 'Form name is required').max(150),
  description: z.string().trim().max(1000).default(''),
  status: z.enum(FORM_STATUS).default('draft'),
  fields: z
    .array(fieldSchema)
    .min(1, 'Add at least one field')
    .max(100)
    .refine((fs) => new Set(fs.map((f) => f.key)).size === fs.length, 'Field keys must be unique'),
});

export const createFormSchema = baseForm;
export const updateFormSchema = baseForm.partial();
