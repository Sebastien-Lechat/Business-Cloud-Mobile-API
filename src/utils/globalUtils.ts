import mongoose from 'mongoose';
import { UserObject } from '../interfaces/userInterface';

/**
 * Fonction de vérification des permissions pour une requête
 * @param user Utilisateur qui fait la requête
 * @param type Type requis pour faire la requête
 * @param admin Rôle requis pour faire la requête
 * @returns Retourne un booléen de si l'email existe ou non
 */
const checkPermission = (user: UserObject, type: 'user' | 'client', admin?: boolean): boolean => {
    if (user.type === 'client') {
        if (type === 'client') return true;
        else return false;
    } else if (user.type === 'user') {
        if (type === 'client') return true;
        else if (type === 'user' && admin && user.data.role === 'Gérant') return true;
        else if (type === 'user' && admin && user.data.role !== 'Gérant') return false;
        else return true;
    } else return false;
};

/**
 * Fonction pour trouver un document dans une collection.
 * @param model Modèle mongoose
 * @param id Id pour filtrer
 * @param updateData Données à mettre à jour
 */
const findOne = async (model: mongoose.Model<any, any>, id: string): Promise<any> => {
    if (id.length !== 24) return null;
    return await model.findOne({ _id: mongoose.Types.ObjectId(id) });
};

/**
 * Fonction pour trouver un document dans une collection et le populate.
 * @param model Modèle mongoose
 * @param id Id pour filtrer
 * @param populate Données à populate
 */
const findOneAndPopulate = async (model: mongoose.Model<any, any>, id: string, populate: string[]): Promise<any> => {
    if (id.length !== 24) return null;
    return await model.findOne({ _id: mongoose.Types.ObjectId(id) }).populate(populate);
};

/**
 * Fonction pour trouver plusieurs documents dans une collection en fonction d'un filtre.
 * @param model Modèle mongoose
 * @param filter Filtre
 */
const findMany = async (model: mongoose.Model<any, any>, filter: any): Promise<any> => {
    return await model.find(filter);
};

/**
 * Fonction pour trouver plusieurs documents dans une collectionen fonction d'un filtre.
 * @param model Modèle mongoose
 * @param filter Filtre
 * @param populate Données à populate
 */
const findManyAndPopulate = async (model: mongoose.Model<any, any>, filter: any, populate: string[]): Promise<any> => {
    return await model.find(filter).populate(populate);
};

/**
 * Fonction pour mettre à jour un document dans une collection.
 * @param model Modèle mongoose
 * @param filter filtre
 * @param updateData Données à mettre à jour
 */
const updateOne = async (model: mongoose.Model<any, any>, filter: any, updateData: object): Promise<any> => {
    return await model.updateOne(filter, { $set: updateData });
};

/**
 * Fonction pour mettre à jour un document dans une collection.
 * @param model Modèle mongoose
 * @param id Id pour filtrer
 * @param updateData Données à mettre à jour
 */
const updateOneById = async (model: mongoose.Model<any, any>, id: string, updateData: any): Promise<any> => {
    if (id.length !== 24) return null;
    return await model.updateOne({ _id: mongoose.Types.ObjectId(id) }, { $set: updateData });
};

/**
 * Fonction pour supprimer un document dans une collection.
 * @param model Modèle mongoose
 * @param id Id pour filtrer
 */
const deleteOne = async (model: mongoose.Model<any, any>, id: string): Promise<any> => {
    if (id.length !== 24) return null;
    return await model.deleteOne({ _id: mongoose.Types.ObjectId(id) });
};

const globalUtils = {
    findOne,
    findOneAndPopulate,
    findMany,
    findManyAndPopulate,
    updateOne,
    updateOneById,
    deleteOne,
    checkPermission
};

export { globalUtils };
