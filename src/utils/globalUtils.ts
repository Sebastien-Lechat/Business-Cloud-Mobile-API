import mongoose from 'mongoose';
import { BillArticleI, BillI } from '../interfaces/billInterface';
import { EstimateArticleI, EstimateI } from '../interfaces/estimateInterface';
import { ExpenseI } from '../interfaces/expenseInterface';
import { StatisticI } from '../interfaces/globalInterface';
import { ProjectI } from '../interfaces/projectInterface';
import { UserExpenseI } from '../interfaces/userExpenseInterface';
import { ClientI, UserObject } from '../interfaces/userInterface';
import { Bill } from '../models/Bill';
import { Client } from '../models/Client';
import { Estimate } from '../models/Estimate';
import { Expense } from '../models/Expense';
import { Project } from '../models/Project';
import { User } from '../models/User';
import { UserExpense } from '../models/UserExpense';
import path from 'path';
import https from 'https';
import fs from 'fs';
import VerifyData from '../helpers/verifyDataHelper';
import { ArticleI } from '../interfaces/articleInterface';

/**
 * Fonction de vérification des permissions pour une requête
 * @param user Utilisateur qui fait la requête
 * @param type Type requis pour faire la requête
 * @param admin Rôle requis pour faire la requête
 * @returns Retourne un booléen de si l'email existe ou non
 */
const checkPermission = (user: UserObject, type: 'user' | 'client', admin?: boolean): boolean => {
    if (user.type === 'client') {
        if (type === 'client') return true;
        else return false;
    } else if (user.type === 'user') {
        if (type === 'client') return true;
        else if (type === 'user' && admin && user.data.role === 'Gérant') return true;
        else if (type === 'user' && admin && user.data.role !== 'Gérant') return false;
        else return true;
    } else return false;
};

/**
 * Fonction pour trouver un document dans une collection.
 * @param model Modèle mongoose
 * @param id Id pour filtrer
 */
const findOne = async (model: mongoose.Model<any, any>, id: string): Promise<any> => {
    if (id.toString().length !== 24) return null;
    return await model.findOne({ _id: mongoose.Types.ObjectId(id) });
};

/**
 * Fonction pour trouver un document dans une collection et le populate.
 * @param model Modèle mongoose
 * @param id Id pour filtrer
 * @param populate Données à populate
 */
const findOneAndPopulate = async (model: mongoose.Model<any, any>, id: string, populate: string[]): Promise<any> => {
    if (id.toString().length !== 24) return null;
    return JSON.parse(JSON.stringify(await model.findOne({ _id: mongoose.Types.ObjectId(id) }).populate(populate)));
};

/**
 * Fonction pour trouver plusieurs documents dans une collection en fonction d'un filtre.
 * @param model Modèle mongoose
 * @param filter Filtre
 */
const findMany = async (model: mongoose.Model<any, any>, filter: any): Promise<any> => {
    return await model.find(filter);
};

/**
 * Fonction pour trouver plusieurs documents dans une collectionen fonction d'un filtre.
 * @param model Modèle mongoose
 * @param filter Filtre
 * @param populate Données à populate
 */
const findManyAndPopulate = async (model: mongoose.Model<any, any>, filter: any, populate: string[]): Promise<any> => {
    return JSON.parse(JSON.stringify(await model.find(filter).populate(populate)));
};

/**
 * Fonction pour mettre à jour un document dans une collection.
 * @param model Modèle mongoose
 * @param filter filtre
 * @param updateData Données à mettre à jour
 */
const updateOne = async (model: mongoose.Model<any, any>, filter: any, updateData: object): Promise<any> => {
    return await model.updateOne(filter, { $set: updateData });
};

/**
 * Fonction pour mettre à jour un document dans une collection.
 * @param model Modèle mongoose
 * @param id Id pour filtrer
 * @param updateData Données à mettre à jour
 */
const updateOneById = async (model: mongoose.Model<any, any>, id: string, updateData: any): Promise<any> => {
    if (id.toString().length !== 24) return null;
    return await model.updateOne({ _id: mongoose.Types.ObjectId(id) }, { $set: updateData });
};

/**
 * Fonction pour supprimer un document dans une collection.
 * @param model Modèle mongoose
 * @param id Id pour filtrer
 */
