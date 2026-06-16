import { Request, Response, NextFunction } from 'express';
import { NotificationService } from '../services/NotificationService';
import { INotificationPayload } from '../models/Notification';
import { validateNotificationPayload } from '../utils/validation';

export class NotificationController {
  constructor(private notificationService: NotificationService) {}

  public sendNotification = async (
    req: Request<{}, {}, INotificationPayload>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const validationErrors = validateNotificationPayload(req.body); // Custom validation utility
      if (validationErrors) {
        res.status(400).json({ message: 'Validation failed', errors: validationErrors });
        return;
      }
      const notification = await this.notificationService.createAndSendNotification(req.body);
      res.status(201).json(notification);
    } catch (error) {
      next(error); // Pass to error handling middleware
    }
  };

  public getNotifications = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      // Handle invalid pagination numbers
      const parsedPage = isNaN(page) || page < 1 ? 1 : page;
      const parsedLimit = isNaN(limit) || limit < 1 ? 10 : limit;

      const result = await this.notificationService.getPaginatedNotifications(parsedPage, parsedLimit);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
}

// Dependency Injection for Controller (example)
const notificationService = new NotificationService();
export const notificationController = new NotificationController(notificationService);
