import { Request, Response } from 'express';
import { errorHandler, sendResponse } from '../helpers/responseHelper';

export class TaskController {
    /**
     * Fonction de récupération de toutes les tâches (GET /tasks)
     * @param req express Request
     * @param res express Response
     */
    static getTasksList = async (req: Request, res: Response) => {
        try {
            // Envoi de la réponse
            sendResponse(res, 200, { error: false, message: '' });
        } catch (err) {
            if (err.message === '') sendResponse(res, 400, { error: true, code: '', message: err.message });
            else errorHandler(res, err);
        }
    }

    /**
     * Fonction de création d'une tâche (POST /task)
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
     * Fonction de suppression d'une tâche (DELETE /task/:id)
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