const deleteOne = async (model: mongoose.Model<any, any>, id: string): Promise<any> => {
    if (id.toString().length !== 24) return null;
    return await model.deleteOne({ _id: mongoose.Types.ObjectId(id) });
};

/**
 * Fonction pour retourner le prochain numéro disponible.
 * @param acronym Filtre pour savoir sur quel table la recherche doit être faite
 */
const findNextNumber = async (acronym: string): Promise<string> => {
    if (acronym === 'FAC') {
        const bills: BillI[] = await Bill.find();
        const allNumber: number[] = bills.map((bill: BillI) => { if (bill.billNum.split(acronym)[1]) return parseInt(bill.billNum.split(acronym)[1], 10); }) as number[];
        const nextNumber = findNewMinNumber(allNumber);
        return acronym + '0'.repeat(6 - nextNumber.toString().length) + nextNumber;
    } else if (acronym === 'DEV') {
        const estimates: EstimateI[] = await Estimate.find();
        const allNumber: number[] = estimates.map((estimate: EstimateI) => { if (estimate.estimateNum.split(acronym)[1]) return parseInt(estimate.estimateNum.split(acronym)[1], 10); }) as number[];
        const nextNumber = findNewMinNumber(allNumber);
        return acronym + '0'.repeat(6 - nextNumber.toString().length) + nextNumber;
    } else if (acronym === 'EXP') {
        const expenses: ExpenseI[] = await Expense.find();
        const allNumber: number[] = expenses.map((expense: ExpenseI) => { if (expense.expenseNum.split(acronym)[1]) return parseInt(expense.expenseNum.split(acronym)[1], 10); }) as number[];
        const nextNumber = findNewMinNumber(allNumber);
        return acronym + '0'.repeat(6 - nextNumber.toString().length) + nextNumber;
    } else if (acronym === 'UEXP') {
        const expenses: UserExpenseI[] = await UserExpense.find();
        const allNumber: number[] = expenses.map((expense: UserExpenseI) => { if (expense.userExpenseNum.split(acronym)[1]) return parseInt(expense.userExpenseNum.split(acronym)[1], 10); }) as number[];
        const nextNumber = findNewMinNumber(allNumber);
        return acronym + '0'.repeat(6 - nextNumber.toString().length) + nextNumber;
    } else {
        const projects: ProjectI[] = await Project.find();
        const allNumber: number[] = projects.map((project: ProjectI) => { if (project.projectNum.split(acronym)[1]) return parseInt(project.projectNum.split(acronym)[1], 10); }) as number[];
        const nextNumber = findNewMinNumber(allNumber);
        return acronym + '0'.repeat(6 - nextNumber.toString().length) + nextNumber;
    }
};

/**
 * Fonction pour retourner le prochain numéro disponible.
 * @param user Utilisateur pour lequel on retourne les statistiques
 */
