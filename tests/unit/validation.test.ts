import { validateNotificationPayload } from '../../src/utils/validation';
import { NotificationType } from '../../src/models/Notification';

describe('validateNotificationPayload Unit Tests', () => {
  it('should return error for invalid payload types (non-objects)', () => {
    expect(validateNotificationPayload(null)).toEqual({ payload: 'Invalid request body' });
    expect(validateNotificationPayload('string')).toEqual({ payload: 'Invalid request body' });
    expect(validateNotificationPayload(123)).toEqual({ payload: 'Invalid request body' });
  });

  it('should pass for a valid email payload', () => {
    const payload = {
      recipient: 'test@example.com',
      type: NotificationType.EMAIL,
      subject: 'Welcome',
      body: 'Hello World',
    };
    expect(validateNotificationPayload(payload)).toBeNull();
  });

  it('should pass for a valid SMS payload without subject', () => {
    const payload = {
      recipient: '+15551234567',
      type: NotificationType.SMS,
      body: 'Hello World',
    };
    expect(validateNotificationPayload(payload)).toBeNull();
  });

  it('should pass for a valid SMS payload with subject', () => {
    const payload = {
      recipient: '15551234567',
      type: NotificationType.SMS,
      subject: 'MySMS',
      body: 'Hello World',
    };
    expect(validateNotificationPayload(payload)).toBeNull();
  });

  it('should return error for missing or empty recipient', () => {
    const payload = {
      type: NotificationType.SMS,
      body: 'Hello World',
    };
    expect(validateNotificationPayload(payload)).toHaveProperty('recipient');
    expect(validateNotificationPayload({ ...payload, recipient: '   ' })).toHaveProperty('recipient');
    expect(validateNotificationPayload({ ...payload, recipient: 123 })).toHaveProperty('recipient');
  });

  it('should return error for invalid recipient format', () => {
    const payload = {
      recipient: 'invalid-recipient',
      type: NotificationType.SMS,
      body: 'Hello World',
    };
    expect(validateNotificationPayload(payload)).toHaveProperty('recipient');
  });

  it('should return error for missing or invalid type', () => {
    const payload = {
      recipient: 'test@example.com',
      body: 'Hello World',
    };
    expect(validateNotificationPayload(payload)).toHaveProperty('type');
    expect(validateNotificationPayload({ ...payload, type: 'invalid' })).toHaveProperty('type');
  });

  it('should return error for missing subject in email type', () => {
    const payload = {
      recipient: 'test@example.com',
      type: NotificationType.EMAIL,
      body: 'Hello World',
    };
    expect(validateNotificationPayload(payload)).toHaveProperty('subject');
    expect(validateNotificationPayload({ ...payload, subject: '   ' })).toHaveProperty('subject');
  });

  it('should return error for non-string subject in SMS type', () => {
    const payload = {
      recipient: '+15551234567',
      type: NotificationType.SMS,
      subject: 123,
      body: 'Hello World',
    };
    expect(validateNotificationPayload(payload as any)).toHaveProperty('subject');
  });

  it('should return error for missing or empty body', () => {
    const payload = {
      recipient: 'test@example.com',
      type: NotificationType.EMAIL,
      subject: 'Welcome',
    };
    expect(validateNotificationPayload(payload)).toHaveProperty('body');
    expect(validateNotificationPayload({ ...payload, body: '   ' })).toHaveProperty('body');
  });
});
