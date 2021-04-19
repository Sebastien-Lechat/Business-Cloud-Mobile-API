"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskController = void 0;
var responseHelper_1 = require("../helpers/responseHelper");
var verifyDataHelper_1 = __importDefault(require("../helpers/verifyDataHelper"));
var Project_1 = require("../models/Project");
var Task_1 = require("../models/Task");
var globalUtils_1 = require("../utils/globalUtils");
var taskUtils_1 = require("../utils/taskUtils");
var userUtils_1 = require("../utils/userUtils");
var TaskController = /** @class */ (function () {
    function TaskController() {
    }
    /**
     * Fonction de récupération de toutes les tâches (GET /tasks)
     * @param req express Request
     * @param res express Response
     */
    TaskController.getTasksList = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var hasPermission, projectId, project, taskList, taskList, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 6, , 7]);
                    hasPermission = globalUtils_1.globalUtils.checkPermission(userUtils_1.userUtils.getRequestUser(req), 'user');
                    if (!hasPermission)
                        throw new Error('You do not have the required permissions');
                    projectId = req.params.projectId;
                    if (!projectId) return [3 /*break*/, 3];
                    return [4 /*yield*/, globalUtils_1.globalUtils.findOne(Project_1.Project, projectId)];
                case 1:
                    project = _a.sent();
                    if (!project)
                        throw new Error('Invalid project id');
                    return [4 /*yield*/, taskUtils_1.taskUtils.getTaskList(projectId)];
                case 2:
                    taskList = _a.sent();
                    // Envoi de la réponse
                    responseHelper_1.sendResponse(res, 200, { error: false, message: 'Successful tasks acquisition', tasks: taskList });
                    return [3 /*break*/, 5];
                case 3: return [4 /*yield*/, taskUtils_1.taskUtils.getTaskList()];
                case 4:
                    taskList = _a.sent();
                    // Envoi de la réponse
                    responseHelper_1.sendResponse(res, 200, { error: false, message: 'Successful tasks acquisition', tasks: taskList });
                    _a.label = 5;
                case 5: return [3 /*break*/, 7];
                case 6:
                    err_1 = _a.sent();
                    if (err_1.message === 'You do not have the required permissions')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '401002', message: err_1.message });
                    else if (err_1.message === 'Invalid project id')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '109051', message: err_1.message });
                    else
                        responseHelper_1.errorHandler(res, err_1);
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    }); };
    /**
     * Fonction de création d'une tâche (POST /task)
     * @param req express Request
     * @param res express Response
     */
    TaskController.create = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var hasPermission, _a, name_1, progression, description, projectId, employees, startDate, deadline, estimateHour, project, _i, employees_1, employee, findEmployee, task, err_2;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 7, , 8]);
                    hasPermission = globalUtils_1.globalUtils.checkPermission(userUtils_1.userUtils.getRequestUser(req), 'user');
                    if (!hasPermission)
                        throw new Error('You do not have the required permissions');
                    _a = req.body, name_1 = _a.name, progression = _a.progression, description = _a.description, projectId = _a.projectId, employees = _a.employees, startDate = _a.startDate, deadline = _a.deadline, estimateHour = _a.estimateHour;
                    // Vérification de si toutes les données nécessaire sont présentes
                    if (!name_1 || progression === undefined || !projectId || !employees || !startDate || !deadline)
                        throw new Error('Missing important fields');
                    // Vérification de la validité du numéro de projet
                    if ((progression && !verifyDataHelper_1.default.validInt(progression)) || (progression < 0 || progression > 100))
                        throw new Error('Invalid progression number');
                    return [4 /*yield*/, globalUtils_1.globalUtils.findOne(Project_1.Project, projectId)];
                case 1:
                    project = _b.sent();
                    if (!project)
                        throw new Error('Invalid project id');
                    if (!employees) return [3 /*break*/, 5];
                    _i = 0, employees_1 = employees;
                    _b.label = 2;
                case 2:
                    if (!(_i < employees_1.length)) return [3 /*break*/, 5];
                    employee = employees_1[_i];
                    return [4 /*yield*/, userUtils_1.userUtils.findUser({ userId: employee.id })];
                case 3:
                    findEmployee = _b.sent();
                    if (!findEmployee)
                        throw new Error('Some employee id are invalid');
                    _b.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 2];
                case 5:
                    // Vérification du nombre d'heures estimé
                    if (estimateHour && !verifyDataHelper_1.default.validInt(estimateHour))
                        throw new Error('Invalid estimate hour');
                    if (estimateHour)
                        req.body.estimateHour = verifyDataHelper_1.default.validInt(estimateHour);
                    // Vérification de la validité de la date d'échéance
                    if (!verifyDataHelper_1.default.validDeadline(deadline))
                        throw new Error('Invalid deadline');
                    req.body.startDate = new Date(startDate);
                    req.body.deadline = new Date(deadline);
                    // Vérification de la date de début n'est pas situé après la deadline
                    if (req.body.deadline.getTime() - req.body.startDate.getTime() < 0)
                        throw new Error('Start date can\'t be set after deadline');
                    return [4 /*yield*/, Task_1.Task.create(req.body)];
                case 6:
                    task = _b.sent();
                    // Envoi de la réponse
                    responseHelper_1.sendResponse(res, 200, { error: false, message: 'Task successfully created', task: taskUtils_1.taskUtils.generateTaskJSON(task) });
                    return [3 /*break*/, 8];
                case 7:
                    err_2 = _b.sent();
                    if (err_2.message === 'You do not have the required permissions')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '401002', message: err_2.message });
                    else if (err_2.message === 'Missing important fields')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '109101', message: err_2.message });
                    else if (err_2.message === 'Invalid progression number')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '109102', message: err_2.message });
                    else if (err_2.message === 'Invalid project id')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '109103', message: err_2.message });
                    else if (err_2.message === 'Some employee id are invalid')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '109104', message: err_2.message });
                    else if (err_2.message === 'Invalid estimate hour')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '109105', message: err_2.message });
                    else if (err_2.message === 'Invalid deadline')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '109106', message: err_2.message });
                    else if (err_2.message === 'Start date can\'t be set after deadline')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '109107', message: err_2.message });
                    else
                        responseHelper_1.errorHandler(res, err_2);
                    return [3 /*break*/, 8];
                case 8: return [2 /*return*/];
            }
        });
    }); };
    /**
     * Fonction de suppression d'une tâche (DELETE /task/:id)
     * @param req express Request
     * @param res express Response
     */
    TaskController.delete = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var hasPermission, id, task, err_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    hasPermission = globalUtils_1.globalUtils.checkPermission(userUtils_1.userUtils.getRequestUser(req), 'user');
                    if (!hasPermission)
                        throw new Error('You do not have the required permissions');
                    id = req.params.id;
                    // Vérification de si toutes les données nécessaire sont présentes
                    if (!id)
                        throw new Error('Missing id field');
                    return [4 /*yield*/, globalUtils_1.globalUtils.findOne(Task_1.Task, id)];
                case 1:
                    task = _a.sent();
                    if (!task)
                        throw new Error('Invalid task id');
                    // Suppression de la tâche
                    return [4 /*yield*/, globalUtils_1.globalUtils.deleteOne(Task_1.Task, id)];
                case 2:
                    // Suppression de la tâche
                    _a.sent();
                    // Envoi de la réponse
                    responseHelper_1.sendResponse(res, 200, { error: false, message: 'Task successfully deleted' });
                    return [3 /*break*/, 4];
                case 3:
                    err_3 = _a.sent();
                    if (err_3.message === 'You do not have the required permissions')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '401002', message: err_3.message });
                    else if (err_3.message === 'Missing id field')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '109151', message: err_3.message });
                    else if (err_3.message === 'Invalid task id')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '109152', message: err_3.message });
                    else
                        responseHelper_1.errorHandler(res, err_3);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    return TaskController;
}());
exports.TaskController = TaskController;
