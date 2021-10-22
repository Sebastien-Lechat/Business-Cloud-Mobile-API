import { Request, Response } from 'express';
import { sendNotificationToOne } from '../helpers/notificationHelper';
import { errorHandler, sendResponse } from '../helpers/responseHelper';
import VerifyData from '../helpers/verifyDataHelper';
import { ProjectI } from '../interfaces/projectInterface';
import { ClientI } from '../interfaces/userInterface';
import { Client } from '../models/Client';
import { Project } from '../models/Project';
import { globalUtils } from '../utils/globalUtils';
import { projectUtils } from '../utils/projectUtils';
import { userUtils } from '../utils/userUtils';

export class ProjectController {

    /**
     * Fonction de récupération de tous les projets (GET /projects)
     * @param req express Request
     * @param res express Response
     */
    static getProjectsList = async (req: Request, res: Response) => {
        try {
            // Récupération de l'utilisateur grâce au Authmiddleware qui rajoute le token dans req
            const user = userUtils.getRequestUser(req);

            // Vérification de si l'utilisateur à les permissions de faire la requête
            const hasPermission = globalUtils.checkPermission(user, 'user');
            if (!hasPermission) throw new Error('You do not have the required permissions');

            // Récupération de la liste des projets
            const projectList = await projectUtils.getProjectList(user.data);

            // Envoi de la réponse
            sendResponse(res, 200, { error: false, message: 'Successful projects acquisition', projects: projectList });
        } catch (err: any) {
            errorHandler(res, err);
        }
    }

    /**
     * Fonction de récupération d'un projet (GET /project/:id)
     * @param req express Request
     * @param res express Response
     */
    static getOneProject = async (req: Request, res: Response) => {
        try {
            // Vérification de si l'utilisateur à les permissions de faire la requête
            const hasPermission = globalUtils.checkPermission(userUtils.getRequestUser(req), 'user');
            if (!hasPermission) throw new Error('You do not have the required permissions');

            // Récupération de toutes les données du body
            const { id } = req.params;

            // Vérification de si toutes les données nécessaire sont présentes
            if (!id) throw new Error('Missing id field');

            // Vérification de si le projet existe
            const project: ProjectI = await globalUtils.findOneAndPopulate(Project, id, ['clientId']);
            if (!project) throw new Error('Invalid project id');

            // Envoi de la réponse
            sendResponse(res, 200, { error: false, message: 'Successful project acquisition', project: projectUtils.generateProjectJSON(project) });
        } catch (err: any) {
            if (err.message === 'Missing id field') sendResponse(res, 400, { error: true, code: '108101', message: err.message });
            else if (err.message === 'Invalid project id') sendResponse(res, 400, { error: true, code: '108102', message: err.message });
            else errorHandler(res, err);
        }
    }

