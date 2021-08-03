import { Request, Response } from 'express';
import { sendMail } from '../helpers/emailHelper';
import { sendNotificationToOne } from '../helpers/notificationHelper';
import { errorHandler, sendResponse } from '../helpers/responseHelper';
import VerifyData from '../helpers/verifyDataHelper';
import { ArticleI } from '../interfaces/articleInterface';
import { BillI } from '../interfaces/billInterface';
import { EnterpriseI } from '../interfaces/enterpriseInterface';
import { EstimateArticleI, EstimateI } from '../interfaces/estimateInterface';
import { ClientI } from '../interfaces/userInterface';
import { Article } from '../models/Article';
import { Bill } from '../models/Bill';
import { Client } from '../models/Client';
import { Enterprise } from '../models/Entreprise';
import { Estimate } from '../models/Estimate';
import { sendBillModel } from '../templates/emailTemplate';
import { articleUtils } from '../utils/articleUtils';
import { billUtils } from '../utils/billUtils';
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
            // Récupération de l'utilisateur grâce au Authmiddleware qui rajoute le token dans req
            const user = userUtils.getRequestUser(req);

            // Récupération de la liste des devis en fonction du rôle
            const estimateList = await estimateUtils.getEstimateList(user);

            // Envoi de la réponse
            sendResponse(res, 200, { error: false, message: 'Successful estimates acquisition', estimates: estimateList });
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
            // Récupération de toutes les données du body
            const { id } = req.params;

            // Vérification de si toutes les données nécessaire sont présentes
            if (!id) throw new Error('Missing id field');

            // Récupération ddu devis
            const estimate = await globalUtils.findOneAndPopulate(Estimate, id, ['articles.articleId']);
            if (!estimate) throw new Error('Invalid estimate id');

            // Envoi de la réponse
            sendResponse(res, 200, { error: false, message: 'Successful estimate acquisition', estimate: estimateUtils.generateEstimateJSON(estimate) });
        } catch (err) {
            if (err.message === 'Invalid estimate id') sendResponse(res, 400, { error: true, code: '105101', message: err.message });
            else errorHandler(res, err);
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
            const { status, clientId, enterpriseId, estimateNum, deadline, reduction } = req.body;

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

            // Vérification de la validité du numéro du devis
            if (!await VerifyData.validEstimateNumber(estimateNum)) throw new Error('Invalid estimate number');

            // Vérification de la validité de la date d'échéance
            if (!VerifyData.validDeadline(deadline)) throw new Error('Invalid deadline');
            req.body.deadline = new Date(deadline);

            req.body.articles = [];
            req.body.totalHT = 0;
            req.body.totalTTC = 0;

            // Création du devis
            const estimate: EstimateI = await Estimate.create(req.body);

            // Envoi d'une notification
            sendNotificationToOne('Nouveau devis', 'Un nouveau devis à été émis en votre nom. Cliquez ici pour le consulter.', customer, estimate._id, 'Devis');

            // Envoi de la réponse
            sendResponse(res, 200, { error: false, message: 'Estimate successfully created', estimate: estimateUtils.generateEstimateJSON(estimate) });
        } catch (err) {
            if (err.message === 'You do not have the required permissions') sendResponse(res, 400, { error: true, code: '401002', message: err.message });
            else if (err.message === 'Missing important fields') sendResponse(res, 400, { error: true, code: '105151', message: err.message });
            else if (err.message === 'Invalid estimate status') sendResponse(res, 400, { error: true, code: '105152', message: err.message });
            else if (err.message === 'Invalid customer id') sendResponse(res, 400, { error: true, code: '105153', message: err.message });
            else if (err.message === 'Invalid enterprise id') sendResponse(res, 400, { error: true, code: '105154', message: err.message });
            else if (err.message === 'Invalid estimate number') sendResponse(res, 400, { error: true, code: '105155', message: err.message });
            else if (err.message === 'Invalid deadline') sendResponse(res, 400, { error: true, code: '105156', message: err.message });
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
            // Vérification de si l'utilisateur à les permissions de faire la requête
            const hasPermission = globalUtils.checkPermission(userUtils.getRequestUser(req), 'user');
            if (!hasPermission) throw new Error('You do not have the required permissions');

            // Récupération de toutes les données du body
            const { id, status, clientId, estimateNum, articles, reduction, deadline } = req.body;

            // Vérification de si toutes les données nécessaire sont présentes
            if (!id) throw new Error('Missing id field');

            // Vérification de si le devis existe
            const estimate: EstimateI = await globalUtils.findOne(Estimate, id);
            if (!estimate) throw new Error('Invalid estimate id');

            // Vérification de la validité du status
            if (status && !VerifyData.validEstimateStatus(status)) throw new Error('Invalid estimate status');

            // Vérification de si le client existe
            if (clientId) {
                const customer: ClientI = await globalUtils.findOne(Client, clientId);
                if (!customer) throw new Error('Invalid customer id');
            }

            // Vérification de la validité du numéro de devis
            if (estimateNum && estimateNum !== estimate.estimateNum && !await VerifyData.validEstimateNumber(estimateNum)) throw new Error('Invalid estimate number');

            // Vérification de la validité de la date d'échéance
            if (deadline && !VerifyData.validDeadline(deadline)) throw new Error('Invalid deadline');

            // Vérification de la validité des articles
            let newTotalHT = 0;
            let newTotalTTC = 0;
            if (articles) {
                for (const article of articles) {
                    if (!article.articleId || !article.quantity) throw new Error('Invalid article format');
                    const articleFind: ArticleI = await globalUtils.findOne(Article, article.articleId as string);
                    if (!articleFind) throw new Error('Some article id are invalid');
                    newTotalHT += (articleFind.price * article.quantity);
                    newTotalTTC += ((articleFind.price * (1 + (articleFind.tva / 100))) * article.quantity);
                }
            }

            // Création des données existante à modifier
            const toUpdate: any = {};

            if (status) toUpdate.status = estimate.status = status;
            if (clientId) toUpdate.clientId = estimate.clientId = clientId;
            if (estimateNum) toUpdate.estimateNum = estimate.estimateNum = estimateNum;
            if (articles) {
                toUpdate.articles = estimate.articles = articles;
                toUpdate.totalHT = newTotalHT.toFixed(2);
                toUpdate.totalTTC = newTotalTTC.toFixed(2);
            }
            if (reduction) toUpdate.reduction = estimate.reduction = reduction;
            if (deadline) toUpdate.deadline = estimate.deadline = deadline;

            // Modification du devis
            await globalUtils.updateOneById(Estimate, id, toUpdate);

            // Récupération du devis avec les articles
            const populateEstimate = await globalUtils.findOneAndPopulate(Estimate, id, ['articles.articleId']);

            // Mise en forme
            populateEstimate.articles.map((article: EstimateArticleI) => {
                article.articleId = articleUtils.generateArticleJSON(article.articleId as ArticleI);
                return article;
            });

            // Envoi de la réponse
            sendResponse(res, 200, { error: false, message: 'Estimate successfully updated', estimate: estimateUtils.generateEstimateJSON(populateEstimate) });
        } catch (err) {
            if (err.message === 'You do not have the required permissions') sendResponse(res, 400, { error: true, code: '401002', message: err.message });
            else if (err.message === 'Missing id field') sendResponse(res, 400, { error: true, code: '105201', message: err.message });
            else if (err.message === 'Invalid estimate id') sendResponse(res, 400, { error: true, code: '105202', message: err.message });
            else if (err.message === 'Invalid estimate status') sendResponse(res, 400, { error: true, code: '105203', message: err.message });
            else if (err.message === 'Invalid customer id') sendResponse(res, 400, { error: true, code: '105204', message: err.message });
            else if (err.message === 'Invalid estimate number') sendResponse(res, 400, { error: true, code: '105205', message: err.message });
            else if (err.message === 'Invalid deadline') sendResponse(res, 400, { error: true, code: '105206', message: err.message });
            else if (err.message === 'Invalid article format') sendResponse(res, 400, { error: true, code: '105207', message: err.message });
            else if (err.message === 'Some article id are invalid') sendResponse(res, 400, { error: true, code: '105208', message: err.message });
            else errorHandler(res, err);
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

            // Vérification de si le devis existe
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

    /**
     * Fonction pour envoyer un mail de relance à un client  (POST /estimate/:estimateId/customer/:clientId/mail)
     * @param req express Request
     * @param res express Response
     */
    static sendEstimateMail = async (req: Request, res: Response) => {
        try {
            // Vérification de si l'utilisateur à les permissions de faire la requête
            const hasPermission = globalUtils.checkPermission(userUtils.getRequestUser(req), 'user');
            if (!hasPermission) throw new Error('You do not have the required permissions');

            // Récupération de toutes les données du body
            const { estimateId, clientId } = req.params;

            // Vérification de si toutes les données nécessaire sont présentes
            if (!estimateId || !clientId) throw new Error('Missing important fields');

            // Vérification de si le devis existe
            const estimate: EstimateI = await globalUtils.findOne(Estimate, estimateId);
            if (!estimate) throw new Error('Invalid estimate id');

            // Vérification de si le client existe
            const customer: ClientI = await globalUtils.findOne(Client, clientId);
            if (!customer) throw new Error('Invalid customer id');

            // Génération de la facture
            const data = await globalUtils.generateInvoice('estimate', estimate._id);

            // Vérification de si l'id est valide ou non
            if (!data) throw new Error('Invalid estimate id');

            // Envoi du mail
            sendMail(customer.email, 'Relance acceptation devis',
                sendBillModel(customer.name, 'du devis', estimate.estimateNum, VerifyData.formatShortDate(new Date(estimate.deadline)), estimate.status === 'En retard'),
                { path: data.file.path, num: estimate.estimateNum }
            );

            // Envoi d'une notification
            sendNotificationToOne('Relance acceptation', 'Vous faites l\'objet d\'une relance d\'acceptation d\'un devis. Veuillez cliquer ici pour le consulter.', customer, estimate._id, 'Devis');

            sendResponse(res, 200, { error: false, message: 'Mail successfully send' });
        } catch (err) {
            if (err.message === 'You do not have the required permissions') sendResponse(res, 400, { error: true, code: '401002', message: err.message });
            else if (err.message === 'Missing important fields') sendResponse(res, 400, { error: true, code: '105301', message: err.message });
            else if (err.message === 'Invalid estimate id') sendResponse(res, 400, { error: true, code: '105302', message: err.message });
            else if (err.message === 'Invalid customer id') sendResponse(res, 400, { error: true, code: '105303', message: err.message });
            else errorHandler(res, err);
        }
    }

    /**
     * Fonction pour transformer un devis en facture (POST /estimate/transform/:estimateId)
     * @param req express Request
     * @param res express Response
     */
    static tranformEstimateToBill = async (req: Request, res: Response) => {
        try {
            // Vérification de si l'utilisateur à les permissions de faire la requête
            const hasPermission = globalUtils.checkPermission(userUtils.getRequestUser(req), 'user');
            if (!hasPermission) throw new Error('You do not have the required permissions');

            // Récupération de toutes les données du body
            const { estimateId } = req.params;

            // Vérification de si toutes les données nécessaire sont présentes
            if (!estimateId) throw new Error('Missing important fields');

            // Vérification de si le devis existe
            const estimate: EstimateI = await globalUtils.findOne(Estimate, estimateId);
            if (!estimate) throw new Error('Invalid estimate id');

            // Vérification de si le client existe
            const customer: ClientI = await globalUtils.findOne(Client, estimate.clientId as string);
            if (!customer) throw new Error('Invalid customer id');

            // Vérification de si le devis n'est pas déjà accepté
            if (estimate.status === 'Accepté') throw new Error('Invalid estimate status');

            // Création de la facture
            const data = {
                status: 'Non payée',
                billNum: await globalUtils.findNextNumber('FAC'),
                deadline: new Date().setDate(new Date().getDate() + 30),
                clientId: estimate.clientId,
                enterpriseId: estimate.enterpriseId,
                articles: estimate.articles,
                totalHT: estimate.totalHT,
                totalTTC: estimate.totalTTC,
            };
            const bill: BillI = await Bill.create(data);

            // Mise à jour du devis
            await globalUtils.updateOneById(Estimate, estimate._id, { status: 'Accepté' });

            // Envoi d'une notification
            sendNotificationToOne('Nouvelle facture', 'Une nouvelle facture à été émise en votre nom. Cliquez ici pour la consulter.', customer, bill._id, 'Facture');

            // Envoi de la réponse
            sendResponse(res, 200, { error: false, message: 'Estimate successfully transform', bill: billUtils.generateBillJSON(bill) });
        } catch (err) {
            if (err.message === 'You do not have the required permissions') sendResponse(res, 400, { error: true, code: '401002', message: err.message });
            else if (err.message === 'Missing important fields') sendResponse(res, 400, { error: true, code: '105351', message: err.message });
            else if (err.message === 'Invalid estimate id') sendResponse(res, 400, { error: true, code: '105352', message: err.message });
            else if (err.message === 'Invalid customer id') sendResponse(res, 400, { error: true, code: '105353', message: err.message });
            else if (err.message === 'Invalid estimate status') sendResponse(res, 400, { error: true, code: '105354', message: err.message });
            else errorHandler(res, err);
        }
    }
}
