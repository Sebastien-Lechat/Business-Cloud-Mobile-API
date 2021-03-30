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
            secure: true, // true for 465, false for other ports
            auth: {
                user: accountMail,
                pass: accountPassword,
            },
        });

        await transporter.sendMail({
            from: 'Lechat Sébastien - Business Cloud Mobile Support <' + accountMail + '>', // sender address
            to: email,
            subject: mailSubject,
            html: model,
        });

        // console.log(info);
    } catch (err) {
        console.log(err);
    }

};

export { sendMail };
