import { Request, Response } from 'express';
import { errorHandler, sendResponse } from '../helpers/responseHelper';
import VerifyData from '../helpers/verifyDataHelper';
import { BillArticleI, BillI } from '../interfaces/billInterface';
import { EnterpriseI } from '../interfaces/enterpriseInterface';
import { ClientI } from '../interfaces/userInterface';
import { Article } from '../models/Article';
import { Bill } from '../models/Bill';
import { Client } from '../models/Client';
import { Enterprise } from '../models/Entreprise';
import { billUtils } from '../utils/billUtils';
import { globalUtils } from '../utils/globalUtils';
import { userUtils } from '../utils/userUtils';

export class BillController {

    /**
     * Fonction de récupération de toutes les facture  (GET /bills)
     * @param req express Request
     * @param res express Response
     */
    static getBillsList = async (req: Request, res: Response) => {
        try {
            // Envoi de la réponse
            sendResponse(res, 200, { error: false, message: 'Successful bills acquisition' });
        } catch (err) {
            errorHandler(res, err);
        }
    }

    /**
     * Fonction de récupération d'une facture  (GET /bill/:id)
     * @param req express Request
     * @param res express Response
     */
    static getOneBill = async (req: Request, res: Response) => {
        try {
            // Envoi de la réponse
            sendResponse(res, 200, { error: false, message: 'Successful bill acquisition' });
        } catch (err) {
            errorHandler(res, err);
        }
    }

    /**
     * Fonction de création d'une facture  (POST /bill)
     * @param req express Request
     * @param res express Response
     */
    static create = async (req: Request, res: Response) => {
        try {
            // Vérification de si l'utilisateur à les permissions de faire la requête
            const hasPermission = globalUtils.checkPermission(userUtils.getRequestUser(req), 'user');
            if (!hasPermission) throw new Error('You do not have the required permissions');

            // Récupération de toutes les données du body
            const { status, clientId, enterpriseId, billNum, deadline, currency, taxe } = req.body;

            // Vérification de si toutes les données nécessaire sont présentes
            if (!status || !clientId || !enterpriseId || !billNum || !deadline) throw new Error('Missing important fields');

            // Vérification de la validité du status
            if (!VerifyData.validBillStatus(status)) throw new Error('Invalid bill status');

            // Vérification de si le client existe
            const customer: ClientI = await globalUtils.findOne(Client, clientId);
            if (!customer) throw new Error('Invalid customer id');

            // Vérification de si l'entreprise existe
            const enterprise: EnterpriseI = await globalUtils.findOne(Enterprise, enterpriseId);
            if (!enterprise) throw new Error('Invalid enterprise id');

            // Vérification de la validité du numéro de facture
            if (!await VerifyData.validBillNumber(billNum)) throw new Error('Invalid bill number');

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
            const bill: BillI = await Bill.create(req.body);

            // Envoi de la réponse
            sendResponse(res, 200, { error: false, message: 'Bill successfully created', bill: billUtils.generateBillJSON(bill) });
        } catch (err) {
            if (err.message === 'Missing important fields') sendResponse(res, 400, { error: true, code: '104151', message: err.message });
            else if (err.message === 'Invalid bill status') sendResponse(res, 400, { error: true, code: '104152', message: err.message });
            else if (err.message === 'Invalid customer id') sendResponse(res, 400, { error: true, code: '104153', message: err.message });
            else if (err.message === 'Invalid enterprise id') sendResponse(res, 400, { error: true, code: '104154', message: err.message });
            else if (err.message === 'Invalid bill number') sendResponse(res, 400, { error: true, code: '104155', message: err.message });
            else if (err.message === 'Invalid deadline') sendResponse(res, 400, { error: true, code: '104156', message: err.message });
            else if (err.message === 'Invalid taxe rate') sendResponse(res, 400, { error: true, code: '104157', message: err.message });
            else errorHandler(res, err);
        }
    }

