import { NotificationService } from '../../src/services/NotificationService';
import { NotificationRepository } from '../../src/repositories/NotificationRepository';
import { NotificationType } from '../../src/models/Notification';

const mockNotificationRepository = {
  create: jest.fn(),
  findPaginated: jest.fn(),
} as unknown as NotificationRepository;

describe('NotificationService Unit Tests', () => {
  let service: NotificationService;

  beforeEach(() => {
    service = new NotificationService(mockNotificationRepository);
    jest.clearAllMocks();
  });

  it('should create and send an email notification', async () => {
    const payload = {
      recipient: 'test@example.com',
      type: NotificationType.EMAIL,
      subject: 'Test Subject',
      body: 'Test Body',
    };
    const mockCreated = { ...payload, _id: '123', status: 'sent' as const, timestamp: new Date() };
    (mockNotificationRepository.create as jest.Mock).mockResolvedValue(mockCreated);

    const result = await service.createAndSendNotification(payload);

    expect(mockNotificationRepository.create).toHaveBeenCalledWith(expect.objectContaining({
      recipient: 'test@example.com',
      type: NotificationType.EMAIL,
      status: 'sent',
    }));
    expect(result.status).toBe('sent');
    expect(result._id).toBe('123');
  });

  it('should create and send an SMS notification', async () => {
    const payload = {
      recipient: '+15551234567',
      type: NotificationType.SMS,
      body: 'Test SMS Body',
    };
    const mockCreated = { ...payload, _id: '456', status: 'sent' as const, timestamp: new Date() };
    (mockNotificationRepository.create as jest.Mock).mockResolvedValue(mockCreated);

    const result = await service.createAndSendNotification(payload);

    expect(mockNotificationRepository.create).toHaveBeenCalledWith(expect.objectContaining({
      recipient: '+15551234567',
      type: NotificationType.SMS,
      status: 'sent',
    }));
    expect(result.status).toBe('sent');
    expect(result._id).toBe('456');
  });

  it('should retrieve paginated list of notifications', async () => {
    const mockResult = {
      notifications: [
        {
          _id: '123',
          recipient: 'test@example.com',
          type: NotificationType.EMAIL,
          subject: 'Subject',
          body: 'Body',
          status: 'sent' as const,
          timestamp: new Date(),
        },
      ],
      page: 1,
      limit: 10,
      totalPages: 1,
      totalItems: 1,
    };
    (mockNotificationRepository.findPaginated as jest.Mock).mockResolvedValue(mockResult);

    const result = await service.getPaginatedNotifications(1, 10);

    expect(mockNotificationRepository.findPaginated).toHaveBeenCalledWith(1, 10);
    expect(result).toEqual(mockResult);
  });
});
