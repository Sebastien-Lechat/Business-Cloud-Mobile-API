import { Request, Response } from 'express';
import { hashPassword } from '../helpers/passwordHelper';
import { errorHandler, sendResponse } from '../helpers/responseHelper';
import VerifyData from '../helpers/verifyDataHelper';
import { ClientI } from '../interfaces/userInterface';
import { Client } from '../models/Client';
import { User } from '../models/User';
import { globalUtils } from '../utils/globalUtils';
import { userUtils } from '../utils/userUtils';


export class ClientController {

    /**
     * Fonction de création d'un client  (POST /customer)
     * @param req express Request
     * @param res express Response
     */
    static create = async (req: Request, res: Response) => {
        try {
            // Vérification de si l'utilisateur à les permissions de faire la requête
            const hasPermission = globalUtils.checkPermission(userUtils.getRequestUser(req), 'user');
            if (!hasPermission) throw new Error('You do not have the required permissions');

            // Récupération de toutes les données du body
            const { name, email, phone, password, address, zip, city, country, numTVA, numSIRET, numRCS, userId } = req.body;

            // Vérification de si toutes les données nécessaire sont présentes
            if (!name || !email || !password) throw new Error('Missing important fields');

            // Vérification de l'email du client que l'on veut créer
            if (!VerifyData.validEmail(email)) throw new Error('Invalid email addresse');

            // Vérification de si l'email existe déjà
            if (await userUtils.emailAlreadyExist(email)) throw new Error('This email is already used');

            // Vérification du mot de passe du client que l'on veut créer et encryptage en cas de bon format
            if (!VerifyData.validPassword(password)) throw new Error('Invalid password format');
            req.body.password = await hashPassword(req.body.password);

            // Vérification du numéro de téléphone de l'utilisateur
            if (phone && !VerifyData.validPhone(phone)) throw new Error('Invalid phone number');

            // Vérification de l'id de l'employé référent
            if (userId && !await globalUtils.findOne(User, userId)) throw new Error('Invalid employee id');

            // Création du client
            const createdEmployee: ClientI = await Client.create(req.body);

            // Envoi de la réponse
            sendResponse(res, 200, { error: false, message: 'Customer successfully created', customer: userUtils.generateUserJSON({ data: createdEmployee, type: 'client' }) });
        } catch (err) {
            if (err.message === 'You do not have the required permissions') sendResponse(res, 400, { error: true, code: '401002', message: err.message });
            else if (err.message === 'Missing important fields') sendResponse(res, 400, { error: true, code: '103151', message: err.message });
            else if (err.message === 'Invalid email addresse') sendResponse(res, 400, { error: true, code: '103152', message: err.message });
            else if (err.message === 'Invalid phone number') sendResponse(res, 400, { error: true, code: '103153', message: err.message });
            else if (err.message === 'Invalid password format') sendResponse(res, 400, { error: true, code: '103154', message: err.message });
            else if (err.message === 'Invalid TVA number') sendResponse(res, 400, { error: true, code: '103155', message: err.message });
            else if (err.message === 'Invalid SIRET number') sendResponse(res, 400, { error: true, code: '103156', message: err.message });
            else if (err.message === 'Invalid RCS number') sendResponse(res, 400, { error: true, code: '103157', message: err.message });
            else if (err.message === 'This email is already used') sendResponse(res, 400, { error: true, code: '103158', message: err.message });
            else if (err.message === 'Invalid employee id') sendResponse(res, 400, { error: true, code: '103159', message: err.message });
            else errorHandler(res, err);
        }
    }

