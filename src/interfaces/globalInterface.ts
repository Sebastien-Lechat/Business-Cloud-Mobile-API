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

export interface StatisticI {
    gainTotal?: number;
    expenseTotal?: number;
    employeeTotal?: number;
    customerTotal?: number;
    projectTotal?: number;
    projectTimeTotal?: number;
    billUnpaidTotal?: number;
    billUnpaidAmountTotal?: number;
}
