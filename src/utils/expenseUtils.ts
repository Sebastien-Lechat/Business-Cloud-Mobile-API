import { ExpenseI, ExpenseJsonI } from '../interfaces/expenseInterface';
import { Expense } from '../models/Expense';
import { globalUtils } from './globalUtils';

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
const getExpenseList = async (projectId?: string): Promise<ExpenseJsonI[]> => {
    const expenseList: ExpenseJsonI[] = [];
    if (projectId) {
        // Récupération de toutess les notes de frais
        const expenses = await globalUtils.findMany(Expense, { projectId: projectId });

        // Mise en forme
        expenses.map((userExpense: ExpenseI) => {
            expenseList.push(generateExpenseJSON(userExpense));
        });

        return expenseList;
    } else {
        // Récupération de toutess les notes de frais
        const userExpenses = await globalUtils.findMany(Expense, {});

        // Mise en forme
        userExpenses.map((userExpense: ExpenseI) => {
            expenseList.push(generateExpenseJSON(userExpense));
        });

        return expenseList;
    }
};

const expenseUtils = {
    generateExpenseJSON,
    getExpenseList
};

export { expenseUtils };

