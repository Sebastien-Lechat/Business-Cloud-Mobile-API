import { Request, Response } from 'express';
import { errorHandler, sendResponse } from '../helpers/responseHelper';
import VerifyData from '../helpers/verifyDataHelper';
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
