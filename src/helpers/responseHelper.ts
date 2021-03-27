import { Response } from 'express';

/**
 * Fontion d'envoi de réponse préfaite
 * @param res Réponse express
 * @param code Code à envoyer
 * @param body Body de la réponse
 */
const sendResponse = (res: Response, code: number, body: object) => {
    res.status(code).send(body);
};

export { sendResponse };
