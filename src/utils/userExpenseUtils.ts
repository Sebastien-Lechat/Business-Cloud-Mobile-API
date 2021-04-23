import { UserExpenseI, UserExpenseJsonI } from '../interfaces/userExpenseInterface';
import { UserObject } from '../interfaces/userInterface';
import { UserExpense } from '../models/UserExpense';
import { globalUtils } from './globalUtils';

/**
 * Fonction générer le JSON de retour d'une note de frais.
 * @param userExpense Note de frais pour lequel on génère le JSON.
 * @return Retourne le JSON.
 */
const generateUserExpenseJSON = (userExpense: UserExpenseI): UserExpenseJsonI => {
    const toReturn = {
        userExpenseNum: userExpense.userExpenseNum,
        id: userExpense._id,
        price: userExpense.price,
        file: userExpense.file,
        category: userExpense.category,
        description: userExpense.description,
        userId: userExpense.userId,
        accountNumber: userExpense.accountNumber,
        createdAt: userExpense.createdAt,
        updatedAt: userExpense.updatedAt,
    };

    return toReturn;
};

/**
 * Fonction pour retourner la liste des notes de frais.
 * @param user Utilisateur pour lequel on génère la liste
 * @return Retourne le JSON
 */
const getUserExpenseList = async (user: UserObject): Promise<UserExpenseJsonI[]> => {
    const userExpenseList: UserExpenseJsonI[] = [];
    if (user.data.role === 'Gérant') {
        // Récupération de toutess les notes de frais
        const userExpenses = await globalUtils.findMany(UserExpense, {});

        // Mise en forme
        userExpenses.map((userExpense: UserExpenseI) => {
            userExpenseList.push(generateUserExpenseJSON(userExpense));
        });

        return userExpenseList;
    } else {
        // Récupération de toutess les notes de frais
        const userExpenses = await globalUtils.findMany(UserExpense, { userId: user.data._id });

        // Mise en forme
        userExpenses.map((userExpense: UserExpenseI) => {
            userExpenseList.push(generateUserExpenseJSON(userExpense));
        });

        return userExpenseList;
    }
};

const userExpenseUtils = {
    generateUserExpenseJSON,
    getUserExpenseList
};

export { userExpenseUtils };

