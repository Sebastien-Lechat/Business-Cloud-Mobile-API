import express from 'express';
import { ArticleController } from '../controllers/ArticleController';
import { authMiddleware } from '../middlewares/authMiddleware';


const route: express.Application = express();

route.get('/articles', [authMiddleware], ArticleController.getArticlesList);
route.post('/article', [authMiddleware], ArticleController.create);
route.delete('/article/:id', [authMiddleware], ArticleController.delete);

export { route as articleRouter };
