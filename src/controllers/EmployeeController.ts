import { Request, Response } from 'express';
import { hashPassword } from '../helpers/passwordHelper';
import { errorHandler, sendResponse } from '../helpers/responseHelper';
import VerifyData from '../helpers/verifyDataHelper';
import { UserI } from '../interfaces/userInterface';
import { User } from '../models/User';
import { globalUtils } from '../utils/globalUtils';
import { userUtils } from '../utils/userUtils';


export class EmployeeController {

    /**
     * Fonction de création d'un employé  (POST /employee)
     * @param req express Request
     * @param res express Response
     */
    static create = async (req: Request, res: Response) => {
        try {
            // Vérification de si l'utilisateur à les permissions de faire la requête
            const hasPermission = globalUtils.checkPermission(userUtils.getRequestUser(req), 'user', true);
            if (!hasPermission) throw new Error('You do not have the required permissions');

            // Récupération de toutes les données du body
            const { name, email, phone, password, role } = req.body;

            // Vérification de si toutes les données nécessaire sont présentes
            if (!name || !email || !password || !role) throw new Error('Missing important fields');

            // Vérification de l'email de l'employé que l'on veut créer
            if (!VerifyData.validEmail(email)) throw new Error('Invalid email addresse');

            // Vérification de si l'email existe déjà
            if (await userUtils.emailAlreadyExist(email)) throw new Error('This email is already used');

            // Vérification du mot de passe de l'employé que l'on veut créer et encryptage en cas de bon format
            if (!VerifyData.validPassword(password)) throw new Error('Invalid password format');
            req.body.password = await hashPassword(req.body.password);

            // Vérification du role de l'employé que l'on veut créer
            if (role && !VerifyData.validRole(role)) throw new Error('Invalid enterprise role');

            // Vérification du numéro de téléphone de l'employé que l'on veut créer
            if (phone && !VerifyData.validPhone(phone)) throw new Error('Invalid phone number');

            // Création de l'employé
            const createdEmployee: UserI = await User.create(req.body);

            // Envoi de la réponse
            sendResponse(res, 200, { error: false, message: 'Employee successfully created', employee: userUtils.generateEmployeeJSON(createdEmployee) });
        } catch (err: any) {
            if (err.message === 'You do not have the required permissions') sendResponse(res, 400, { error: true, code: '401002', message: err.message });
            else if (err.message === 'Missing important fields') sendResponse(res, 400, { error: true, code: '103301', message: err.message });
            else if (err.message === 'Invalid email addresse') sendResponse(res, 400, { error: true, code: '103302', message: err.message });
            else if (err.message === 'Invalid phone number') sendResponse(res, 400, { error: true, code: '103303', message: err.message });
            else if (err.message === 'Invalid password format') sendResponse(res, 400, { error: true, code: '103304', message: err.message });
            else if (err.message === 'Invalid enterprise role') sendResponse(res, 400, { error: true, code: '103305', message: err.message });
            else if (err.message === 'This email is already used') sendResponse(res, 400, { error: true, code: '103306', message: err.message });
            else errorHandler(res, err);
        }
    }

    /**
     * Fonction de modification d'un employé  (PUT /employee)
     * @param req express Request
     * @param res express Response
     */
    static update = async (req: Request, res: Response) => {
        try {
            // Vérification de si l'utilisateur à les permissions de faire la requête
            const hasPermission = globalUtils.checkPermission(userUtils.getRequestUser(req), 'user', true);
            if (!hasPermission) throw new Error('You do not have the required permissions');

            // Récupération de toutes les données du body
            const { id, name, email, phone, role } = req.body;

            // Vérification de si toutes les données nécessaire sont présentes
            if (!id) throw new Error('Missing id field');

            // Vérification de si l'utilisateur existe
            const user: UserI = await globalUtils.findOne(User, id);
            if (!user) throw new Error('Invalid employee id');

            // Vérification de l'email de l'employé que l'on veut modifier
            if (email && !VerifyData.validEmail(email)) throw new Error('Invalid email addresse');

            // Vérification de si l'email existe déjà
            if (email && await userUtils.emailAlreadyExist(email)) throw new Error('This email is already used');

            // Vérification du role de l'employé que l'on veut modifier
            if (role && !VerifyData.validRole(role)) throw new Error('Invalid enterprise role');

            // Vérification du numéro de téléphone de l'employé que l'on veut modifier
            if (phone && !VerifyData.validPhone(phone)) throw new Error('Invalid phone number');

            // Création des données existante à modifier
            const toUpdate: any = {};
            if (name) toUpdate.name = user.name = name;
            if (email) {
                toUpdate.email = user.email = email;
                toUpdate.verify_email = user.verify_email = { code: 0, date: 0, verified: false };
            }
            if (phone) toUpdate.phone = user.phone = phone;
            if (role) toUpdate.role = user.role = role;

            // Modification de l'employé
            await globalUtils.updateOneById(User, id, toUpdate);

            // Envoi de la réponse
            sendResponse(res, 200, { error: false, message: 'Employee successfully updated', employee: userUtils.generateEmployeeJSON(user) });
        } catch (err: any) {
            if (err.message === 'You do not have the required permissions') sendResponse(res, 400, { error: true, code: '401002', message: err.message });
            else if (err.message === 'Missing id field') sendResponse(res, 400, { error: true, code: '103351', message: err.message });
            else if (err.message === 'Invalid email addresse') sendResponse(res, 400, { error: true, code: '103352', message: err.message });
            else if (err.message === 'Invalid phone number') sendResponse(res, 400, { error: true, code: '103353', message: err.message });
            else if (err.message === 'Invalid employee id') sendResponse(res, 400, { error: true, code: '103354', message: err.message });
            else if (err.message === 'Invalid enterprise role') sendResponse(res, 400, { error: true, code: '103355', message: err.message });
            else if (err.message === 'This email is already used') sendResponse(res, 400, { error: true, code: '103356', message: err.message });
            else errorHandler(res, err);
        }
    }


    /**
     * Fonction de suppression d'un employé  (DELETE /employee/:id)
     * @param req express Request
     * @param res express Response
     */
    static delete = async (req: Request, res: Response) => {
        try {
            // Vérification de si l'utilisateur à les permissions de faire la requête
            const hasPermission = globalUtils.checkPermission(userUtils.getRequestUser(req), 'user', true);
            if (!hasPermission) throw new Error('You do not have the required permissions');

            // Récupération de toutes les données du body
            const { id } = req.params;

            // Vérification de si toutes les données nécessaire sont présentes
            if (!id) throw new Error('Missing id field');

            // Vérification de si l'employé existe
            const user: UserI = await globalUtils.findOne(User, id);
            if (!user) throw new Error('Invalid employee id');

            // Suppression de l'employé
            await globalUtils.deleteOne(User, id);

            // Désactivation de l'employé
            // await userUtils.disabledOne(User, id);

            // Envoi de la réponse
            sendResponse(res, 200, { error: false, message: 'Employee successfully deleted' });
        } catch (err: any) {
            if (err.message === 'You do not have the required permissions') sendResponse(res, 400, { error: true, code: '401002', message: err.message });
            else if (err.message === 'Missing id field') sendResponse(res, 400, { error: true, code: '103401', message: err.message });
            else if (err.message === 'Invalid employee id') sendResponse(res, 400, { error: true, code: '103402', message: err.message });
            else errorHandler(res, err);
        }
    }

}
