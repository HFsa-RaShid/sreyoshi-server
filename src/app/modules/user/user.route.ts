import express from 'express';
import { UserController } from './user.controller';
import auth from '../../../middlewares/auth';
import { upload } from '../../utils/uploadConfig'; // আপনার আপলোড কনফিগারেশন পাথ

const router = express.Router();

// ১. পাবলিক বা নরমাল ইউজার রাউটস
router.post('/create-user', UserController.createUser);
router.get('/my-profile', auth(), UserController.getMyProfile);

router.patch(
  '/update-profile', 
  auth(), 
  upload.single('profileImage'), 
  UserController.updateProfile
);
router.patch('/change-password', auth(), UserController.changePassword);

router.delete('/terminate-session/:sessionId', auth(), UserController.terminateSession);
router.delete('/delete-account', auth(), UserController.deleteAccount);


// 🎯 ২. অ্যাডমিন প্রিভিলেজড রাউটস (অ্যাডমিন প্যানেলের জন্য)
router.get('/all-users', auth('admin'), UserController.getAllUsers);
router.post('/invite-user', auth('admin'), UserController.inviteUser);

// 🔍 এখানে আপনার ভুলটি ছিল—এই দুটি রাউট মিসিং ছিল, এখন যুক্ত করে দেওয়া হয়েছে:
router.patch('/update-role/:userId', auth('admin'), UserController.updateUserRole);
router.patch('/toggle-status/:userId', auth('admin'), UserController.toggleUserStatus); 

export const UserRoutes = router;