const findStatistics = async (user: UserObject): Promise<StatisticI> => {
    let gainTotal = 0;
    let amountTotal = 0;
    let expenseTotal = 0;
    let projectTotal = 0;
    let projectTimeTotal = 0;
    const statistics: StatisticI = {};
    if (user.type === 'client') {
        const bills: BillI[] = await globalUtils.findManyAndPopulate(Bill, { clientId: mongoose.Types.ObjectId(user.data._id) }, ['clientId']);

        // Calcul des gains
        bills.map((bill: BillI) => {
            bill.amountPaid ? gainTotal += bill.amountPaid : gainTotal += 0;
            bill.totalTTC ? amountTotal += bill.totalTTC : amountTotal += 0;
        });

        statistics.gainTotal = gainTotal;
        statistics.projectTotal = await Project.countDocuments({ clientId: mongoose.Types.ObjectId(user.data._id) });
        statistics.billUnpaidTotal = await Bill.countDocuments({ status: { $ne: 'Payée' }, clientId: mongoose.Types.ObjectId(user.data._id) });
        statistics.billUnpaidAmountTotal = amountTotal - gainTotal;

        return statistics;
    } else if (user.type === 'user') {
        if (user.data.role === 'Gérant') {
            // Calcul des gains
            const bills: BillI[] = await Bill.find();
            bills.map((bill: BillI) => {
                bill.amountPaid ? gainTotal += bill.amountPaid : gainTotal += 0;
                bill.totalTTC ? amountTotal += bill.totalTTC : amountTotal += 0;
            });

            // Calcul des dépenses
            const expenses: ExpenseI[] = await Expense.find();
            expenses.map((expense: ExpenseI) => {
                expense.price ? expenseTotal += expense.price : expenseTotal += 0;
            });

            // Calcul du temps passé sur les projets
            const projects: ProjectI[] = await Project.find();
            projects.map((project: ProjectI) => {
                project.billing?.billableTime ? projectTimeTotal += project.billing?.billableTime : projectTimeTotal += 0;
                projectTotal += 1;
            });

            statistics.gainTotal = gainTotal;
            statistics.expenseTotal = expenseTotal;
            statistics.employeeTotal = await User.countDocuments();
            statistics.customerTotal = await Client.countDocuments();
            statistics.projectTotal = projectTotal;
            statistics.projectTimeTotal = projectTimeTotal;
            statistics.billUnpaidTotal = await Bill.countDocuments({ status: { $ne: 'Payée' } });
            statistics.billUnpaidAmountTotal = amountTotal - gainTotal;
            return statistics;
        } else {
            let bills: BillI[] = await globalUtils.findManyAndPopulate(Bill, {}, ['clientId']);

            // Filtre de tout ce qui ne concerne pas l'employé
            bills = bills.filter((bill: BillI) => {
                const client = bill.clientId as ClientI;
                return (client.userId) ? client.userId.toString() === user.data._id.toString() : false;
            });

            // Calcul des gains
            bills.map((bill: BillI) => {
                bill.amountPaid ? gainTotal += bill.amountPaid : gainTotal += 0;
                bill.totalTTC ? amountTotal += bill.totalTTC : amountTotal += 0;
            });

            // Calcul des dépenses
            const expenses: ExpenseI[] = await Expense.find({ userId: mongoose.Types.ObjectId(user.data._id) });
            expenses.map((expense: ExpenseI) => {
                expense.price ? expenseTotal += expense.price : expenseTotal += 0;
            });

            // Calcul du temps passé sur les projets
            const projects: ProjectI[] = await Project.find({ 'employees.id': mongoose.Types.ObjectId(user.data._id) });
            projects.map((project: ProjectI) => {
                project.billing?.billableTime ? projectTimeTotal += project.billing?.billableTime : projectTimeTotal += 0;
                projectTotal += 1;
            });

            statistics.gainTotal = gainTotal;
            statistics.expenseTotal = expenseTotal;
            statistics.employeeTotal = await User.countDocuments();
            statistics.customerTotal = await Client.countDocuments({ userId: mongoose.Types.ObjectId(user.data._id) });
            statistics.projectTotal = projectTotal;
            statistics.projectTimeTotal = projectTimeTotal;
            statistics.billUnpaidTotal = await Bill.countDocuments({ status: { $ne: 'Payée' } });
            statistics.billUnpaidAmountTotal = amountTotal - gainTotal;
            return statistics;
        }
    } else return statistics;
};

/**
 * Fonction pour généré une facture ou un devis.
 */
