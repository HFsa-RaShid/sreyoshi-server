import { Schema, model } from 'mongoose';
import { INotification, NotificationModel } from './notification.interface';

const notificationSchema = new Schema<INotification>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    notificationType: {
      type: String,
      enum: ['Order Update', 'Promotion', 'System Alert'],
      required: true,
    },
    isRead: { type: Boolean, default: false }, 
  },
  { timestamps: true }
);

export const Notification = model<INotification, NotificationModel>('Notification', notificationSchema);