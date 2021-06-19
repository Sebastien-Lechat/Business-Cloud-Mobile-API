import { config } from 'dotenv';
import { Request } from 'express';
import jsonwebtoken from 'jsonwebtoken';
import mongoose from 'mongoose';
import { HistoryI } from '../interfaces/globalInterface';
import { ClientI, EmployeeJsonI, ShortUserListI, UserI, UserJsonI, UserObject, UserUpdateI } from '../interfaces/userInterface';
import { Client } from '../models/Client';
import { History } from '../models/History';
import { User } from '../models/User';

config();

const JWT_KEY: string = process.env.JWT_KEY as string;

/**
 * Fonction de vérification de si l'email existe déjà
 * @param emailToFind Email à vérifier si elle existe déjà ou non
 * @returns Retourne un booléen de si l'email existe ou non
 */
const emailAlreadyExist = async (emailToFind: string): Promise<boolean> => {
    const alreadyExistC = await Client.findOne({ email: emailToFind });
    const alreadyExistU = await User.findOne({ email: emailToFind });
    return (alreadyExistC || alreadyExistU) ? true : false;
};

/**
 * Fonction pour trouver un utilisateur
 * @param userEmail Email pour trouver un utilisateur en base de données
 * @param userId ID pour trouver un utilisateur en base de données
 * @param token Token pour trouver un utilisateur en base de données
 * @returns Retourne l'utilisateur si il est enregistré en base, sinon on retourne null
 */
const findUser = async (option: { userEmail?: string, userId?: string, token?: string }): Promise<UserObject | null> => {
    if (option.userId && option.userId.toString().length !== 24) return null;

    let query: any;
    if (option.userId && option.userEmail && option.token) query = { _id: mongoose.Types.ObjectId(option.userId), email: option.userEmail, token: option.token };
    else if (option.userId && option.userEmail) query = { _id: mongoose.Types.ObjectId(option.userId), email: option.userEmail, token: option.token };
    else if (option.userId) query = { _id: mongoose.Types.ObjectId(option.userId) };
    else if (option.userEmail) query = { email: option.userEmail };

    const alreadyExistC: ClientI = await Client.findOne(query);
    const alreadyExistU: UserI = await User.findOne(query).populate('enterprise', { __v: 0 });
    return (alreadyExistC) ? { data: alreadyExistC, type: 'client' } : (alreadyExistU) ? { data: alreadyExistU, type: 'user' } : null;
};

/**
 * Fonction pour trouver l'historique d'un utilisateur
 * @param userId ID de l'utilisateur
 * @returns Retourne l'historique d'action de l'utilisateur si il en a un
 */
const findUserHistory = async (userId: string): Promise<HistoryI[]> => {
    const histories: HistoryI[] = await History.find({ userId: mongoose.Types.ObjectId(userId) }, { __v: 0 }).sort({ createdAt: -1 });
    return histories;
};

/**
 * Fonction pour retourner la liste des utilisateur en fonction du rôle.
 * @param user Utilisateur pour lequel on génère la liste
 */
