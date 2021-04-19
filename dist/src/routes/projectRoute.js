"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.projectRouter = void 0;
var express_1 = __importDefault(require("express"));
var ProjectController_1 = require("../controllers/ProjectController");
var authMiddleware_1 = require("../middlewares/authMiddleware");
var route = express_1.default();
exports.projectRouter = route;
route.get('/projects', [authMiddleware_1.authMiddleware], ProjectController_1.ProjectController.getProjectsList);
route.get('/project/:id', [authMiddleware_1.authMiddleware], ProjectController_1.ProjectController.getOneProject);
route.post('/project', [authMiddleware_1.authMiddleware], ProjectController_1.ProjectController.create);
route.put('/project', [authMiddleware_1.authMiddleware], ProjectController_1.ProjectController.update);
route.delete('/project/:id', [authMiddleware_1.authMiddleware], ProjectController_1.ProjectController.delete);