    /**
     * Fonction de modification d'une facture  (PUT /bill)
     * @param req express Request
     * @param res express Response
     */
    static update = async (req: Request, res: Response) => {
        try {
            // Vérification de si l'utilisateur à les permissions de faire la requête
            const hasPermission = globalUtils.checkPermission(userUtils.getRequestUser(req), 'user');
            if (!hasPermission) throw new Error('You do not have the required permissions');

            // Récupération de toutes les données du body
            const { id, status, clientId, billNum, articles, currency, deadline, taxe } = req.body;

            // Vérification de si toutes les données nécessaire sont présentes
            if (!id) throw new Error('Missing id field');

            // Vérification de si la facture existe
            const bill: BillI = await globalUtils.findOne(Bill, id);
            if (!bill) throw new Error('Invalid bill id');

            // Vérification de la validité du status
            if (status && !VerifyData.validBillStatus(status)) throw new Error('Invalid bill status');

            // Vérification de si le client existe
            if (clientId) {
                const customer: ClientI = await globalUtils.findOne(Client, clientId);
                if (!customer) throw new Error('Invalid customer id');
            }

            // Vérification de la validité du numéro de facture
            if (billNum && billNum !== bill.billNum && !await VerifyData.validBillNumber(billNum)) throw new Error('Invalid bill number');

            // Vérification de la validité de la date d'échéance
            if (deadline && !VerifyData.validDeadline(deadline)) throw new Error('Invalid deadline');

            // Vérification de la validité de la taxe
            if (taxe && !VerifyData.validTaxe(taxe)) throw new Error('Invalid taxe rate');

            // Vérification de la validité des articles
            if (articles) {
                articles.map(async (article: BillArticleI) => {
                    if (!article.articleId || !article.quantity) throw new Error('Invalid article format');
                    const articleFind = await globalUtils.findOne(Article, article.articleId);
                    if (!articleFind) throw new Error('Invalid article id');
                });
            }

            // Création des données existante à modifier
            const toUpdate: any = {};

            if (status) toUpdate.status = bill.status = status;
            if (clientId) toUpdate.clientId = bill.clientId = clientId;
            if (billNum) toUpdate.billNum = bill.billNum = billNum;
            if (articles) toUpdate.articles = bill.articles = articles;
            if (taxe) toUpdate.taxe = bill.taxe = taxe;
            if (currency) toUpdate.currency = bill.currency = currency;
            if (deadline) toUpdate.deadline = bill.deadline = deadline;

            // Modification de la facture
            await globalUtils.updateOneById(Bill, id, toUpdate);

            // Envoi de la réponse
            sendResponse(res, 200, { error: false, message: 'Bill successfully updated', bill: billUtils.generateBillJSON(bill) });
        } catch (err) {
            if (err.message === 'Missing id field') sendResponse(res, 400, { error: true, code: '104201', message: err.message });
            else if (err.message === 'Invalid bill id') sendResponse(res, 400, { error: true, code: '104202', message: err.message });
            else if (err.message === 'Invalid bill status') sendResponse(res, 400, { error: true, code: '104203', message: err.message });
            else if (err.message === 'Invalid customer id') sendResponse(res, 400, { error: true, code: '104204', message: err.message });
            else if (err.message === 'Invalid bill number') sendResponse(res, 400, { error: true, code: '104205', message: err.message });
            else if (err.message === 'Invalid deadline') sendResponse(res, 400, { error: true, code: '104206', message: err.message });
            else if (err.message === 'Invalid taxe rate') sendResponse(res, 400, { error: true, code: '104207', message: err.message });
            else if (err.message === 'Invalid article format') sendResponse(res, 400, { error: true, code: '104208', message: err.message });
            else if (err.message === 'Invalid article id') sendResponse(res, 400, { error: true, code: '104209', message: err.message });
            else errorHandler(res, err);
        }
    }


    /**
     * Fonction de suppression d'une facture  (DELETE /bill/:id)
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
            const bill: BillI = await globalUtils.findOne(Bill, id);
            if (!bill) throw new Error('Invalid bill id');

            // Suppression de la facture
            await globalUtils.deleteOne(Bill, id);

            // Envoi de la réponse
            sendResponse(res, 200, { error: false, message: 'Bill successfully deleted' });
        } catch (err) {
            if (err.message === 'You do not have the required permissions') sendResponse(res, 400, { error: true, code: '401002', message: err.message });
            else if (err.message === 'Missing id field') sendResponse(res, 400, { error: true, code: '104251', message: err.message });
            else if (err.message === 'Invalid bill id') sendResponse(res, 400, { error: true, code: '104252', message: err.message });
            else errorHandler(res, err);
        }
    }
}
