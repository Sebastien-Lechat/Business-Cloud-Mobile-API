import bcrypt from 'bcrypt';
/**
 * Encrypte le mot de passe
 * @param password Mot de passe de l'utilisateur
 */
const hashPassword = async (password: string): Promise<string> => {
    return await bcrypt.hash(password, 10);
};

/**
 * Compare deux mot de passe (un non-chiffré et un chiffré)
 * @param password Mot de passe de l'utilisateur
 * @param hash Hash à comparer
 */
const comparePassword = async (password: string, hash: string): Promise<boolean> => {
    return await bcrypt.compare(password, hash);
};

export { hashPassword, comparePassword };
