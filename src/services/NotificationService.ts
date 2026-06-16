import { NotificationRepository } from '../repositories/NotificationRepository';
import { INotificationPayload, INotification } from '../models/Notification';

export class NotificationService {
  constructor(private notificationRepository: NotificationRepository = new NotificationRepository()) {}

  public async createAndSendNotification(payload: INotificationPayload): Promise<INotification> {
    // Simulate sending logic based on type
    console.log(`Sending ${payload.type} notification to ${payload.recipient}: ${payload.body}`);

    const newNotification: Omit<INotification, '_id'> = {
      ...payload,
      status: 'sent', // Simulate success for now
      timestamp: new Date(),
    };
    return this.notificationRepository.create(newNotification);
  }

  public async getPaginatedNotifications(page: number, limit: number): Promise<{
    notifications: INotification[];
    page: number;
    limit: number;
    totalPages: number;
    totalItems: number;
  }> {
    return this.notificationRepository.findPaginated(page, limit);
  }
}
