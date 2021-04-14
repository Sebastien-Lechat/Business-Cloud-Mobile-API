import { ProjectI, ProjectJsonI } from '../interfaces/projectInterface';
import { Project } from '../models/Project';
import { globalUtils } from './globalUtils';

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
        clientId: project.clientId,
        progression: project.progression,
        startDate: project.startDate,
        deadline: project.deadline,
        employees: project.employees,
        fixedRate: (project.fixedRate) ? project.fixedRate : undefined,
        hourlyRate: (project.hourlyRate) ? project.hourlyRate : undefined,
        estimateHour: project.estimateHour,
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
    const projects = await globalUtils.findMany(Project, {});

    // Mise en forme
    projects.map((project: ProjectI) => {
        projectList.push(generateProjectJSON(project));
    });

    return projectList;
};

const projectUtils = {
    generateProjectJSON,
    getProjectList
};

export { projectUtils };

