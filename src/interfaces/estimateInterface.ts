import { ArticleI, ArticleJsonI } from './articleInterface';
import { ClientI, ShortUserListI } from './userInterface';
export interface EstimateI {
    estimateNum: string;
    _id: string;
    status: string;
    clientId: string | ClientI | ShortUserListI;
    enterpriseId: string;
    articles: EstimateArticleI[];
    reduction: number;
    totalHT: number;
    totalTTC: number;
    deadline: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface EstimateJsonI {
    estimateNum: string;
    id: string;
    status: string;
    clientId: string | ClientI | ShortUserListI;
    enterpriseId: string;
    articles: EstimateArticleI[];
    reduction: number;
    totalHT: number;
    totalTTC: number;
    deadline: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface EstimateArticleI {
    articleId: string | ArticleI | ArticleJsonI;
    quantity: number;
}
