"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.articleRouter = void 0;
var express_1 = __importDefault(require("express"));
var ArticleController_1 = require("../controllers/ArticleController");
var authMiddleware_1 = require("../middlewares/authMiddleware");
var route = express_1.default();
exports.articleRouter = route;
route.get('/articles', [authMiddleware_1.authMiddleware], ArticleController_1.ArticleController.getArticlesList);
route.post('/article', [authMiddleware_1.authMiddleware], ArticleController_1.ArticleController.create);
route.delete('/article/:id', [authMiddleware_1.authMiddleware], ArticleController_1.ArticleController.delete);
