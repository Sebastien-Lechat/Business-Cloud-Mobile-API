import 'colorts/lib/string';
import mongoose from 'mongoose';
import { EnterpriseI } from '../interfaces/enterpriseInterface';
import { Enterprise } from '../models/Entreprise';
import { User } from '../models/User';


export class InitApp {

    /**
     * Fonction initialiser la base de données avec les informations du gérant et son l'entreprise
     */
    static InitImportantData = async (): Promise<void> => {
        try {
            const enterprise = await Enterprise.findOne();
            if (!enterprise) {
                const initilizedEnterprise: EnterpriseI = await Enterprise.create({
                    address: '70 rue Anatol France',
                    zip: '92044',
                    city: 'Levallois-Perret',
                    country: 'France',
                    activity: 'School',
                    numTVA: 'FR03512803495',
                    numRCS: 'RC Paris 234 987 456',
                    numSIRET: '362 521 879 00034',
                });
                const manager = await User.findOne({ role: 'Gérant', email: 'seb_le@hotmail.fr' });
                if (!manager) await InitApp.createManager(initilizedEnterprise._id);
                else if (manager && initilizedEnterprise) await InitApp.updateManager(initilizedEnterprise._id);
            } else {
                const manager = await User.findOne({ role: 'Gérant', email: 'seb_le@hotmail.fr' });
                if (!manager) await InitApp.createManager(enterprise._id);
                else await InitApp.updateManager(enterprise._id);
            }
            console.log('App Initialized'.green);
            process.exit();
        } catch (error) {
            console.log(error);
            process.exit();
        }
    }

    /**
     * Fonction créer le manager
     */
    static createManager = async (enterprise: EnterpriseI): Promise<void> => {
        await User.create({
            name: 'Sébastien Lechat',
            email: 'seb_le@hotmail.fr',
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
            enterprise: enterprise._id,
        });
    }

    /**
     * Fonction mettre à jour le manager
     */
    static updateManager = async (enterprise: EnterpriseI): Promise<void> => {
        await User.updateOne({ email: 'seb_le@hotmail.fr', role: 'Gérant' }, { $set: { enterprise: mongoose.Types.ObjectId(enterprise._id) } });
    }
}
