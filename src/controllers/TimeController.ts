import { Request, Response } from 'express';
import { errorHandler, sendResponse } from '../helpers/responseHelper';
import VerifyData from '../helpers/verifyDataHelper';
import { ProjectI } from '../interfaces/projectInterface';
import { TaskI } from '../interfaces/taskInterface';
import { TimeI } from '../interfaces/timeInterface';
import { Project } from '../models/Project';
import { Task } from '../models/Task';
import { Time } from '../models/Time';
import { globalUtils } from '../utils/globalUtils';
import { projectUtils } from '../utils/projectUtils';
import { timeUtils } from '../utils/timeUtils';
import { userUtils } from '../utils/userUtils';

export class TimeController {
    /**
     * Fonction de récupération de tous les temps (GET /times)
     * @param req express Request
     * @param res express Response
     */
    static getTimesList = async (req: Request, res: Response) => {
        try {
            // Vérification de si l'utilisateur à les permissions de faire la requête
            const hasPermission = globalUtils.checkPermission(userUtils.getRequestUser(req), 'user');
            if (!hasPermission) throw new Error('You do not have the required permissions');

            // Récupération de toutes les données du body
            const { projectId } = req.params;

            if (projectId) {
                // vérification de si le projet existe bien
                const project: ProjectI = await globalUtils.findOne(Project, projectId);
                if (!project) throw new Error('Invalid project id');

                // Récupération de la liste des temps
                const timeList = await timeUtils.getTimeList(projectId);

                // Envoi de la réponse
                sendResponse(res, 200, { error: false, message: 'Successful times acquisition', times: timeList });
            } else {
                // Récupération de la liste des dépenses
                const timeList = await timeUtils.getTimeList();

                // Envoi de la réponse
                sendResponse(res, 200, { error: false, message: 'Successful times acquisition', times: timeList });
            }
        } catch (err: any) {
            if (err.message === 'You do not have the required permissions') sendResponse(res, 400, { error: true, code: '401002', message: err.message });
            else if (err.message === 'Invalid project id') sendResponse(res, 400, { error: true, code: '110051', message: err.message });
            else errorHandler(res, err);
        }
    }

    /**
     * Fonction de création d'un temps (POST /time)
     * @param req express Request
     * @param res express Response
     */
    static create = async (req: Request, res: Response) => {
        try {
            // Récupération de l'utilisateur grâce au Authmiddleware qui rajoute le token dans req
            const user = userUtils.getRequestUser(req);

            // Vérification de si l'utilisateur à les permissions de faire la requête
            const hasPermission = globalUtils.checkPermission(user, 'user');
            if (!hasPermission) throw new Error('You do not have the required permissions');

            // Ajout de l'utilisateur pour la création si il a les permissions
            req.body.userId = user.data._id;

            // Récupération de toutes les données du body
            const { taskId, projectId, billable, duration } = req.body;

            // Vérification de si toutes les données nécessaire sont présentes
            if (!projectId || billable === undefined || !duration) throw new Error('Missing important fields');

            // vérification de si le projet existe bien
            const project: ProjectI = await globalUtils.findOne(Project, projectId);
            if (!project) throw new Error('Invalid project id');

            // vérification de si la tâche existe bien
            if (taskId) {
                const task: TaskI = await globalUtils.findOne(Task, taskId);
                if (!task) throw new Error('Invalid task id');
            }

            // Vérification de la validité du champs facturable
            if (billable && billable !== true && billable !== false) throw new Error('Invalid billable format');

            // Vérification du nombre d'heures estimé
            if (!VerifyData.validInt(duration)) throw new Error('Invalid duration number');
            req.body.duration = VerifyData.validInt(duration);

            // Création du temps
            const time: TimeI = await Time.create(req.body);

            // Mise à jour des dépenses et du temps facturable
            await projectUtils.updateProjectBilling(projectId);

            const populateTime = await Time.findOne({ _id: time._id }).populate('userId', { _id: 1, name: 1 });

            // Envoi de la réponse
            sendResponse(res, 200, { error: false, message: 'Time successfully created', time: timeUtils.generateTimeJSON(populateTime) });
        } catch (err: any) {
            if (err.message === 'You do not have the required permissions') sendResponse(res, 400, { error: true, code: '401002', message: err.message });
            else if (err.message === 'Missing important fields') sendResponse(res, 400, { error: true, code: '110101', message: err.message });
            else if (err.message === 'Invalid project id') sendResponse(res, 400, { error: true, code: '110102', message: err.message });
            else if (err.message === 'Invalid task id') sendResponse(res, 400, { error: true, code: '110103', message: err.message });
            else if (err.message === 'Invalid billable format') sendResponse(res, 400, { error: true, code: '110104', message: err.message });
            else if (err.message === 'Invalid duration number') sendResponse(res, 400, { error: true, code: '110105', message: err.message });
            else errorHandler(res, err);
        }
    }

