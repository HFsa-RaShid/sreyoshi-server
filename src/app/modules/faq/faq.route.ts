import express from 'express';
import { FaqControllers } from './faq.controller';

const router = express.Router();

router.post('/', FaqControllers.createFaq);
router.get('/', FaqControllers.getAllFaqs);
router.get('/:id', FaqControllers.getSingleFaq);
router.patch('/:id', FaqControllers.updateFaq);
router.delete('/:id', FaqControllers.deleteFaq);

export const FaqRoutes = router;