import { Router } from 'express';
import { adminOnly } from '../middleware/auth.js';
import { submissionLimiter } from '../middleware/rateLimit.js';
import { validateObjectId } from '../middleware/validate.js';
import * as c from '../controllers/submissionController.js';

const router = Router({ mergeParams: true });

router.use(validateObjectId('formId'));
router.post('/', submissionLimiter, c.createSubmission); // public
router.get('/', adminOnly, c.listSubmissions);
router.get('/:submissionId', adminOnly, validateObjectId('submissionId'), c.getSubmission);
router.delete('/:submissionId', adminOnly, validateObjectId('submissionId'), c.deleteSubmission);

export default router;
