import { Request, Response, NextFunction } from 'express';
import { NotificationServices } from './notification.service';

const createNotification = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await NotificationServices.createNotificationInDB(req.body);
    res.status(201).json({
      success: true,
      message: 'Notification triggered successfully!',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getMyNotifications = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?._id || req.params.userId;
    const page = Number(req.query.page) || 1;

    const { notifications, totalNotifications, totalUnread, limit } = 
      await NotificationServices.getMyNotificationsFromDB(userId, page);
    
    const totalPages = Math.ceil(totalNotifications / limit);

    res.status(200).json({
      success: true,
      meta: {
        page,
        limit,
        totalNotifications,
        totalPages,
        totalUnread,
      },
      data: notifications,
    });
  } catch (error) {
    next(error);
  }
};

const markAllAsRead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?._id || req.body.userId;
    await NotificationServices.markAllAsReadInDB(userId);
    res.status(200).json({
      success: true,
      message: 'All notifications marked as read',
    });
  } catch (error) {
    next(error);
  }
};

const markSingleAsRead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await NotificationServices.markSingleAsReadInDB(req.params.id as string);
    res.status(200).json({
      success: true,
      message: 'Notification marked as read',
    });
  } catch (error) {
    next(error);
  }
};

const deleteNotification = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await NotificationServices.deleteNotificationFromDB(req.params.id as string);
    res.status(200).json({
      success: true,
      message: 'Notification deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const NotificationControllers = {
  createNotification,
  getMyNotifications,
  markSingleAsRead,
  markAllAsRead,
  deleteNotification,
};