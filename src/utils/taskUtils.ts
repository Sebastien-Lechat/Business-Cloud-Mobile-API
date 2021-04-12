import { TaskI, TaskJsonI } from '../interfaces/taskInterface';

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
const getTaskList = async (): Promise<TaskJsonI[]> => {
    const expenseList: TaskJsonI[] = [];

    return expenseList;
};

const taskUtils = {
    generateTaskJSON,
    getTaskList
};

export { taskUtils };

