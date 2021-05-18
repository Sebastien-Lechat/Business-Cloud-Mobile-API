import { TimeI, TimeJsonI } from '../interfaces/timeInterface';
import { Time } from '../models/Time';

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
    const timeList: TimeJsonI[] = [];
    if (projectId) {
        // Récupération de toutess les notes de frais
        const times = await Time.find({ projectId: projectId }).populate('userId', { _id: 1, name: 1 }).sort({ createdAt: -1 });

        // Mise en forme
        times.map((time: TimeI) => {
            timeList.push(generateTimeJSON(time));
        });

        return timeList;
    } else {
        // Récupération de toutess les notes de frais
        const times = await Time.find({}).populate('userId', { _id: 1, name: 1 }).sort({ createdAt: -1 });

        // Mise en forme
        times.map((time: TimeI) => {
            timeList.push(generateTimeJSON(time));
        });

        return timeList;
    }
};

const timeUtils = {
    generateTimeJSON,
    getTimeList
};

export { timeUtils };

