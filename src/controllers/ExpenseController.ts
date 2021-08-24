import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { errorHandler, sendResponse } from '../helpers/responseHelper';
import VerifyData from '../helpers/verifyDataHelper';
import { ExpenseI } from '../interfaces/expenseInterface';
import { ProjectI } from '../interfaces/projectInterface';
import { UserI } from '../interfaces/userInterface';
import { Expense } from '../models/Expense';
import { Project } from '../models/Project';
import { User } from '../models/User';
import { expenseUtils } from '../utils/expenseUtils';
import { globalUtils } from '../utils/globalUtils';
import { projectUtils } from '../utils/projectUtils';
import { userUtils } from '../utils/userUtils';

export class ExpenseController {
    /**
     * Fonction de récupération de toutes les dépenses  (GET /expenses/:projectId)
     * @param req express Request
     * @param res express Response
     */
    static getExpensesList = async (req: Request, res: Response) => {
        try {
            // Vérification de si l'utilisateur à les permissions de faire la requête
            const hasPermission = globalUtils.checkPermission(userUtils.getRequestUser(req), 'user');
            if (!hasPermission) throw new Error('You do not have the required permissions');

            // Récupération de toutes les données du body
            const { projectId } = req.params;

            if (projectId) {
                // vérification de si le projet existe bien
                const project: ProjectI = await globalUtils.findOne(Project, projectId);
                if (!project) throw new Error('Invalid project id');

                // Récupération de la liste des dépenses
                const expenseList = await expenseUtils.getExpenseList(projectId);

                // Envoi de la réponse
                sendResponse(res, 200, { error: false, message: 'Successful expenses acquisition', expenses: expenseList });
            } else {
                // Récupération de la liste des dépenses
                const expenseList = await expenseUtils.getExpenseList();

                // Envoi de la réponse
                sendResponse(res, 200, { error: false, message: 'Successful expenses acquisition', expenses: expenseList });
            }
        } catch (err) {
            if (err.message === 'You do not have the required permissions') sendResponse(res, 400, { error: true, code: '401002', message: err.message });
            else if (err.message === 'Invalid project id') sendResponse(res, 400, { error: true, code: '111001', message: err.message });
            else errorHandler(res, err);
        }
    }

    /**
     * Fonction de récupération d'une dépense (GET /expense/:id)
     * @param req express Request
     * @param res express Response
     */
    static getOneExpense = async (req: Request, res: Response) => {
        try {
            // Vérification de si l'utilisateur à les permissions de faire la requête
            const hasPermission = globalUtils.checkPermission(userUtils.getRequestUser(req), 'user');
            if (!hasPermission) throw new Error('You do not have the required permissions');

            // Récupération de toutes les données du body
            const { id } = req.params;

            // Vérification de si toutes les données nécessaire sont présentes
            if (!id) throw new Error('Missing id field');

            // Vérification de si la dépense existe
            const expense: ExpenseI = await globalUtils.findOne(Expense, id);
            if (!expense) throw new Error('Invalid expense id');

            // Envoi de la réponse
            sendResponse(res, 200, { error: false, message: 'Successful expense acquisition', expense: expenseUtils.generateExpenseJSON(expense) });
        } catch (err) {
            if (err.message === 'Missing id field') sendResponse(res, 400, { error: true, code: '111051', message: err.message });
            else if (err.message === 'Invalid expense id') sendResponse(res, 400, { error: true, code: '111052', message: err.message });
            else errorHandler(res, err);
        }
    }

