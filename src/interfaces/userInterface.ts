export interface UserObject {
    data: UserI | ClientI;
    type: 'client' | 'user';
}

export interface UserI {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    password: string;
    avatar?: string;
    birthdayDate?: string;
    reset_password?: { token: string, date: number };
    verify_email?: { code: number, date: number, verified: boolean };
    double_authentification?: { code: number, date: number, activated: boolean };
    token?: string;
    refreshToken?: string;
    attempt: number;
    lastLogin: number;
    createdAt: Date;
    updatedAt: Date;
    currency?: string;
    post?: string;
    isActive: boolean;
}

export interface UserUpdateI {
    _id?: string;
    name?: string;
    phone?: string;
    email?: string;
    avatar?: string;
    password?: string;
    birthdayDate?: string;
    reset_password?: { token: string, date: number };
    verify_email?: { code: number, date: number, verified: boolean };
    double_authentification?: { code: number, date: number, activated: boolean };
    token?: string;
    refreshToken?: string;
    attempt?: number;
    lastLogin?: number;
    createdAt?: Date;
    updatedAt?: Date;
    currency?: string;
    post?: string;
}


export interface UserJsonI {
    id: string;
    name: string;
    email: string;
    phone?: string;
    avatar?: string;
    token: string;
    refreshToken: string;
    createdAt: Date;
    updatedAt: Date;
    address?: string;
    zip?: string;
    city?: string;
    country?: string;
    numTVA?: string;
    numSIRET?: string;
    numRCS?: string;
    post?: string;
    currency?: string;
}

export interface ClientI extends UserI {
    address?: string;
    zip?: string;
    city?: string;
    country?: string;
    numTVA?: string;
    numSIRET?: string;
    numRCS?: string;
}