    /**
     * Fonction de création du projet (POST /project)
     * @param req express Request
     * @param res express Response
     */
    static create = async (req: Request, res: Response) => {
        try {
            // Vérification de si l'utilisateur à les permissions de faire la requête
            const hasPermission = globalUtils.checkPermission(userUtils.getRequestUser(req), 'user');
            if (!hasPermission) throw new Error('You do not have the required permissions');

            // Récupération de toutes les données du body
            const { projectNum, title, status, clientId, progression, startDate, deadline, employees, fixedRate, hourlyRate, estimateHour } = req.body;

            // Vérification de si toutes les données nécessaire sont présentes
            if (!title || projectNum === undefined || !status || !clientId || !deadline || !employees) throw new Error('Missing important fields');

            // Vérification de la validité du status
            if (!VerifyData.validProjectStatus(status)) throw new Error('Invalid project status');

            // Vérification de si le client existe
            const customer: ClientI = await globalUtils.findOne(Client, clientId);
            if (!customer) throw new Error('Invalid customer id');

            // Vérification de la validité du numéro de projet
            if (!await VerifyData.validProjectNumber(projectNum)) throw new Error('Invalid project number');

            // Vérification de la validité du numéro de projet
            if ((progression && !VerifyData.validInt(progression)) || (progression < 0 || progression > 100)) throw new Error('Invalid progression number');

            // Vérification de la validité de la date d'échéance
            if (!VerifyData.validDeadline(deadline)) throw new Error('Invalid deadline');
            req.body.deadline = new Date(deadline);

            // Vérification des employés attribué au projet
            if (employees) {
                for (const employee of employees) {
                    const findEmployee = await userUtils.findUser({ userId: employee.id });
                    if (!findEmployee) throw new Error('Some employee id are invalid');
                }
            }

            // Vérification du taux de facturation du projet
            if (fixedRate && hourlyRate) throw new Error('You can\'t have both billing systems active');

            if (fixedRate && !VerifyData.validFloat(fixedRate)) throw new Error('Invalid fixed rate');
            if (fixedRate) req.body.fixedRate = VerifyData.validFloat(fixedRate);

            if (hourlyRate && !VerifyData.validFloat(hourlyRate)) throw new Error('Invalid hourly rate');
            if (hourlyRate) req.body.hourlyRate = VerifyData.validFloat(hourlyRate);

            // Vérification de la date de début du projet
            if (!startDate) req.body.startDate = new Date();
            else req.body.startDate = new Date(startDate);

            // Vérification du nombre d'heures estimé
            if (estimateHour && !VerifyData.validInt(estimateHour)) throw new Error('Invalid estimate hour');
            if (estimateHour) req.body.estimateHour = VerifyData.validInt(estimateHour);

            // Vérification de la date de début n'est pas situé après la deadline
            if ((req.body.deadline as Date).getTime() - (req.body.startDate as Date).getTime() < 0) throw new Error('Start date can\'t be set after deadline');

            // Création du projet
            const project: ProjectI = await Project.create(req.body);

            // Envoi de la réponse
            sendResponse(res, 200, { error: false, message: 'Project successfully created', project: projectUtils.generateProjectJSON(project) });
        } catch (err: any) {
            if (err.message === 'You do not have the required permissions') sendResponse(res, 400, { error: true, code: '401002', message: err.message });
            else if (err.message === 'Missing important fields') sendResponse(res, 400, { error: true, code: '108151', message: err.message });
            else if (err.message === 'Invalid project status') sendResponse(res, 400, { error: true, code: '108152', message: err.message });
            else if (err.message === 'Invalid customer id') sendResponse(res, 400, { error: true, code: '108153', message: err.message });
            else if (err.message === 'Invalid project number') sendResponse(res, 400, { error: true, code: '108154', message: err.message });
            else if (err.message === 'Invalid progression number') sendResponse(res, 400, { error: true, code: '108155', message: err.message });
            else if (err.message === 'Invalid deadline') sendResponse(res, 400, { error: true, code: '108156', message: err.message });
            else if (err.message === 'Some employee id are invalid') sendResponse(res, 400, { error: true, code: '108157', message: err.message });
            else if (err.message === 'You can\'t have both billing systems active') sendResponse(res, 400, { error: true, code: '108158', message: err.message });
            else if (err.message === 'Invalid fixed rate') sendResponse(res, 400, { error: true, code: '108159', message: err.message });
            else if (err.message === 'Invalid hourly rate') sendResponse(res, 400, { error: true, code: '108160', message: err.message });
            else if (err.message === 'Invalid estimate hour') sendResponse(res, 400, { error: true, code: '108161', message: err.message });
            else if (err.message === 'Start date can\'t be set after deadline') sendResponse(res, 400, { error: true, code: '108162', message: err.message });
            else errorHandler(res, err);
        }
    }

