export interface HistoryI {
    _id: string;
    action: {
        method: string;
        route: string;
    };
    userEmail: string;
    success: boolean;
    createdAt: Date;
    updatedAt: Date;
}
