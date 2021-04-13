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

/**
 * Fontion d'envoi des erreurs non géré par l'api
 * @param res Réponse express
 * @param err Message d'erreur
 */
const errorHandler = (res: Response, err: any) => {
    console.log(err);
    res.status(500).send({ error: true, message: 'Unexpected error', err });
};

export { sendResponse, errorHandler };
