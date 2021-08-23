import mongoose from 'mongoose';
import { ArticleI } from '../interfaces/articleInterface';
import { BillI } from '../interfaces/billInterface';
import { ExpenseI } from '../interfaces/expenseInterface';
import { ProjectI, ProjectJsonI } from '../interfaces/projectInterface';
import { TimeI } from '../interfaces/timeInterface';
import { ClientI } from '../interfaces/userInterface';
import { Article } from '../models/Article';
import { Bill } from '../models/Bill';
import { Enterprise } from '../models/Entreprise';
import { Expense } from '../models/Expense';
import { Project } from '../models/Project';
import { Time } from '../models/Time';
import { globalUtils } from './globalUtils';
import { userUtils } from './userUtils';

/**
 * Fonction générer le JSON de retour d'un projet.
 * @param project Projet pour lequel on génère le JSON.
 * @return Retourne le JSON.
 */
const generateProjectJSON = (project: ProjectI): ProjectJsonI => {
    const toReturn = {
        id: project._id,
        projectNum: project.projectNum,
        title: project.title,
        status: project.status,
        clientId: (typeof project.clientId !== 'string') ? userUtils.generateShortUserJSON({ data: project.clientId as ClientI, type: 'client' }) : project.clientId,
        progression: project.progression,
        startDate: project.startDate,
        deadline: project.deadline,
        employees: project.employees,
        fixedRate: project.fixedRate,
        hourlyRate: project.hourlyRate,
        estimateHour: project.estimateHour,
        description: project.description,
        billing: project.billing,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
    };

    return toReturn;
};

/**
 * Fonction pour retourner la liste des projets.
 * @return Retourne le JSON
 */
const getProjectList = async (): Promise<ProjectJsonI[]> => {
    const projectList: ProjectJsonI[] = [];

    // Récupération de tous les projets
    const projects = await globalUtils.findManyAndPopulate(Project, {}, ['clientId']);

    // Mise en forme
    projects.map((project: ProjectI) => {
        projectList.push(generateProjectJSON(project));
    });

    return projectList;
};

/**
 * Fonction mettre à jour le projet avec le nouveau montant facturable et les dépenses
 * @return Retourne le JSON
 */
const updateProjectBilling = async (projectId: string): Promise<void> => {
    const times: TimeI[] = await Time.find({ projectId: mongoose.Types.ObjectId(projectId) });
    let totalTime = 0;
    times.map((time: TimeI) => {
        if (time.billable) totalTime += time.duration;
    });

    const expenses: ExpenseI[] = await Expense.find({ projectId: mongoose.Types.ObjectId(projectId) });
    let totalExpense = 0;
    expenses.map((expense: ExpenseI) => {
        if (expense.billable) totalExpense += expense.price;
    });

    await Project.updateOne({ _id: mongoose.Types.ObjectId(projectId) }, { $set: { billing: { billableTime: totalTime, additionalExpense: totalExpense } } });
};

/**
 * Fonction transformer le projet en une facture
 * @return Retourne l'id de la facture
 */
const transformProjectToBill = async (project: ProjectI): Promise<BillI> => {
    let times: TimeI[] = [];
    let expenses: ExpenseI[] = [];
    let totalHT = 0;
    let totalTTC = 0;
    const articles: { articleId: string, quantity: number }[] = [];

    // Récupération des temps et transformation en article
    times = await Time.find({ projectId: mongoose.Types.ObjectId(project._id) });
    if (times.length !== 0 && project.hourlyRate) {
        times.map(async (time: TimeI) => {
            if (time.billable) {
                let article: ArticleI;
                article = await Article.findOne({
                    name: time.taskName ? time.taskName : 'Activités diverses liés au projet',
                    price: project.hourlyRate as number,
                    tva: 0,
                });
                if (!article) {
                    article = await Article.create({
                        name: time.taskName ? time.taskName : 'Activités diverses liés au projet',
                        price: project.hourlyRate as number,
                        tva: 0,
                        accountNumber: 999999,
                        showAutoComplete: false,
                    });
                }
                const quantity = parseFloat((time.duration / (1000 * 60 * 60)).toFixed(2));
                articles.push({
                    articleId: article._id,
                    quantity: quantity,
                });
                totalHT += parseFloat((article.price * quantity).toFixed(2));
                totalTTC += parseFloat(((article.price * (1 + (article.tva / 100))) * quantity).toFixed(2));
            }
        });
    }

    // Récupération des dépenses et transformation en article
    expenses = await Expense.find({ projectId: mongoose.Types.ObjectId(project._id) });
    if (expenses.length !== 0) {
        expenses.map(async (expense: ExpenseI) => {
            if (expense.billable) {
                let article: ArticleI;
                article = await Article.findOne({
                    name: expense.category,
                    price: expense.price,
                    tva: 20,
                });
                if (!article) {
                    article = await Article.create({
                        name: expense.category,
                        price: expense.price,
                        tva: 20,
                        accountNumber: expense.accountNumber,
                        showAutoComplete: false,
                    });
                }
                articles.push({
                    articleId: article._id,
                    quantity: 1,
                });
                totalHT += parseFloat((article.price * 1).toFixed(2));
                totalTTC += parseFloat(((article.price * (1 + (article.tva / 100))) * 1).toFixed(2));
            }
        });
    }

    // Récupération des informations de l'entreprise
    const enterprise = await Enterprise.findOne();

    // Création de la facture
    const data = {
        status: 'Non payée',
        billNum: await globalUtils.findNextNumber('FAC'),
        deadline: new Date().setDate(new Date().getDate() + 30),
        clientId: project.clientId,
        enterpriseId: enterprise._id,
        articles: articles,
        totalHT: parseFloat(totalHT.toFixed(2)),
        totalTTC: parseFloat(totalTTC.toFixed(2)),
    };
    const bill: BillI = await Bill.create(data);


    // Suppression du projet après la transformation
    await globalUtils.deleteOne(Project, project._id);

    // Retourne l'id de la facture crée
    return bill;
};



const projectUtils = {
    generateProjectJSON,
    getProjectList,
    updateProjectBilling,
    transformProjectToBill
};

export { projectUtils };

