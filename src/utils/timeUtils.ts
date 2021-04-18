import { ProjectI } from '../interfaces/projectInterface';
import { TimeI, TimeJsonI } from '../interfaces/timeInterface';

/**
 * Fonction générer le JSON de retour d'un temps.
 * @param time Temps pour lequel on génère le JSON.
 * @return Retourne le JSON.
 */
const generateTimeJSON = (time: TimeI): TimeJsonI => {
    const toReturn = {
        id: time._id,
        userId: time.userId,
        taskId: time.taskId,
        projectId: time.projectId,
        billable: time.billable,
        duration: time.duration,
        createdAt: time.createdAt,
        updatedAt: time.updatedAt,
    };

    return toReturn;
};

/**
 * Fonction pour retourner la liste des temps.
 * @return Retourne le JSON
 */
const getTimeList = async (projectId?: string): Promise<TimeJsonI[]> => {
    const expenseList: TimeJsonI[] = [];

    return expenseList;
};

const timeUtils = {
    generateTimeJSON,
    getTimeList
};

export { timeUtils };

