import mongoose from 'mongoose';
import { ConvI, ConvJsonI } from '../interfaces/conversationInterface';
import { MessageI } from '../interfaces/messageInterface';
import { Conversation } from '../models/Conversation';
import { Message } from '../models/Message';

/**
 * Fonction de récupération des conversation d'un utilisateur
 * @param id Id de l'utilisateur
 * @returns Les conversation ou [] si l'utilisateur n'en a pas
 */
const getConversationList = async (id: string): Promise<ConvJsonI[]> => {
    const allConversationList: ConvJsonI[] = [];

    // On récupère toutes les conversations en fonction de toutes les possibilités
    const conversations: ConvI[] = await Conversation.find({
        $or: [
            { 'member1.user': mongoose.Types.ObjectId(id) },
            { 'member2.user': mongoose.Types.ObjectId(id) }
        ]
    }).populate('member1.user', { _id: 1, name: 1 }).populate('member2.user', { _id: 1, name: 1 }).sort({ updatedAt: -1 });

    conversations.map((conversation: ConvI) => {
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
    const case1 = await Conversation.findOne({ 'member1.user': mongoose.Types.ObjectId(userId), 'member2.user': mongoose.Types.ObjectId(userId1) }).populate('member1.user', { _id: 1, name: 1 }).populate('member2.user', { _id: 1, name: 1 });
    if (case1) return case1;
    const case2 = await Conversation.findOne({ 'member1.user': mongoose.Types.ObjectId(userId1), 'member2.user': mongoose.Types.ObjectId(userId) }).populate('member1.user', { _id: 1, name: 1 }).populate('member2.user', { _id: 1, name: 1 });
    if (case2) return case2;

    return null;
};

/**
 * Fonction générer le JSON de réponse d'un devis.
 * @param conversation Conversation pour laquelle on génère le JSON
 * @return Retourne le JSON
 */
const generateConversationJSON = (conversation: ConvI): ConvJsonI => {
    const toReturn = {
        id: conversation._id,
        member1: conversation.member1,
        member2: conversation.member2,
        createdAt: conversation.createdAt,
        updatedAt: conversation.updatedAt,
        lastMessage: conversation.lastMessage,
    };

    return toReturn;
};

/**
 * Fonction trouver une conversation et la populate.
 * @param conversationId ID de la conversation
 * @return Retourne la conversation ou null
 */
const findAndPopulateConv = async (conversationId: string): Promise<ConvI | null> => {
    return await Conversation.findOne({ _id: mongoose.Types.ObjectId(conversationId) }).populate('member1.user', { _id: 1, name: 1, socketToken: 1 }).populate('member2.user', { _id: 1, name: 1, socketToken: 1 });
};

/**
 * Fonction trouver les messages d'une conversation.
 * @param conversationId ID de la conversation
 * @return Retourne un tableau de message
 */
const findAllConvMessage = async (conversationId: string): Promise<MessageI[] | []> => {
    const messages = await Message.find({ conversationId: mongoose.Types.ObjectId(conversationId) }, { _id: 0, __v: 0 });
    return messages.length !== 0 ? messages : [];
};

/**
 * Fonction mettre en lu les messages d'une conversation.
 * @param conversationId ID de la conversation
 * @param userId ID de l'utilisateur
 */
const updateAllMessageSeen = async (conversationId: string, userId: string): Promise<void> => {
    await Message.updateMany({ conversationId: mongoose.Types.ObjectId(conversationId), userId: { $ne: mongoose.Types.ObjectId(userId) } }, { $set: { seen: true } });
};

const conversationUtils = {
    getConversationList,
    findConversation,
    findAllConvMessage,
    updateAllMessageSeen,
    findAndPopulateConv,
    generateConversationJSON
};

export { conversationUtils };

