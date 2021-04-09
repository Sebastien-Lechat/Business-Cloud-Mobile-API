import mongoose from 'mongoose';
import { BillI } from '../interfaces/billInterface';
import { ClientI, UserObject } from '../interfaces/userInterface';
import { Bill } from '../models/Bill';
import { globalUtils } from './globalUtils';

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

/**
 * Fonction pour retourner la liste des factures en fonction du rôle.
 * @param user Utilisateur pour lequel on génère la liste
 */
const getBillList = async (user: UserObject): Promise<BillI[]> => {
    let billList: BillI[] = [];
    if (user.type === 'client') {
        // Récupération de toutes les factures concernants ce client
        billList = await globalUtils.findMany(Bill, { clientId: mongoose.Types.ObjectId(user.data._id) });

        // Envoi de la liste
        return billList;
    } else if (user.type === 'user') {
        if (user.data.role === 'Gérant') {
            // Récupération de toutes les factures
            billList = await globalUtils.findMany(Bill, {});

            // Mise en forme
            billList = billList.map((bill: BillI) => {
                return billUtils.generateBillJSON(bill);
            });

            // Envoi de la liste
            return billList;
        } else {
            // Récupération de toutes les factures
            billList = await globalUtils.findManyAndPopulate(Bill, {}, ['clientId']);

            // Filtre de tout ce qui ne concerne pas l'employé
            billList = billList.filter((bill: BillI) => {
                const client = bill.clientId as ClientI;
                bill.clientId = client._id;
                return (client.userId) ? client.userId.toString() === user.data._id.toString() : false;
            });

            // Mise en forme
            billList = billList.map((bill: BillI) => {

                return billUtils.generateBillJSON(bill);
            });

            // Envoi de la liste
            return billList;
        }
    } else return billList;
};

const billUtils = {
    generateBillJSON,
    getBillList
};

export { billUtils };
