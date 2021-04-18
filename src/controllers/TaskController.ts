import { Request, Response } from 'express';
import { errorHandler, sendResponse } from '../helpers/responseHelper';
import VerifyData from '../helpers/verifyDataHelper';
import { ProjectI } from '../interfaces/projectInterface';
import { TaskI } from '../interfaces/taskInterface';
import { Project } from '../models/Project';
import { Task } from '../models/Task';
import { globalUtils } from '../utils/globalUtils';
import { taskUtils } from '../utils/taskUtils';
import { userUtils } from '../utils/userUtils';

export class TaskController {
    /**
     * Fonction de récupération de toutes les tâches (GET /tasks)
     * @param req express Request
     * @param res express Response
     */
    static getTasksList = async (req: Request, res: Response) => {
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

                // Récupération de la liste des tâches
                const taskList = await taskUtils.getTaskList(projectId);

                // Envoi de la réponse
                sendResponse(res, 200, { error: false, message: 'Successful tasks acquisition', tasks: taskList });
            } else {
                // Récupération de la liste des dépenses
                const taskList = await taskUtils.getTaskList();

                // Envoi de la réponse
                sendResponse(res, 200, { error: false, message: 'Successful tasks acquisition', tasks: taskList });
            }
        } catch (err) {
            if (err.message === 'You do not have the required permissions') sendResponse(res, 400, { error: true, code: '401002', message: err.message });
            else if (err.message === 'Invalid project id') sendResponse(res, 400, { error: true, code: '109051', message: err.message });
            else errorHandler(res, err);
        }
    }

    /**
     * Fonction de création d'une tâche (POST /task)
     * @param req express Request
     * @param res express Response
     */
    static create = async (req: Request, res: Response) => {
        try {
            // Vérification de si l'utilisateur à les permissions de faire la requête
            const hasPermission = globalUtils.checkPermission(userUtils.getRequestUser(req), 'user');
            if (!hasPermission) throw new Error('You do not have the required permissions');

            // Récupération de toutes les données du body
            const { name, progression, description, projectId, employees, startDate, deadline, estimateHour } = req.body;

            // Vérification de si toutes les données nécessaire sont présentes
            if (!name || progression === undefined || !projectId || !employees || !startDate || !deadline) throw new Error('Missing important fields');

            // Vérification de la validité du numéro de projet
            if ((progression && !VerifyData.validInt(progression)) || (progression < 0 || progression > 100)) throw new Error('Invalid progression number');

            // Vérification de si le projet existe
            const project: ProjectI = await globalUtils.findOne(Project, projectId);
            if (!project) throw new Error('Invalid project id');

            // Vérification des employés attribué au projet
            if (employees) {
                for (const employee of employees) {
                    const findEmployee = await userUtils.findUser({ userId: employee.id });
                    if (!findEmployee) throw new Error('Some employee id are invalid');
                }
            }

            // Vérification du nombre d'heures estimé
            if (estimateHour && !VerifyData.validInt(estimateHour)) throw new Error('Invalid estimate hour');
            if (estimateHour) req.body.estimateHour = VerifyData.validInt(estimateHour);

            // Vérification de la validité de la date d'échéance
            if (!VerifyData.validDeadline(deadline)) throw new Error('Invalid deadline');
            req.body.startDate = new Date(startDate);
            req.body.deadline = new Date(deadline);

            // Vérification de la date de début n'est pas situé après la deadline
            if ((req.body.deadline as Date).getTime() - (req.body.startDate as Date).getTime() < 0) throw new Error('Start date can\'t be set after deadline');

            // Création de la tâche
            const task = await Task.create(req.body);

            // Envoi de la réponse
            sendResponse(res, 200, { error: false, message: 'Task successfully created', task: taskUtils.generateTaskJSON(task) });
        } catch (err) {
            if (err.message === 'You do not have the required permissions') sendResponse(res, 400, { error: true, code: '401002', message: err.message });
            else if (err.message === 'Missing important fields') sendResponse(res, 400, { error: true, code: '109101', message: err.message });
            else if (err.message === 'Invalid progression number') sendResponse(res, 400, { error: true, code: '109102', message: err.message });
            else if (err.message === 'Invalid project id') sendResponse(res, 400, { error: true, code: '109103', message: err.message });
            else if (err.message === 'Some employee id are invalid') sendResponse(res, 400, { error: true, code: '109104', message: err.message });
            else if (err.message === 'Invalid estimate hour') sendResponse(res, 400, { error: true, code: '109105', message: err.message });
            else if (err.message === 'Invalid deadline') sendResponse(res, 400, { error: true, code: '109106', message: err.message });
            else if (err.message === 'Start date can\'t be set after deadline') sendResponse(res, 400, { error: true, code: '109107', message: err.message });
            else errorHandler(res, err);
        }
    }

    /**
     * Fonction de suppression d'une tâche (DELETE /task/:id)
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

            // Vérification de si la tâche existe
            const task: TaskI = await globalUtils.findOne(Task, id);
            if (!task) throw new Error('Invalid task id');

            // Suppression de la tâche
            await globalUtils.deleteOne(Task, id);

            // Envoi de la réponse
            sendResponse(res, 200, { error: false, message: 'Task successfully deleted' });
        } catch (err) {
            if (err.message === 'You do not have the required permissions') sendResponse(res, 400, { error: true, code: '401002', message: err.message });
            else if (err.message === 'Missing id field') sendResponse(res, 400, { error: true, code: '109151', message: err.message });
            else if (err.message === 'Invalid task id') sendResponse(res, 400, { error: true, code: '109152', message: err.message });
            else errorHandler(res, err);
        }
    }
}
