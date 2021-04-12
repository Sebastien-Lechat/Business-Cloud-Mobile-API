import { Request, Response } from 'express';
import { errorHandler, sendResponse } from '../helpers/responseHelper';

export class TimeController {
    /**
     * Fonction de récupération de tous les temps (GET /times)
     * @param req express Request
     * @param res express Response
     */
    static getTimesList = async (req: Request, res: Response) => {
        try {
            // Envoi de la réponse
            sendResponse(res, 200, { error: false, message: '' });
        } catch (err) {
            if (err.message === '') sendResponse(res, 400, { error: true, code: '', message: err.message });
            else errorHandler(res, err);
        }
    }

    /**
     * Fonction de création d'un temps (POST /time)
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
     * Fonction de suppression d'un temps (DELETE /time/:id)
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
