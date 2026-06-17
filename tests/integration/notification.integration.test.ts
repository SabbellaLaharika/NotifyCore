import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../src/app';
import { NotificationModel, NotificationType } from '../../src/models/Notification';

describe('Notification API Integration Tests', () => {
  beforeAll(async () => {
    // Dynamically build the test URI depending on environment (localhost vs docker)
    const baseUri = process.env.MONGODB_URI_TEST || 
      (process.env.MONGODB_URI 
        ? `${process.env.MONGODB_URI.split('/').slice(0, -1).join('/')}/notification-test-db` 
        : 'mongodb://localhost:27017/notification-test-db');
    
    await mongoose.connect(baseUri);
  });

  afterEach(async () => {
    await NotificationModel.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('should create a new email notification', async () => {
    const payload = {
      recipient: 'integration@example.com',
      type: NotificationType.EMAIL,
      subject: 'Integration Test',
      body: 'This is an integration test',
    };

    const res = await request(app)
      .post('/api/notifications')
      .send(payload);

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('_id');
    expect(res.body.recipient).toEqual('integration@example.com');
    expect(res.body.status).toEqual('sent');

    const savedNotification = await NotificationModel.findById(res.body._id);
    expect(savedNotification).not.toBeNull();
  });

  it('should create a new SMS notification', async () => {
    const payload = {
      recipient: '+15551234567',
      type: NotificationType.SMS,
      body: 'SMS Integration Test',
    };

    const res = await request(app)
      .post('/api/notifications')
      .send(payload);

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('_id');
    expect(res.body.recipient).toEqual('+15551234567');
    expect(res.body.status).toEqual('sent');

    const savedNotification = await NotificationModel.findById(res.body._id);
    expect(savedNotification).not.toBeNull();
  });

  it('should return 400 for invalid notification payload', async () => {
    const invalidPayload = {
      recipient: 'invalid-email',
      type: 'invalid-type',
      body: 'Missing subject for email',
    };

    const res = await request(app)
      .post('/api/notifications')
      .send(invalidPayload);

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('message', 'Validation failed');
    expect(res.body).toHaveProperty('errors');
  });

  it('should retrieve a paginated list of notifications ordered by timestamp descending', async () => {
    const now = new Date();
    // Create 3 notifications with distinct timestamps
    const notif1 = await NotificationModel.create({
      recipient: 'user1@example.com',
      type: NotificationType.EMAIL,
      subject: 'First',
      body: 'First body',
      status: 'sent',
      timestamp: new Date(now.getTime() - 2000),
    });

    const notif2 = await NotificationModel.create({
      recipient: 'user2@example.com',
      type: NotificationType.EMAIL,
      subject: 'Second',
      body: 'Second body',
      status: 'sent',
      timestamp: new Date(now.getTime() - 1000),
    });

    const notif3 = await NotificationModel.create({
      recipient: 'user3@example.com',
      type: NotificationType.EMAIL,
      subject: 'Third',
      body: 'Third body',
      status: 'sent',
      timestamp: now,
    });

    // Request limit=2, page=1
    const res = await request(app)
      .get('/api/notifications?page=1&limit=2')
      .expect(200);

    expect(res.body).toHaveProperty('page', 1);
    expect(res.body).toHaveProperty('limit', 2);
    expect(res.body).toHaveProperty('totalPages', 2);
    expect(res.body).toHaveProperty('totalItems', 3);
    expect(res.body).toHaveProperty('notifications');
    expect(res.body.notifications.length).toEqual(2);

    // Verify ordering by timestamp descending (notif3 should be first, then notif2)
    expect(res.body.notifications[0]._id).toEqual(notif3._id.toString());
    expect(res.body.notifications[1]._id).toEqual(notif2._id.toString());

    // Fetch page 2
    const resPage2 = await request(app)
      .get('/api/notifications?page=2&limit=2')
      .expect(200);

    expect(resPage2.body.notifications.length).toEqual(1);
    expect(resPage2.body.notifications[0]._id).toEqual(notif1._id.toString());
  });
});
