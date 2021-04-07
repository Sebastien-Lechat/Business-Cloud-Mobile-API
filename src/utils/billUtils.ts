import { BillI } from '../interfaces/billInterface';

/**
 * Fonction générer le JSON de réponse d'une facture.
 * @param bill Facture pour laquelle on génère le JSON
 * @return Retourne le JSON
 */
const generateBillJSON = (bill: BillI): BillI => {
    const toReturn = {
        billNum: bill.billNum,
        id: bill.id,
        status: bill.status,
        clientId: bill.clientId,
        enterpriseId: bill.enterpriseId,
        articles: bill.articles,
        currency: (bill.currency) ? bill.currency : undefined,
        taxe: (bill.taxe !== undefined) ? bill.taxe : undefined,
        totalHT: bill.totalHT,
        totalTTC: bill.totalTTC,
        deadline: bill.deadline,
        amountPaid: (bill.amountPaid !== undefined) ? bill.amountPaid : undefined,
        payementDate: (bill.payementDate) ? bill.payementDate : undefined,
        createdAt: bill.createdAt,
        updatedAt: bill.updatedAt,
    };

    return toReturn;
};

const billUtils = {
    generateBillJSON,
};

export { billUtils };
