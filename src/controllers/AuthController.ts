
import { Request, Response } from 'express';
import validator from 'validator';
import { sendMail } from '../helpers/emailHelper';
import { comparePassword, hashPassword } from '../helpers/passwordHelper';
import { errorHandler, sendResponse } from '../helpers/responseHelper';
import VerifyData from '../helpers/verifyDataHelper';
import { ClientI } from '../interfaces/userInterface';
import { Client } from '../models/Client';
import { passwordLostModel, sendCodeModel } from '../templates/emailTemplate';
import { userUtils } from '../utils/userUtils';

export class AuthController {
    /**
     * Fonction de connexion à l'application (POST /auth/login)
     * @param req express Request
     * @param res express Response
     */
    static login = async (req: Request, res: Response) => {
        try {
            // Récupération de toutes les données du body
            const { email, password, code } = req.body;

            // Vérification de si toutes les données nécessaire sont présentes
            if (!email || !password) throw new Error('Missing email or password field');

            // Vérification de l'email de l'utilisateur
            if (!VerifyData.validEmail(email)) throw new Error('Invalid email addresse');

            // Récupération de l'utilisateur si il existe
            let user = await userUtils.findUser({ userEmail: email });
            if (!user) throw new Error('Invalid login credential');

            // Vérification de si l'utilisateur n'a pas fait trop de tentative de connexion
            const timeBetweenLastLogin = (Date.now() - user.data.lastLogin) / 1000;

            // Si l'utilisateur à respecter les deux minutes d'attente on remet sont nombres d'essai à 0
            if (user.data.attempt >= 5 && timeBetweenLastLogin > 300) await userUtils.updateLastLogin(user, true);

            // On vérifie le nombre de connnexion et le temps depuis la dernière connexion
            if (user.data.attempt >= 5 && timeBetweenLastLogin < 300) throw new Error('Too many attempts on this email (5 max) - Please wait (5min)');

            // Vérification de si le mot de passe est correct ou non. Si il ne l'est pas on ajoute un essai de connexion
            if (!await comparePassword(password, user.data.password)) {
                await userUtils.updateLastLogin(user);
                throw new Error('Invalid login credential');
            }

            // Vérification de si le compte est actif ou non
            if (!user.data.isActive) throw new Error('This account is disabled');

            // Si tout ce passe bien remise des essais de connexion à 0
            await userUtils.updateLastLogin(user, true);

            // Vérification de si l'adresse email est vérifié ou non
            if (!user.data.verify_email || !user.data.verify_email.verified) throw new Error('Email address is not verified');

            // Vérification de si la double authentification est activé, et si elle l'est on vérifie également la présence et la validité du code
            if (user.data.double_authentification && user.data.double_authentification.activated) {
                if (!code) throw new Error('Double authentification is activated, code is required');
                if (user.data.double_authentification.code !== code) throw new Error('Wrong code');
                const time = (Date.now() - user.data.double_authentification.date) / 1000;
                if (time > 600) return res.status(400).send({ success: false, message: 'This code is no longer valid' });
            }

            // Génération des tokens de l'utilisateur et de la réponse
            user = await userUtils.generateUserToken(user);
            user = await userUtils.generateUserRefreshToken(user);

            // Envoi de la réponse
            sendResponse(res, 200, { error: false, message: 'Successfully connected', user: userUtils.generateUserJSON(user) });
        } catch (err) {
            if (err.message === 'Missing email or password field') sendResponse(res, 400, { error: true, code: '101001', message: err.message });
            else if (err.message === 'Invalid email addresse') sendResponse(res, 400, { error: true, code: '101002', message: err.message });
            else if (err.message === 'Invalid login credential') sendResponse(res, 400, { error: true, code: '101003', message: err.message });
            else if (err.message === 'Email address is not verified') sendResponse(res, 400, { error: true, code: '101004', message: err.message });
            else if (err.message === 'Double authentification is activated, code is required') sendResponse(res, 400, { error: true, code: '101205', message: err.message });
            else if (err.message === 'Wrong code') sendResponse(res, 400, { error: true, code: '101006', message: err.message });
            else if (err.message === 'This code is no longer valid') sendResponse(res, 400, { error: true, code: '101007', message: err.message });
            else if (err.message === 'This account is disabled') sendResponse(res, 400, { error: true, code: '101008', message: err.message });
            else if (err.message === 'Too many attempts on this email (5 max) - Please wait (5min)') sendResponse(res, 400, { error: true, code: '101009', message: err.message });
            else errorHandler(res, err);
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
            if (await userUtils.emailAlreadyExist(email)) throw new Error('This email is already used');

            // Vérification du mot de passe de l'utilisateur et encryptage en cas de bon format
            if (!VerifyData.validPassword(password)) throw new Error('Invalid password format');
            req.body.password = await hashPassword(req.body.password);

            // Vérification du numéro de téléphone de l'utilisateur
            if (phone && !VerifyData.validPhone(phone)) throw new Error('Invalid phone number');

            // Vérification de la date de naissance de l'utilisateur
            if (birthdayDate && !VerifyData.validDate(birthdayDate)) throw new Error('Invalid date format');

            // Création de l'utilisateur
            const client: ClientI = await Client.create(req.body);

            // Envoi de la réponse
            sendResponse(res, 200, { error: false, message: 'Successfully registred', user: { id: client._id, name: client.name, email: client.email } });
        } catch (err) {
            if (err.message === 'Missing important fields') sendResponse(res, 400, { error: true, code: '101051', message: err.message });
            else if (err.message === 'Invalid email addresse') sendResponse(res, 400, { error: true, code: '101052', message: err.message });
            else if (err.message === 'Invalid phone number') sendResponse(res, 400, { error: true, code: '101053', message: err.message });
            else if (err.message === 'Invalid password format') sendResponse(res, 400, { error: true, code: '101054', message: err.message });
            else if (err.message === 'Invalid TVA number') sendResponse(res, 400, { error: true, code: '101055', message: err.message });
            else if (err.message === 'Invalid SIRET number') sendResponse(res, 400, { error: true, code: '101056', message: err.message });
            else if (err.message === 'Invalid RCS number') sendResponse(res, 400, { error: true, code: '101057', message: err.message });
            else if (err.message === 'Invalid date format') sendResponse(res, 400, { error: true, code: '101058', message: err.message });
            else if (err.message === 'This email is already used') sendResponse(res, 400, { error: true, code: '101059', message: err.message });
            else errorHandler(res, err);
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
            const user = await userUtils.findUser({ userEmail: email });
            if (user) {
                // Création du token à envoyer
                const token = await userUtils.generatePasswordToken(user);

                // Envoi du mail de récupération de mot de passe
                sendMail(email, 'Mot de passe oublié', passwordLostModel(user.data.name, token));

                // Envoi de la réponse
                sendResponse(res, 200, { error: false, message: 'Email successfully send' });
            } else { // Si l'utilisateur n'existe pas, on renvoit quand même le même message de succès
                sendResponse(res, 200, { error: false, message: 'Email successfully send' });
            }
        } catch (err) {
            if (err.message === 'Missing email field') sendResponse(res, 400, { error: true, code: '101101', message: err.message });
            else if (err.message === 'Invalid email addresse') sendResponse(res, 400, { error: true, code: '101102', message: err.message });
            else errorHandler(res, err);
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
            const user = await userUtils.findUser({ userEmail: email });
            if (user) {
                // Création du code a envoyer, et de si l'email est déjà vérifié
                const code = await userUtils.generateVerifyEmailCode(user);
                if (!code) throw new Error('Email already verified');

                // Envoi du mail de vérification du mail avec le code
                sendMail(email, 'Vérification de l\' email', sendCodeModel(user.data.name, code as number, 'pour la vérification de votre mail'));

                // Envoi de la réponse
                sendResponse(res, 200, { error: false, message: 'Email successfully send' });
            } else { // Si l'utilisateur n'existe pas, on renvoit quand même le même message de succès
                sendResponse(res, 200, { error: false, message: 'Email successfully send' });
            }
        } catch (err) {
            if (err.message === 'Missing email field') sendResponse(res, 400, { error: true, code: '101151', message: err.message });
            else if (err.message === 'Invalid email addresse') sendResponse(res, 400, { error: true, code: '101152', message: err.message });
            else if (err.message === 'Email already verified') sendResponse(res, 400, { error: true, code: '101153', message: err.message });
            else errorHandler(res, err);
        }
    }

