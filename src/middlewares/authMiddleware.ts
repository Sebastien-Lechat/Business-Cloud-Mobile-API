import express, { Request, Response, NextFunction } from 'express';
import jsonwebtoken from 'jsonwebtoken';
import { config } from 'dotenv';
import { errorHandler, sendResponse } from '../helpers/responseHelper';
import { userUtils } from '../utils/userUtils';

config();

const JWT_KEY: string = process.env.JWT_KEY as string;

const middleware: express.Application = express();

// récupération tu token du l'utilisateur
middleware.use(async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Récupération du token
        const token = req.header('Authorization')?.replace('Bearer ', '') as string;
        if (!token) throw new Error('Not authorized to access to this resource');

        // Vérification du token et des informations contenue à l'intérieur
        const data: any = jsonwebtoken.verify(token, JWT_KEY);
        if (!data || !data.email || !data._id) throw new Error('Not authorized to access to this resource');

        // Récupération de l'utilisateur pour le mettre dans le req et y avoir dans les routes après
        const user = await userUtils.findUser({ userEmail: data.email, userId: data._id });
        if (!user) throw new Error('Not authorized to access to this resource');
        Object.assign(req, { user });

        // Si tout se passe bien suite de la requête
        next();
    } catch (err) {
        if (err.message === 'Not authorized to access to this resource') sendResponse(res, 401, { error: true, message: err.message });
        else if (err.message === 'jwt expired') sendResponse(res, 401, { error: true, message: 'This token has expired' });
        else if (err.message === 'invalid token') sendResponse(res, 401, { error: true, message: 'Invalid token' });
        else if (err.message === 'invalid signature') sendResponse(res, 401, { error: true, message: 'Invalid token signature' });
        else errorHandler(res, err);
    }
});

export { middleware as authMiddleware };
