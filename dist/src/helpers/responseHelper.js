"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.sendResponse = void 0;
/**
 * Fontion d'envoi de réponse préfaite
 * @param res Réponse express
 * @param code Code à envoyer
 * @param body Body de la réponse
 */
var sendResponse = function (res, code, body) {
    res.status(code).send(body);
};
exports.sendResponse = sendResponse;
/**
 * Fontion d'envoi des erreurs non géré par l'api
 * @param res Réponse express
 * @param err Message d'erreur
 */
var errorHandler = function (res, err) {
    var errorMessage = { message: err.message, error: err };
    console.log(errorMessage);
    res.status(500).send({ error: true, message: 'Unexpected error', errorMessage: errorMessage });
};
exports.errorHandler = errorHandler;