const getUsersList = async (user: UserObject): Promise<ShortUserListI[]> => {
    const userList: ShortUserListI[] = [];
    if (user.type === 'client') {
        // Pour un client réucpération du gérant
        userList.push(generateShortUserJSON({ data: await User.findOne({ role: 'Gérant' }), type: 'user' }));

        // Et de son employé référent si il en a un
        if ((user.data as ClientI).userId) userList.push(generateShortUserJSON({ data: await User.findOne({ _id: (user.data as ClientI).userId }), type: 'user' }));

        // Envoi de la liste
        return userList;
    } else if (user.type === 'user') {
        if (user.data.role === 'Gérant') {
            // Pour un gérant on récupère tous les clients
            const customers: ClientI[] = await Client.find();
            customers.map((customer) => userList.push(generateShortUserJSON({ data: customer, type: 'client' })));

            // Pour un gérant on récupère tous les employés
            const employees: UserI[] = await User.find();
            employees.map((employee) => userList.push(generateShortUserJSON({ data: employee, type: 'user' })));

            // On organise par date de création (le plus ancien en premier)
            userList.sort((a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

            // Envoi de la liste filtrer (on ne s'envoi pas soit même)
            return userList.filter((item) => item.id.toString() !== user.data._id.toString());
        } else {
            // Pour un employé on récupère tous ses clients
            const customers: ClientI[] = await Client.find({ userId: user.data._id });
            customers.map((customer) => userList.push(generateShortUserJSON({ data: customer, type: 'client' })));

            // Pour un employé on récupère la liste des autres employés
            const employees: UserI[] = await User.find();
            employees.map((employee) => userList.push(generateShortUserJSON({ data: employee, type: 'user' })));

            // On organise par date de création (le plus ancien en premier)
            userList.sort((a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

            // Envoi de la liste filtrer (on ne s'envoi pas soit même)
            return userList.filter((item) => item.id.toString() !== user.data._id.toString());
        }
    } else return userList;
};

/**
 * Fonction pour mettre à jour un utilisateur.
 * @param user Utilisateur à mettre à jour
 * @param updateData Données à mettre à jour
 */
const updateUser = async (user: UserObject, updateData: UserUpdateI): Promise<void> => {
    if (user.type === 'user') await User.updateOne({ _id: mongoose.Types.ObjectId(user.data._id), email: user.data.email }, { $set: updateData });
    if (user.type === 'client') await Client.updateOne({ _id: mongoose.Types.ObjectId(user.data._id), email: user.data.email }, { $set: updateData });
};

/**
 * Fonction pour désactiver un utilisateur.
 * @param model Modèle mongoose
 * @param id Id pour filtrer
 */
const disabledOne = async (model: mongoose.Model<any, any>, id: string): Promise<any> => {
    return await model.updateOne({ _id: mongoose.Types.ObjectId(id) }, { $set: { isActive: false } });
};

/**
 * Fonction pour mettre à jour la dernière date de connexion, et le nombre tentative de l'utilisateur.
 * @param user Utilisateur pour lequel on met à jour la dernière date de connexion, et le nombre tentative.
 * @returns Retourne l'utilisateur modifié
 */
const updateLastLogin = async (user: UserObject, reset?: boolean): Promise<UserObject> => {
    if (reset) user.data.attempt = 0;
    await updateUser(user, { lastLogin: Date.now(), attempt: user.data.attempt + 1 });
    return user;
};

/**
 * Fonction générer le token de l'utilisateur.
 * @param user Utilisateur pour lequel on génère le token
 * @returns Retourne l'utilisateur modifié
 */
const generateUserToken = async (user: UserObject): Promise<UserObject> => {
    user.data.token = jsonwebtoken.sign({ _id: user.data._id, email: user.data.email }, JWT_KEY, { expiresIn: '24h' });
    await updateUser(user, { token: user.data.token });
    return user;
};

/**
 * Fonction générer le refreshToken de l'utilisateur.
 * @param user Utilisateur pour lequel on génère le refreshToken
 * @returns Retourne l'utilisateur modifié
 */
const generateUserRefreshToken = async (user: UserObject): Promise<UserObject> => {
    user.data.refreshToken = jsonwebtoken.sign({ _id: user.data._id, email: user.data.email }, JWT_KEY, { expiresIn: '30d' });
    await updateUser(user, { refreshToken: user.data.refreshToken });
    return user;
};

/**
 * Fonction générer le JSON de réponse pour les requête lié à l'utilisateur.
 * @param user Utilisateur pour lequel on génère le JSON
 * @returns Retourne JSON
 */
const generateUserJSON = (user: { data: ClientI, type: 'client' | 'user' }): UserJsonI => {
    const toReturn: UserJsonI = {
        type: user.type,
        id: user.data._id,
        name: user.data.name,
        email: user.data.email,
        createdAt: user.data.createdAt,
        updatedAt: user.data.updatedAt,
        token: user.data.token as string,
        refreshToken: user.data.refreshToken as string,
    };

    if (user.data.socketToken) toReturn.socketToken = user.data.socketToken;
    if (user.data.avatar) toReturn.avatar = user.data.avatar;
    if (user.data.phone) toReturn.phone = user.data.phone;
    if (user.data.birthdayDate) toReturn.birthdayDate = user.data.birthdayDate;
    if (user.data.activity) toReturn.activity = user.data.activity;
    if (user.data.address) toReturn.address = user.data.address;
    if (user.data.zip) toReturn.zip = user.data.zip;
    if (user.data.city) toReturn.city = user.data.city;
    if (user.data.country) toReturn.country = user.data.country;
    if (user.data.numTVA) toReturn.numTVA = user.data.numTVA;
    if (user.data.numSIRET) toReturn.numSIRET = user.data.numSIRET;
    if (user.data.numRCS) toReturn.numRCS = user.data.numRCS;
    if (user.data.currency) toReturn.currency = user.data.currency;
    if (user.data.role) toReturn.role = user.data.role;
    if (user.data.enterprise) toReturn.enterprise = user.data.enterprise;

    if (!user.data.verify_email?.verified) toReturn.needVerifyEmail = true;
    else toReturn.needVerifyEmail = false;

    if (user.data.double_authentification?.activated) toReturn.doubleAuthentification = true;
    else toReturn.doubleAuthentification = false;

    return toReturn;
};

/**
 * Fonction générer le short JSON de réponse pour les requête lié à l'utilisateur.
 * @param user Utilisateur pour lequel on génère le JSON
 * @returns Retourne JSON
 */
const generateShortUserJSON = (user: UserObject): ShortUserListI => {
    const toReturn: ShortUserListI = {
        type: user.type,
        id: user.data._id.toString(),
        name: user.data.name,
        email: user.data.email,
        createdAt: user.data.createdAt,
        updatedAt: user.data.updatedAt,
    };

    if (user.data.avatar) toReturn.avatar = user.data.avatar;
    if (user.data.phone) toReturn.phone = user.data.phone;
    if (user.data.role) toReturn.role = user.data.role;
    if ((user.data as ClientI).userId) toReturn.userId = (user.data as ClientI).userId;

    return toReturn;
};

/**
 * Fonction générer le JSON de réponse pour les requête lié à l'employé.
 * @param user Utilisateur pour lequel on génère le JSON
 * @returns Retourne JSON
 */
const generateEmployeeJSON = (user: UserI): EmployeeJsonI => {
    const toReturn: EmployeeJsonI = {
        type: 'user',
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    };
    if (user.avatar) toReturn.avatar = user.avatar;
    if (user.phone) toReturn.phone = user.phone;
    return toReturn;
};

/**
 * Fonction générer le token de récupération de mot de passe d'un utilisateur.
 * @param user Utilisateur pour lequel on génère le token
 * @returns Retourne le token
 */
const generatePasswordToken = async (user: { data: UserI, type: 'client' | 'user' }): Promise<string> => {
    user.data.reset_password = genPasswordToken();
    if (user.type === 'user') await updateUser(user, { reset_password: user.data.reset_password });
    if (user.type === 'client') await updateUser(user, { reset_password: user.data.reset_password });
    return user.data.reset_password.token;
};

/**
 * Fonction générer le code de vérification de mail d'un utilisateur.
 * @param user Utilisateur pour lequel on génère le code
 * @returns Retourne le code créé
 */
const generateVerifyEmailCode = async (user: { data: UserI, type: 'client' | 'user' }): Promise<number | boolean> => {
    if (user.data.verify_email && user.data.verify_email.verified) return false;
    user.data.verify_email = genCodePasswordLost();
    if (user.type === 'user') await updateUser(user, { verify_email: user.data.verify_email });
    if (user.type === 'client') await updateUser(user, { verify_email: user.data.verify_email });
    return user.data.verify_email.code;
};

/**
 * Fonction générer le code de double authentification d'un utilisateur.
 * @param user Utilisateur pour lequel on génère le code
 * @returns Retourne le code créé
 */
const generateDoubleAuthCode = async (user: { data: UserI, type: 'client' | 'user' }): Promise<number> => {
    user.data.double_authentification = genCodeDoubleAuth();
    if (user.type === 'user') await updateUser(user, { double_authentification: user.data.double_authentification });
    if (user.type === 'client') await updateUser(user, { double_authentification: user.data.double_authentification });
    return user.data.double_authentification.code;
};

/**
 * Fonction de récupération de l'utilisateur dans la requête grâce au token
 * @param req Requête contenant l'utilisateur
 * @returns Retourne l'utilisateur
 */
const getRequestUser = (req: Request): UserObject => {
    // Récupération de l'utilisateur grâce au Authmiddleware qui rajoute le token dans req
    const request: any = req;
    const user: UserObject = request.user;
    return user;
};

const userUtils = {
    emailAlreadyExist,
    findUser,
    findUserHistory,
    getUsersList,
    updateUser,
    disabledOne,
    updateLastLogin,
    generateUserToken,
    generateUserRefreshToken,
    generateUserJSON,
    generateShortUserJSON,
    generateEmployeeJSON,
    generatePasswordToken,
    generateVerifyEmailCode,
    generateDoubleAuthCode,
    getRequestUser
};

export { userUtils };

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

const genCodePasswordLost = (): { date: number, code: number, verified: boolean } => {
    const between = (min: number, max: number): number => {
        return Math.floor(
            Math.random() * (max - min + 1) + min
        );
    };
    return {
        date: Date.now(),
        code: between(100000, 999999),
        verified: false,
    };
};

const genCodeDoubleAuth = (): { activated: boolean, date: number, code: number } => {
    const between = (min: number, max: number): number => {
        return Math.floor(
            Math.random() * (max - min + 1) + min
        );
    };
    return {
        activated: true,
        date: Date.now(),
        code: between(100000, 999999),
    };
};

const genPasswordToken = (): { date: number, token: string } => {
    return {
        date: Date.now(),
        token: '',
    };
};