const generateInvoice = async (type: string, id: string): Promise<{ file: any, fileData: BillI | EstimateI } | null> => {
    // Vérification de si la factue ou le devis existe
    const fileData: BillI | EstimateI =
        (type === 'bill') ? await Bill.findOne({ _id: mongoose.Types.ObjectId(id) }).populate('articles.articleId') :
            (type === 'estimate') ? await Estimate.findOne({ _id: mongoose.Types.ObjectId(id) }).populate('articles.articleId') :
                null;

    // Vérification de si le client existe
    const customer: ClientI = await globalUtils.findOne(Client, fileData.clientId as string);
    if (!customer) throw new Error('Invalid customer id');

    if (fileData) {
        // Génération des données de la facture
        const invoice = {
            header: type === 'bill' ? 'FACTURE' : 'DEVIS',
            logo: 'https://i.ibb.co/898J5pv/BUSINESS-CLOUD-Logo.png',
            from: 'Business Cloud\n70 rue Marius Aufan\nLevallois-Perret, 92300 France',
            to: customer.name,
            ship_to: (customer.address && customer.city && customer.zip && customer.country) ? customer.address + '\n' + customer.city + ', ' + customer.zip + ' ' + customer.country : 'Adresse indéterminée',
            currency: 'eur',
            number: type === 'bill' ? (fileData as BillI).billNum : (fileData as EstimateI).estimateNum,
            payment_terms: 'Credit card',
            date: VerifyData.formatShortDate(new Date()),
            due_date: VerifyData.formatShortDate(new Date(fileData.deadline)),
            items: generatearticleList(fileData.articles),
            fields: {
                tax: true,
            },
            custom_fields: [{
                name: 'Status',
                value: fileData.status,
            }],
            amount_paid: (fileData as BillI).amountPaid ? (fileData as BillI).amountPaid : undefined,
            tax: fileData.totalTTC - fileData.totalHT,
            to_title: 'Facturé à',
            ship_to_title: 'Adresse de facturation',
            date_title: 'Date',
            payment_terms_title: 'Type payement',
            due_date_title: 'Date de paiement',
            purchase_order_title: 'Purchase Order',
            quantity_header: 'Quantité',
            item_header: 'Objet',
            unit_cost_header: 'Coût HT',
            amount_header: 'Total HT',
            subtotal_title: 'Total HT',
            discounts_title: 'Réductions',
            tax_title: 'Taxe',
            shipping_title: 'Livraison',
            total_title: 'Total TTC',
            amount_paid_title: 'Montant payé',
            balance_title: 'Balance',
            terms_title: 'Termes',
            notes_title: 'Notes',
        };

        const postData = JSON.stringify(invoice);

        const options: https.RequestOptions = {
            hostname: 'invoice-generator.com',
            port: 443,
            path: '/',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData)
            }
        };

        const file = await invoiceRequest(fileData, type, options, postData, (error: any) => {
            console.log('Error'.red, error);
        });
        return { file, fileData };

    } else return null;
};

/**
 * Fonction pour retourner le __dirname.
 */
const dirname = async (): Promise<string> => {
    return path.resolve();
};

/**
 * Fonction pour retourner le séparateur système utilisé.
 */
const systemSeparator = async (): Promise<string> => {
    switch (require('os').platform()) {
        case ('win32'):
            return '\\';
        case ('linux'):
            return '/';
        default:
            return '/';
    }
};

const globalUtils = {
    findOne,
    findOneAndPopulate,
    findMany,
    findManyAndPopulate,
    updateOne,
    updateOneById,
    deleteOne,
    findNextNumber,
    findStatistics,
    checkPermission,
    generateInvoice,
    systemSeparator,
    dirname
};

export { globalUtils };

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

const findNewMinNumber = (allNumber: number[]) => {
    let count = 1;
    let nextNumber = Math.min(...allNumber) + count;
    while (allNumber.find((num) => num === Math.min(...allNumber) + count)) {
        count++;
        nextNumber = Math.min(...allNumber) + count;
    }
    return nextNumber;
};

const invoiceRequest = (fileData: BillI | EstimateI, type: string, options: https.RequestOptions, postData: string, error: any) => {
    return new Promise<any>(async (resolve, reject) => {
        if (!fs.existsSync('./tmpInvoice/')) {
            fs.mkdirSync('./tmpInvoice/');
        }
        const file: fs.WriteStream = fs.createWriteStream(path.join('./tmpInvoice/', (((fileData as BillI).billNum) ? (fileData as BillI).billNum + '.pdf' : (fileData as EstimateI).estimateNum + '.pdf')));
        const req = https.request(options, (res) => {
            res.on('data', (chunk) => {
                file.write(chunk);
            })
                .on('end', () => {
                    resolve(file.end());
                })
                .on('error', (errorTest: any) => {
                    console.log('ErrorTest'.red, errorTest);
                });
        });
        req.write(postData);
        req.end();
        req.on('error', error);
    });
};

const generatearticleList = (articles: EstimateArticleI[] | BillArticleI[]): { name: string, quantity: number, unit_cost: number, description: string }[] | [] => {
    const articleList: { name: string, quantity: number, unit_cost: number, description: string }[] = [];
    articles.map((article) => {
        articleList.push({
            name: (article.articleId as ArticleI).name,
            quantity: article.quantity,
            unit_cost: (article.articleId as ArticleI).price,
            description: 'TVA - ' + (article.articleId as ArticleI).tva + '%' + (((article.articleId as ArticleI).description && (article.articleId as ArticleI).description !== '') ? '| ' + (article.articleId as ArticleI).description : '')
        });
    });
    return articleList;
};
