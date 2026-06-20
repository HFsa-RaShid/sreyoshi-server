import express from 'express';
import { ShadeController } from './shade.controller';
import { upload } from '../../utils/uploadConfig';

const router = express.Router();

// 💡 upload.single থেকে পরিবর্তন করে upload.array('shadeImages') করা হলো
router.post('/', upload.array('shadeImages', 20), ShadeController.createShadeConfig);
router.patch('/:id', upload.array('shadeImages', 20), ShadeController.updateShadeConfig);

router.get('/', ShadeController.getAllShadeConfigs);
router.get('/:id', ShadeController.getSingleShadeConfig);
router.delete('/:id', ShadeController.deleteShadeConfig);

export const ShadeRoutes = router;