    /**
     * Fonction de modification d'un client  (PUT /customer)
     * @param req express Request
     * @param res express Response
     */
    static update = async (req: Request, res: Response) => {
        try {
            // Vérification de si l'utilisateur à les permissions de faire la requête
            const hasPermission = globalUtils.checkPermission(userUtils.getRequestUser(req), 'user');
            if (!hasPermission) throw new Error('You do not have the required permissions');

            // Récupération de toutes les données du body
            const { id, name, email, phone, address, zip, city, country, numTVA, numSIRET, numRCS, userId } = req.body;

            // Vérification de si toutes les données nécessaire sont présentes
            if (!id) throw new Error('Missing id field');

            // Vérification de si l'utilisateur existe
            const user: ClientI = await globalUtils.findOne(Client, id);
            if (!user) throw new Error('Invalid customer id');

            // Vérification de l'email du client que l'on veut modifier
            if (email && !VerifyData.validEmail(email)) throw new Error('Invalid email addresse');

            // Vérification de si l'email existe déjà
            if (email && await userUtils.emailAlreadyExist(email)) throw new Error('This email is already used');

            // Vérification du numéro de téléphone du client que l'on veut modifier
            if (phone && !VerifyData.validPhone(phone)) throw new Error('Invalid phone number');

            // Vérification de l'id de l'employé référent
            if (userId && !await globalUtils.findOne(User, userId)) throw new Error('Invalid employee id');

            // Création des données existante à modifier
            const toUpdate: any = {};
            if (name) toUpdate.name = user.name = name;
            if (email) {
                toUpdate.email = user.email = email;
                toUpdate.verify_email = user.verify_email = { code: 0, date: 0, verified: false };
            }
            if (address) toUpdate.address = user.address = address;
            if (phone) toUpdate.phone = user.phone = phone;
            if (zip) toUpdate.zip = user.zip = zip;
            if (city) toUpdate.city = user.city = city;
            if (country) toUpdate.country = user.country = country;
            if (numTVA) toUpdate.numTVA = user.numTVA = numTVA;
            if (numSIRET) toUpdate.numSIRET = user.numSIRET = numSIRET;
            if (numRCS) toUpdate.numRCS = user.numRCS = numRCS;
            if (userId) toUpdate.userId = user.userId = userId;

            // Modification du client
            await globalUtils.updateOneById(Client, id, toUpdate);

            // Envoi de la réponse
            sendResponse(res, 200, { error: false, message: 'Customer successfully updated', customer: userUtils.generateUserJSON({ data: user, type: 'client' }) });
        } catch (err) {
            if (err.message === 'You do not have the required permissions') sendResponse(res, 400, { error: true, code: '401002', message: err.message });
            else if (err.message === 'Missing id field') sendResponse(res, 400, { error: true, code: '103201', message: err.message });
            else if (err.message === 'Invalid email addresse') sendResponse(res, 400, { error: true, code: '103202', message: err.message });
            else if (err.message === 'Invalid phone number') sendResponse(res, 400, { error: true, code: '103203', message: err.message });
            else if (err.message === 'Invalid customer id') sendResponse(res, 400, { error: true, code: '103204', message: err.message });
            else if (err.message === 'Invalid TVA number') sendResponse(res, 400, { error: true, code: '103205', message: err.message });
            else if (err.message === 'Invalid SIRET number') sendResponse(res, 400, { error: true, code: '103206', message: err.message });
            else if (err.message === 'Invalid RCS number') sendResponse(res, 400, { error: true, code: '103207', message: err.message });
            else if (err.message === 'This email is already used') sendResponse(res, 400, { error: true, code: '103208', message: err.message });
            else if (err.message === 'Invalid employee id') sendResponse(res, 400, { error: true, code: '103209', message: err.message });
            else errorHandler(res, err);
        }
    }


    /**
     * Fonction de suppression d'un client  (DELETE /customer/:id)
     * @param req express Request
     * @param res express Response
     */
    static delete = async (req: Request, res: Response) => {
        try {
            // Vérification de si l'utilisateur à les permissions de faire la requête
            const hasPermission = globalUtils.checkPermission(userUtils.getRequestUser(req), 'user');
            if (!hasPermission) throw new Error('You do not have the required permissions');

            // Récupération de toutes les données du body
            const { id } = req.params;

            // Vérification de si toutes les données nécessaire sont présentes
            if (!id) throw new Error('Missing id field');

            // Vérification de si l'utilisateur existe
            const user: ClientI = await globalUtils.findOne(Client, id);
            if (!user) throw new Error('Invalid customer id');

            // Suppression du client
            await globalUtils.deleteOne(Client, id);

            // Désactivation du client
            // await userUtils.disabledOne(Client, id);

            // Envoi de la réponse
            sendResponse(res, 200, { error: false, message: 'Customer successfully deleted' });
        } catch (err) {
            if (err.message === 'You do not have the required permissions') sendResponse(res, 400, { error: true, code: '401002', message: err.message });
            else if (err.message === 'Missing id field') sendResponse(res, 400, { error: true, code: '103251', message: err.message });
            else if (err.message === 'Invalid customer id') sendResponse(res, 400, { error: true, code: '103252', message: err.message });
            else errorHandler(res, err);
        }
    }

}