    /**
     * Fonction de modification d'un temps (PUT /time)
     * @param req express Request
     * @param res express Response
     */
    static update = async (req: Request, res: Response) => {
        try {
            // Récupération de l'utilisateur grâce au Authmiddleware qui rajoute le token dans req
            const user = userUtils.getRequestUser(req);

            // Vérification de si l'utilisateur à les permissions de faire la requête
            const hasPermission = globalUtils.checkPermission(user, 'user');
            if (!hasPermission) throw new Error('You do not have the required permissions');

            // Récupération de toutes les données du body
            const { id, billable } = req.body;

            // Vérification de si toutes les données nécessaire sont présentes
            if (!id || billable === undefined) throw new Error('Missing important fields');

            // Vérification de si le temps existe
            const time: TimeI = await globalUtils.findOne(Time, id);
            if (!time) throw new Error('Invalid time id');

            // Vérification de la validité du champs facturable
            if (billable && billable !== true && billable !== false) throw new Error('Invalid billable format');

            // Création de la tâche
            await globalUtils.updateOneById(Time, id, { billable: billable });

            // Mise à jour des dépenses et du temps facturable
            if (time.projectId) await projectUtils.updateProjectBilling(time.projectId);

            // Envoi de la réponse
            sendResponse(res, 200, { error: false, message: 'Time successfully updated', time: timeUtils.generateTimeJSON(time) });
        } catch (err: any) {
            if (err.message === 'You do not have the required permissions') sendResponse(res, 400, { error: true, code: '401002', message: err.message });
            else if (err.message === 'Missing important fields') sendResponse(res, 400, { error: true, code: '110151', message: err.message });
            else if (err.message === 'Invalid time id') sendResponse(res, 400, { error: true, code: '110152', message: err.message });
            else if (err.message === 'Invalid billable format') sendResponse(res, 400, { error: true, code: '110153', message: err.message });
            else errorHandler(res, err);
        }
    }

    /**
     * Fonction de suppression d'un temps (DELETE /time/:id)
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

            // Vérification de si le temps existe
            const time: TimeI = await globalUtils.findOne(Time, id);
            if (!time) throw new Error('Invalid time id');

            // Suppression du temps
            await globalUtils.deleteOne(Time, id);

            // Mise à jour des dépenses et du temps facturable
            if (time.projectId) await projectUtils.updateProjectBilling(time.projectId);

            // Envoi de la réponse
            sendResponse(res, 200, { error: false, message: 'Time successfully deleted' });
        } catch (err: any) {
            if (err.message === 'You do not have the required permissions') sendResponse(res, 400, { error: true, code: '401002', message: err.message });
            else if (err.message === 'Missing id field') sendResponse(res, 400, { error: true, code: '110201', message: err.message });
            else if (err.message === 'Invalid time id') sendResponse(res, 400, { error: true, code: '110202', message: err.message });
            else errorHandler(res, err);
        }
    }
}
