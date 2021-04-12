import { Request, Response } from 'express';
import { errorHandler, sendResponse } from '../helpers/responseHelper';
import VerifyData from '../helpers/verifyDataHelper';
import { ArticleI } from '../interfaces/articleInterface';
import { Article } from '../models/Article';
import { articleUtils } from '../utils/articleUtils';
import { globalUtils } from '../utils/globalUtils';
import { userUtils } from '../utils/userUtils';

export class ArticleController {
    /**
     * Fonction de récupération de tous les articles  (GET /articles)
     * @param req express Request
     * @param res express Response
     */
    static getArticlesList = async (req: Request, res: Response) => {
        try {
            // Vérification de si l'utilisateur à les permissions de faire la requête
            const hasPermission = globalUtils.checkPermission(userUtils.getRequestUser(req), 'user');
            if (!hasPermission) throw new Error('You do not have the required permissions');

            // Récupération de la liste des articles
            const articleListe = await articleUtils.getArticleList();

            // Envoi de la réponse
            sendResponse(res, 200, { error: false, message: 'Successful articles acquisition', articles: articleListe });
        } catch (err) {
            errorHandler(res, err);
        }
    }

    /**
     * Fonction de création d'un article (POST /article)
     * @param req express Request
     * @param res express Response
     */
    static create = async (req: Request, res: Response) => {
        try {
            // Vérification de si l'utilisateur à les permissions de faire la requête
            const hasPermission = globalUtils.checkPermission(userUtils.getRequestUser(req), 'user');
            if (!hasPermission) throw new Error('You do not have the required permissions');

            // Récupération de toutes les données du body
            const { name, accountNumber, price, tva } = req.body;

            // Vérification de si toutes les données nécessaire sont présentes
            if (!name || !accountNumber === undefined || price === undefined || tva === undefined) throw new Error('Missing important fields');

            // Vérification de la validité du numéro de compte
            if (!VerifyData.validAccountNumber(accountNumber)) throw new Error('Invalid account number');
            req.body.accountNumber = VerifyData.validAccountNumber(accountNumber);

            // Vérification de la validité du prix
            if (!VerifyData.validPrice(price)) throw new Error('Invalid price format');
            req.body.price = VerifyData.validPrice(price);

            // Vérification de la validité de la tva
            if (!VerifyData.validTaxe(tva)) throw new Error('Invalid tva format');
            req.body.tva = VerifyData.validTaxe(tva);

            // Création de l'article
            const article: ArticleI = await Article.create(req.body);

            // Envoi de la réponse
            sendResponse(res, 200, { error: false, message: 'Article successfully created', article: articleUtils.generateArticleJSON(article) });
        } catch (err) {
            if (err.message === 'Missing important fields') sendResponse(res, 400, { error: true, code: '106101', message: err.message });
            else if (err.message === 'Invalid account number') sendResponse(res, 400, { error: true, code: '106102', message: err.message });
            else if (err.message === 'Invalid price format') sendResponse(res, 400, { error: true, code: '106103', message: err.message });
            else if (err.message === 'Invalid tva format') sendResponse(res, 400, { error: true, code: '106104', message: err.message });
            else errorHandler(res, err);
        }
    }

    /**
     * Fonction de suppression d'un article (DELETE /article/:id)
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
            const article: ArticleI = await globalUtils.findOne(Article, id);
            if (!article) throw new Error('Invalid article id');

            // Suppression de l'article
            await globalUtils.deleteOne(Article, id);

            // Envoi de la réponse
            sendResponse(res, 200, { error: false, message: 'Article successfully deleted' });
        } catch (err) {
            if (err.message === 'You do not have the required permissions') sendResponse(res, 400, { error: true, code: '401002', message: err.message });
            else if (err.message === 'Missing id field') sendResponse(res, 400, { error: true, code: '106151', message: err.message });
            else if (err.message === 'Invalid article id') sendResponse(res, 400, { error: true, code: '106152', message: err.message });
            else errorHandler(res, err);
        }
    }
}
