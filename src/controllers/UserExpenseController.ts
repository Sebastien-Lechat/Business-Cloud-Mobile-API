import { Request, Response } from 'express';
import { errorHandler, sendResponse } from '../helpers/responseHelper';

export class UserExpenseController {
    /**
     * Fonction de récupération de tous  (GET /expenses-employee)
     * @param req express Request
     * @param res express Response
     */
    static getUserExpensesList = async (req: Request, res: Response) => {
        try {
            // Envoi de la réponse
            sendResponse(res, 200, { error: false, message: '' });
        } catch (err) {
            if (err.message === '') sendResponse(res, 400, { error: true, code: '', message: err.message });
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
            // Envoi de la réponse
            sendResponse(res, 200, { error: false, message: '' });
        } catch (err) {
            if (err.message === '') sendResponse(res, 400, { error: true, code: '', message: err.message });
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
            // Envoi de la réponse
            sendResponse(res, 200, { error: false, message: '' });
        } catch (err) {
            if (err.message === '') sendResponse(res, 400, { error: true, code: '', message: err.message });
            else errorHandler(res, err);
        }
    }
}
