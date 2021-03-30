import validator from 'validator';

export default class VerifyData {
    /**
     * Vérification de si l'email est bien au bon format
     * @param email Email à vérifier
     */
    static validEmail(email: string): boolean {
        return validator.isEmail(email);
    }

    /**
     * Vérification de si le téléphone est au bon format
     * @param phone Téléphone à vérifier
     */
    static validPhone(phone: string): boolean {
        return validator.isMobilePhone(phone);
    }

    /**
     * Vérification de si le mot de passe est assez fort
     * @param password Mot de passe à vérifier
     */
    static validPassword(password: string): boolean {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{7,}$/;
        if (password.trim().length < 7 || password.trim().length > 30) return false;
        else return regex.test(password);
    }


    /**
     * Vérification de si la date est au bon format
     * @param date Date à vérifier
     */
    static validDate(date: string): boolean {
        return validator.isDate(date, { format: 'DD-MM-YYYY', strictMode: true, delimiters: ['-', '/', '.'] });
    }

    /**
     * Vérification de si le numéro de tva est au bon format
     * @param taxe Téléphone à vérifier
     */
    static validPostalCode(zip: string): boolean {
        return validator.isPostalCode(zip, 'FR');
    }

}
