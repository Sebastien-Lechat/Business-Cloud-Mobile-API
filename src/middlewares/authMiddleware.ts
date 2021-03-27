import express, { Request, Response, NextFunction } from 'express';
import jsonwebtoken, { JwtHeader, VerifyOptions } from 'jsonwebtoken';
import { config } from 'dotenv';
import { sendResponse } from '../helpers/responseHelper';

config();

const JWT_KEY: string = process.env.JWT_KEY as string;

const middleware: express.Application = express();

// récupération tu token du l'utilisateur
middleware.use(async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Récupération du token
        const token = req.header('Authorization')?.replace('Bearer ', '') as string;

        // Vérification du token
        const data = jsonwebtoken.verify(token, JWT_KEY);
        // Récupération de l'utilisateur pour le mettre dans le req et y avoir dans les routes après
        // const user = await UserModels.getOneUser(payload.id, token);
        // if (!user) { throw new Error('Not authorized to access this resource'); }
        // Object.assign(req, {user});

        // Si tout se passe bien suite de la requête
        next();
    } catch (err) {
        const body = { error: true, message: err.message };
        if (err.message === 'Not authorized to access this resource') { sendResponse(res, 401, body); }
    }
});

export { middleware as authMiddleware };