    /**
     * Fonction de modification du projet (PUT /project)
     * @param req express Request
     * @param res express Response
     */
    static update = async (req: Request, res: Response) => {
        try {
            // Vérification de si l'utilisateur à les permissions de faire la requête
            const hasPermission = globalUtils.checkPermission(userUtils.getRequestUser(req), 'user');
            if (!hasPermission) throw new Error('You do not have the required permissions');

            // Récupération de toutes les données du body
            const { id, projectNum, title, status, clientId, progression, startDate, deadline, employees, fixedRate, hourlyRate, estimateHour } = req.body;

            // Vérification de si toutes les données nécessaire sont présentes
            if (!id) throw new Error('Missing id field');

            // Vérification de si le projet existe
            const project: ProjectI = await globalUtils.findOne(Project, id);
            if (!project) throw new Error('Invalid project id');

            // Vérification de la validité du status
            if (status && !VerifyData.validProjectStatus(status)) throw new Error('Invalid project status');

            // Vérification de si le client existe
            if (clientId) {
                const customer: ClientI = await globalUtils.findOne(Client, clientId);
                if (!customer) throw new Error('Invalid customer id');
            }

            // Vérification de la validité du numéro de projet
            if (projectNum && projectNum !== project.projectNum && !await VerifyData.validProjectNumber(projectNum)) throw new Error('Invalid project number');

            // Vérification de la validité du numéro de projet
            if ((progression && !VerifyData.validInt(progression)) || (progression < 0 || progression > 100)) throw new Error('Invalid progression number');

            // Vérification de la validité de la date d'échéance
            if (deadline) {
                if (!VerifyData.validDeadline(deadline)) throw new Error('Invalid deadline');
                req.body.deadline = new Date(deadline);
            }

            // Vérification des employés attribué au projet
            if (employees) {
                for (const employee of employees) {
                    const findEmployee = await userUtils.findUser({ userId: employee.id });
                    if (!findEmployee) throw new Error('Some employee id are invalid');
                }
            }

            // Vérification du taux de facturation du projet
            if (fixedRate && hourlyRate) throw new Error('You can\'t have both billing systems active');

            if (fixedRate && !VerifyData.validFloat(fixedRate)) throw new Error('Invalid fixed rate');

            if (hourlyRate && !VerifyData.validFloat(hourlyRate)) throw new Error('Invalid hourly rate');

            // Vérification de la date de début du projet
            if (estimateHour && !VerifyData.validInt(estimateHour)) throw new Error('Invalid estimate hour');
            if (estimateHour) req.body.estimateHour = VerifyData.validInt(estimateHour);

            // Vérification de la date de début n'est pas situé après la deadline
            if (startDate && deadline && new Date(deadline).getTime() - new Date(startDate).getTime() < 0) throw new Error('Start date can\'t be set after deadline');
            else if (startDate && !deadline && (project.deadline as Date).getTime() - new Date(startDate).getTime() < 0) throw new Error('Start date can\'t be set after deadline');
            else if (!startDate && deadline && new Date(deadline).getTime() - (project.startDate as Date).getTime() < 0) throw new Error('Start date can\'t be set after deadline');

            const toUpdate: any = {};
            if (projectNum) toUpdate.projectNum = project.projectNum = projectNum;
            if (title) toUpdate.title = project.title = title;
            if (status) toUpdate.status = project.status = status;
            if (clientId) toUpdate.clientId = project.clientId = clientId;
            if (progression) toUpdate.progression = project.progression = progression;
            if (startDate) toUpdate.startDate = project.startDate = startDate;
            if (deadline) toUpdate.deadline = project.deadline = deadline;
            if (employees) toUpdate.employees = project.employees = employees;
            if (fixedRate) {
                toUpdate.fixedRate = project.fixedRate = fixedRate;
                toUpdate.hourlyRate = 0;
            }
            if (hourlyRate) {
                toUpdate.hourlyRate = project.hourlyRate = hourlyRate;
                toUpdate.fixedRate = 0;
            }
            if (estimateHour) toUpdate.estimateHour = project.estimateHour = estimateHour;

            // Modification du projet
            await globalUtils.updateOneById(Project, id, toUpdate);

            // Envoi de la réponse
            sendResponse(res, 200, { error: false, message: 'Project successfully updated', project: projectUtils.generateProjectJSON(project) });
        } catch (err: any) {
            if (err.message === 'You do not have the required permissions') sendResponse(res, 400, { error: true, code: '401002', message: err.message });
            else if (err.message === 'Missing id field') sendResponse(res, 400, { error: true, code: '108201', message: err.message });
            else if (err.message === 'Invalid project id') sendResponse(res, 400, { error: true, code: '108202', message: err.message });
            else if (err.message === 'Invalid project status') sendResponse(res, 400, { error: true, code: '108203', message: err.message });
            else if (err.message === 'Invalid customer id') sendResponse(res, 400, { error: true, code: '108204', message: err.message });
            else if (err.message === 'Invalid project number') sendResponse(res, 400, { error: true, code: '108205', message: err.message });
            else if (err.message === 'Invalid progression number') sendResponse(res, 400, { error: true, code: '108206', message: err.message });
            else if (err.message === 'Invalid deadline') sendResponse(res, 400, { error: true, code: '108207', message: err.message });
            else if (err.message === 'Some employee id are invalid') sendResponse(res, 400, { error: true, code: '108208', message: err.message });
            else if (err.message === 'You can\'t have both billing systems active') sendResponse(res, 400, { error: true, code: '108209', message: err.message });
            else if (err.message === 'Invalid fixed rate') sendResponse(res, 400, { error: true, code: '108210', message: err.message });
            else if (err.message === 'Invalid hourly rate') sendResponse(res, 400, { error: true, code: '108211', message: err.message });
            else if (err.message === 'Invalid estimate hour') sendResponse(res, 400, { error: true, code: '108212', message: err.message });
            else if (err.message === 'Start date can\'t be set after deadline') sendResponse(res, 400, { error: true, code: '108213', message: err.message });
            else errorHandler(res, err);
        }
    }

