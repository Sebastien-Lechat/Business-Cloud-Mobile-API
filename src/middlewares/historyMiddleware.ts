import express, { Request, Response, NextFunction } from 'express';
import { History } from '../models/History';
import { userUtils } from '../utils/userUtils';

const middleware: express.Application = express();

// récupération tu token du l'utilisateur
middleware.use(async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Récupération de l'utilisateur grâce au Authmiddleware qui rajoute le token dans req
        const user = userUtils.getRequestUser(req);
        console.log(('History log: ' + req.method + ' | ' + req.url + ' | ' + user.data.name).cyan);

        if (!user) throw new Error('Not connected');

        res.on('finish', async () => {
            try {
                const success = (res.statusCode === 200 || res.statusCode === 201 || res.statusCode === 304) ? true : false;
                await History.create({
                    userId: user.data._id,
                    action: { method: req.method, route: req.url },
                    success
                });
            } catch (error) {
                console.log('History => Creation failed : '.red, error);
            }
        });
        return next();
    } catch (error) {
        console.log('History => Finish failed : '.red, error);
    }

});

export { middleware as historyMiddleware };
