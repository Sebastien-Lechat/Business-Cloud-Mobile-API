import mongoose from 'mongoose';
import { EstimateI } from '../interfaces/estimateInterface';
import { ClientI, UserObject } from '../interfaces/userInterface';
import { Estimate } from '../models/Estimate';
import { globalUtils } from './globalUtils';

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
        currency: (estimate.currency) ? estimate.currency : undefined,
        taxe: (estimate.taxe !== undefined) ? estimate.taxe : undefined,
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
 */
const getEstimateList = async (user: UserObject): Promise<EstimateI[]> => {
    let estimateList: EstimateI[] = [];
    if (user.type === 'client') {
        // Récupération de tous les devis concernants ce client
        estimateList = await globalUtils.findMany(Estimate, { clientId: mongoose.Types.ObjectId(user.data._id) });

        // Envoi de la liste
        return estimateList;
    } else if (user.type === 'user') {
        if (user.data.role === 'Gérant') {
            // Récupération de tous les devis
            estimateList = await globalUtils.findMany(Estimate, {});

            // Mise en forme
            estimateList = estimateList.map((estimate: EstimateI) => {
                return estimateUtils.generateEstimateJSON(estimate);
            });

            // Envoi de la liste
            return estimateList;
        } else {
            // Récupération de tous les devis
            estimateList = await globalUtils.findManyAndPopulate(Estimate, {}, ['clientId']);

            // Filtre de tout ce qui ne concerne pas l'employé
            estimateList = estimateList.filter((estimate: EstimateI) => {
                const client = estimate.clientId as ClientI;
                estimate.clientId = client._id;
                return (client.userId) ? client.userId.toString() === user.data._id.toString() : false;
            });

            // Mise en forme
            estimateList = estimateList.map((estimate: EstimateI) => {

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
