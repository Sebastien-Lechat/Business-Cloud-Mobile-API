export interface MessageI {
    _id: string;
    conversationId: string;
    userId: string;
    text: string;
    createdAt: Date;
    updatedAt: Date;
}
