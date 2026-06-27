import express from 'express';
import { DeliveryChargeController } from './deliveryCharge.controller';
import auth from '../../../middlewares/auth'; 

const router = express.Router();

// চেকআউট পেজের জন্য পাবলিক গেট রিকোয়েস্ট
router.get('/calculate', DeliveryChargeController.getCalculateCharge);

// অ্যাডমিন ম্যানেজমেন্ট এন্ডপয়েন্ট
router.post('/create', auth('admin'), DeliveryChargeController.createZone);
router.get('/all-zones', DeliveryChargeController.getAllZones);
router.patch('/update/:id', auth('admin'), DeliveryChargeController.updateZone);
router.delete('/delete/:id', auth('admin'), DeliveryChargeController.deleteZone);

export const DeliveryChargeRoutes = router;