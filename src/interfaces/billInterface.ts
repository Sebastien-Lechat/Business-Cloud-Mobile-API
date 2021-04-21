import { ArticleI, ArticleJsonI } from './articleInterface';
import { ClientI, ShortUserListI } from './userInterface';

export interface BillI {
    billNum: string;
    _id: string;
    status: string;
    clientId: string | ClientI | ShortUserListI;
    enterpriseId: string;
    articles: BillArticleI[];
    reduction: number;
    totalHT: number;
    totalTTC: number;
    deadline: string;
    amountPaid?: number;
    payementDate?: Date;
    createdAt: Date;
    updatedAt: Date;
}

export interface BillJsonI {
    billNum: string;
    id: string;
    status: string;
    clientId: string | ClientI | ShortUserListI;
    enterpriseId: string;
    articles: BillArticleI[];
    reduction: number;
    totalHT: number;
    totalTTC: number;
    deadline: string;
    amountPaid?: number;
    payementDate?: Date;
    createdAt: Date;
    updatedAt: Date;
}

export interface BillArticleI {
    articleId: string | ArticleI | ArticleJsonI;
    quantity: number;
}
