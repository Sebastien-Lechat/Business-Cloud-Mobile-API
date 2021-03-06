import express from 'express';
import { ConversationController } from '../controllers/ConversationController';
import { authMiddleware } from '../middlewares/authMiddleware';


const route: express.Application = express();

route.get('/conversations', [authMiddleware], ConversationController.getConversationsList);
route.get('/conversation/:id', [authMiddleware], ConversationController.getConversation);
route.get('/conversation/:id/messages', [authMiddleware], ConversationController.getConversationMessages);
route.post('/conversation', [authMiddleware], ConversationController.create);
route.delete('/conversation/:id', [authMiddleware], ConversationController.delete);

export { route as conversationRouter };
