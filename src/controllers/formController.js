import { Form } from '../models/Form.js';
import { Submission } from '../models/Submission.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { buildPagination, escapeRegex, parsePagination } from '../utils/pagination.js';

export const createForm = asyncHandler(async (req, res) => {
  const form = await Form.create({ ...req.body, createdBy: req.user.id });
  res.status(201).json({ success: true, data: form });
});

export const listForms = asyncHandler(async (req, res) => {
  const pg = parsePagination(req.query);
  const filter = {};
  if (['draft', 'published'].includes(req.query.status)) filter.status = req.query.status;
  if (typeof req.query.search === 'string' && req.query.search.trim()) {
    filter.name = { $regex: escapeRegex(req.query.search.trim()), $options: 'i' };
  }

  const [items, total] = await Promise.all([
    Form.aggregate([
      { $match: filter },
      { $sort: { updatedAt: -1 } },
      { $skip: pg.skip },
      { $limit: pg.limit },
      // Never ship the full fields array in list views
      { $project: { name: 1, description: 1, status: 1, createdAt: 1, updatedAt: 1, fieldCount: { $size: { $ifNull: ['$fields', []] } } } },
    ]),
    Form.countDocuments(filter),
  ]);
  res.json({ success: true, data: items, pagination: buildPagination(pg, total) });
});

export const getForm = asyncHandler(async (req, res) => {
  const form = await Form.findById(req.params.id).lean();
  // Drafts are invisible to the public
  if (!form || (form.status !== 'published' && req.user?.role !== 'admin')) throw new ApiError(404, 'Form not found');
  res.json({ success: true, data: form });
});

export const updateForm = asyncHandler(async (req, res) => {
  const form = await Form.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true, runValidators: true });
  if (!form) throw new ApiError(404, 'Form not found');
  res.json({ success: true, data: form });
});

export const deleteForm = asyncHandler(async (req, res) => {
  const form = await Form.findByIdAndDelete(req.params.id);
  if (!form) throw new ApiError(404, 'Form not found');
  // At scale move this to a background job (see README)
  await Submission.deleteMany({ formId: form._id });
  res.json({ success: true, message: 'Form deleted' });
});
