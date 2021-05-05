export interface NotificationI {
    _id: string;
    userId: string;
    title: string;
    message: string;
    seen: boolean;
    category: string;
    targetId: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface NotificationJsonI {
    id: string;
    userId: string;
    title: string;
    message: string;
    seen: boolean;
    category: string;
    targetId: string;
    createdAt: Date;
    updatedAt: Date;
}
