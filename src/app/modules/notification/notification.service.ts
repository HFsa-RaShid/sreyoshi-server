import { INotification } from './notification.interface';
import { Notification } from './notification.model';
import { User } from '../user/user.model';
import { io } from '../../../server'; 
import { IUser } from '../user/user.interface';

const createNotificationInDB = async (payload: INotification) => {
 
  const user = (await User.findById(payload.userId).lean()) as IUser | null;

  if (user) {
    
    const isOrderNotificationEnabled = user.preferences?.orderNotifications ?? true;
    const isPromotionEnabled = user.preferences?.promotionalAlerts ?? true;

    if (payload.notificationType === 'Order Update' && !isOrderNotificationEnabled) {
      return null;
    }
    if (payload.notificationType === 'Promotion' && !isPromotionEnabled) {
      return null;
    }
  }

 
  const result = await Notification.create(payload);

 
  if (result) {
    io.to(payload.userId.toString()).emit('new_notification', {
      success: true,
      data: result,
    });
  }

  return result;
};

const getMyNotificationsFromDB = async (userId: string, page: number) => {
  const limit = 10; 
  const skip = (page - 1) * limit;

  const notifications = await Notification.find({ userId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const totalNotifications = await Notification.countDocuments({ userId });
  const totalUnread = await Notification.countDocuments({ userId, isRead: false });

  return {
    notifications,
    totalNotifications,
    totalUnread,
    limit,
  };
};

const markAllAsReadInDB = async (userId: string) => {
  return await Notification.updateMany(
    { userId, isRead: false },
    { $set: { isRead: true } }
  );
};

const markSingleAsReadInDB = async (id: string) => {
  return await Notification.findByIdAndUpdate(
    id,
    { $set: { isRead: true } },
    { new: true }
  );
};

const deleteNotificationFromDB = async (id: string) => {
  return await Notification.findByIdAndDelete(id);
};

export const NotificationServices = {
  createNotificationInDB,
  getMyNotificationsFromDB,
  markSingleAsReadInDB,
  markAllAsReadInDB,
  deleteNotificationFromDB,
};