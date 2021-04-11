import { ConvI, ConvJsonI } from '../interfaces/conversationInterface';
import { Conversation } from '../models/Conversation';

/**
 * Fonction de récupération des conversation d'un utilisateur
 * @param id Id de l'utilisateur
 * @returns Les conversation ou [] si l'utilisateur n'en a pas
 */
const getConversationList = async (id: string): Promise<ConvJsonI[]> => {
    const allConversationList: ConvJsonI[] = [];

    // On regarde dans la première possibilité d'id si la conversation existe
    const case1: ConvI[] = await Conversation.find({ userId: id });
    case1.map((conversation: ConvI) => {
        allConversationList.push(conversationUtils.generateConversationJSON(conversation));
    });

    // On regarde dans la deuxième possibilité d'id si la conversation existe
    const case2: ConvI[] = await Conversation.find({ userId1: id });
    case2.map((conversation: ConvI) => {
        allConversationList.push(conversationUtils.generateConversationJSON(conversation));
    });

    return allConversationList;
};

/**
 * Fonction de récupération d'une conversation entre 2 utilisateurs
 * @param userId Id du premier utilisateur
 * @param userId1 Id du second utilisateur
 * @returns La conversation ou null si elle n'existe pas
 */
const findConversation = async (userId: string, userId1: string): Promise<ConvI | null> => {
    // On regarde dans les deux possibilité d'id si la conversation existe
    const case1 = await Conversation.findOne({ userId: userId, userId1: userId1 });
    if (case1) return case1;
    const case2 = await Conversation.findOne({ userId: userId1, userId1: userId });
    if (case2) return case2;
    return null;
};

/**
 * Fonction générer le JSON de réponse d'un devis.
 * @param estimate Devis pour laquelle on génère le JSON
 * @return Retourne le JSON
 */
const generateConversationJSON = (conversation: ConvI): ConvJsonI => {
    const toReturn = {
        id: conversation._id,
        userId: conversation.userId,
        userId1: conversation.userId1,
        createdAt: conversation.createdAt,
        updatedAt: conversation.updatedAt,
    };

    return toReturn;
};

const conversationUtils = {
    getConversationList,
    findConversation,
    generateConversationJSON
};

export { conversationUtils };

