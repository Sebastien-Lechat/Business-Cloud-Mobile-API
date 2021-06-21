import { authorize } from '@thream/socketio-jwt';
import { config } from 'dotenv';
import mongoose from 'mongoose';
import SocketIO from 'socket.io';
import { sendNotificationToOne } from '../helpers/notificationHelper';
import { MessageI } from '../interfaces/messageInterface';
import { UserObject } from '../interfaces/userInterface';
import { Conversation } from '../models/Conversation';
import { Message } from '../models/Message';
import { User } from '../models/User';
import { userUtils } from '../utils/userUtils';
config();

const JWT_KEY: string = process.env.JWT_KEY as string;

const initUserSocket = async (socket: SocketIO.Socket, id: string) => {
    try {
        const user = await userUtils.findUser({ userId: id });
        if (!user) {
            socket.disconnect(true);
        } else {
            console.log(('Open socket : ' + user.data.name).cyan);
            await userUtils.updateUser(user, { socketToken: socket.id });
        }
    } catch (error) {
        console.error(error);
    }
};

const closeUserSocket = async (socket: SocketIO.Socket, id: string) => {
    try {
        const user = await userUtils.findUser({ userId: id });
        if (user) {
            console.log(('Close socket : ' + user.data.name).cyan);
            await userUtils.updateUser(user, { socketToken: '' });
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

        socket.on('private message', async (data: { conversationId: string, content: string, to: { id: string, socketId: string, name: string } }) => {
            try {
                console.log('Message in transit...'.cyan);
                const message: MessageI = await Message.create({ conversationId: data.conversationId, userId: socket.decodedToken._id, text: data.content, seen: false });
                const user = await userUtils.findUser({ userId: data.to.id }) as UserObject;
                const isConnected = Array.from(await io.allSockets()).find((connectedSocket) => connectedSocket === data.to.socketId);
                await Conversation.updateOne({ _id: mongoose.Types.ObjectId(data.conversationId) }, { $set: { lastMessage: { text: data.content, user: user.data._id } } });
                if (!isConnected) sendNotificationToOne('Nouveau message de ' + data.to.name, 'Vous avez reçu un nouveau message de ' + data.to.name + '. Cliquez ici pour le consulter.', user.data, data.conversationId, 'Message');
                socket.to(data.to.socketId).emit('private message', { content: data.content, from: socket.decodedToken._id, createdAt: message.createdAt, seen: false });
            } catch (error) {
                console.log(error);
            }
        });

        socket.on('check connected', async (data: { to: { socketId: string, name: string } }) => {
            const isConnected = Array.from(await io.allSockets()).find((connectedSocket) => connectedSocket === data.to.socketId);
            socket.emit('check connected', { value: (isConnected ? true : false), from: { name: data.to.name, socketId: data.to.socketId, } });
        });

        socket.on('disconnect', () => closeUserSocket(socket, socket.decodedToken._id));
    });
};
