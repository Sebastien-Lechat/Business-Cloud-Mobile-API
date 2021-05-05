import { Request, Response } from 'express';
import { errorHandler, sendResponse } from '../helpers/responseHelper';
import { NotificationI } from '../interfaces/notificationInterface';
import { Notification } from '../models/Notification';
import { globalUtils } from '../utils/globalUtils';
import { notificationUtils } from '../utils/notificationutils';
import { userUtils } from '../utils/userUtils';

export class NotificationController {
    /**
     * Fonction de récupération de toutes les notifications (GET /notifications)
     * @param req express Request
     * @param res express Response
     */
    static getNotificationsList = async (req: Request, res: Response) => {
        try {
            // Récupération de l'utilisateur grâce au Authmiddleware qui rajoute le token dans req
            const user = userUtils.getRequestUser(req);

            // Récupération de la liste des notifications
            const notificationList = await notificationUtils.getNotificationList(user);

            // Mise à jour de toutes les notifications à vu
            await notificationUtils.updateAllToSeen(user);

            // Envoi de la réponse
            sendResponse(res, 200, { error: false, message: 'Successful notifications acquisition', notifications: notificationList });
        } catch (err) {
            errorHandler(res, err);
        }
    }

    /**
     * Fonction de récupération du nombre de notifications non lu (GET /notifications/count)
     * @param req express Request
     * @param res express Response
     */
    static getNotificationsCount = async (req: Request, res: Response) => {
        try {
            // Récupération de l'utilisateur grâce au Authmiddleware qui rajoute le token dans req
            const user = userUtils.getRequestUser(req);

            // Récupération du nombre de notification non lu
            const notificationCount = await notificationUtils.getNotificationCount(user);

            // Envoi de la réponse
            sendResponse(res, 200, { error: false, message: 'Successful notifications count acquisition', count: notificationCount });
        } catch (err) {
            errorHandler(res, err);
        }
    }

    // /**
    //  * Fonction pour mettre à jour toutes les notifications à vu (PUT /notifications/seen)
    //  * @param req express Request
    //  * @param res express Response
    //  */
    // static seeAllNotifications = async (req: Request, res: Response) => {
    //     try {
    //         // Récupération de l'utilisateur grâce au Authmiddleware qui rajoute le token dans req
    //         const user = userUtils.getRequestUser(req);

    //         // Mise à jour de toutes les notifications
    //         await notificationUtils.updateAllToSeen(user);

    //         // Envoi de la réponse
    //         sendResponse(res, 200, { error: false, message: 'Successful notifications update' });
    //     } catch (err) {
    //         errorHandler(res, err);
    //     }
    // }

    /**
     * Fonction de suppression d'une notification (DELETE /notification/:id)
     * @param req express Request
     * @param res express Response
     */
    static delete = async (req: Request, res: Response) => {
        try {
            // Récupération de toutes les données du body
            const { id } = req.params;

            // Vérification de si toutes les données nécessaire sont présentes
            if (!id) throw new Error('Missing id field');

            // Vérification de si la notification existe
            const notification: NotificationI = await globalUtils.findOne(Notification, id);
            if (!notification) throw new Error('Invalid notification id');

            // Suppression du devis
            await globalUtils.deleteOne(Notification, id);

            // Envoi de la réponse
            sendResponse(res, 200, { error: false, message: 'Notification successfully deleted' });
        } catch (err) {
            if (err.message === 'Missing id field') sendResponse(res, 400, { error: true, code: '113101', message: err.message });
            else if (err.message === 'Invalid notification id') sendResponse(res, 400, { error: true, code: '113102', message: err.message });
            else errorHandler(res, err);
        }
    }
}

