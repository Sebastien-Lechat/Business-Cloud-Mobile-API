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
exports.TimeController = void 0;
var responseHelper_1 = require("../helpers/responseHelper");
var verifyDataHelper_1 = __importDefault(require("../helpers/verifyDataHelper"));
var Project_1 = require("../models/Project");
var Task_1 = require("../models/Task");
var Time_1 = require("../models/Time");
var globalUtils_1 = require("../utils/globalUtils");
var timeUtils_1 = require("../utils/timeUtils");
var userUtils_1 = require("../utils/userUtils");
var TimeController = /** @class */ (function () {
    function TimeController() {
    }
    /**
     * Fonction de récupération de tous les temps (GET /times)
     * @param req express Request
     * @param res express Response
     */
    TimeController.getTimesList = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var hasPermission, projectId, project, timeList, timeList, err_1;
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
                    return [4 /*yield*/, timeUtils_1.timeUtils.getTimeList(projectId)];
                case 2:
                    timeList = _a.sent();
                    // Envoi de la réponse
                    responseHelper_1.sendResponse(res, 200, { error: false, message: 'Successful times acquisition', times: timeList });
                    return [3 /*break*/, 5];
                case 3: return [4 /*yield*/, timeUtils_1.timeUtils.getTimeList()];
                case 4:
                    timeList = _a.sent();
                    // Envoi de la réponse
                    responseHelper_1.sendResponse(res, 200, { error: false, message: 'Successful times acquisition', times: timeList });
                    _a.label = 5;
                case 5: return [3 /*break*/, 7];
                case 6:
                    err_1 = _a.sent();
                    if (err_1.message === 'You do not have the required permissions')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '401002', message: err_1.message });
                    else if (err_1.message === 'Invalid project id')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '110051', message: err_1.message });
                    else
                        responseHelper_1.errorHandler(res, err_1);
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    }); };
    /**
     * Fonction de création d'un temps (POST /time)
     * @param req express Request
     * @param res express Response
     */
    TimeController.create = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var user, hasPermission, _a, taskId, projectId, billable, duration, project, task, time, err_2;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 5, , 6]);
                    user = userUtils_1.userUtils.getRequestUser(req);
                    hasPermission = globalUtils_1.globalUtils.checkPermission(user, 'user');
                    if (!hasPermission)
                        throw new Error('You do not have the required permissions');
                    // Ajout de l'utilisateur pour la création si il a les permissions
                    req.body.userId = user.data._id;
                    _a = req.body, taskId = _a.taskId, projectId = _a.projectId, billable = _a.billable, duration = _a.duration;
                    // Vérification de si toutes les données nécessaire sont présentes
                    if (!projectId || billable === undefined || !duration)
                        throw new Error('Missing important fields');
                    return [4 /*yield*/, globalUtils_1.globalUtils.findOne(Project_1.Project, projectId)];
                case 1:
                    project = _b.sent();
                    if (!project)
                        throw new Error('Invalid project id');
                    if (!taskId) return [3 /*break*/, 3];
                    return [4 /*yield*/, globalUtils_1.globalUtils.findOne(Task_1.Task, taskId)];
                case 2:
                    task = _b.sent();
                    if (!task)
                        throw new Error('Invalid task id');
                    _b.label = 3;
                case 3:
                    // Vérification de la validité du champs facturable
                    if (billable && billable !== true && billable !== false)
                        throw new Error('Invalid billable format');
                    // Vérification du nombre d'heures estimé
                    if (!verifyDataHelper_1.default.validInt(duration))
                        throw new Error('Invalid duration number');
                    req.body.duration = verifyDataHelper_1.default.validInt(duration);
                    return [4 /*yield*/, Time_1.Time.create(req.body)];
                case 4:
                    time = _b.sent();
                    // Envoi de la réponse
                    responseHelper_1.sendResponse(res, 200, { error: false, message: 'Time successfully created', time: timeUtils_1.timeUtils.generateTimeJSON(time) });
                    return [3 /*break*/, 6];
                case 5:
                    err_2 = _b.sent();
                    if (err_2.message === 'You do not have the required permissions')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '401002', message: err_2.message });
                    else if (err_2.message === 'Missing important fields')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '110101', message: err_2.message });
                    else if (err_2.message === 'Invalid project id')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '110102', message: err_2.message });
                    else if (err_2.message === 'Invalid task id')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '110103', message: err_2.message });
                    else if (err_2.message === 'Invalid billable format')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '110104', message: err_2.message });
                    else if (err_2.message === 'Invalid duration number')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '110105', message: err_2.message });
                    else
                        responseHelper_1.errorHandler(res, err_2);
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    }); };
    /**
     * Fonction de suppression d'un temps (DELETE /time/:id)
     * @param req express Request
     * @param res express Response
     */
    TimeController.delete = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var hasPermission, id, time, err_3;
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
                    return [4 /*yield*/, globalUtils_1.globalUtils.findOne(Time_1.Time, id)];
                case 1:
                    time = _a.sent();
                    if (!time)
                        throw new Error('Invalid time id');
                    // Suppression du temps
                    return [4 /*yield*/, globalUtils_1.globalUtils.deleteOne(Time_1.Time, id)];
                case 2:
                    // Suppression du temps
                    _a.sent();
                    // Envoi de la réponse
                    responseHelper_1.sendResponse(res, 200, { error: false, message: 'Time successfully deleted' });
                    return [3 /*break*/, 4];
                case 3:
                    err_3 = _a.sent();
                    if (err_3.message === 'You do not have the required permissions')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '401002', message: err_3.message });
                    else if (err_3.message === 'Missing id field')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '110151', message: err_3.message });
                    else if (err_3.message === 'Invalid time id')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '110152', message: err_3.message });
                    else
                        responseHelper_1.errorHandler(res, err_3);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    return TimeController;
}());
exports.TimeController = TimeController;
