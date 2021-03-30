
import { Request, Response } from 'express';
import { emailAlreadyExist, findUser, generateDoubleAuthCode, generatePasswordToken, generateVerifyEmailCode } from '../helpers/userHelper';
import { sendMail } from '../helpers/emailHelper';
import { passwordLostModel, sendCodeModel } from '../templates/emailTemplate';
import { hashPassword } from '../helpers/passwordHelper';
import { sendResponse } from '../helpers/responseHelper';
import VerifyData from '../helpers/verifyDataHelper';
import { CreateClientI, UserI } from '../interfaces/userInterface';
import { Client } from '../models/Client';
import { User } from '../models/User';

export class AuthController {
    /**
     * Fonction de connexion à l'application (POST /auth/login)
     * @param req express Request
     * @param res express Response
     */
    static login = async (req: Request, res: Response) => {
        try {
            sendResponse(res, 200, { error: false, message: 'L\'api marche' });
        } catch (err) {
            console.log(err);
        }

    }

    /**
     * Fonction d'inscription dans l'application (POST /auth/register)
     * @param req express Request
     * @param res express Response
     */
    static register = async (req: Request, res: Response) => {
        try {
            // Récupération de toutes les données du body
            const { name, email, password, phone, birthdayDate, address, zip, city, country, numTVA, numSIRET, numRCS } = req.body;

            // Vérification de si toutes les données nécessaire sont présentes
            if (!name || !email || !password) throw new Error('Missing important fields');

            // Vérification de l'email de l'utilisateur
            if (!VerifyData.validEmail(email)) throw new Error('Invalid email addresse');

            // Vérification de si l'email existe déjà
            if (await emailAlreadyExist(email)) throw new Error('This email is already used');

            // Vérification du mot de passe de l'utilisateur et encryptage en cas de bon format
            if (!VerifyData.validPassword(password)) throw new Error('Invalid password format');
            req.body.password = await hashPassword(req.body.password);

            // Vérification du numéro de téléphone de l'utilisateur
            if (phone && !VerifyData.validPhone(email)) throw new Error('Invalid phone number');

            // Vérification de la date de naissance de l'utilisateur
            if (birthdayDate && !VerifyData.validDate(birthdayDate)) throw new Error('Invalid date format');

            // Création de l'utilisateur
            const client: CreateClientI = await Client.create(req.body);

            // Envoi de la réponse
            sendResponse(res, 200, { error: false, message: 'Successfully registred', user: { id: client.id, name: client.name, email: client.email } });
        } catch (err) {
            console.log(err);
            if (err.message === 'Missing important fields') sendResponse(res, 400, { error: false, code: '101051', message: err.message });
            if (err.message === 'Invalid email addresse') sendResponse(res, 400, { error: false, code: '101052', message: err.message });
            if (err.message === 'Invalid phone number') sendResponse(res, 400, { error: false, code: '101053', message: err.message });
            if (err.message === 'Invalid password format') sendResponse(res, 400, { error: false, code: '101054', message: err.message });
            if (err.message === 'Invalid TVA number') sendResponse(res, 400, { error: false, code: '101055', message: err.message });
            if (err.message === 'Invalid SIRET number') sendResponse(res, 400, { error: false, code: '101056', message: err.message });
            if (err.message === 'Invalid RCS number') sendResponse(res, 400, { error: false, code: '101057', message: err.message });
            if (err.message === 'Invalid date format') sendResponse(res, 400, { error: false, code: '101058', message: err.message });
            if (err.message === 'This email is already used') sendResponse(res, 400, { error: false, code: '101059', message: err.message });
        }

    }

