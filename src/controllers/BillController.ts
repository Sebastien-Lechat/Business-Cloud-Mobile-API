import { Request, Response } from 'express';
import { sendMail } from '../helpers/emailHelper';
import { sendNotificationToOne } from '../helpers/notificationHelper';
import { errorHandler, sendResponse } from '../helpers/responseHelper';
import VerifyData from '../helpers/verifyDataHelper';
import { ArticleI } from '../interfaces/articleInterface';
import { BillArticleI, BillI } from '../interfaces/billInterface';
import { EnterpriseI } from '../interfaces/enterpriseInterface';
import { ClientI } from '../interfaces/userInterface';
import { Article } from '../models/Article';
import { Bill } from '../models/Bill';
import { Client } from '../models/Client';
import { Enterprise } from '../models/Entreprise';
import { sendBillModel } from '../templates/emailTemplate';
import { articleUtils } from '../utils/articleUtils';
import { billUtils } from '../utils/billUtils';
import { globalUtils } from '../utils/globalUtils';
import { userUtils } from '../utils/userUtils';
import { config } from 'dotenv';

config();

// const stripePublicKey: string = process.env.STRIPE_PUBLIC as string;
const stripePrivateKey: string = process.env.STRIPE_PRIVATE as string;

const stripe = require('stripe')(stripePrivateKey);
export class BillController {

    /**
     * Fonction de récupération de toutes les facture  (GET /bills)
     * @param req express Request
     * @param res express Response
     */
    static getBillsList = async (req: Request, res: Response) => {
        try {
            // Récupération de l'utilisateur grâce au Authmiddleware qui rajoute le token dans req
            const user = userUtils.getRequestUser(req);

            // Récupération de la liste des factures en fonction du rôle
            const billList = await billUtils.getBillList(user);

            // Envoi de la réponse
            sendResponse(res, 200, { error: false, message: 'Successful bills acquisition', bills: billList });
        } catch (err: any) {
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
            // Récupération de toutes les données du body
            const { id } = req.params;

            // Vérification de si toutes les données nécessaire sont présentes
            if (!id) throw new Error('Missing id field');

            // Récupération de l'utilisateur
            const bill = await globalUtils.findOneAndPopulate(Bill, id, ['articles.articleId']);
            if (!bill) throw new Error('Invalid bill id');

            // Envoi de la réponse
            sendResponse(res, 200, { error: false, message: 'Successful bill acquisition', bill: billUtils.generateBillJSON(bill) });
        } catch (err: any) {
            if (err.message === 'Invalid bill id') sendResponse(res, 400, { error: true, code: '104101', message: err.message });
            else errorHandler(res, err);
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
            const { status, clientId, enterpriseId, billNum, deadline, reduction } = req.body;

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

            req.body.articles = [];
            req.body.totalHT = 0;
            req.body.totalTTC = 0;

            // Création de la facture
            const bill: BillI = await Bill.create(req.body);

            // Envoi d'une notification
            sendNotificationToOne('Nouvelle facture', 'Une nouvelle facture à été émise en votre nom. Cliquez ici pour la consulter.', customer, bill._id, 'Facture');

            // Envoi de la réponse
            sendResponse(res, 200, { error: false, message: 'Bill successfully created', bill: billUtils.generateBillJSON(bill) });
        } catch (err: any) {
            if (err.message === 'You do not have the required permissions') sendResponse(res, 400, { error: true, code: '401002', message: err.message });
            else if (err.message === 'Missing important fields') sendResponse(res, 400, { error: true, code: '104151', message: err.message });
            else if (err.message === 'Invalid bill status') sendResponse(res, 400, { error: true, code: '104152', message: err.message });
            else if (err.message === 'Invalid customer id') sendResponse(res, 400, { error: true, code: '104153', message: err.message });
            else if (err.message === 'Invalid enterprise id') sendResponse(res, 400, { error: true, code: '104154', message: err.message });
            else if (err.message === 'Invalid bill number') sendResponse(res, 400, { error: true, code: '104155', message: err.message });
            else if (err.message === 'Invalid deadline') sendResponse(res, 400, { error: true, code: '104156', message: err.message });
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
            const { id, status, clientId, billNum, reduction, deadline } = req.body;
            const articles: Array<BillArticleI> = req.body.articles;

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

            // Vérification de la validité des articles et mise à jour du prix HT et TTC
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

            if (status) toUpdate.status = bill.status = status;
            if (clientId) toUpdate.clientId = bill.clientId = clientId;
            if (billNum) toUpdate.billNum = bill.billNum = billNum;
            if (articles) {
                toUpdate.articles = bill.articles = articles;
                toUpdate.totalHT = newTotalHT.toFixed(2);
                toUpdate.totalTTC = newTotalTTC.toFixed(2);
            }
            if (reduction) toUpdate.reduction = bill.reduction = reduction;
            if (deadline) toUpdate.deadline = bill.deadline = deadline;

            // Modification de la facture
            await globalUtils.updateOneById(Bill, id, toUpdate);

            // Récupération de la facture avec les articles
            const populateBill: BillI = await globalUtils.findOneAndPopulate(Bill, id, ['articles.articleId']);

            // Mise en forme
            populateBill.articles.map((article: BillArticleI) => {
                article.articleId = articleUtils.generateArticleJSON(article.articleId as ArticleI);
                return article;
            });

            // Envoi de la réponse
            sendResponse(res, 200, { error: false, message: 'Bill successfully updated', bill: billUtils.generateBillJSON(populateBill) });
        } catch (err: any) {
            if (err.message === 'You do not have the required permissions') sendResponse(res, 400, { error: true, code: '401002', message: err.message });
            else if (err.message === 'Missing id field') sendResponse(res, 400, { error: true, code: '104201', message: err.message });
            else if (err.message === 'Invalid bill id') sendResponse(res, 400, { error: true, code: '104202', message: err.message });
            else if (err.message === 'Invalid bill status') sendResponse(res, 400, { error: true, code: '104203', message: err.message });
            else if (err.message === 'Invalid customer id') sendResponse(res, 400, { error: true, code: '104204', message: err.message });
            else if (err.message === 'Invalid bill number') sendResponse(res, 400, { error: true, code: '104205', message: err.message });
            else if (err.message === 'Invalid deadline') sendResponse(res, 400, { error: true, code: '104206', message: err.message });
            else if (err.message === 'Invalid article format') sendResponse(res, 400, { error: true, code: '104207', message: err.message });
            else if (err.message === 'Some article id are invalid') sendResponse(res, 400, { error: true, code: '104208', message: err.message });
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

            // Vérification de si la facture existe
            const bill: BillI = await globalUtils.findOne(Bill, id);
            if (!bill) throw new Error('Invalid bill id');

            // Suppression de la facture
            await globalUtils.deleteOne(Bill, id);

            // Envoi de la réponse
            sendResponse(res, 200, { error: false, message: 'Bill successfully deleted' });
        } catch (err: any) {
            if (err.message === 'You do not have the required permissions') sendResponse(res, 400, { error: true, code: '401002', message: err.message });
            else if (err.message === 'Missing id field') sendResponse(res, 400, { error: true, code: '104251', message: err.message });
            else if (err.message === 'Invalid bill id') sendResponse(res, 400, { error: true, code: '104252', message: err.message });
            else errorHandler(res, err);
        }
    }

