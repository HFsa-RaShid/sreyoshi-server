import express from 'express';
import { ShadeController } from './shade.controller';

const router = express.Router();

router.post('/', ShadeController.createShadeConfig);
router.get('/', ShadeController.getAllShadeConfigs);
router.get('/:id', ShadeController.getSingleShadeConfig);
router.patch('/:id', ShadeController.updateShadeConfig);
router.delete('/:id', ShadeController.deleteShadeConfig);

export const ShadeRoutes = router;