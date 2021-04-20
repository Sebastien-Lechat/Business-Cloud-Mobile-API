import nodemailer from 'nodemailer';
import { config } from 'dotenv';
config();

const accountMail = process.env.MAIL as string;
const accountPassword = process.env.MAIL_PASSWORD as string;
/**
 * Fonction pour envoyer un email, return true si l'email est parti et false si il y a une erreur.
 * @param email Email de l'utilisateur devant recevoir le mail.
 */
const sendMail = async (email: string, mailSubject: string, model: string): Promise<void> => {
    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: accountMail,
                pass: accountPassword,
            },
        });

        await transporter.sendMail({
            from: 'Business Cloud Mobile Support - Lechat Sébastien <' + accountMail + '>',
            to: email,
            subject: mailSubject,
            html: model,
        });

    } catch (err) {
        console.log(err);
    }

};

export { sendMail };
