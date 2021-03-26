import { Response } from "express";

/**
 * Fontion d'envoi de réponse préfaite
 * @param res 
 * @param code 
 * @param body 
 */
const sendResponse = (res: Response, code: number, body: Object) => {
    res.status(code).send(body);
}

export { sendResponse }