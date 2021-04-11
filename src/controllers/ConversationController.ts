import { Request, Response } from 'express';
import { errorHandler, sendResponse } from '../helpers/responseHelper';
import { ConvI } from '../interfaces/conversationInterface';
import { Conversation } from '../models/Conversation';
import { conversationUtils } from '../utils/conversationUtils';
import { globalUtils } from '../utils/globalUtils';
import { userUtils } from '../utils/userUtils';

export class ConversationController {
    /**
     * Fonction de récupération de toutes les conversation (GET /conversations)
     * @param req express Request
     * @param res express Response
     */
    static getConversationsList = async (req: Request, res: Response) => {
        try {
            // Récupération de l'utilisateur grâce au Authmiddleware qui rajoute le token dans req
            const user = userUtils.getRequestUser(req);

            // Récupération de la liste des conversations
            const conversationList = await conversationUtils.getConversationList(user.data._id);

            // Envoi de la réponse
            sendResponse(res, 200, { error: false, message: 'Successful conversations acquisition', conversations: conversationList });
        } catch (err) {
            errorHandler(res, err);
        }
    }

    /**
     * Fonction de création d'une conversation (GET /conversations)
     * @param req express Request
     * @param res express Response
     */
    static create = async (req: Request, res: Response) => {
        try {
            // Récupération de l'utilisateur grâce au Authmiddleware qui rajoute le token dans req
            const user = userUtils.getRequestUser(req);

            // Récupération de toutes les données du body
            const { userId } = req.body;

            // Vérification de si toutes les données nécessaire sont présentes
            if (!userId) throw new Error('Missing important fields');

            // Vérification que l'on ne créer pas une conversation avec sois même
            if (user.data._id.toString() === userId) throw new Error('Can\'t create conversation with yourself');

            // Vérification que l'utilisateur avec qui l'on crée la conversation existe bien
            const targetUser = await userUtils.findUser({ userId: userId });
            if (!targetUser) throw new Error('Invalid user id');

            // Vérification de si la conversation n'existe pas déjà
            const alreadyExiste = await conversationUtils.findConversation(user.data._id, userId);
            if (alreadyExiste) sendResponse(res, 200, { error: false, message: 'Conversation already exist', conversation: conversationUtils.generateConversationJSON(alreadyExiste) });
            else {
                // Si la conversation n'existe pas on la créer
                const conversation = await Conversation.create({ userId: user.data._id, userId1: userId });

                // Envoi de la réponse
                sendResponse(res, 200, { error: false, message: 'Conversation successfully created', conversation: conversationUtils.generateConversationJSON(conversation) });
            }
        } catch (err) {
            if (err.message === 'Missing important fields') sendResponse(res, 400, { error: true, code: '112101', message: err.message });
            else if (err.message === 'Can\'t create conversation with yourself') sendResponse(res, 400, { error: true, code: '112102', message: err.message });
            else if (err.message === 'Invalid user id') sendResponse(res, 400, { error: true, code: '112103', message: err.message });
            else errorHandler(res, err);
        }
    }

    /**
     * Fonction de suppression d'une conversation (GET /conversations)
     * @param req express Request
     * @param res express Response
     */
    static delete = async (req: Request, res: Response) => {
        try {
            // Récupération de toutes les données du body
            const { id } = req.params;

            // Vérification de si toutes les données nécessaire sont présentes
            if (!id) throw new Error('Missing id field');

            // Vérification de si l'utilisateur existe
            const conversation: ConvI = await globalUtils.findOne(Conversation, id);
            if (!conversation) throw new Error('Invalid conversation id');

            // Suppression du devis
            await globalUtils.deleteOne(Conversation, id);

            // Envoi de la réponse
            sendResponse(res, 200, { error: false, message: 'Conversation successfully deleted' });
        } catch (err) {
            if (err.message === 'You do not have the required permissions') sendResponse(res, 400, { error: true, code: '401002', message: err.message });
            else if (err.message === 'Missing id field') sendResponse(res, 400, { error: true, code: '112151', message: err.message });
            else if (err.message === 'Invalid conversation id') sendResponse(res, 400, { error: true, code: '112152', message: err.message });
            else errorHandler(res, err);
        }
    }
}