    /**
     * Fonction de création d'une dépense (POST /expense)
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
            const { expenseNum, price, category, file, description, projectId, accountNumber, billable } = req.body;

            // Vérification de si toutes les données nécessaire sont présentes
            if (!expenseNum || accountNumber === undefined || price === undefined || !category) throw new Error('Missing important fields');

            // Vérification de la validité du numéro de facture
            if (!await VerifyData.validExpenseNumber(expenseNum)) throw new Error('Invalid expense number');

            // Vérification de la validité du numéro de compte
            if (!VerifyData.validAccountNumber(accountNumber)) throw new Error('Invalid account number');
            req.body.accountNumber = VerifyData.validAccountNumber(accountNumber);

            // Vérification de la validité du prix
            if (!VerifyData.validPrice(price)) throw new Error('Invalid price format');
            req.body.price = VerifyData.validPrice(price);

            // Vérification de la validité du champs facturable
            if (billable && billable !== true && billable !== false) throw new Error('Invalid billable format');

            let expense;

            // Vérification de si le projet existe bien
            if (projectId) {
                const project = await Project.findOne({ _id: mongoose.Types.ObjectId(projectId) });
                if (!project) throw new Error('Invalid project id');

                // Création de la note de frais
                req.body.userId = user.data._id;
                expense = await Expense.create(req.body);

                await projectUtils.updateProjectBilling(projectId);
            } else {
                // Création de la note de frais
                req.body.userId = user.data._id;
                expense = await Expense.create(req.body);
            }

            // Envoi de la réponse
            sendResponse(res, 200, { error: false, message: 'Expense successfully created', expense: expenseUtils.generateExpenseJSON(expense) });
        } catch (err) {
            if (err.message === 'You do not have the required permissions') sendResponse(res, 400, { error: true, code: '401002', message: err.message });
            else if (err.message === 'Missing important fields') sendResponse(res, 400, { error: true, code: '111101', message: err.message });
            else if (err.message === 'Invalid expense number') sendResponse(res, 400, { error: true, code: '111102', message: err.message });
            else if (err.message === 'Invalid account number') sendResponse(res, 400, { error: true, code: '111103', message: err.message });
            else if (err.message === 'Invalid price format') sendResponse(res, 400, { error: true, code: '111104', message: err.message });
            else if (err.message === 'Invalid billable format') sendResponse(res, 400, { error: true, code: '111105', message: err.message });
            else if (err.message === 'Invalid project id') sendResponse(res, 400, { error: true, code: '111106', message: err.message });
            else errorHandler(res, err);
        }
    }

    /**
     * Fonction de modification d'une dépense (PUT /expense)
     * @param req express Request
     * @param res express Response
     */
    static update = async (req: Request, res: Response) => {
        try {
            // Récupération de l'utilisateur grâce au Authmiddleware qui rajoute le token dans req
            const user = userUtils.getRequestUser(req);

            // Vérification de si l'utilisateur à les permissions de faire la requête
            const hasPermission = globalUtils.checkPermission(user, 'user');
            if (!hasPermission) throw new Error('You do not have the required permissions');

            // Récupération de toutes les données du body
            const { id, billable } = req.body;

            // Vérification de si toutes les données nécessaire sont présentes
            if (!id || billable === undefined) throw new Error('Missing important fields');

            // Vérification de si la dépense existe
            const expense: ExpenseI = await globalUtils.findOne(Expense, id);
            if (!expense) throw new Error('Invalid expense id');

            // Vérification de la validité du champs facturable
            if (billable && billable !== true && billable !== false) throw new Error('Invalid billable format');

            // Création de la tâche
            await globalUtils.updateOneById(Expense, id, { billable: billable });

            // Mise à jour des dépenses et du temps facturable
            if (expense.projectId) await projectUtils.updateProjectBilling(expense.projectId);

            // Envoi de la réponse
            sendResponse(res, 200, { error: false, message: 'Time successfully updated', expense: expenseUtils.generateExpenseJSON(expense) });
        } catch (err) {
            if (err.message === 'You do not have the required permissions') sendResponse(res, 400, { error: true, code: '401002', message: err.message });
            else if (err.message === 'Missing important fields') sendResponse(res, 400, { error: true, code: '111151', message: err.message });
            else if (err.message === 'Invalid expense id') sendResponse(res, 400, { error: true, code: '111152', message: err.message });
            else if (err.message === 'Invalid billable format') sendResponse(res, 400, { error: true, code: '111153', message: err.message });
            else errorHandler(res, err);
        }
    }

    /**
     * Fonction de suppression d'une dépense (DELETE /expense/:id)
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

            // Vérification de si la dépense existe
            const expense: ExpenseI = await globalUtils.findOne(Expense, id);
            if (!expense) throw new Error('Invalid expense id');

            // Suppression de la dépense
            await globalUtils.deleteOne(Expense, id);

            // Mise à jour des dépenses et du temps facturable
            if (expense.projectId) await projectUtils.updateProjectBilling(expense.projectId);

            // Envoi de la réponse
            sendResponse(res, 200, { error: false, message: 'Expense successfully deleted' });
        } catch (err) {
            if (err.message === 'You do not have the required permissions') sendResponse(res, 400, { error: true, code: '401002', message: err.message });
            else if (err.message === 'Missing id field') sendResponse(res, 400, { error: true, code: '111201', message: err.message });
            else if (err.message === 'Invalid expense id') sendResponse(res, 400, { error: true, code: '111202', message: err.message });
            else errorHandler(res, err);
        }
    }
}
