import 'colorts/lib/string';
import { Enterprise } from '../models/Entreprise';
import { User } from '../models/User';


export class InitApp {

    /**
     * Fonction initialiser la base de données avec les informations du gérant et son l'entreprise
     */
    static InitImportantData = async (): Promise<void> => {
        try {
            const enterprise = await Enterprise.find();
            if (enterprise.length === 0) {
                await Enterprise.create({
                    address: '70 rue Anatol France',
                    zip: '92044',
                    city: 'Levallois-Perret',
                    country: 'France',
                    activity: 'School',
                    numTVA: 'FR03512803495',
                    numRCS: 'RC Paris 234 987 456',
                    numSIRET: '362 521 879 00034',
                });
            }
            const manager = await User.find({ role: 'Gérant' });
            if (manager.length === 0) {
                await User.create({
                    name: 'Sébastien Lechat',
                    email: 'seb.lcht@gmail.com',
                    password: '$2b$10$.OfFlsY70FZPSyK.ogMZCeYc78mF0VZkU77fiYXHvTI98YCUjHzTO',
                    role: 'Gérant',
                    phone: '0601010101',
                    birthdayDate: '06-06-1666',
                    isActive: true,
                    reset_password: { date: 0, token: '' },
                    double_authentification: { activated: false, code: '0', date: 0 },
                    verify_email: { code: '0', date: 0, verified: false },
                    attempt: 0,
                    lastLogin: 0,
                });
            }
            console.log('App Initialized'.blue);
            process.exit();
        } catch (error) {
            console.log(error.red);
        }
    }
}