    /**
     * Fonction de vérification de l'email utilisateur (POST /auth/verify-email)
     * @param req express Request
     * @param res express Response
     */
    static verifyEmail = async (req: Request, res: Response) => {
        try {
            // Récupération de toutes les données du body
            const { email, code } = req.body;

            // Vérification de si toutes les données nécessaire sont présentes
            if (!email || !code) throw new Error('Missing email or code field');

            // Vérification de l'email de l'utilisateur
            if (!VerifyData.validEmail(email)) throw new Error('Invalid email addresse');

            // Récupération de l'utilisateur pour vérifier si il existe
            const user = await userUtils.findUser({ userEmail: email });
            if (!user) throw new Error('Invalid user information');

            // Vérification de si l'utilisateur à bien fait une requête de vérification de son mail
            if (!user.data.verify_email || !user.data.verify_email.code || user.data.verify_email.verified === undefined) throw new Error('You need to make a request to check this email');

            // Vérification de si le code est toujours valide et si c'est le bon code
            if (code !== user.data.verify_email.code) throw new Error('Wrong code');
            const time = (Date.now() - user.data.verify_email.date) / 1000;
            if (time > 600) throw new Error('This code is no longer valid');

            // Changement du statut de vérification de l'email
            await userUtils.updateUser(user, { verify_email: { code: 0, date: 0, verified: true } });

            // Envoi de la réponse
            sendResponse(res, 200, { error: false, message: 'Successful verification' });
        } catch (err) {
            if (err.message === 'Missing email or code field') sendResponse(res, 400, { error: true, code: '101201', message: err.message });
            else if (err.message === 'Invalid email addresse') sendResponse(res, 400, { error: true, code: '101202', message: err.message });
            else if (err.message === 'Invalid user information') sendResponse(res, 400, { error: true, code: '101203', message: err.message });
            else if (err.message === 'You need to make a request to check this email') sendResponse(res, 400, { error: true, code: '101204', message: err.message });
            else if (err.message === 'Wrong code') sendResponse(res, 400, { error: true, code: '101205', message: err.message });
            else if (err.message === 'This code is no longer valid') sendResponse(res, 400, { error: true, code: '101206', message: err.message });
            else errorHandler(res, err);
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
            const { email } = req.body;

            // Vérification de si toutes les données nécessaire sont présentes
            if (!email) throw new Error('Missing email or userId field');

            // Vérification de l'email de l'utilisateur
            if (!VerifyData.validEmail(email)) throw new Error('Invalid email addresse');

            // Récupération de l'utilisateur pour vérifier si il existe
            const user = await userUtils.findUser({ userEmail: email });
            if (!user) throw new Error('Invalid user information');

            // Vérification de si la double authentification est activé
            if (!user.data.double_authentification?.activated) throw new Error('Double authentification is not activated on this account');

            // Création du code a envoyer
            const code = await userUtils.generateDoubleAuthCode(user);

            // Envoi du mail de double authentification avec le code
            sendMail(email, 'Double authentification', sendCodeModel(user.data.name, code, 'pour la double authentification de votre compte'));

            // Envoi de la réponse
            sendResponse(res, 200, { error: false, message: 'Email successfully send' });
        } catch (err) {
            if (err.message === 'Missing email field') sendResponse(res, 400, { error: true, code: '101251', message: err.message });
            else if (err.message === 'Invalid email addresse') sendResponse(res, 400, { error: true, code: '101252', message: err.message });
            else if (err.message === 'Invalid user information') sendResponse(res, 400, { error: true, code: '101253', message: err.message });
            else if (err.message === 'Double authentification is not activated on this account') sendResponse(res, 400, { error: true, code: '101254', message: err.message });
            else errorHandler(res, err);
        }
    }

    /**
     * Fonction pour activer la double authentification (POST /auth/activate-double-auth)
     * @param req express Request
     * @param res express Response
     */
    static activateDoubleAuth = async (req: Request, res: Response) => {
        try {
            // Récupération de toutes les données du body
            let { isActive } = req.body;

            // On assure que la donnée est un booléen
            isActive = validator.toBoolean(isActive);

            // Vérification de si toutes les données nécessaire sont présentes
            if (isActive === undefined) throw new Error('Missing isActive field');

            // Récupération de l'utilisateur grâce au Authmiddleware qui rajoute le token dans req
            const user = userUtils.getRequestUser(req);

            // On met à jour l'option de double authentification
            await userUtils.updateUser(user, { double_authentification: { activated: isActive, code: 0, date: 0 } });

            // Envoi de la réponse
            sendResponse(res, 200, { error: false, message: 'Double authentification successfully updated' });
        } catch (err) {
            if (err.message === 'Missing isActive field') sendResponse(res, 400, { error: true, code: '101301', message: err.message });
            else errorHandler(res, err);
        }
    }
}
