import express from 'express';
import { UserController } from './user.controller';
import auth from '../../../middlewares/auth';
import { upload } from '../../utils/uploadConfig'; // আপনার আপলোড কনফিগারেশন পাথ

const router = express.Router();

router.post('/create-user', UserController.createUser);
router.get('/my-profile', auth(), UserController.getMyProfile);

// 🎯 সংশোধন: upload.single মিডলওয়্যারটি এখন সঠিক জায়গায় (update-profile এ) বসানো হয়েছে
router.patch(
  '/update-profile', 
  auth(), 
  upload.single('profileImage'), 
  UserController.updateProfile
);

// 🎯 সংশোধন: পাসওয়ার্ড চেঞ্জের এখান থেকে মাল্টার মিডলওয়্যারটি সরিয়ে দেওয়া হয়েছে
router.patch('/change-password', auth(), UserController.changePassword);

router.delete('/terminate-session/:sessionId', auth(), UserController.terminateSession);
router.delete('/delete-account', auth(), UserController.deleteAccount);

export const UserRoutes = router;