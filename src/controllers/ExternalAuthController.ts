import { Request, Response } from 'express';
import { errorHandler, sendResponse } from '../helpers/responseHelper';
import VerifyData from '../helpers/verifyDataHelper';
import { userUtils } from '../utils/userUtils';

export class ExternalAuthController {
    /**
     * Fonction pour les connexions d'API externe (POST /auth/external/login)
     * @param req express Request
     * @param res express Response
     */
    static externalLogin = async (req: Request, res: Response) => {
        try {
            // Récupération de toutes les données du body
            const { type, id, email, token } = req.body;

            // Vérification de si toutes les données nécessaire sont présentes
            if (!id || !email || !type || !token) throw new Error('Missing important fields');

            // Vérification de l'email de l'utilisateur
            if (!VerifyData.validEmail(email)) throw new Error('Invalid email addresse');

            // Récupération de l'utilisateur si il existe et si les informations de connexion son bonne
            let user = await userUtils.findUser({ userEmail: email });
            if (!user) throw new Error('No account linked to this email');

            // Vérification que le type est correcte
            if (type !== 'facebook' && type !== 'google') throw new Error('Invalid type');

            // Vérification que le compte externe est lié au compte existant
            if ((type === 'facebook' && !user.data.facebookAuth?.id) || (type === 'google' && !user.data.googleAuth?.id)) throw new Error('Another account already exist at this email');

            // Vérification de si l'id de connexion est le bon
            if ((type === 'facebook' && user.data.facebookAuth?.id !== id) || (type === 'google' && user.data.googleAuth?.id !== id)) throw new Error('Invalid external account ID');

            // Mise à jour du token de connexion si tout se passe bien
            if (type === 'facebook') await userUtils.updateUser(user, { facebookAuth: { token: token } });
            else if (type === 'google') await userUtils.updateUser(user, { googleAuth: { token: token } });

            // Génération des tokens de l'utilisateur et de la réponse
            user = await userUtils.generateUserToken(user);
            user = await userUtils.generateUserRefreshToken(user);

            // Envoi de la réponse
            sendResponse(res, 200, { error: false, message: 'Successfully connected', user: userUtils.generateUserJSON(user) });
        } catch (err) {
            if (err.message === 'Missing external ID field') sendResponse(res, 400, { error: true, code: '101401', message: err.message });
            else if (err.message === 'Missing email field') sendResponse(res, 400, { error: true, code: '101402', message: err.message });
            else if (err.message === 'Invalid email addresse') sendResponse(res, 400, { error: true, code: '101403', message: err.message });
            else if (err.message === 'No account linked to this email') sendResponse(res, 400, { error: true, code: '101404', message: err.message });
            else if (err.message === 'Invalid type') sendResponse(res, 400, { error: true, code: '101405', message: err.message });
            else if (err.message === 'Another account already exist at this email') sendResponse(res, 400, { error: true, code: '101406', message: err.message });
            else if (err.message === 'Invalid external account ID') sendResponse(res, 400, { error: true, code: '101407', message: err.message });
            else errorHandler(res, err);
        }
    }
}
