import express from 'express';
import { ShopSettingsController } from './shopSettings.controller';
import auth from '../../../middlewares/auth'; 
import { upload } from '../../utils/uploadConfig';


const router = express.Router();

router.get('/', ShopSettingsController.getSettings);

router.patch(
  '/update', 
  auth('admin'), 
  upload.single('logo'), 
  ShopSettingsController.updateSettings
);

router.delete('/reset', auth('admin'), ShopSettingsController.resetSettings);

export const ShopSettingsRoutes = router;