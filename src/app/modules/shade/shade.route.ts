import express from 'express';
import { ShadeController } from './shade.controller';

const router = express.Router();

router.post('/', ShadeController.createShadeConfig);
router.patch('/:id', ShadeController.updateShadeConfig);

router.get('/', ShadeController.getAllShadeConfigs);
router.get('/:id', ShadeController.getSingleShadeConfig);
router.delete('/:id', ShadeController.deleteShadeConfig);

export const ShadeRoutes = router;