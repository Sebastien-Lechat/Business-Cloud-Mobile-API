
import { Request, Response } from 'express';
import { emailAlreadyExist } from '../helpers/defaultHelper';
import { hashPassword } from '../helpers/passwordHelper';
import { sendResponse } from '../helpers/responseHelper';
import VerifyData from '../helpers/verifyDataHelper';
import { CreateClientI } from '../interfaces/clientInterface';
import { Client } from '../models/Client';
import { User } from '../models/User';

export class UserController {
    /**
     * Login function (POST /login)
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
     * Login function (POST /login)
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
}
