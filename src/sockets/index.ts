import mongoose from 'mongoose';
import SocketIO from 'socket.io';
import { authorize } from '@thream/socketio-jwt';
import { config } from 'dotenv';
import { User } from '../models/User';
config();

const JWT_KEY: string = process.env.JWT_KEY as string;

const initUserSocket = async (socket: SocketIO.Socket, id: string) => {
    try {
        const user = await User.findById(id);
        if (!user) {
            socket.disconnect(true);
        } else {
            console.log(('Open socket : ' + user.name).cyan);
            await User.updateOne({ _id: mongoose.Types.ObjectId(id) }, { $set: { socketToken: socket.id } });
        }
    } catch (error) {
        console.error(error);
    }
};

const closeUserSocket = async (socket: SocketIO.Socket, id: string) => {
    try {
        const user = await User.findById(id);
        if (user) {
            console.log(('Close socket : ' + user.name).cyan);
            await User.updateOne({ _id: mongoose.Types.ObjectId(id) }, { $set: { socketToken: socket.id } });
        }
        socket.disconnect(true);
    } catch (error) {
        console.error(error);
    }
};

export = (io: SocketIO.Server) => {
    io.use(
        authorize({
            secret: JWT_KEY,
        }),
    );
    io.on('connection', async (socket) => {
        initUserSocket(socket, socket.decodedToken._id);

        socket.on('disconnect', () => closeUserSocket(socket, socket.decodedToken._id));
    });
};
