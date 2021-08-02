import nodemailer from 'nodemailer';
import { config } from 'dotenv';
import Mail from 'nodemailer/lib/mailer';
config();

const accountMail = process.env.MAIL as string;
const accountPassword = process.env.MAIL_PASSWORD as string;
/**
 * Fonction pour envoyer un email, return true si l'email est parti et false si il y a une erreur.
 * @param email Email de l'utilisateur devant recevoir le mail.
 */
const sendMail = async (email: string, mailSubject: string, model: string, file?: { path: string, num: string }): Promise<void> => {
    try {
        const attachments: Mail.Attachment[] = [];
        if (file) attachments.push({ filename: `${file?.num}.pdf`, path: file?.path });
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
            attachments,
        });

    } catch (error) {
        console.log(error);
    }

};

export { sendMail };
