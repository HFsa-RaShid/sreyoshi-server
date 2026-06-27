import express from 'express';
import { NotificationControllers } from './notification.controller';

const router = express.Router();

router.post('/', NotificationControllers.createNotification); 
router.get('/:userId', NotificationControllers.getMyNotifications);
router.patch('/:id/read', NotificationControllers.markSingleAsRead); 
router.patch('/mark-all-read', NotificationControllers.markAllAsRead); 
router.delete('/:id', NotificationControllers.deleteNotification); 

export const NotificationRoutes = router;