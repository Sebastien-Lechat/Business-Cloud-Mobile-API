import { ProjectI, ProjectJsonI } from '../interfaces/projectInterface';

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
    };

    return toReturn;
};

/**
 * Fonction pour retourner la liste des projets.
 * @return Retourne le JSON
 */
const getProjectList = async (): Promise<ProjectJsonI[]> => {
    const expenseList: ProjectJsonI[] = [];

    return expenseList;
};

const projectUtils = {
    generateProjectJSON,
    getProjectList
};

export { projectUtils };

