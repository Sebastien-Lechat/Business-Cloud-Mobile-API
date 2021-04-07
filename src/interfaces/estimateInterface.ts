export interface EstimateI {
    estimateNum: string;
    id: string;
    status: string;
    clientId: string;
    enterpriseId: string;
    articles: EstimateArticleI[];
    currency?: string;
    taxe?: number;
    totalHT: number;
    totalTTC: number;
    deadline: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface EstimateArticleI {
    articleId: string;
    quantity: number;
}
