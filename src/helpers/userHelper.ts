import mongoose from 'mongoose';
import { UserI } from '../interfaces/userInterface';
import { Client } from '../models/Client';
import { User } from '../models/User';

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
 * @param emailToFind Email pour trouver un utilisateur en base de données
 * @returns Retourne l'utilisateur si il est enregistré en base, sinon on retourne null
 */
const findUser = async (emailToFind: string, id?: string): Promise<{ data: UserI, type: 'client' | 'user' } | null> => {
    if (id && id.length !== 24) return null;
    const alreadyExistC = await Client.findOne({ _id: mongoose.Types.ObjectId(id), email: emailToFind });
    const alreadyExistU = await User.findOne({ _id: mongoose.Types.ObjectId(id), email: emailToFind });
    return (alreadyExistC) ? { data: alreadyExistC, type: 'client' } : (alreadyExistU) ? { data: alreadyExistU, type: 'user' } : null;
};

/**
 * Fonction générer le token de récupération de mot de passe d'un utilisateur.
 * @param user Utilisateur pour lequel on génère le token
 * @returns Retourne le token
 */
const generatePasswordToken = async (user: { data: UserI, type: 'client' | 'user' }): Promise<string> => {
    user.data.reset_password = genPasswordToken();
    if (user.type === 'user') await User.updateOne({ _id: mongoose.Types.ObjectId(user.data.id), email: user.data.email }, { $set: { reset_password: user.data.reset_password } });
    if (user.type === 'client') await Client.updateOne({ _id: mongoose.Types.ObjectId(user.data.id), email: user.data.email }, { $set: { reset_password: user.data.reset_password } });
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
    if (user.type === 'user') await User.updateOne({ _id: mongoose.Types.ObjectId(user.data.id), email: user.data.email }, { $set: { verify_email: user.data.verify_email } });
    if (user.type === 'client') await Client.updateOne({ _id: mongoose.Types.ObjectId(user.data.id), email: user.data.email }, { $set: { verify_email: user.data.verify_email } });
    return user.data.verify_email.code;
};

/**
 * Fonction générer le code de double authentification d'un utilisateur.
 * @param user Utilisateur pour lequel on génère le code
 * @returns Retourne le code créé
 */
const generateDoubleAuthCode = async (user: { data: UserI, type: 'client' | 'user' }): Promise<number> => {
    user.data.double_authentification = genCodeDoubleAuth();
    if (user.type === 'user') await User.updateOne({ _id: mongoose.Types.ObjectId(user.data.id), email: user.data.email }, { $set: { double_authentification: user.data.double_authentification } });
    if (user.type === 'client') await Client.updateOne({ _id: mongoose.Types.ObjectId(user.data.id), email: user.data.email }, { $set: { double_authentification: user.data.double_authentification } });
    return user.data.double_authentification.code;
};

export { emailAlreadyExist, findUser, generatePasswordToken, generateVerifyEmailCode, generateDoubleAuthCode };

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

const genCodeDoubleAuth = (): { date: number, code: number } => {
    const between = (min: number, max: number): number => {
        return Math.floor(
            Math.random() * (max - min + 1) + min
        );
    };
    return {
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
