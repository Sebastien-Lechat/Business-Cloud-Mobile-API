import mongoose from 'mongoose';
import cron from 'node-cron';
import { BillI } from '../interfaces/billInterface';
import { EstimateI } from '../interfaces/estimateInterface';
import { ProjectI } from '../interfaces/projectInterface';
import { Bill } from '../models/Bill';
import { Estimate } from '../models/Estimate';
import { Project } from '../models/Project';
import 'colorts/lib/string';

export class CronTask {

    private cronTask = cron;

    constructor() { }

    /**
     * Fonction pour mettre à jour les status des factures, devis et projets.
     */
    startTask = async () => {
        await this.statusTask();

        this.cronTask.schedule('0 */5 * * * *', async () => {
            await this.statusTask();
        });
    }

    statusTask = async () => {
        console.log('CRON: Mise à jour des projets...'.blue);
        // Mise à jour du status des projets
        const projects: ProjectI[] = await Project.find();
        projects.map(async (project: ProjectI) => {
            if (project.deadline.getTime() - Date.now()) {
                await Project.updateOne({ _id: mongoose.Types.ObjectId(project._id) }, { $set: { status: 'En retard' } });
            }
        });

        /* ----------------------------------------------- */

        console.log('CRON: Mise à jour des factures...'.blue);

        // Mise à jour du status des factures
        const bills: BillI[] = await Bill.find();
        bills.map(async (bill: BillI) => {
            if (new Date(bill.deadline).getTime() - Date.now()) {
                await Bill.updateOne({ _id: mongoose.Types.ObjectId(bill._id) }, { $set: { status: 'En retard' } });
            }
        });

        /* ----------------------------------------------- */

        console.log('CRON: Mise à jour des devis...'.blue);

        // Mise à jour du status des devis
        const estimates: EstimateI[] = await Estimate.find();
        estimates.map(async (estimate: EstimateI) => {
            if (new Date(estimate.deadline).getTime() - Date.now()) {
                await Estimate.updateOne({ _id: mongoose.Types.ObjectId(estimate._id) }, { $set: { status: 'En retard' } });
            }
        });
    }
}
