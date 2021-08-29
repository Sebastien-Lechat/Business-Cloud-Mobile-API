import { Request, Response } from 'express';
import { sendMail } from '../helpers/emailHelper';
import { errorHandler, sendResponse } from '../helpers/responseHelper';
import VerifyData from '../helpers/verifyDataHelper';
import { BillI } from '../interfaces/billInterface';
import { EstimateI } from '../interfaces/estimateInterface';
import { ClientI } from '../interfaces/userInterface';
import { sendFileModel } from '../templates/emailTemplate';
import { globalUtils } from '../utils/globalUtils';
import { userUtils } from '../utils/userUtils';

export class GlobalController {
    /**
     * Fonction pour retourner le prochain numéro disponible (GET /global/nextNumber&acronym=)
     * @param req express Request
     * @param res express Response
     */
    static getNextNumber = async (req: Request, res: Response) => {
        try {
            // Vérification de si l'utilisateur à les permissions de faire la requête
            const hasPermission = globalUtils.checkPermission(userUtils.getRequestUser(req), 'user');
            if (!hasPermission) throw new Error('You do not have the required permissions');

            // Récupération de toutes les données du body
            const { acronym } = req.query;

            // Récupération du prochain chiffre disponible
            const nextNumber = await globalUtils.findNextNumber(acronym as string);

            sendResponse(res, 200, { error: false, message: 'Successful number acquisition', nextNumber });
        } catch (err) {
            if (err.message === 'Missing important fields') sendResponse(res, 400, { error: true, code: '114001', message: err.message });
            else errorHandler(res, err);
        }
    }

    /**
     * Fonction pour générer une facture et l'envoyer par mail (GET /global/generateInvoice/:type/:id)
     * @param req express Request
     * @param res express Response
     */
    static generateInvoice = async (req: Request, res: Response) => {
        try {
            // Récupération de l'utilisateur grâce au Authmiddleware qui rajoute le token dans req
            const user = userUtils.getRequestUser(req);

            // Récupération de toutes les données du body
            const { id, type } = req.params;

            // Vérification de si toutes les données nécessaire sont présentes
            if (!id || !type) throw new Error('Missing important fields');

            // Vérification du format du type
            if (type !== 'estimate' && type !== 'bill') throw new Error('Invalid type field');

            // Génération de la facture
            const data = await globalUtils.generateInvoice(type, id);

            // Vérification de si l'id est valide ou non
            if (!data) throw new Error('Invalid file id');

            // Envoi du mail
            sendMail(user.data.email, 'Récupération d\'un document',
                sendFileModel(
                    user.data.name, type === 'bill' ? 'de la facture' : 'du devis',
                    type === 'bill' ? (data.fileData as BillI).billNum : (data.fileData as EstimateI).estimateNum,
                    VerifyData.formatShortDate(new Date(data.fileData.deadline)),
                    data.fileData.status === 'En retard',
                ),
                { path: data.file.path, num: type === 'bill' ? (data.fileData as BillI).billNum : (data.fileData as EstimateI).estimateNum }
            );

            sendResponse(res, 200, { error: false, message: 'Document successfully send' });
        } catch (err) {
            if (err.message === 'Missing important fields') sendResponse(res, 400, { error: true, code: '114051', message: err.message });
            else if (err.message === 'Invalid type field') sendResponse(res, 400, { error: true, code: '114052', message: err.message });
            else if (err.message === 'Invalid customer id') sendResponse(res, 400, { error: true, code: '114053', message: err.message });
            else if (err.message === 'Invalid file id') sendResponse(res, 400, { error: true, code: '114054', message: err.message });
            else errorHandler(res, err);
        }
    }

    /**
     * Fonction pour retourner les statistiques pour les différents types d'utilisateurs (GET /global/statistics)
     * @param req express Request
     * @param res express Response
     */
    static getStatistic = async (req: Request, res: Response) => {
        try {
            // Récupération de l'utilisateur grâce au Authmiddleware qui rajoute le token dans req
            const user = userUtils.getRequestUser(req);

            // Récupération des statistiques en fonction du rôle de l'utilisateur
            const statistics = await globalUtils.findStatistics(user);

            sendResponse(res, 200, { error: false, message: 'Successful statistic acquisition', statistics: statistics });
        } catch (err) {
            errorHandler(res, err);
        }

    }
}
