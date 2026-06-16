import { NotificationModel, INotification, INotificationDocument } from '../models/Notification';

export class NotificationRepository {
  public async create(payload: Omit<INotification, '_id'>): Promise<INotification> {
    const doc = await NotificationModel.create(payload);
    return this.mapDocument(doc);
  }

  public async findPaginated(page: number, limit: number): Promise<{
    notifications: INotification[];
    page: number;
    limit: number;
    totalPages: number;
    totalItems: number;
  }> {
    const skip = (page - 1) * limit;

    const [docs, totalItems] = await Promise.all([
      NotificationModel.find()
        .sort({ timestamp: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      NotificationModel.countDocuments().exec(),
    ]);

    const notifications = docs.map(doc => this.mapDocument(doc));
    const totalPages = Math.ceil(totalItems / limit) || 1;

    return {
      notifications,
      page,
      limit,
      totalPages,
      totalItems,
    };
  }

  private mapDocument(doc: INotificationDocument): INotification {
    const obj = doc.toObject();
    return {
      _id: obj._id.toString(),
      recipient: obj.recipient,
      type: obj.type,
      subject: obj.subject,
      body: obj.body,
      status: obj.status,
      timestamp: obj.timestamp,
    };
  }
}
