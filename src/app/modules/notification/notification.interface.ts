import { Model, Types } from 'mongoose';

export type INotification = {
  userId: Types.ObjectId;
  title: string;
  message: string;
  notificationType: 'Order Update' | 'Promotion' | 'System Alert';
  isRead: boolean;
};

export type NotificationModel = Model<INotification, Record<string, unknown>>;