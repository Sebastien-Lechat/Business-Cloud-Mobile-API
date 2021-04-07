import { Request, Response } from 'express';
import { errorHandler, sendResponse } from '../helpers/responseHelper';
import { EstimateI } from '../interfaces/estimateInterface';
import { Estimate } from '../models/Estimate';
import { globalUtils } from '../utils/globalUtils';
import { userUtils } from '../utils/userUtils';

export class EstimateController {
    /**
     * Fonction de récupération de tous les devis  (GET /estimates)
     * @param req express Request
     * @param res express Response
     */
    static getEstimatesList = async (req: Request, res: Response) => {
        try {
            // Envoi de la réponse
            sendResponse(res, 200, { error: false, message: 'Successful estimates acquisition' });
        } catch (err) {
            errorHandler(res, err);
        }
    }

    /**
     * Fonction de récupération d'un devis  (GET /estimate/:id)
     * @param req express Request
     * @param res express Response
     */
    static getOneEstimate = async (req: Request, res: Response) => {
        try {
            // Envoi de la réponse
            sendResponse(res, 200, { error: false, message: 'Successful estimate acquisition' });
        } catch (err) {
            errorHandler(res, err);
        }
    }

    /**
     * Fonction de suppression d'un devis  (DELETE /estimate/:id)
     * @param req express Request
     * @param res express Response
     */
    static delete = async (req: Request, res: Response) => {
        try {
            // Vérification de si l'utilisateur à les permissions de faire la requête
            const hasPermission = globalUtils.checkPermission(userUtils.getRequestUser(req), 'user');
            if (!hasPermission) throw new Error('You do not have the required permissions');

            // Récupération de toutes les données du body
            const { id } = req.params;

            // Vérification de si toutes les données nécessaire sont présentes
            if (!id) throw new Error('Missing id field');

            // Vérification de si l'utilisateur existe
            const bill: EstimateI = await globalUtils.findOne(Estimate, id);
            if (!bill) throw new Error('Invalid estimate id');

            // Suppression du devis
            await globalUtils.deleteOne(Estimate, id);

            // Envoi de la réponse
            sendResponse(res, 200, { error: false, message: 'Estimate successfully deleted' });
        } catch (err) {
            if (err.message === 'You do not have the required permissions') sendResponse(res, 400, { error: true, code: '401002', message: err.message });
            else if (err.message === 'Missing id field') sendResponse(res, 400, { error: true, code: '105251', message: err.message });
            else if (err.message === 'Invalid estimate id') sendResponse(res, 400, { error: true, code: '105252', message: err.message });
            else errorHandler(res, err);
        }
    }
}
