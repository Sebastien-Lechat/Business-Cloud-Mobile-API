import { Request, Response } from 'express';
import { comparePassword, hashPassword } from '../helpers/passwordHelper';
import { errorHandler, sendResponse } from '../helpers/responseHelper';
import VerifyData from '../helpers/verifyDataHelper';
import { Client } from '../models/Client';
import { User } from '../models/User';
import { globalUtils } from '../utils/globalUtils';
import { userUtils } from '../utils/userUtils';
import { ClientI } from '../interfaces/userInterface';
import { Enterprise } from '../models/Entreprise';

export class AccountController {

    /**
     * Fonction de récupération de tous les utilisateurs (GET /users)
     * @param req express Request
     * @param res express Response
     */
    static getUsersList = async (req: Request, res: Response) => {
        try {
            // Récupération de l'utilisateur grâce au Authmiddleware qui rajoute le token dans req
            const user = userUtils.getRequestUser(req);

            // Récupération de la liste des utilisateurs en fonction du rôle
            const userList = await userUtils.getUsersList(user);

            // Envoi de la réponse
            sendResponse(res, 200, { error: false, message: 'Successful users acquisition', users: userList });
        } catch (err) {
            errorHandler(res, err);
        }
    }

    /**
     * Fonction de récupération d'un utilisateur (GET /user/:id)
     * @param req express Request
     * @param res express Response
     */
    static getUser = async (req: Request, res: Response) => {
        try {
            // Récupération de toutes les données du body
            const { id } = req.params;

            // Vérification de si toutes les données nécessaire sont présentes
            if (!id) throw new Error('Missing id field');

            // Récupération de l'utilisateur
            const user = await userUtils.findUser({ userId: id });
            if (!user) throw new Error('Invalid user id');

            // Envoi de la réponse
            sendResponse(res, 200, { error: false, message: 'Successful user acquisition', user: userUtils.generateUserJSON(user) });
        } catch (err) {
            if (err.message === 'Invalid user id') sendResponse(res, 400, { error: true, code: '104101', message: err.message });
            else errorHandler(res, err);
        }
    }

    /**
     * Fonction d'enregistrement de l'appareil pour les notifications (POST /account/register-fcm/)
     * @param req express Request
     * @param res express Response
     */
    static fcmRegisterDevice = async (req: Request, res: Response) => {
        try {
            // Récupération de l'utilisateur grâce au Authmiddleware qui rajoute le token dans req
            const user = userUtils.getRequestUser(req);

            // Récupération de toutes les données du body
            const { deviceId, token } = req.body;

            console.log(deviceId, token);

            // Vérification de si toutes les données nécessaire sont présentes
            if (!deviceId || !token) throw new Error('Missing important fields');

            if (user.data.fcmDevice) {
                user.data.fcmDevice.push({ device: deviceId, token: token });
            } else {
                user.data.fcmDevice = [{ device: deviceId, token: token }];
            }

            await userUtils.updateUser(user, { fcmDevice: user.data.fcmDevice });

            // Envoi de la réponse
            sendResponse(res, 200, { error: false, message: 'Device successfully added' });
        } catch (err) {
            if (err.message === 'Missing important fields') sendResponse(res, 400, { error: true, message: err.message });
            else errorHandler(res, err);
        }
    }

    /**
     * Fonction de récupération du profil  (GET /account)
     * @param req express Request
     * @param res express Response
     */
    static getProfile = async (req: Request, res: Response) => {
        try {
            // Récupération de l'utilisateur grâce au Authmiddleware qui rajoute le token dans req
            const user = userUtils.getRequestUser(req);

            // Envoi de la réponse
            sendResponse(res, 200, { error: false, message: 'Successful profil acquisition', user: userUtils.generateUserJSON(user) });
        } catch (err) {
            errorHandler(res, err);
        }
    }

    /**
     * Fonction de modification des informations personnelles  (PUT /account/information)
     * @param req express Request
     * @param res express Response
     */
    static modifyPersonnalInfo = async (req: Request, res: Response) => {
        try {
            // Récupération de l'utilisateur grâce au Authmiddleware qui rajoute le token dans req
            const user = userUtils.getRequestUser(req);

            // Récupération de toutes les données du body
            const { avatar, name, email, phone, birthdayDate } = req.body;

            // Vérification de l'email de l'utilisateur
            if (email && !VerifyData.validEmail(email)) throw new Error('Invalid email addresse');

            // Vérification de si l'email existe déjà
            if (email && await userUtils.emailAlreadyExist(email)) throw new Error('This email is already used');

            // Vérification du numéro de téléphone de l'utilisateur
            if (phone && !VerifyData.validPhone(phone)) throw new Error('Invalid phone number');

            // Vérification de la date de naissance de l'utilisateur
            if (birthdayDate && !VerifyData.validDate(birthdayDate)) throw new Error('Invalid date format');

            // Création des données existante à modifier
            const toUpdate: any = {};
            if (name) toUpdate.name = user.data.name = name;
            if (email) {
                toUpdate.email = user.data.email = email;
                toUpdate.verify_email = user.data.verify_email = { code: 0, date: 0, verified: false };
            }
            if (phone) toUpdate.phone = user.data.phone = phone;
            if (birthdayDate) toUpdate.birthdayDate = user.data.birthdayDate = birthdayDate;

            // Modification du client
            await globalUtils.updateOneById((user.type === 'user') ? User : Client, user.data._id, toUpdate);

            // Envoi de la réponse
            sendResponse(res, 200, { error: false, message: 'Profile successfully updated', user: userUtils.generateUserJSON(user) });
        } catch (err) {
            if (err.message === 'Invalid email addresse') sendResponse(res, 400, { error: true, code: '102051', message: err.message });
            else if (err.message === 'Invalid phone number') sendResponse(res, 400, { error: true, code: '102052', message: err.message });
            else if (err.message === 'Invalid date format') sendResponse(res, 400, { error: true, code: '102053', message: err.message });
            else if (err.message === 'This email is already used') sendResponse(res, 400, { error: true, code: '102054', message: err.message });
            else if (err.message === 'Internal server error, avatar can not be saved') sendResponse(res, 500, { error: true, code: '500004', message: err.message });
            else errorHandler(res, err);
        }
    }