    /**
     * Fonction de suppression d'un projet (DELETE /project/:id)
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

            // Vérification de si le projet existe
            const project: ProjectI = await globalUtils.findOne(Project, id);
            if (!project) throw new Error('Invalid project id');

            // Suppression de du projet
            await globalUtils.deleteOne(Project, id);

            // Envoi de la réponse
            sendResponse(res, 200, { error: false, message: 'Project successfully deleted' });
        } catch (err: any) {
            if (err.message === 'You do not have the required permissions') sendResponse(res, 400, { error: true, code: '401002', message: err.message });
            else if (err.message === 'Missing id field') sendResponse(res, 400, { error: true, code: '108251', message: err.message });
            else if (err.message === 'Invalid project id') sendResponse(res, 400, { error: true, code: '108252', message: err.message });
            else errorHandler(res, err);
        }
    }

    /**
     * Fonction de transformation d'un projet en facture (POST /project/transform/:id)
     * @param req express Request
     * @param res express Response
     */
    static transformToBill = async (req: Request, res: Response) => {
        try {
            // Vérification de si l'utilisateur à les permissions de faire la requête
            const hasPermission = globalUtils.checkPermission(userUtils.getRequestUser(req), 'user');
            if (!hasPermission) throw new Error('You do not have the required permissions');

            // Récupération de toutes les données du body
            const { id } = req.params;

            // Vérification de si toutes les données nécessaire sont présentes
            if (!id) throw new Error('Missing id field');

            // Vérification de si le projet existe
            const project: ProjectI = await globalUtils.findOne(Project, id);
            if (!project) throw new Error('Invalid project id');

            // Transformation du projet
            const bill = await projectUtils.transformProjectToBill(project);

            // Vérification de si le client existe
            const customer: ClientI = await globalUtils.findOne(Client, bill.clientId as string);
            if (!customer) throw new Error('Invalid customer id');

            // Envoi d'une notification
            sendNotificationToOne('Nouvelle facture', 'Une nouvelle facture à été émise en votre nom. Cliquez ici pour la consulter.', customer, bill._id, 'Facture');

            // Envoi de la réponse
            sendResponse(res, 200, { error: false, message: 'Project successfully transformed', billId: bill._id });
        } catch (err: any) {
            if (err.message === 'You do not have the required permissions') sendResponse(res, 400, { error: true, code: '401002', message: err.message });
            else if (err.message === 'Missing id field') sendResponse(res, 400, { error: true, code: '108301', message: err.message });
            else if (err.message === 'Invalid project id') sendResponse(res, 400, { error: true, code: '108302', message: err.message });
            else errorHandler(res, err);
        }
    }
}
