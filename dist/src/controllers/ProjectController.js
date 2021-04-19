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
exports.ProjectController = void 0;
var responseHelper_1 = require("../helpers/responseHelper");
var verifyDataHelper_1 = __importDefault(require("../helpers/verifyDataHelper"));
var Client_1 = require("../models/Client");
var Project_1 = require("../models/Project");
var globalUtils_1 = require("../utils/globalUtils");
var projectUtils_1 = require("../utils/projectUtils");
var userUtils_1 = require("../utils/userUtils");
var ProjectController = /** @class */ (function () {
    function ProjectController() {
    }
    /**
     * Fonction de récupération de tous les projets (GET /projects)
     * @param req express Request
     * @param res express Response
     */
    ProjectController.getProjectsList = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var hasPermission, projectList, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    hasPermission = globalUtils_1.globalUtils.checkPermission(userUtils_1.userUtils.getRequestUser(req), 'user');
                    if (!hasPermission)
                        throw new Error('You do not have the required permissions');
                    return [4 /*yield*/, projectUtils_1.projectUtils.getProjectList()];
                case 1:
                    projectList = _a.sent();
                    // Envoi de la réponse
                    responseHelper_1.sendResponse(res, 200, { error: false, message: 'Successful projects acquisition', projects: projectList });
                    return [3 /*break*/, 3];
                case 2:
                    err_1 = _a.sent();
                    responseHelper_1.errorHandler(res, err_1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    /**
     * Fonction de récupération d'un projet (GET /project/:id)
     * @param req express Request
     * @param res express Response
     */
    ProjectController.getOneProject = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var hasPermission, id, project, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    hasPermission = globalUtils_1.globalUtils.checkPermission(userUtils_1.userUtils.getRequestUser(req), 'user');
                    if (!hasPermission)
                        throw new Error('You do not have the required permissions');
                    id = req.params.id;
                    // Vérification de si toutes les données nécessaire sont présentes
                    if (!id)
                        throw new Error('Missing id field');
                    return [4 /*yield*/, globalUtils_1.globalUtils.findOne(Project_1.Project, id)];
                case 1:
                    project = _a.sent();
                    if (!project)
                        throw new Error('Invalid project id');
                    // Envoi de la réponse
                    responseHelper_1.sendResponse(res, 200, { error: false, message: 'Successful project acquisition', project: projectUtils_1.projectUtils.generateProjectJSON(project) });
                    return [3 /*break*/, 3];
                case 2:
                    err_2 = _a.sent();
                    if (err_2.message === 'Missing id field')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '108101', message: err_2.message });
                    else if (err_2.message === 'Invalid project id')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '108102', message: err_2.message });
                    else
                        responseHelper_1.errorHandler(res, err_2);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    /**
     * Fonction de création du projet (POST /project)
     * @param req express Request
     * @param res express Response
     */
    ProjectController.create = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var hasPermission, _a, projectNum, title, status_1, clientId, progression, startDate, deadline, employees, fixedRate, hourlyRate, estimateHour, customer, _i, employees_1, employee, findEmployee, project, err_3;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 8, , 9]);
                    hasPermission = globalUtils_1.globalUtils.checkPermission(userUtils_1.userUtils.getRequestUser(req), 'user');
                    if (!hasPermission)
                        throw new Error('You do not have the required permissions');
                    _a = req.body, projectNum = _a.projectNum, title = _a.title, status_1 = _a.status, clientId = _a.clientId, progression = _a.progression, startDate = _a.startDate, deadline = _a.deadline, employees = _a.employees, fixedRate = _a.fixedRate, hourlyRate = _a.hourlyRate, estimateHour = _a.estimateHour;
                    // Vérification de si toutes les données nécessaire sont présentes
                    if (!title || projectNum === undefined || !status_1 || !clientId || !deadline || !employees)
                        throw new Error('Missing important fields');
                    // Vérification de la validité du status
                    if (!verifyDataHelper_1.default.validProjectStatus(status_1))
                        throw new Error('Invalid project status');
                    return [4 /*yield*/, globalUtils_1.globalUtils.findOne(Client_1.Client, clientId)];
                case 1:
                    customer = _b.sent();
                    if (!customer)
                        throw new Error('Invalid customer id');
                    return [4 /*yield*/, verifyDataHelper_1.default.validProjectNumber(projectNum)];
                case 2:
                    // Vérification de la validité du numéro de projet
                    if (!(_b.sent()))
                        throw new Error('Invalid project number');
                    // Vérification de la validité du numéro de projet
                    if ((progression && !verifyDataHelper_1.default.validInt(progression)) || (progression < 0 || progression > 100))
                        throw new Error('Invalid progression number');
                    // Vérification de la validité de la date d'échéance
                    if (!verifyDataHelper_1.default.validDeadline(deadline))
                        throw new Error('Invalid deadline');
                    req.body.deadline = new Date(deadline);
                    if (!employees) return [3 /*break*/, 6];
                    _i = 0, employees_1 = employees;
                    _b.label = 3;
                case 3:
                    if (!(_i < employees_1.length)) return [3 /*break*/, 6];
                    employee = employees_1[_i];
                    return [4 /*yield*/, userUtils_1.userUtils.findUser({ userId: employee.id })];
                case 4:
                    findEmployee = _b.sent();
                    if (!findEmployee)
                        throw new Error('Some employee id are invalid');
                    _b.label = 5;
                case 5:
                    _i++;
                    return [3 /*break*/, 3];
                case 6:
                    // Vérification du taux de facturation du projet
                    if (fixedRate && hourlyRate)
                        throw new Error('You can\'t have both billing systems active');
                    if (fixedRate && !verifyDataHelper_1.default.validFloat(fixedRate))
                        throw new Error('Invalid fixed rate');
                    if (fixedRate)
                        req.body.fixedRate = verifyDataHelper_1.default.validFloat(fixedRate);
                    if (hourlyRate && !verifyDataHelper_1.default.validFloat(hourlyRate))
                        throw new Error('Invalid hourly rate');
                    if (hourlyRate)
                        req.body.hourlyRate = verifyDataHelper_1.default.validFloat(hourlyRate);
                    // Vérification de la date de début du projet
                    if (!startDate)
                        req.body.startDate = new Date();
                    else
                        req.body.startDate = new Date(startDate);
                    // Vérification du nombre d'heures estimé
                    if (estimateHour && !verifyDataHelper_1.default.validInt(estimateHour))
                        throw new Error('Invalid estimate hour');
                    if (estimateHour)
                        req.body.estimateHour = verifyDataHelper_1.default.validInt(estimateHour);
                    // Vérification de la date de début n'est pas situé après la deadline
                    if (req.body.deadline.getTime() - req.body.startDate.getTime() < 0)
                        throw new Error('Start date can\'t be set after deadline');
                    return [4 /*yield*/, Project_1.Project.create(req.body)];
                case 7:
                    project = _b.sent();
                    // Envoi de la réponse
                    responseHelper_1.sendResponse(res, 200, { error: false, message: 'Project successfully created', project: projectUtils_1.projectUtils.generateProjectJSON(project) });
                    return [3 /*break*/, 9];
                case 8:
                    err_3 = _b.sent();
                    if (err_3.message === 'You do not have the required permissions')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '401002', message: err_3.message });
                    else if (err_3.message === 'Missing important fields')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '108151', message: err_3.message });
                    else if (err_3.message === 'Invalid project status')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '108152', message: err_3.message });
                    else if (err_3.message === 'Invalid customer id')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '108153', message: err_3.message });
                    else if (err_3.message === 'Invalid project number')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '108154', message: err_3.message });
                    else if (err_3.message === 'Invalid progression number')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '108155', message: err_3.message });
                    else if (err_3.message === 'Invalid deadline')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '108156', message: err_3.message });
                    else if (err_3.message === 'Some employee id are invalid')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '108157', message: err_3.message });
                    else if (err_3.message === 'You can\'t have both billing systems active')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '108158', message: err_3.message });
                    else if (err_3.message === 'Invalid fixed rate')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '108159', message: err_3.message });
                    else if (err_3.message === 'Invalid hourly rate')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '108160', message: err_3.message });
                    else if (err_3.message === 'Invalid estimate hour')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '108161', message: err_3.message });
                    else if (err_3.message === 'Start date can\'t be set after deadline')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '108162', message: err_3.message });
                    else
                        responseHelper_1.errorHandler(res, err_3);
                    return [3 /*break*/, 9];
                case 9: return [2 /*return*/];
            }
        });
    }); };
    /**
     * Fonction de modification du projet (PUT /project)
     * @param req express Request
     * @param res express Response
     */
    ProjectController.update = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var hasPermission, _a, id, projectNum, title, status_2, clientId, progression, startDate, deadline, employees, fixedRate, hourlyRate, estimateHour, project, customer, _b, _i, employees_2, employee, findEmployee, toUpdate, err_4;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 11, , 12]);
                    hasPermission = globalUtils_1.globalUtils.checkPermission(userUtils_1.userUtils.getRequestUser(req), 'user');
                    if (!hasPermission)
                        throw new Error('You do not have the required permissions');
                    _a = req.body, id = _a.id, projectNum = _a.projectNum, title = _a.title, status_2 = _a.status, clientId = _a.clientId, progression = _a.progression, startDate = _a.startDate, deadline = _a.deadline, employees = _a.employees, fixedRate = _a.fixedRate, hourlyRate = _a.hourlyRate, estimateHour = _a.estimateHour;
                    // Vérification de si toutes les données nécessaire sont présentes
                    if (!id)
                        throw new Error('Missing id field');
                    return [4 /*yield*/, globalUtils_1.globalUtils.findOne(Project_1.Project, id)];
                case 1:
                    project = _c.sent();
                    if (!project)
                        throw new Error('Invalid project id');
                    // Vérification de la validité du status
                    if (status_2 && !verifyDataHelper_1.default.validProjectStatus(status_2))
                        throw new Error('Invalid project status');
                    if (!clientId) return [3 /*break*/, 3];
                    return [4 /*yield*/, globalUtils_1.globalUtils.findOne(Client_1.Client, clientId)];
                case 2:
                    customer = _c.sent();
                    if (!customer)
                        throw new Error('Invalid customer id');
                    _c.label = 3;
                case 3:
                    _b = projectNum && projectNum !== project.projectNum;
                    if (!_b) return [3 /*break*/, 5];
                    return [4 /*yield*/, verifyDataHelper_1.default.validProjectNumber(projectNum)];
                case 4:
                    _b = !(_c.sent());
                    _c.label = 5;
                case 5:
                    // Vérification de la validité du numéro de projet
                    if (_b)
                        throw new Error('Invalid project number');
                    // Vérification de la validité du numéro de projet
                    if ((progression && !verifyDataHelper_1.default.validInt(progression)) || (progression < 0 || progression > 100))
                        throw new Error('Invalid progression number');
                    // Vérification de la validité de la date d'échéance
                    if (deadline) {
                        if (!verifyDataHelper_1.default.validDeadline(deadline))
                            throw new Error('Invalid deadline');
                        req.body.deadline = new Date(deadline);
                    }
                    if (!employees) return [3 /*break*/, 9];
                    _i = 0, employees_2 = employees;
                    _c.label = 6;
                case 6:
                    if (!(_i < employees_2.length)) return [3 /*break*/, 9];
                    employee = employees_2[_i];
                    return [4 /*yield*/, userUtils_1.userUtils.findUser({ userId: employee.id })];
                case 7:
                    findEmployee = _c.sent();
                    if (!findEmployee)
                        throw new Error('Some employee id are invalid');
                    _c.label = 8;
                case 8:
                    _i++;
                    return [3 /*break*/, 6];
                case 9:
                    // Vérification du taux de facturation du projet
                    if (fixedRate && hourlyRate)
                        throw new Error('You can\'t have both billing systems active');
                    if (fixedRate && !verifyDataHelper_1.default.validFloat(fixedRate))
                        throw new Error('Invalid fixed rate');
                    if (hourlyRate && !verifyDataHelper_1.default.validFloat(hourlyRate))
                        throw new Error('Invalid hourly rate');
                    // Vérification de la date de début du projet
                    if (estimateHour && !verifyDataHelper_1.default.validInt(estimateHour))
                        throw new Error('Invalid estimate hour');
                    if (estimateHour)
                        req.body.estimateHour = verifyDataHelper_1.default.validInt(estimateHour);
                    // Vérification de la date de début n'est pas situé après la deadline
                    if (startDate && deadline && new Date(deadline).getTime() - new Date(startDate).getTime() < 0)
                        throw new Error('Start date can\'t be set after deadline');
                    else if (startDate && !deadline && project.deadline.getTime() - new Date(startDate).getTime() < 0)
                        throw new Error('Start date can\'t be set after deadline');
                    else if (!startDate && deadline && new Date(deadline).getTime() - project.startDate.getTime() < 0)
                        throw new Error('Start date can\'t be set after deadline');
                    toUpdate = {};
                    if (projectNum)
                        toUpdate.projectNum = project.projectNum = projectNum;
                    if (title)
                        toUpdate.title = project.title = title;
                    if (status_2)
                        toUpdate.status = project.status = status_2;
                    if (clientId)
                        toUpdate.clientId = project.clientId = clientId;
                    if (progression)
                        toUpdate.progression = project.progression = progression;
                    if (startDate)
                        toUpdate.startDate = project.startDate = startDate;
                    if (deadline)
                        toUpdate.deadline = project.deadline = deadline;
                    if (employees)
                        toUpdate.employees = project.employees = employees;
                    if (fixedRate) {
                        toUpdate.fixedRate = project.fixedRate = fixedRate;
                        toUpdate.hourlyRate = 0;
                    }
                    if (hourlyRate) {
                        toUpdate.hourlyRate = project.hourlyRate = hourlyRate;
                        toUpdate.fixedRate = 0;
                    }
                    if (estimateHour)
                        toUpdate.estimateHour = project.estimateHour = estimateHour;
                    // Modification du projet
                    return [4 /*yield*/, globalUtils_1.globalUtils.updateOneById(Project_1.Project, id, toUpdate)];
                case 10:
                    // Modification du projet
                    _c.sent();
                    // Envoi de la réponse
                    responseHelper_1.sendResponse(res, 200, { error: false, message: 'Project successfully updated', project: projectUtils_1.projectUtils.generateProjectJSON(project) });
                    return [3 /*break*/, 12];
                case 11:
                    err_4 = _c.sent();
                    if (err_4.message === 'You do not have the required permissions')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '401002', message: err_4.message });
                    else if (err_4.message === 'Missing id field')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '108201', message: err_4.message });
                    else if (err_4.message === 'Invalid project id')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '108202', message: err_4.message });
                    else if (err_4.message === 'Invalid project status')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '108203', message: err_4.message });
                    else if (err_4.message === 'Invalid customer id')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '108204', message: err_4.message });
                    else if (err_4.message === 'Invalid project number')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '108205', message: err_4.message });
                    else if (err_4.message === 'Invalid progression number')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '108206', message: err_4.message });
                    else if (err_4.message === 'Invalid deadline')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '108207', message: err_4.message });
                    else if (err_4.message === 'Some employee id are invalid')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '108208', message: err_4.message });
                    else if (err_4.message === 'You can\'t have both billing systems active')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '108209', message: err_4.message });
                    else if (err_4.message === 'Invalid fixed rate')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '108210', message: err_4.message });
                    else if (err_4.message === 'Invalid hourly rate')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '108211', message: err_4.message });
                    else if (err_4.message === 'Invalid estimate hour')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '108212', message: err_4.message });
                    else if (err_4.message === 'Start date can\'t be set after deadline')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '108213', message: err_4.message });
                    else
                        responseHelper_1.errorHandler(res, err_4);
                    return [3 /*break*/, 12];
                case 12: return [2 /*return*/];
            }
        });
    }); };
    /**
     * Fonction de suppression d'un projet (DELETE /project/:id)
     * @param req express Request
     * @param res express Response
     */
    ProjectController.delete = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var hasPermission, id, project, err_5;
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
                    return [4 /*yield*/, globalUtils_1.globalUtils.findOne(Project_1.Project, id)];
                case 1:
                    project = _a.sent();
                    if (!project)
                        throw new Error('Invalid project id');
                    // Suppression de du projet
                    return [4 /*yield*/, globalUtils_1.globalUtils.deleteOne(Project_1.Project, id)];
                case 2:
                    // Suppression de du projet
                    _a.sent();
                    // Envoi de la réponse
                    responseHelper_1.sendResponse(res, 200, { error: false, message: 'Project successfully deleted' });
                    return [3 /*break*/, 4];
                case 3:
                    err_5 = _a.sent();
                    if (err_5.message === 'You do not have the required permissions')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '401002', message: err_5.message });
                    else if (err_5.message === 'Missing id field')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '108251', message: err_5.message });
                    else if (err_5.message === 'Invalid project id')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '108252', message: err_5.message });
                    else
                        responseHelper_1.errorHandler(res, err_5);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    return ProjectController;
}());
exports.ProjectController = ProjectController;
