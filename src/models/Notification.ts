import mongoose, { Schema, Document } from 'mongoose';

export enum NotificationType {
  EMAIL = 'email',
  SMS = 'sms',
}

export interface INotificationPayload {
  recipient: string;
  type: NotificationType;
  subject?: string;
  body: string;
}

export interface INotification extends INotificationPayload {
  _id: string;
  status: 'pending' | 'sent' | 'failed';
  timestamp: Date;
}

export interface INotificationDocument extends Document, Omit<INotification, '_id'> {
  _id: mongoose.Types.ObjectId;
}

const NotificationSchema: Schema = new Schema(
  {
    recipient: {
      type: String,
      required: true,
      index: true,
    },
    type: {
      type: String,
      required: true,
      enum: Object.values(NotificationType),
    },
    subject: {
      type: String,
      required: function (this: any) {
        return this.type === NotificationType.EMAIL;
      },
    },
    body: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ['pending', 'sent', 'failed'],
      default: 'pending',
    },
    timestamp: {
      type: Date,
      required: true,
      default: Date.now,
      index: true,
    },
  },
  {
    versionKey: false,
  }
);

// Compound or single index optimization for pagination by timestamp descending
NotificationSchema.index({ timestamp: -1 });

export const NotificationModel = mongoose.model<INotificationDocument>('Notification', NotificationSchema);
