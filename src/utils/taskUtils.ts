import { TaskI, TaskJsonI } from '../interfaces/taskInterface';
import { Task } from '../models/Task';
import { globalUtils } from './globalUtils';

/**
 * Fonction générer le JSON de retour d'une tâche.
 * @param task Tâche pour lequel on génère le JSON.
 * @return Retourne le JSON.
 */
const generateTaskJSON = (task: TaskI): TaskJsonI => {
    const toReturn = {
        id: task._id,
        name: task.name,
        progression: task.progression,
        description: task.description,
        projectId: task.projectId,
        employees: task.employees,
        startDate: task.startDate,
        deadline: task.deadline,
        estimateHour: task.estimateHour,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt,
    };

    return toReturn;
};

/**
 * Fonction pour retourner la liste des tâches.
 * @return Retourne le JSON
 */
const getTaskList = async (projectId?: string): Promise<TaskJsonI[]> => {
    const taskList: TaskJsonI[] = [];
    if (projectId) {
        // Récupération de toutess les notes de frais
        const tasks = await globalUtils.findMany(Task, { projectId: projectId });

        // Mise en forme
        tasks.map((task: TaskI) => {
            taskList.push(generateTaskJSON(task));
        });

        return taskList;
    } else {
        // Récupération de toutess les notes de frais
        const tasks = await globalUtils.findMany(Task, {});

        // Mise en forme
        tasks.map((task: TaskI) => {
            taskList.push(generateTaskJSON(task));
        });

        return taskList;
    }
};

const taskUtils = {
    generateTaskJSON,
    getTaskList
};

export { taskUtils };

