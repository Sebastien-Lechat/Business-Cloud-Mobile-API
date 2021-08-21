import mongoose from 'mongoose';
import { ArticleI } from '../interfaces/articleInterface';
import { BillI, BillJsonI } from '../interfaces/billInterface';
import { ClientI, UserObject } from '../interfaces/userInterface';
import { Bill } from '../models/Bill';
import { articleUtils } from './articleUtils';
import { globalUtils } from './globalUtils';
import { userUtils } from './userUtils';

/**
 * Fonction générer le JSON de réponse d'une facture.
 * @param bill Facture pour laquelle on génère le JSON
 * @return Retourne le JSON
 */
const generateBillJSON = (bill: BillI): BillJsonI => {
    const toReturn = {
        billNum: bill.billNum,
        id: bill._id,
        status: bill.status,
        clientId: (typeof bill.clientId !== 'string') ? userUtils.generateShortUserJSON({ data: bill.clientId as ClientI, type: 'client' }) : bill.clientId,
        enterpriseId: bill.enterpriseId,
        articles: bill.articles,
        reduction: bill.reduction,
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
 * @return Retourne le JSON
 */
const getBillList = async (user: UserObject): Promise<BillJsonI[]> => {
    const billList: BillJsonI[] = [];
    if (user.type === 'client') {
        // Récupération de toutes les factures concernants ce client
        const bills = await globalUtils.findManyAndPopulate(Bill, { clientId: mongoose.Types.ObjectId(user.data._id) }, ['clientId', 'articles.articleId']);

        // Mise en forme
        bills.map((bill: BillI) => {
            bill.articles.map((article) => {
                article.articleId = articleUtils.generateArticleJSON(article.articleId as ArticleI);
            });
            billList.push(billUtils.generateBillJSON(bill));
        });

        // Envoi de la liste
        return billList;
    } else if (user.type === 'user') {
        if (user.data.role === 'Gérant') {
            // Récupération de toutes les factures
            const bills = await globalUtils.findManyAndPopulate(Bill, {}, ['clientId', 'articles.articleId']);

            // Mise en forme
            bills.map((bill: BillI) => {
                bill.articles.map((article) => {
                    article.articleId = articleUtils.generateArticleJSON(article.articleId as ArticleI);
                });
                billList.push(billUtils.generateBillJSON(bill));
            });

            // Envoi de la liste
            return billList;
        } else {
            // Récupération de toutes les factures
            let bills = await globalUtils.findManyAndPopulate(Bill, {}, ['clientId', 'articles.articleId']);

            // Filtre de tout ce qui ne concerne pas l'employé
            bills = bills.filter((bill: BillI) => {
                const client = bill.clientId as ClientI;
                return (client.userId) ? client.userId.toString() === user.data._id.toString() : false;
            });

            // Mise en forme
            bills.map((bill: BillI) => {
                bill.articles.map((article) => {
                    article.articleId = articleUtils.generateArticleJSON(article.articleId as ArticleI);
                });
                billList.push(billUtils.generateBillJSON(bill));
            });

            // Envoi de la liste
            return billList;
        }
    } else return billList;
};

/**
 * Fonction pour retourner le montant modifié pour stripe
 * @param amount Montant de la facture
 * @return Retourne le JSON
 */
const getBillAmount = (amount: number): number => {
    if (amount % 1 === 0) {
        return parseFloat(amount + '00');
    } else {
        return parseFloat(amount.toString().split('.')[0] + amount.toString().split('.')[1]);
    }
};

const billUtils = {
    generateBillJSON,
    getBillAmount,
    getBillList
};

export { billUtils };
