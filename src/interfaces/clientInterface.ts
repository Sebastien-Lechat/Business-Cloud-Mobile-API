export interface CreateClientI {
    id: string;
    name: string;
    email: string;
    phone?: string;
    birthdayDate?: string;
    address?: string;
    zip?: string;
    city?: string;
    country?: string;
    numTVA?: string;
    numSIRET?: string;
    numRCS?: string;
}
