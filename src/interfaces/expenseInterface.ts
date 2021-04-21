export interface ExpenseI {
    expenseNum: string;
    _id: string;
    price: number;
    accountNumber: number;
    category: string;
    file: string;
    description: string;
    userId: string;
    projectId?: string;
    billable: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface ExpenseJsonI {
    expenseNum: string;
    id: string;
    price: number;
    accountNumber: number;
    category: string;
    file: string;
    description: string;
    userId: string;
    projectId?: string;
    billable: boolean;
    createdAt: Date;
    updatedAt: Date;
}

