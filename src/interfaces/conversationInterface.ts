export interface ConvI {
    _id: string;
    member1: { type: string, user: { _id: string, name: string, socketToken: string, phone?: string } };
    member2: { type: string, user: { _id: string, name: string, socketToken: string, phone?: string } };
    createdAt: Date;
    updatedAt: Date;
    lastMessage?: { text: string, user: string };
}

export interface ConvJsonI {
    id: string;
    member1: { type: string, user: { _id: string, name: string, avatar?: string, socketToken: string, phone?: string } };
    member2: { type: string, user: { _id: string, name: string, avatar?: string, socketToken: string, phone?: string } };
    createdAt: Date;
    updatedAt: Date;
    lastMessage?: { text: string, user: string };
}
