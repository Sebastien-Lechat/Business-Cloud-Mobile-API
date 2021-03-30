export interface UserI {
    id: string;
    name: string;
    email: string;
    phone?: string;
    birthdayDate?: string;
    reset_password?: { token: string, date: number };
    verify_email?: { code: number, date: number, verified: boolean };
    double_authentification?: { code: number, date: number };
}


export interface CreateClientI extends UserI {
    address?: string;
    zip?: string;
    city?: string;
    country?: string;
    numTVA?: string;
    numSIRET?: string;
    numRCS?: string;
}
