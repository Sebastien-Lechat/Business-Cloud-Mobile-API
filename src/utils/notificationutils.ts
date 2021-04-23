import { NotificationI, NotificationJsonI } from '../interfaces/notificationInterface';
import { UserObject } from '../interfaces/userInterface';
import { Notification } from '../models/Notification';
import { globalUtils } from './globalUtils';

/**
 * Fonction générer le JSON de retour d'une notification.
 * @param notification Notification pour lequel on génère le JSON.
 * @return Retourne le JSON.
 */
const generateNotificationJSON = (notification: NotificationI): NotificationJsonI => {
    const toReturn = {
        id: notification._id,
        title: notification.title,
        message: notification.message,
        category: notification.category,
        userId: notification.userId,
        seen: notification.seen,
        createdAt: notification.createdAt,
        updatedAt: notification.updatedAt,
    };

    return toReturn;
};

/**
 * Fonction pour retourner la liste des notifications.
 * @param user Utilisateur pour lequel on génère la liste.
 * @return Retourne le JSON
 */
const getNotificationList = async (user: UserObject): Promise<NotificationJsonI[]> => {
    const notificationList: NotificationJsonI[] = [];

    // Récupération de tous les notifications
    const notifications = await globalUtils.findMany(Notification, { userId: user.data._id });

    // Mise en forme
    notifications.map((notification: NotificationI) => {
        notificationList.push(generateNotificationJSON(notification));
    });

    return notificationList;
};

const notificationUtils = {
    generateNotificationJSON,
    getNotificationList
};

export { notificationUtils };
