import { EstimateI } from '../interfaces/estimateInterface';

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

const estimateUtils = {
    generateEstimateJSON,
};

export { estimateUtils };
