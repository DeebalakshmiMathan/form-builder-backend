import { Form } from '../models/Form.js';
import { Submission } from '../models/Submission.js';
import { validateSubmission } from '../services/submissionValidator.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { buildPagination, parsePagination } from '../utils/pagination.js';

export const createSubmission = asyncHandler(async (req, res) => {
  const form = await Form.findOne({ _id: req.params.formId, status: 'published' }).select('fields').lean();
  if (!form) throw new ApiError(404, 'Form not found or not published');

  const { isValid, errors, data } = validateSubmission(form.fields, req.body?.data ?? req.body);
  if (!isValid) throw new ApiError(422, 'Validation failed', errors);

  const submission = await Submission.create({
    formId: form._id,
    data,
    meta: { ip: req.ip, userAgent: (req.get('user-agent') || '').slice(0, 300) },
  });
  res.status(201).json({ success: true, data: { id: submission._id, createdAt: submission.createdAt } });
});

export const listSubmissions = asyncHandler(async (req, res) => {
  const pg = parsePagination(req.query);
  const filter = { formId: req.params.formId };
  const [items, total] = await Promise.all([
    Submission.find(filter).sort({ createdAt: -1 }).skip(pg.skip).limit(pg.limit).lean(),
    Submission.countDocuments(filter),
  ]);
  res.json({ success: true, data: items, pagination: buildPagination(pg, total) });
});

export const getSubmission = asyncHandler(async (req, res) => {
  const s = await Submission.findOne({ _id: req.params.submissionId, formId: req.params.formId }).lean();
  if (!s) throw new ApiError(404, 'Submission not found');
  res.json({ success: true, data: s });
});

export const deleteSubmission = asyncHandler(async (req, res) => {
  const s = await Submission.findOneAndDelete({ _id: req.params.submissionId, formId: req.params.formId });
  if (!s) throw new ApiError(404, 'Submission not found');
  res.json({ success: true, message: 'Submission deleted' });
});