    /**
     * Fonction pour envoyer un mail de relance à un client  (POST /bill/:billId/customer/:clientId/mail)
     * @param req express Request
     * @param res express Response
     */
    static sendBillMail = async (req: Request, res: Response) => {
        try {
            // Vérification de si l'utilisateur à les permissions de faire la requête
            const hasPermission = globalUtils.checkPermission(userUtils.getRequestUser(req), 'user');
            if (!hasPermission) throw new Error('You do not have the required permissions');

            // Récupération de toutes les données du body
            const { billId, clientId } = req.params;

            // Vérification de si toutes les données nécessaire sont présentes
            if (!billId || !clientId) throw new Error('Missing important fields');

            // Vérification de si la facture existe
            const bill: BillI = await globalUtils.findOne(Bill, billId);
            if (!bill) throw new Error('Invalid bill id');

            // Vérification de si le client existe
            const customer: ClientI = await globalUtils.findOne(Client, clientId);
            if (!customer) throw new Error('Invalid customer id');

            // Génération de la facture
            const data = await globalUtils.generateInvoice('bill', bill._id);

            // Envoi du mail
            sendMail(customer.email, 'Relance payement facture',
                sendBillModel(customer.name, 'de la facture', bill.billNum, VerifyData.formatShortDate(new Date(bill.deadline)), bill.status === 'En retard'),
                { path: data?.file.path, num: bill.billNum }
            );

            // Envoi d'une notification
            sendNotificationToOne('Relance payement', 'Vous faites l\'objet d\'une relance de payement pour une facture. Veuillez cliquer ici pour la régler.', customer, bill._id, 'Facture');

            sendResponse(res, 200, { error: false, message: 'Mail successfully send' });
        } catch (err: any) {
            if (err.message === 'You do not have the required permissions') sendResponse(res, 400, { error: true, code: '401002', message: err.message });
            else if (err.message === 'Missing important fields') sendResponse(res, 400, { error: true, code: '104301', message: err.message });
            else if (err.message === 'Invalid bill id') sendResponse(res, 400, { error: true, code: '104302', message: err.message });
            else if (err.message === 'Invalid customer id') sendResponse(res, 400, { error: true, code: '104303', message: err.message });
            else errorHandler(res, err);
        }
    }

