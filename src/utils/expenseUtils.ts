import { ExpenseI, ExpenseJsonI } from '../interfaces/expenseInterface';

/**
 * Fonction générer le JSON de retour d'une dépense.
 * @param expense Dépense pour lequel on génère le JSON.
 * @return Retourne le JSON.
 */
const generateExpenseJSON = (expense: ExpenseI): ExpenseJsonI => {
    const toReturn = {
        expenseNum: expense.expenseNum,
        id: expense._id,
        price: expense.price,
        accountNumber: expense.accountNumber,
        category: expense.category,
        file: expense.file,
        description: expense.description,
        userId: expense.userId,
        projectId: expense.projectId,
        invoiced: expense.invoiced,
        createdAt: expense.createdAt,
        updatedAt: expense.updatedAt,
    };

    return toReturn;
};

/**
 * Fonction pour retourner la liste des dépenses.
 * @return Retourne le JSON
 */
const getExpenseList = async (): Promise<ExpenseJsonI[]> => {
    const expenseList: ExpenseJsonI[] = [];

    return expenseList;
};

const expenseUtils = {
    generateExpenseJSON,
    getExpenseList
};

export { expenseUtils };

