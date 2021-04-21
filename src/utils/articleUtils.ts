import { ArticleI, ArticleJsonI } from '../interfaces/articleInterface';
import { Article } from '../models/Article';
import { globalUtils } from './globalUtils';

/**
 * Fonction générer le JSON de réponse d'un article.
 * @param article Article pour lequel on génère le JSON
 * @return Retourne le JSON
 */
const generateArticleJSON = (article: ArticleI): ArticleJsonI => {
    const toReturn = {
        id: article._id,
        name: article.name,
        price: article.price,
        tva: article.tva,
        description: (article.description) ? article.description : undefined,
        accountNumber: article.accountNumber,
        createdAt: article.createdAt,
        updatedAt: article.updatedAt,
    };

    return toReturn;
};

/**
 * Fonction pour retourner la liste des articles.
 * @return Retourne le JSON
 */
const getArticleList = async (): Promise<ArticleJsonI[]> => {
    const articleList: ArticleJsonI[] = [];

    // Récupération de tous les articles
    const articles = await globalUtils.findMany(Article, {});

    articles.map((article: ArticleI) => {
        articleList.push(generateArticleJSON(article));
    });

    return articleList;
};

const articleUtils = {
    generateArticleJSON,
    getArticleList
};

export { articleUtils };
