import { Request, Response } from 'express';
import { errorHandler, sendResponse } from '../helpers/responseHelper';
import VerifyData from '../helpers/verifyDataHelper';
import { UserExpenseI } from '../interfaces/userExpense';
import { UserI } from '../interfaces/userInterface';
import { User } from '../models/User';
import { UserExpense } from '../models/UserExpense';
import { globalUtils } from '../utils/globalUtils';
import { userExpenseUtils } from '../utils/userExpenseUtils';
import { userUtils } from '../utils/userUtils';

export class UserExpenseController {
    /**
     * Fonction de récupération de tous  (GET /expenses-employee)
     * @param req express Request
     * @param res express Response
     */
    static getUserExpensesList = async (req: Request, res: Response) => {
        try {
            // Récupération de l'utilisateur grâce au Authmiddleware qui rajoute le token dans req
            const user = userUtils.getRequestUser(req);

            // Vérification de si l'utilisateur à les permissions de faire la requête
            const hasPermission = globalUtils.checkPermission(user, 'user');
            if (!hasPermission) throw new Error('You do not have the required permissions');

            // Récupération de la liste des notes de frais
            const userExpenseList = await userExpenseUtils.getUserExpenseList(user);

            // Envoi de la réponse
            sendResponse(res, 200, { error: false, message: 'Successful expenses acquisition', expenses: userExpenseList });
        } catch (err) {
            if (err.message === 'You do not have the required permissions') sendResponse(res, 400, { error: true, code: '401002', message: err.message });
            else errorHandler(res, err);
        }
    }

    /**
     * Fonction de récupération d'une note de frais (GET /expense-employee/:id)
     * @param req express Request
     * @param res express Response
     */
    static getOneUserExpense = async (req: Request, res: Response) => {
        try {
            // Vérification de si l'utilisateur à les permissions de faire la requête
            const hasPermission = globalUtils.checkPermission(userUtils.getRequestUser(req), 'user');
            if (!hasPermission) throw new Error('You do not have the required permissions');

            // Récupération de toutes les données du body
            const { id } = req.params;

            // Vérification de si toutes les données nécessaire sont présentes
            if (!id) throw new Error('Missing id field');

            // Vérification de si la note de frais existe
            const userExpense: UserExpenseI = await globalUtils.findOne(UserExpense, id);
            if (!userExpense) throw new Error('Invalid expense id');

            // Envoi de la réponse
            sendResponse(res, 200, { error: false, message: 'Successful expense acquisition', expense: userExpenseUtils.generateUserExpenseJSON(userExpense) });
        } catch (err) {
            if (err.message === 'Missing id field') sendResponse(res, 400, { error: true, code: '107051', message: err.message });
            else if (err.message === 'Invalid expense id') sendResponse(res, 400, { error: true, code: '107052', message: err.message });
            else errorHandler(res, err);
        }
    }

    /**
     * Fonction de création (POST /expense-employee)
     * @param req express Request
     * @param res express Response
     */
    static create = async (req: Request, res: Response) => {
        try {
            // Récupération de l'utilisateur grâce au Authmiddleware qui rajoute le token dans req
            const user = userUtils.getRequestUser(req);

            // Vérification de si l'utilisateur à les permissions de faire la requête
            const hasPermission = globalUtils.checkPermission(user, 'user');
            if (!hasPermission) throw new Error('You do not have the required permissions');

            // Récupération de toutes les données du body
            const { userExpenseNum, price, category, file, description, accountNumber } = req.body;

            // Vérification de si toutes les données nécessaire sont présentes
            if (!userExpenseNum || accountNumber === undefined || price === undefined || !category) throw new Error('Missing important fields');

            // Vérification de la validité du numéro de facture
            if (!await VerifyData.validUserExpenseNumber(userExpenseNum)) throw new Error('Invalid expense number');

            // Vérification de la validité du numéro de compte
            if (!VerifyData.validAccountNumber(accountNumber)) throw new Error('Invalid account number');
            req.body.accountNumber = VerifyData.validAccountNumber(accountNumber);

            // Vérification de la validité du prix
            if (!VerifyData.validPrice(price)) throw new Error('Invalid price format');
            req.body.price = VerifyData.validPrice(price);

            // Création de la note de frais
            req.body.userId = user.data._id;
            const expense = await UserExpense.create(req.body);

            // Envoi de la réponse
            sendResponse(res, 200, { error: false, message: 'Expense successfully created', expense: userExpenseUtils.generateUserExpenseJSON(expense) });
        } catch (err) {
            if (err.message === 'You do not have the required permissions') sendResponse(res, 400, { error: true, code: '401002', message: err.message });
            else if (err.message === 'Missing important fields') sendResponse(res, 400, { error: true, code: '107101', message: err.message });
            else if (err.message === 'Invalid expense number') sendResponse(res, 400, { error: true, code: '107102', message: err.message });
            else if (err.message === 'Invalid account number') sendResponse(res, 400, { error: true, code: '107103', message: err.message });
            else if (err.message === 'Invalid price format') sendResponse(res, 400, { error: true, code: '107104', message: err.message });
            else errorHandler(res, err);
        }
    }

    /**
     * Fonction de suppression (DELETE /expense-employee/:id)
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

            // Vérification de si la note de frais existe
            const userExpense: UserExpenseI = await globalUtils.findOne(UserExpense, id);
            if (!userExpense) throw new Error('Invalid expense id');

            // Suppression de la note de frais
            await globalUtils.deleteOne(UserExpense, id);

            // Envoi de la réponse
            sendResponse(res, 200, { error: false, message: 'Expense successfully deleted' });
        } catch (err) {
            if (err.message === 'You do not have the required permissions') sendResponse(res, 400, { error: true, code: '401002', message: err.message });
            else if (err.message === '') sendResponse(res, 400, { error: true, code: '107151', message: err.message });
            else errorHandler(res, err);
        }
    }
}
