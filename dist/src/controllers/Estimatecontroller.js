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
exports.EstimateController = void 0;
var responseHelper_1 = require("../helpers/responseHelper");
var verifyDataHelper_1 = __importDefault(require("../helpers/verifyDataHelper"));
var Article_1 = require("../models/Article");
var Client_1 = require("../models/Client");
var Entreprise_1 = require("../models/Entreprise");
var Estimate_1 = require("../models/Estimate");
var articleUtils_1 = require("../utils/articleUtils");
var estimateUtils_1 = require("../utils/estimateUtils");
var globalUtils_1 = require("../utils/globalUtils");
var userUtils_1 = require("../utils/userUtils");
var EstimateController = /** @class */ (function () {
    function EstimateController() {
    }
    /**
     * Fonction de récupération de tous les devis  (GET /estimates)
     * @param req express Request
     * @param res express Response
     */
    EstimateController.getEstimatesList = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var user, estimateList, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    user = userUtils_1.userUtils.getRequestUser(req);
                    return [4 /*yield*/, estimateUtils_1.estimateUtils.getEstimateList(user)];
                case 1:
                    estimateList = _a.sent();
                    // Envoi de la réponse
                    responseHelper_1.sendResponse(res, 200, { error: false, message: 'Successful estimates acquisition', estimates: estimateList });
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
     * Fonction de récupération d'un devis  (GET /estimate/:id)
     * @param req express Request
     * @param res express Response
     */
    EstimateController.getOneEstimate = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var id, estimate, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    id = req.params.id;
                    // Vérification de si toutes les données nécessaire sont présentes
                    if (!id)
                        throw new Error('Missing id field');
                    return [4 /*yield*/, globalUtils_1.globalUtils.findOne(Estimate_1.Estimate, id)];
                case 1:
                    estimate = _a.sent();
                    if (!estimate)
                        throw new Error('Invalid estimate id');
                    // Envoi de la réponse
                    responseHelper_1.sendResponse(res, 200, { error: false, message: 'Successful estimate acquisition', estimate: estimateUtils_1.estimateUtils.generateEstimateJSON(estimate) });
                    return [3 /*break*/, 3];
                case 2:
                    err_2 = _a.sent();
                    if (err_2.message === 'Invalid estimate id')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '105101', message: err_2.message });
                    else
                        responseHelper_1.errorHandler(res, err_2);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    /**
     * Fonction de création d'un devis (POST /estimate)
     * @param req express Request
     * @param res express Response
     */
    EstimateController.create = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var hasPermission, _a, status_1, clientId, enterpriseId, estimateNum, deadline, currency, customer, enterprise, estimate, err_3;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 5, , 6]);
                    hasPermission = globalUtils_1.globalUtils.checkPermission(userUtils_1.userUtils.getRequestUser(req), 'user');
                    if (!hasPermission)
                        throw new Error('You do not have the required permissions');
                    _a = req.body, status_1 = _a.status, clientId = _a.clientId, enterpriseId = _a.enterpriseId, estimateNum = _a.estimateNum, deadline = _a.deadline, currency = _a.currency;
                    // Vérification de si toutes les données nécessaire sont présentes
                    if (!status_1 || !clientId || !enterpriseId || !estimateNum || !deadline)
                        throw new Error('Missing important fields');
                    // Vérification de la validité du status
                    if (!verifyDataHelper_1.default.validEstimateStatus(status_1))
                        throw new Error('Invalid estimate status');
                    return [4 /*yield*/, globalUtils_1.globalUtils.findOne(Client_1.Client, clientId)];
                case 1:
                    customer = _b.sent();
                    if (!customer)
                        throw new Error('Invalid customer id');
                    return [4 /*yield*/, globalUtils_1.globalUtils.findOne(Entreprise_1.Enterprise, enterpriseId)];
                case 2:
                    enterprise = _b.sent();
                    if (!enterprise)
                        throw new Error('Invalid enterprise id');
                    return [4 /*yield*/, verifyDataHelper_1.default.validEstimateNumber(estimateNum)];
                case 3:
                    // Vérification de la validité du numéro du devis
                    if (!(_b.sent()))
                        throw new Error('Invalid estimate number');
                    // Vérification de la validité de la date d'échéance
                    if (!verifyDataHelper_1.default.validDeadline(deadline))
                        throw new Error('Invalid deadline');
                    req.body.deadline = new Date(deadline);
                    req.body.articles = [];
                    req.body.totalHT = 0;
                    req.body.totalTTC = 0;
                    return [4 /*yield*/, Estimate_1.Estimate.create(req.body)];
                case 4:
                    estimate = _b.sent();
                    // Envoi de la réponse
                    responseHelper_1.sendResponse(res, 200, { error: false, message: 'Estimate successfully created', estimate: estimateUtils_1.estimateUtils.generateEstimateJSON(estimate) });
                    return [3 /*break*/, 6];
                case 5:
                    err_3 = _b.sent();
                    if (err_3.message === 'You do not have the required permissions')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '401002', message: err_3.message });
                    else if (err_3.message === 'Missing important fields')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '105151', message: err_3.message });
                    else if (err_3.message === 'Invalid estimate status')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '105152', message: err_3.message });
                    else if (err_3.message === 'Invalid customer id')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '105153', message: err_3.message });
                    else if (err_3.message === 'Invalid enterprise id')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '105154', message: err_3.message });
                    else if (err_3.message === 'Invalid estimate number')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '105155', message: err_3.message });
                    else if (err_3.message === 'Invalid deadline')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '105156', message: err_3.message });
                    else
                        responseHelper_1.errorHandler(res, err_3);
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    }); };
    /**
     * Fonction de modification d'un devis (PUT /estimate)
     * @param req express Request
     * @param res express Response
     */
    EstimateController.update = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var hasPermission, _a, id, status_2, clientId, estimateNum, articles, currency, deadline, estimate, customer, _b, newTotalHT, newTotalTTC, _i, articles_1, article, articleFind, toUpdate, populateEstimate, err_4;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 12, , 13]);
                    hasPermission = globalUtils_1.globalUtils.checkPermission(userUtils_1.userUtils.getRequestUser(req), 'user');
                    if (!hasPermission)
                        throw new Error('You do not have the required permissions');
                    _a = req.body, id = _a.id, status_2 = _a.status, clientId = _a.clientId, estimateNum = _a.estimateNum, articles = _a.articles, currency = _a.currency, deadline = _a.deadline;
                    // Vérification de si toutes les données nécessaire sont présentes
                    if (!id)
                        throw new Error('Missing id field');
                    return [4 /*yield*/, globalUtils_1.globalUtils.findOne(Estimate_1.Estimate, id)];
                case 1:
                    estimate = _c.sent();
                    if (!estimate)
                        throw new Error('Invalid estimate id');
                    // Vérification de la validité du status
                    if (status_2 && !verifyDataHelper_1.default.validEstimateStatus(status_2))
                        throw new Error('Invalid estimate status');
                    if (!clientId) return [3 /*break*/, 3];
                    return [4 /*yield*/, globalUtils_1.globalUtils.findOne(Client_1.Client, clientId)];
                case 2:
                    customer = _c.sent();
                    if (!customer)
                        throw new Error('Invalid customer id');
                    _c.label = 3;
                case 3:
                    _b = estimateNum && estimateNum !== estimate.estimateNum;
                    if (!_b) return [3 /*break*/, 5];
                    return [4 /*yield*/, verifyDataHelper_1.default.validEstimateNumber(estimateNum)];
                case 4:
                    _b = !(_c.sent());
                    _c.label = 5;
                case 5:
                    // Vérification de la validité du numéro de devis
                    if (_b)
                        throw new Error('Invalid estimate number');
                    // Vérification de la validité de la date d'échéance
                    if (deadline && !verifyDataHelper_1.default.validDeadline(deadline))
                        throw new Error('Invalid deadline');
                    newTotalHT = 0;
                    newTotalTTC = 0;
                    if (!articles) return [3 /*break*/, 9];
                    _i = 0, articles_1 = articles;
                    _c.label = 6;
                case 6:
                    if (!(_i < articles_1.length)) return [3 /*break*/, 9];
                    article = articles_1[_i];
                    if (!article.articleId || !article.quantity)
                        throw new Error('Invalid article format');
                    return [4 /*yield*/, globalUtils_1.globalUtils.findOne(Article_1.Article, article.articleId)];
                case 7:
                    articleFind = _c.sent();
                    if (!articleFind)
                        throw new Error('Some article id are invalid');
                    newTotalHT += (articleFind.price * article.quantity);
                    newTotalTTC += ((articleFind.price * (1 + (articleFind.tva / 100))) * article.quantity);
                    _c.label = 8;
                case 8:
                    _i++;
                    return [3 /*break*/, 6];
                case 9:
                    toUpdate = {};
                    if (status_2)
                        toUpdate.status = estimate.status = status_2;
                    if (clientId)
                        toUpdate.clientId = estimate.clientId = clientId;
                    if (estimateNum)
                        toUpdate.estimateNum = estimate.estimateNum = estimateNum;
                    if (articles) {
                        toUpdate.articles = estimate.articles = articles;
                        toUpdate.totalHT = newTotalHT.toFixed(2);
                        toUpdate.totalTTC = newTotalTTC.toFixed(2);
                    }
                    if (currency)
                        toUpdate.currency = estimate.currency = currency;
                    if (deadline)
                        toUpdate.deadline = estimate.deadline = deadline;
                    // Modification du devis
                    return [4 /*yield*/, globalUtils_1.globalUtils.updateOneById(Estimate_1.Estimate, id, toUpdate)];
                case 10:
                    // Modification du devis
                    _c.sent();
                    return [4 /*yield*/, globalUtils_1.globalUtils.findOneAndPopulate(Estimate_1.Estimate, id, ['articles.articleId'])];
                case 11:
                    populateEstimate = _c.sent();
                    // Mise en forme
                    populateEstimate.articles.map(function (article) {
                        article.articleId = articleUtils_1.articleUtils.generateArticleJSON(article.articleId);
                        return article;
                    });
                    // Envoi de la réponse
                    responseHelper_1.sendResponse(res, 200, { error: false, message: 'Estimate successfully updated', estimate: estimateUtils_1.estimateUtils.generateEstimateJSON(populateEstimate) });
                    return [3 /*break*/, 13];
                case 12:
                    err_4 = _c.sent();
                    if (err_4.message === 'You do not have the required permissions')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '401002', message: err_4.message });
                    else if (err_4.message === 'Missing id field')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '105201', message: err_4.message });
                    else if (err_4.message === 'Invalid estimate id')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '105202', message: err_4.message });
                    else if (err_4.message === 'Invalid estimate status')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '105203', message: err_4.message });
                    else if (err_4.message === 'Invalid customer id')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '105204', message: err_4.message });
                    else if (err_4.message === 'Invalid estimate number')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '105205', message: err_4.message });
                    else if (err_4.message === 'Invalid deadline')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '105206', message: err_4.message });
                    else if (err_4.message === 'Invalid article format')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '105207', message: err_4.message });
                    else if (err_4.message === 'Some article id are invalid')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '105208', message: err_4.message });
                    else
                        responseHelper_1.errorHandler(res, err_4);
                    return [3 /*break*/, 13];
                case 13: return [2 /*return*/];
            }
        });
    }); };
    /**
     * Fonction de suppression d'un devis (DELETE /estimate/:id)
     * @param req express Request
     * @param res express Response
     */
    EstimateController.delete = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var hasPermission, id, estimate, err_5;
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
                    return [4 /*yield*/, globalUtils_1.globalUtils.findOne(Estimate_1.Estimate, id)];
                case 1:
                    estimate = _a.sent();
                    if (!estimate)
                        throw new Error('Invalid estimate id');
                    // Suppression du devis
                    return [4 /*yield*/, globalUtils_1.globalUtils.deleteOne(Estimate_1.Estimate, id)];
                case 2:
                    // Suppression du devis
                    _a.sent();
                    // Envoi de la réponse
                    responseHelper_1.sendResponse(res, 200, { error: false, message: 'Estimate successfully deleted' });
                    return [3 /*break*/, 4];
                case 3:
                    err_5 = _a.sent();
                    if (err_5.message === 'You do not have the required permissions')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '401002', message: err_5.message });
                    else if (err_5.message === 'Missing id field')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '105251', message: err_5.message });
                    else if (err_5.message === 'Invalid estimate id')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '105252', message: err_5.message });
                    else
                        responseHelper_1.errorHandler(res, err_5);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    return EstimateController;
}());
exports.EstimateController = EstimateController;
