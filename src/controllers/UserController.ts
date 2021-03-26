
import { Request, Response } from 'express';
import { sendResponse } from '../helpers/responseHelper';

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
}
