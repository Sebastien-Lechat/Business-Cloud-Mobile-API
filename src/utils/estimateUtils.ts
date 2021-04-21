import mongoose from 'mongoose';
import { ArticleI } from '../interfaces/articleInterface';
import { EstimateI } from '../interfaces/estimateInterface';
import { ClientI, UserObject } from '../interfaces/userInterface';
import { Estimate } from '../models/Estimate';
import { articleUtils } from './articleUtils';
import { globalUtils } from './globalUtils';
import { userUtils } from './userUtils';

/**
 * Fonction générer le JSON de réponse d'un devis.
 * @param estimate Devis pour laquelle on génère le JSON
 * @return Retourne le JSON
 */
const generateEstimateJSON = (estimate: EstimateI): EstimateI => {
    const toReturn = {
        estimateNum: estimate.estimateNum,
        id: estimate.id,
        status: estimate.status,
        clientId: estimate.clientId,
        enterpriseId: estimate.enterpriseId,
        articles: estimate.articles,
        reduction: estimate.reduction,
        totalHT: estimate.totalHT,
        totalTTC: estimate.totalTTC,
        deadline: estimate.deadline,
        createdAt: estimate.createdAt,
        updatedAt: estimate.updatedAt,
    };

    return toReturn;
};

/**
 * Fonction pour retourner la liste des devis en fonction du rôle.
 * @param user Utilisateur pour lequel on génère la liste
 * @return Retourne le JSON
 */
const getEstimateList = async (user: UserObject): Promise<EstimateI[]> => {
    let estimateList: EstimateI[] = [];
    if (user.type === 'client') {
        // Récupération de tous les devis concernants ce client
        estimateList = await globalUtils.findManyAndPopulate(Estimate, { clientId: mongoose.Types.ObjectId(user.data._id) }, ['clientId', 'articles.articleId']);

        // Mise en forme
        estimateList = estimateList.map((estimate: EstimateI) => {
            estimate.clientId = userUtils.generateShortUserJSON({ data: estimate.clientId as ClientI, type: 'client' });
            estimate.articles.map((article) => {
                article.articleId = articleUtils.generateArticleJSON(article.articleId as ArticleI);
            });
            return estimateUtils.generateEstimateJSON(estimate);
        });

        // Envoi de la liste
        return estimateList;
    } else if (user.type === 'user') {
        if (user.data.role === 'Gérant') {
            // Récupération de tous les devis
            estimateList = await globalUtils.findManyAndPopulate(Estimate, {}, ['clientId', 'articles.articleId']);

            // Mise en forme
            estimateList = estimateList.map((estimate: EstimateI) => {
                estimate.clientId = userUtils.generateShortUserJSON({ data: estimate.clientId as ClientI, type: 'client' });
                estimate.articles.map((article) => {
                    article.articleId = articleUtils.generateArticleJSON(article.articleId as ArticleI);
                });
                return estimateUtils.generateEstimateJSON(estimate);
            });

            // Envoi de la liste
            return estimateList;
        } else {
            // Récupération de tous les devis
            estimateList = await globalUtils.findManyAndPopulate(Estimate, {}, ['clientId', 'articles.articleId']);

            // Filtre de tout ce qui ne concerne pas l'employé
            estimateList = estimateList.filter((estimate: EstimateI) => {
                const client = estimate.clientId as ClientI;
                estimate.clientId = client._id;
                return (client.userId) ? client.userId.toString() === user.data._id.toString() : false;
            });

            // Mise en forme
            estimateList = estimateList.map((estimate: EstimateI) => {
                estimate.clientId = userUtils.generateShortUserJSON({ data: estimate.clientId as ClientI, type: 'client' });
                estimate.articles.map((article) => {
                    article.articleId = articleUtils.generateArticleJSON(article.articleId as ArticleI);
                });
                return estimateUtils.generateEstimateJSON(estimate);
            });

            // Envoi de la liste
            return estimateList;
        }
    } else return estimateList;
};

const estimateUtils = {
    generateEstimateJSON,
    getEstimateList
};

export { estimateUtils };
