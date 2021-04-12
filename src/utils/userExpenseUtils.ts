import { UserExpenseI, UserExpenseJsonI } from '../interfaces/userExpense';
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
 * @return Retourne le JSON
 */
const getUserExpenseList = async (): Promise<UserExpenseJsonI[]> => {
    const userExpenseList: UserExpenseJsonI[] = [];

    return userExpenseList;
};

const userExpenseUtils = {
    generateUserExpenseJSON,
    getUserExpenseList
};

export { userExpenseUtils };

