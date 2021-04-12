import { Request, Response } from 'express';
import { errorHandler, sendResponse } from '../helpers/responseHelper';

export class ProjectController {

    /**
     * Fonction de récupération de tous les projets (GET /projects)
     * @param req express Request
     * @param res express Response
     */
    static getProjectsList = async (req: Request, res: Response) => {
        try {
            // Envoi de la réponse
            sendResponse(res, 200, { error: false, message: '' });
        } catch (err) {
            if (err.message === '') sendResponse(res, 400, { error: true, code: '', message: err.message });
            else errorHandler(res, err);
        }
    }

    /**
     * Fonction de récupération d'un projet (GET /project)
     * @param req express Request
     * @param res express Response
     */
    static getOneProject = async (req: Request, res: Response) => {
        try {
            // Envoi de la réponse
            sendResponse(res, 200, { error: false, message: '' });
        } catch (err) {
            if (err.message === '') sendResponse(res, 400, { error: true, code: '', message: err.message });
            else errorHandler(res, err);
        }
    }

    /**
     * Fonction de création du projet (POST /project)
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
     * Fonction de modification du projet (PUT /project)
     * @param req express Request
     * @param res express Response
     */
    static update = async (req: Request, res: Response) => {
        try {
            // Envoi de la réponse
            sendResponse(res, 200, { error: false, message: '' });
        } catch (err) {
            if (err.message === '') sendResponse(res, 400, { error: true, code: '', message: err.message });
            else errorHandler(res, err);
        }
    }

    /**
     * Fonction de suppression d'un projet (DELETE /project/:id)
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
