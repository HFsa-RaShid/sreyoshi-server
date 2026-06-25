import express from 'express';
import { DeliveryChargeController } from './deliveryCharge.controller';
import auth from '../../../middlewares/auth'; // আপনার প্রোজেক্টের Auth মিডলওয়্যার

const router = express.Router();

// ইউজার এন্ডপয়েন্ট (চেকআউট পেজে ব্যবহারের জন্য পাবলিক/ইউজার)
router.get('/calculate', DeliveryChargeController.getCalculateCharge);

// অ্যাডমিন ম্যানেজমেন্ট এন্ডপয়েন্ট
router.post('/create', auth('admin'), DeliveryChargeController.createZone);
router.get('/all-zones', auth('admin'), DeliveryChargeController.getAllZones);
router.patch('/update/:id', auth('admin'), DeliveryChargeController.updateZone);
router.delete('/delete/:id', auth('admin'), DeliveryChargeController.deleteZone);

export const DeliveryChargeRoutes = router;