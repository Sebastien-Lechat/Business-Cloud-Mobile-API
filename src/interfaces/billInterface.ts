import { ClientI } from './userInterface';

export interface BillI {
    billNum: string;
    id: string;
    status: string;
    clientId: string | ClientI;
    enterpriseId: string;
    articles: BillArticleI[];
    currency?: string;
    taxe?: number;
    totalHT: number;
    totalTTC: number;
    deadline: string;
    amountPaid?: number;
    payementDate?: Date;
    createdAt: Date;
    updatedAt: Date;
}

export interface BillArticleI {
    articleId: string;
    quantity: number;
}
