import express from 'express';
import { ArticleController } from '../controllers/ArticleController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { historyMiddleware } from '../middlewares/historyMiddleware';


const route: express.Application = express();

route.get('/articles', [authMiddleware], ArticleController.getArticlesList);
route.post('/article', [authMiddleware, historyMiddleware], ArticleController.create);
route.delete('/article/:id', [authMiddleware, historyMiddleware], ArticleController.delete);

export { route as articleRouter };
