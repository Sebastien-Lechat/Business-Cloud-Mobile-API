import { Request, Response } from 'express';
import { errorHandler, sendResponse } from '../helpers/responseHelper';
import VerifyData from '../helpers/verifyDataHelper';
import { EnterpriseI } from '../interfaces/enterpriseInterface';
import { EstimateI } from '../interfaces/estimateInterface';
import { ClientI } from '../interfaces/userInterface';
import { Client } from '../models/Client';
import { Enterprise } from '../models/Entreprise';
import { Estimate } from '../models/Estimate';
import { estimateUtils } from '../utils/estimateUtils';
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
     * Fonction de création d'un devis (POST /estimate)
     * @param req express Request
     * @param res express Response
     */
    static create = async (req: Request, res: Response) => {
        try {
            // Vérification de si l'utilisateur à les permissions de faire la requête
            const hasPermission = globalUtils.checkPermission(userUtils.getRequestUser(req), 'user');
            if (!hasPermission) throw new Error('You do not have the required permissions');

            // Récupération de toutes les données du body
            const { status, clientId, enterpriseId, estimateNum, deadline, currency, taxe } = req.body;

            // Vérification de si toutes les données nécessaire sont présentes
            if (!status || !clientId || !enterpriseId || !estimateNum || !deadline) throw new Error('Missing important fields');

            // Vérification de la validité du status
            if (!VerifyData.validEstimateStatus(status)) throw new Error('Invalid estimate status');

            // Vérification de si le client existe
            const customer: ClientI = await globalUtils.findOne(Client, clientId);
            if (!customer) throw new Error('Invalid customer id');

            // Vérification de si l'entreprise existe
            const enterprise: EnterpriseI = await globalUtils.findOne(Enterprise, enterpriseId);
            if (!enterprise) throw new Error('Invalid enterprise id');

            // Vérification de la validité du numéro de facture
            if (!await VerifyData.validEstimateNumber(estimateNum)) throw new Error('Invalid estimate number');

            // Vérification de la validité de la date d'échéance
            if (!VerifyData.validDeadline(deadline)) throw new Error('Invalid deadline');
            req.body.deadline = new Date(deadline);

            // Vérification de la validité de la taxe
            if (taxe && !VerifyData.validTaxe(taxe)) throw new Error('Invalid taxe rate');
            if (taxe) req.body.taxe = VerifyData.validTaxe(taxe);

            req.body.articles = [];
            req.body.totalHT = 0;
            req.body.totalTTC = 0;

            // Création de la facture
            const estimate: EstimateI = await Estimate.create(req.body);

            // Envoi de la réponse
            sendResponse(res, 200, { error: false, message: 'Estimate successfully created', estimate: estimateUtils.generateEstimateJSON(estimate) });
        } catch (err) {
            if (err.message === 'Missing important fields') sendResponse(res, 400, { error: true, code: '105201', message: err.message });
            else if (err.message === 'Invalid estimate status') sendResponse(res, 400, { error: true, code: '105202', message: err.message });
            else if (err.message === 'Invalid customer id') sendResponse(res, 400, { error: true, code: '105203', message: err.message });
            else if (err.message === 'Invalid enterprise id') sendResponse(res, 400, { error: true, code: '105204', message: err.message });
            else if (err.message === 'Invalid estimate number') sendResponse(res, 400, { error: true, code: '105205', message: err.message });
            else if (err.message === 'Invalid deadline') sendResponse(res, 400, { error: true, code: '105206', message: err.message });
            else if (err.message === 'Invalid taxe rate') sendResponse(res, 400, { error: true, code: '105207', message: err.message });
            else errorHandler(res, err);
        }
    }

    /**
     * Fonction de modification d'un devis (PUT /estimate)
     * @param req express Request
     * @param res express Response
     */
    static update = async (req: Request, res: Response) => {
        try {
        } catch (err) {
        }
    }

    /**
     * Fonction de suppression d'un devis (DELETE /estimate/:id)
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
            const estimate: EstimateI = await globalUtils.findOne(Estimate, id);
            if (!estimate) throw new Error('Invalid estimate id');

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
