import { Router } from 'express';
import { notificationController } from '../controllers/NotificationController';

const router = Router();

router.post('/notifications', notificationController.sendNotification);
router.get('/notifications', notificationController.getNotifications);

export default router;
