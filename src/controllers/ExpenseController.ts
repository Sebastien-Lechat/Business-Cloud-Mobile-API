import { Request, Response } from 'express';
import { errorHandler, sendResponse } from '../helpers/responseHelper';

export class ExpenseController {
    /**
     * Fonction de récupération de toutes les dépenses  (GET /expenses)
     * @param req express Request
     * @param res express Response
     */
    static getExpensesList = async (req: Request, res: Response) => {
        try {
            // Envoi de la réponse
            sendResponse(res, 200, { error: false, message: '' });
        } catch (err) {
            if (err.message === '') sendResponse(res, 400, { error: true, code: '', message: err.message });
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
            // Envoi de la réponse
            sendResponse(res, 200, { error: false, message: '' });
        } catch (err) {
            if (err.message === '') sendResponse(res, 400, { error: true, code: '', message: err.message });
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
            // Envoi de la réponse
            sendResponse(res, 200, { error: false, message: '' });
        } catch (err) {
            if (err.message === '') sendResponse(res, 400, { error: true, code: '', message: err.message });
            else errorHandler(res, err);
        }
    }
}
