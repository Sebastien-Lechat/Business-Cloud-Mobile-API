const FCM = require('fcm-node');
import { config } from 'dotenv';
import { ClientI } from '../interfaces/userInterface';
import { Notification } from '../models/Notification';
config();

const serverKey = process.env.FCM_KEY as string;
const fcm = new FCM(serverKey);

export const sendNotificationToOne = async (titleText: string, bodyText: string, user: ClientI, category?: string) => {
    try {
        await Notification.create({ title: titleText, message: bodyText, userId: user._id, category: category });

        user.fcmDevice?.map((device) => {
            const message = {
                to: device.token,
                notification: {
                    title: titleText,
                    body: bodyText
                },
            };
            fcm.send(message, (err: any) => {
                if (err) console.log('Something has gone wrong!', err);
            });
        });
    } catch (err) {

    }

};

// Envoi d'une notification à l'utilisateur
// sendNotificationToOne('Nouvelle facture', 'Une nouvelle facture à été émise. Cliquez ici pour la consulter.', user.data, 'Facture');
// sendNotificationToOne('Nouveau projet', 'Un nouveau projet à été créer. Cliquez ici pour le consulter.', user.data, 'Projet');
// sendNotificationToOne('Nouveau message de xxxxxx', 'Vous avez reçu un nouveau message de xxxxxx. Cliquez ici pour le consulter.', user.data, 'Message');

