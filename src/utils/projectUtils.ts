import mongoose from 'mongoose';
import { ProjectI, ProjectJsonI } from '../interfaces/projectInterface';
import { TimeI } from '../interfaces/timeInterface';
import { ClientI } from '../interfaces/userInterface';
import { Project } from '../models/Project';
import { Time } from '../models/Time';
import { globalUtils } from './globalUtils';
import { userUtils } from './userUtils';

/**
 * Fonction générer le JSON de retour d'un projet.
 * @param project Projet pour lequel on génère le JSON.
 * @return Retourne le JSON.
 */
const generateProjectJSON = (project: ProjectI): ProjectJsonI => {
    const toReturn = {
        id: project._id,
        projectNum: project.projectNum,
        title: project.title,
        status: project.status,
        clientId: (typeof project.clientId !== 'string') ? userUtils.generateShortUserJSON({ data: project.clientId as ClientI, type: 'client' }) : project.clientId,
        progression: project.progression,
        startDate: project.startDate,
        deadline: project.deadline,
        employees: project.employees,
        fixedRate: project.fixedRate,
        hourlyRate: project.hourlyRate,
        estimateHour: project.estimateHour,
        description: project.description,
        billing: project.billing,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
    };

    return toReturn;
};

/**
 * Fonction pour retourner la liste des projets.
 * @return Retourne le JSON
 */
const getProjectList = async (): Promise<ProjectJsonI[]> => {
    const projectList: ProjectJsonI[] = [];

    // Récupération de tous les projets
    const projects = await globalUtils.findManyAndPopulate(Project, {}, ['clientId']);

    // Mise en forme
    projects.map((project: ProjectI) => {
        projectList.push(generateProjectJSON(project));
    });

    return projectList;
};

/**
 * Fonction mettre à jour le projet avec le nouveau montant facturable et les dépenses
 * @return Retourne le JSON
 */
const updateProjectBilling = async (projectId: string): Promise<void> => {
    const times: TimeI[] = await Time.find({ projectId: mongoose.Types.ObjectId(projectId) });
    let totalTime = 0;
    times.map((time: TimeI) => {
        if (time.billable) totalTime += time.duration;
    });

    await Project.updateOne({ _id: mongoose.Types.ObjectId(projectId) }, { $set: { billing: { billableTime: totalTime } } });
};

const projectUtils = {
    generateProjectJSON,
    getProjectList,
    updateProjectBilling
};

export { projectUtils };

