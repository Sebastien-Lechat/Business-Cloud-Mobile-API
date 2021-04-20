import { ArticleI } from './articleInterface';
import { ClientI, ShortUserListI } from './userInterface';

export interface BillI {
    billNum: string;
    id: string;
    status: string;
    clientId: string | ClientI | ShortUserListI;
    enterpriseId: string;
    articles: BillArticleI[];
    currency?: string;
    totalHT: number;
    totalTTC: number;
    deadline: string;
    amountPaid?: number;
    payementDate?: Date;
    createdAt: Date;
    updatedAt: Date;
}

export interface BillArticleI {
    articleId: string | ArticleI;
    quantity: number;
}
