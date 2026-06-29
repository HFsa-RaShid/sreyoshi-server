import express from 'express';
import { WishlistControllers } from './wishlist.controller';
import auth from '../../../middlewares/auth';

const router = express.Router();

// প্রোডাক্ট উইশলিস্টে যোগ/বিয়োগ করার জন্য (ইউআই-এর হার্ট বা ডিলিট বাটনের জন্য)
router.post('/toggle',auth(), WishlistControllers.toggleWishlist);

// নির্দিষ্ট ইউজারের উইশলিস্ট ডাটা ফ্রন্টএন্ডে রেন্ডার করার জন্য
router.get('/:userId',auth(), WishlistControllers.getMyWishlist);

// পুরো উইশলিস্ট এক ক্লিকে খালি করার জন্য
router.delete('/clear/:userId', WishlistControllers.clearWishlist);
router.patch('/remove-item', WishlistControllers.removeSingleItem);

export const WishlistRoutes = router;