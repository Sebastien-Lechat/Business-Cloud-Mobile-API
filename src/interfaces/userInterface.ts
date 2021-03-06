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
    socketToken?: string;
    attempt: number;
    lastLogin: number;
    createdAt: Date;
    updatedAt: Date;
    currency?: string;
    role: string;
    isActive: boolean;
    fcmDevice?: { token: string, device: string }[];
    facebookAuth?: { id: string, token: string };
    googleAuth?: { id: string, token: string };
    enterprise?: string;
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
    socketToken?: string;
    attempt?: number;
    lastLogin?: number;
    createdAt?: Date;
    updatedAt?: Date;
    currency?: string;
    role?: string;
    fcmDevice?: { token: string, device: string }[];
    facebookAuth?: { id?: string, token?: string };
    googleAuth?: { id?: string, token?: string };
    isActive?: boolean;
}

export interface UserJsonI {
    type: string;
    id: string;
    name: string;
    email: string;
    birthdayDate?: string;
    phone?: string;
    avatar?: string;
    token: string;
    refreshToken: string;
    socketToken?: string;
    createdAt: Date;
    updatedAt: Date;
    activity?: any;
    address?: string;
    zip?: string;
    city?: string;
    country?: string;
    numTVA?: string;
    numSIRET?: string;
    numRCS?: string;
    role?: string;
    currency?: string;
    userId?: string;
    needVerifyEmail?: boolean;
    doubleAuthentification?: boolean;
    enterprise?: string;
}

export interface EmployeeJsonI {
    type: string;
    id: string;
    name: string;
    email: string;
    role: string;
    phone?: string;
    avatar?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface ClientI extends UserI {
    activity?: any;
    address?: string;
    zip?: string;
    city?: string;
    country?: string;
    numTVA?: string;
    numSIRET?: string;
    numRCS?: string;
    userId?: string;
}

export interface ShortUserListI {
    type: string;
    id: string;
    name: string;
    email: string;
    phone?: string;
    avatar?: string;
    createdAt: Date;
    updatedAt: Date;
    role?: string;
    userId?: string;
    socketToken?: string;
}
