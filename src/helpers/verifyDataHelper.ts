import validator from 'validator';
import { Bill } from '../models/Bill';
import { Estimate } from '../models/Estimate';
import { Expense } from '../models/Expense';
import { Project } from '../models/Project';
import { UserExpense } from '../models/UserExpense';
import { globalUtils } from '../utils/globalUtils';

export default class VerifyData {
    /**
     * Vérification de si l'email est bien au bon format
     * @param email Email à vérifier
     */
    static validEmail(email: string): boolean {
        return validator.isEmail(email);
    }

    /**
     * Vérification de si le téléphone est au bon format
     * @param phone Téléphone à vérifier
     */
    static validPhone(phone: string): boolean {
        return validator.isMobilePhone(phone);
    }

    /**
     * Vérification de si le mot de passe est assez fort
     * @param password Mot de passe à vérifier
     */
    static validPassword(password: string): boolean {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{7,}$/;
        if (password.trim().length < 7 || password.trim().length > 30) return false;
        else return regex.test(password);
    }

    /**
     * Vérification de si la date est au bon format
     * @param date Date à vérifier
     */
    static validDate(date: string): boolean {
        return validator.isDate(date, { format: 'DD-MM-YYYY', strictMode: true, delimiters: ['-', '/', '.'] });
    }

    /**
     * Vérification de si le rôle est au bon format
     * @param role Rôle à vérifier
     */
    static validRole(role: string): boolean {
        return (role === 'Gérant') ? false : true;
    }


    /**
     * Vérification de si le numéro de tva est au bon format
     * @param zip Code postal à vérifier
     */
    static validPostalCode(zip: string): boolean {
        return validator.isPostalCode(zip, 'FR');
    }

    /**
     * Vérification du statut de la facture
     * @param status Statut à vérifier
     */
    static validBillStatus(status: string): boolean {
        return (status === 'Non payée' || status === 'Partiellement payée' || status === 'Payée' || status === 'En retard') ? true : false;
    }

    /**
     * Vérification du statut du devis
     * @param status Statut à vérifier
     */
    static validEstimateStatus(status: string): boolean {
        return (status === 'En attente' || status === 'Refusé' || status === 'Accepté' || status === 'En retard') ? true : false;
    }

    /**
     * Vérification du statut du projet
     * @param status Statut à vérifier
     */
    static validProjectStatus(status: string): boolean {
        return (status === 'En attente' || status === 'En cours' || status === 'Terminé' || status === 'En retard') ? true : false;
    }

    /**
     * Vérification du numéro de facture
     * @param billNumber Numéro à vérifier
     */
    static async validBillNumber(billNumber: string): Promise<boolean> {
        if (billNumber.substring(0, 3) !== 'FAC') return false;
        if (billNumber.length !== 9) return false;
        const bills = await globalUtils.findMany(Bill, { billNum: billNumber });
        if (bills.length !== 0) return false;
        return true;
    }

    /**
     * Vérification du numéro de devis
     * @param estimateNumber Numéro à vérifier
     */
    static async validEstimateNumber(estimateNumber: string): Promise<boolean> {
        if (estimateNumber.substring(0, 3) !== 'DEV') return false;
        if (estimateNumber.length !== 9) return false;
        const estimates = await globalUtils.findMany(Estimate, { estimateNum: estimateNumber });
        if (estimates.length !== 0) return false;
        return true;
    }

    /**
     * Vérification du numéro de note de frais
     * @param userExpenseNumber Numéro à vérifier
     */
    static async validUserExpenseNumber(userExpenseNumber: string): Promise<boolean> {
        if (userExpenseNumber.substring(0, 4) !== 'UEXP') return false;
        if (userExpenseNumber.length !== 10) return false;
        const userExpenses = await globalUtils.findMany(UserExpense, { userExpenseNum: userExpenseNumber });
        if (userExpenses.length !== 0) return false;
        return true;
    }

    /**
     * Vérification du numéro de note de frais
     * @param expenseNumber Numéro à vérifier
     */
    static async validExpenseNumber(expenseNumber: string): Promise<boolean> {
        if (expenseNumber.substring(0, 3) !== 'EXP') return false;
        if (expenseNumber.length !== 9) return false;
        const expenses = await globalUtils.findMany(Expense, { expenseNum: expenseNumber });
        if (expenses.length !== 0) return false;
        return true;
    }

    /**
     * Vérification du numéro de projet
     * @param projectNumber Numéro à vérifier
     */
    static async validProjectNumber(projectNumber: string): Promise<boolean> {
        if (projectNumber.substring(0, 3) !== 'PRO') return false;
        if (projectNumber.length !== 9) return false;
        const projects = await globalUtils.findMany(Project, { projectNum: projectNumber });
        if (projects.length !== 0) return false;
        return true;
    }

    /**
     * Vérification de la validité de la deadline
     * @param deadline Deadline à vérifier
     */
    static validDeadline(deadline: string): boolean {
        // if (!validator.isDate(deadline, { format: 'DD-MM-YYYY', strictMode: true, delimiters: ['-', '/', '.'] })) return false;
        return ((new Date(deadline).getTime() - Date.now()) > 0) ? true : false;
    }

    /**
     * Vérification de la taxe
     * @param taxe Taxe à vérifier
     */
    static validTaxe(taxe: string | number): number {
        if (typeof taxe === 'number') return validator.toFloat((taxe as number).toFixed(2));
        return validator.toFloat(taxe);
    }

    /**
     * Vérification de la validité d'un nombre
     * @param num Nombre à vérifier
     */
    static validFloat(num: string): number {
        if (typeof num === 'number') return validator.toFloat((num as number).toFixed(2));
        else return validator.toFloat(num);
    }

    /**
     * Vérification de la validité d'un nombre
     * @param num Nombre à vérifier
     */
    static validInt(num: string | number): number {
        if (typeof num === 'number') return Math.round(num);
        else return validator.toInt(num);
    }

    /**
     * Vérification du prix
     * @param price Prix à vérifier
     */
    static validPrice(price: string | number): number {
        if (typeof price === 'number') return validator.toFloat((price as number).toFixed(2));
        else return validator.toFloat(price);
    }

    /**
     * Vérification du numéro de compte
     * @param accountNumber Numéro de compte à vérifier
     */
    static validAccountNumber(accountNumber: string | number): number {
        if (typeof accountNumber === 'number') return Math.round(accountNumber);
        else return validator.toInt(accountNumber);
    }
}