    /**
     * Fonction pour envoyer le mail lors du mot de passe oublié (POST /auth/request-password-lost)
     * @param req express Request
     * @param res express Response
     */
    static requestPasswordLost = async (req: Request, res: Response) => {
        try {
            // Récupération de toutes les données du body
            const { email } = req.body;

            // Vérification de si toutes les données nécessaire sont présentes
            if (!email) throw new Error('Missing email field');

            // Vérification de l'email de l'utilisateur
            if (!VerifyData.validEmail(email)) throw new Error('Invalid email addresse');

            // Récupération de l'utilisateur si il existe, on envoie le mail
            const user = await findUser(email);
            if (user) {
                // Création du token à envoyer
                const token = await generatePasswordToken(user);

                // Envoi du mail de récupération de mot de passe
                if (user) sendMail(email, 'Mot de passe oublié', passwordLostModel(user.data.name, token));

                // Envoi de la réponse
                sendResponse(res, 200, { error: false, message: 'Email successfully send' });
            } else { // Si l'utilisateur n'existe pas, on renvoit quand même le même message de succès
                sendResponse(res, 200, { error: false, message: 'Email successfully send' });
            }
        } catch (err) {
            console.log(err);
            if (err.message === 'Missing email field') sendResponse(res, 400, { error: false, code: '101101', message: err.message });
            if (err.message === 'Invalid email addresse') sendResponse(res, 400, { error: false, code: '101102', message: err.message });
        }
    }

    /**
     * Fonction pour envoyer le mail lors de la vérification du mail (POST /auth/request-verify-email)
     * @param req express Request
     * @param res express Response
     */
    static requestVerifyEmail = async (req: Request, res: Response) => {
        try {
            // Récupération de toutes les données du body
            const { email } = req.body;

            // Vérification de si toutes les données nécessaire sont présentes
            if (!email) throw new Error('Missing email field');

            // Vérification de l'email de l'utilisateur
            if (!VerifyData.validEmail(email)) throw new Error('Invalid email addresse');

            // Récupération de l'utilisateur si il existe, on envoie le mail
            const user = await findUser(email);
            if (user) {
                // Création du code a envoyer, et de si l'email est déjà vérifié
                const code = await generateVerifyEmailCode(user);
                if (!code) throw new Error('Email already verified');

                // Envoi du mail de récupération de mot de passe avec le code
                if (user) sendMail(email, 'Mot de passe oublié', sendCodeModel(user.data.name, code as number, 'pour la vérification de votre mail'));

                // Envoi de la réponse
                sendResponse(res, 200, { error: false, message: 'Email successfully send' });
            } else { // Si l'utilisateur n'existe pas, on renvoit quand même le même message de succès
                sendResponse(res, 200, { error: false, message: 'Email successfully send' });
            }
        } catch (err) {
            console.log(err);
            if (err.message === 'Missing email field') sendResponse(res, 400, { error: false, code: '101151', message: err.message });
            if (err.message === 'Invalid email addresse') sendResponse(res, 400, { error: false, code: '101152', message: err.message });
            if (err.message === 'Email already verified') sendResponse(res, 400, { error: false, code: '101153', message: err.message });
        }
    }

    /**
     * Login function (POST /auth/verify-email)
     * @param req express Request
     * @param res express Response
     */
    static verifyEmail = async (req: Request, res: Response) => {
        try {
            sendResponse(res, 200, { error: false, message: 'L\'api marche' });
        } catch (err) {
            console.log(err);
        }

    }

    /**
     * Fonction pour envoyer le mail lors de la double authentification (POST /auth/request-double-auth)
     * @param req express Request
     * @param res express Response
     */
    static requestDoubleAuth = async (req: Request, res: Response) => {
        try {
            // Récupération de toutes les données du body
            const { email, userId } = req.body;

            // Vérification de si toutes les données nécessaire sont présentes
            if (!email || !userId) throw new Error('Missing email or id field');

            // Vérification de l'email de l'utilisateur
            if (!VerifyData.validEmail(email)) throw new Error('Invalid email addresse');

            // Récupération de l'utilisateur pour vérifier si il existe
            const user = await findUser(email, userId);
            if (!user) throw new Error('Invalid user information');

            // Création du code a envoyer, et de si l'email est déjà vérifié
            const code = await generateDoubleAuthCode(user);

            // Envoi du mail de récupération de mot de passe avec le code
            if (user) sendMail(email, 'Mot de passe oublié', sendCodeModel(user.data.name, code, 'pour la double authentification de votre compte'));

            // Envoi de la réponse
            sendResponse(res, 200, { error: false, message: 'Email successfully send' });
        } catch (err) {
            console.log(err);
            if (err.message === 'Missing email or id field') sendResponse(res, 400, { error: false, code: '101201', message: err.message });
            if (err.message === 'Invalid email addresse') sendResponse(res, 400, { error: false, code: '101202', message: err.message });
            if (err.message === 'Invalid user information') sendResponse(res, 400, { error: false, code: '101203', message: err.message });
        }
    }
}
