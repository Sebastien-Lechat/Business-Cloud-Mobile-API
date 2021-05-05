import { NotificationI, NotificationJsonI } from '../interfaces/notificationInterface';
import { UserObject } from '../interfaces/userInterface';
import { Notification } from '../models/Notification';
import mongoose from 'mongoose';

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
        targetId: notification.targetId,
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
    const notifications = await Notification.find({ userId: mongoose.Types.ObjectId(user.data._id) }).sort({ _id: -1 }).limit(99);

    // Mise en forme
    notifications.map((notification: NotificationI) => {
        notificationList.push(generateNotificationJSON(notification));
    });

    return notificationList;
};

/**
 * Fonction pour retourner le nombre de notifications non lu.
 * @param user Utilisateur pour lequel on génère le count.
 * @return Retourne le nombre de notifications
 */
const getNotificationCount = async (user: UserObject): Promise<NotificationJsonI[]> => {
    return await Notification.find({ userId: mongoose.Types.ObjectId(user.data._id), seen: false }).countDocuments();
};

/**
 * Fonction pour retourner le nombre de notifications non lu.
 * @param user Utilisateur pour lequel on génère le count.
 * @return Retourne le JSON
 */
const updateAllToSeen = async (user: UserObject): Promise<void> => {
    return await Notification.updateMany({ userId: mongoose.Types.ObjectId(user.data._id), seen: false }, { $set: { seen: true } });
};

const notificationUtils = {
    generateNotificationJSON,
    getNotificationList,
    updateAllToSeen,
    getNotificationCount
};

export { notificationUtils };
