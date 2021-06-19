import { ClientI, ShortUserListI } from './userInterface';

export interface ProjectI {
    projectNum: string;
    _id: string;
    title: string;
    status: string;
    clientId: string | ClientI | ShortUserListI;
    progression: number;
    startDate: Date;
    deadline: Date;
    employees: { id: string }[];
    fixedRate?: number;
    hourlyRate?: number;
    estimateHour: number;
    description?: string;
    billing?: { billableTime?: number, additionalExpense?: number };
    createdAt: Date;
    updatedAt: Date;
}

export interface ProjectJsonI {
    projectNum: string;
    id: string;
    title: string;
    status: string;
    clientId: string | ClientI | ShortUserListI;
    progression: number;
    startDate: Date;
    deadline: Date;
    employees: { id: string }[];
    fixedRate?: number;
    hourlyRate?: number;
    estimateHour: number;
    description?: string;
    billing?: { billableTime?: number, additionalExpense?: number };
    createdAt: Date;
    updatedAt: Date;
}