    /**
     * Fonction pour retourner les informations de payement d'une facture  (POST /bill/payment-sheet)
     * @param req express Request
     * @param res express Response
     */
    static paymentSheet = async (req: Request, res: Response) => {
        try {
            // Vérification de si l'utilisateur à les permissions de faire la requête
            const hasPermission = globalUtils.checkPermission(userUtils.getRequestUser(req), 'client');
            if (!hasPermission) throw new Error('You do not have the required permissions');

            // Récupération de toutes les données du body
            const { amount } = req.body;

            // Vérification de si toutes les données nécessaire sont présentes
            if (!amount) throw new Error('Missing important fields');

            const customer = await stripe.customers.create();

            const ephemeralKey = await stripe.ephemeralKeys.create(
                { customer: customer.id },
                { apiVersion: '2020-08-27' }
            );

            const paymentIntent = await stripe.paymentIntents.create({
                amount: billUtils.getBillAmount(amount),
                currency: 'eur',
                customer: customer.id,
            });

            // Envoi de la réponse
            res.json({
                paymentIntent: paymentIntent.client_secret,
                ephemeralKey: ephemeralKey.secret,
                customer: customer.id
            });
        } catch (err: any) {
            if (err.message === 'You do not have the required permissions') sendResponse(res, 400, { error: true, code: '401002', message: err.message });
            else if (err.message === 'Missing important fields') sendResponse(res, 400, { error: true, code: '104351', message: err.message });
            else errorHandler(res, err);
        }
    }

    /**
     * Fonction pour payer une facture (POST /bill/payment/:id)
     * @param req express Request
     * @param res express Response
     */
    static payBill = async (req: Request, res: Response) => {
        try {
            // Vérification de si l'utilisateur à les permissions de faire la requête
            const hasPermission = globalUtils.checkPermission(userUtils.getRequestUser(req), 'client');
            if (!hasPermission) throw new Error('You do not have the required permissions');

            // Récupération de toutes les données du body
            const { id } = req.params;

            // Vérification de si toutes les données nécessaire sont présentes
            if (!id) throw new Error('Missing important fields');

            // Vérification de si la facture existe
            const bill: BillI = await globalUtils.findOne(Bill, id);
            if (!bill) throw new Error('Invalid bill id');

            // Vérification de si la facture n'est pas déjà payée
            if (bill.status === 'Payée') throw new Error('Invalid bill status');

            // Création des données existante à modifier
            const toUpdate: any = {
                status: 'Payée',
                amountPaid: bill.totalTTC,
                payementDate: new Date(),
            };

            // Modification de la facture
            await globalUtils.updateOneById(Bill, id, toUpdate);

            // Récupération de la facture avec les articles
            const populateBill: BillI = await globalUtils.findOneAndPopulate(Bill, id, ['articles.articleId']);

            // Mise en forme
            populateBill.articles.map((article: BillArticleI) => {
                article.articleId = articleUtils.generateArticleJSON(article.articleId as ArticleI);
                return article;
            });

            // Envoi de la réponse
            sendResponse(res, 200, { error: false, message: 'Bill successfully payed', bill: billUtils.generateBillJSON(populateBill) });
        } catch (err: any) {
            if (err.message === 'You do not have the required permissions') sendResponse(res, 400, { error: true, code: '401002', message: err.message });
            else if (err.message === 'Missing important fields') sendResponse(res, 400, { error: true, code: '104401', message: err.message });
            else if (err.message === 'Invalid bill id') sendResponse(res, 400, { error: true, code: '104402', message: err.message });
            else if (err.message === 'Invalid bill status') sendResponse(res, 400, { error: true, code: '104403', message: err.message });
            else errorHandler(res, err);
        }
    }
}
