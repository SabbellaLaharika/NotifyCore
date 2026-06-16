import { NotificationType } from '../models/Notification';

export const validateNotificationPayload = (payload: any): Record<string, string> | null => {
  const errors: Record<string, string> = {};

  if (!payload || typeof payload !== 'object') {
    return { payload: 'Invalid request body' };
  }

  const { recipient, type, subject, body } = payload;

  // Validate recipient
  if (typeof recipient !== 'string' || !recipient.trim()) {
    errors.recipient = 'Recipient is required and must be a string';
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    const isValidEmail = emailRegex.test(recipient);
    const isValidPhone = phoneRegex.test(recipient.trim());

    if (!isValidEmail && !isValidPhone) {
      errors.recipient = 'Recipient must be a valid email address or phone number';
    }
  }

  // Validate type
  if (type !== NotificationType.EMAIL && type !== NotificationType.SMS) {
    errors.type = "Type must be either 'email' or 'sms'";
  }

  // Validate subject
  if (type === NotificationType.EMAIL) {
    if (typeof subject !== 'string' || !subject.trim()) {
      errors.subject = 'Subject is required for email notifications';
    }
  } else if (type === NotificationType.SMS) {
    if (subject !== undefined && typeof subject !== 'string') {
      errors.subject = 'Subject must be a string';
    }
  }

  // Validate body
  if (typeof body !== 'string' || !body.trim()) {
    errors.body = 'Body is required and must be a string';
  }

  return Object.keys(errors).length > 0 ? errors : null;
};
