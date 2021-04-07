import validator from 'validator';
import { Bill } from '../models/Bill';
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
        if (estimateNumber.substring(0, 3) !== 'EST') return false;
        if (estimateNumber.length !== 9) return false;
        const estimates = await globalUtils.findMany(Bill, { estimateNum: estimateNumber });
        if (estimates.length !== 0) return false;
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
     * Vérification de la taxe de la facture
     * @param taxe taxe à vérifier
     */
    static validTaxe(taxe: string): number | undefined {
        return validator.toFloat(taxe);
    }

}