    /**
     * Fonction de modification du mot de passe (PUT /account/password)
     * @param req express Request
     * @param res express Response
     */
    static modifyPassword = async (req: Request, res: Response) => {
        try {
            // Récupération de l'utilisateur grâce au Authmiddleware qui rajoute le token dans req
            const user = userUtils.getRequestUser(req);

            // Récupération de toutes les données du body
            const { email, oldPassword, newPassword } = req.body;

            // Vérification de si toutes les données nécessaire sont présentes
            if (!email || !oldPassword || !newPassword) throw new Error('Missing important fields');

            // Vérification de si l'ancien mot de passe est le bon
            if (!await comparePassword(oldPassword, user.data.password)) throw new Error('Invalid old password');

            // Vérification du mot de passe de l'utilisateur et encryptage en cas de bon format
            if (!VerifyData.validPassword(newPassword)) throw new Error('Invalid password format');
            req.body.password = await hashPassword(newPassword);

            // Création des données existante à modifier
            const toUpdate: any = {};
            if (newPassword) toUpdate.password = user.data.password = req.body.password;

            // Modification du client
            await globalUtils.updateOneById((user.type === 'user') ? User : Client, user.data._id, toUpdate);

            // Envoi de la réponse
            sendResponse(res, 200, { error: false, message: 'Profile successfully updated', user: userUtils.generateUserJSON(user) });
        } catch (err) {
            if (err.message === 'Missing important fields') sendResponse(res, 400, { error: true, code: '102101', message: err.message });
            else if (err.message === 'Invalid old password') sendResponse(res, 400, { error: true, code: '102102', message: err.message });
            else if (err.message === 'Invalid password format') sendResponse(res, 400, { error: true, code: '102103', message: err.message });
            else errorHandler(res, err);
        }
    }

    /**
     * Fonction de modification d'addresse  (PUT /account/address)
     * @param req express Request
     * @param res express Response
     */
    static modifyAddress = async (req: Request, res: Response) => {
        try {
            // Récupération de l'utilisateur grâce au Authmiddleware qui rajoute le token dans req
            const user = userUtils.getRequestUser(req);

            // Vérification que l'utilisateur faisant la requête est un client ou un gérant
            if (user.type === 'client' || user.data.role === 'Gérant') {

                // Récupération de toutes les données du body
                const { address, zip, city, country } = req.body;

                // Création des données existante à modifier
                const toUpdate: any = {};
                if (address) toUpdate.address = (user.data as ClientI).address = address;
                if (zip) toUpdate.zip = (user.data as ClientI).zip = zip;
                if (city) toUpdate.city = (user.data as ClientI).city = city;
                if (country) toUpdate.country = (user.data as ClientI).country = country;

                if (user.data.role === 'Gérant') {
                    await globalUtils.updateOne(Enterprise, { userId: user.data._id }, toUpdate);
                } else // Modification du client
                    await globalUtils.updateOneById(Client, user.data._id, toUpdate);

                // Envoi de la réponse
                sendResponse(res, 200, { error: false, message: 'Profile successfully updated', user: userUtils.generateUserJSON(user) });

            } else throw new Error('You cannot edit your address with this account');
        } catch (err) {
            if (err.message === 'You cannot edit your address with this account') sendResponse(res, 400, { error: true, code: '102151', message: err.message });
            else errorHandler(res, err);
        }
    }

    /**
     * Fonction de modification des informations de l'entreprise (PUT /account/enterprise)
     * @param req express Request
     * @param res express Response
     */
    static modifyEnterprise = async (req: Request, res: Response) => {
        try {
            // Récupération de l'utilisateur grâce au Authmiddleware qui rajoute le token dans req
            const user = userUtils.getRequestUser(req);

            // Vérification que l'utilisateur faisant la requête est un client ou un gérant
            if (user.type === 'client' || user.data.role === 'Gérant') {

                // Récupération de toutes les données du body
                const { activity, numTVA, numSIRET, numRCS, currency } = req.body;

                // Création des données existante à modifier
                const toUpdate: any = {};
                if (activity) toUpdate.activity = (user.data as ClientI).activity = activity;
                if (numTVA) toUpdate.numTVA = (user.data as ClientI).numTVA = numTVA;
                if (numSIRET) toUpdate.numSIRET = (user.data as ClientI).numSIRET = numSIRET;
                if (numRCS) toUpdate.numRCS = (user.data as ClientI).numRCS = numRCS;
                if (currency) toUpdate.currency = (user.data as ClientI).currency = currency;

                if (user.data.role === 'Gérant') {
                    await globalUtils.updateOne(Enterprise, { userId: user.data._id }, toUpdate);
                } else // Modification du client
                    await globalUtils.updateOneById(Client, user.data._id, toUpdate);

                // Envoi de la réponse
                sendResponse(res, 200, { error: false, message: 'Profile successfully updated', user: userUtils.generateUserJSON(user) });

            } else throw new Error('You cannot edit your enterprise with this account');
        } catch (err) {
            if (err.message === 'You cannot edit your enterprise with this account') sendResponse(res, 400, { error: true, code: '102201', message: err.message });
            else errorHandler(res, err);
        }
    }
}
