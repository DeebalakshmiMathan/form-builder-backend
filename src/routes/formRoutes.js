import { Router } from 'express';
import { adminOnly, optionalAuth } from '../middleware/auth.js';
import { validateBody, validateObjectId } from '../middleware/validate.js';
import { createFormSchema, updateFormSchema } from '../validators/formSchema.js';
import * as c from '../controllers/formController.js';
import submissionRoutes from './submissionRoutes.js';

const router = Router();

router.post('/', adminOnly, validateBody(createFormSchema), c.createForm);
router.get('/', adminOnly, c.listForms);
router.get('/:id', validateObjectId('id'), optionalAuth, c.getForm); // public if published
router.put('/:id', adminOnly, validateObjectId('id'), validateBody(updateFormSchema), c.updateForm);
router.delete('/:id', adminOnly, validateObjectId('id'), c.deleteForm);

router.use('/:formId/submissions', submissionRoutes);

export default router;
