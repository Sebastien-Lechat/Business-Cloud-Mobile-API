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
exports.ArticleController = void 0;
var responseHelper_1 = require("../helpers/responseHelper");
var verifyDataHelper_1 = __importDefault(require("../helpers/verifyDataHelper"));
var Article_1 = require("../models/Article");
var articleUtils_1 = require("../utils/articleUtils");
var globalUtils_1 = require("../utils/globalUtils");
var userUtils_1 = require("../utils/userUtils");
var ArticleController = /** @class */ (function () {
    function ArticleController() {
    }
    /**
     * Fonction de récupération de tous les articles  (GET /articles)
     * @param req express Request
     * @param res express Response
     */
    ArticleController.getArticlesList = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var hasPermission, articleListe, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    hasPermission = globalUtils_1.globalUtils.checkPermission(userUtils_1.userUtils.getRequestUser(req), 'user');
                    if (!hasPermission)
                        throw new Error('You do not have the required permissions');
                    return [4 /*yield*/, articleUtils_1.articleUtils.getArticleList()];
                case 1:
                    articleListe = _a.sent();
                    // Envoi de la réponse
                    responseHelper_1.sendResponse(res, 200, { error: false, message: 'Successful articles acquisition', articles: articleListe });
                    return [3 /*break*/, 3];
                case 2:
                    err_1 = _a.sent();
                    if (err_1.message === 'You do not have the required permissions')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '401002', message: err_1.message });
                    else
                        responseHelper_1.errorHandler(res, err_1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    /**
     * Fonction de création d'un article (POST /article)
     * @param req express Request
     * @param res express Response
     */
    ArticleController.create = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var hasPermission, _a, name_1, accountNumber, price, tva, article, err_2;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    hasPermission = globalUtils_1.globalUtils.checkPermission(userUtils_1.userUtils.getRequestUser(req), 'user');
                    if (!hasPermission)
                        throw new Error('You do not have the required permissions');
                    _a = req.body, name_1 = _a.name, accountNumber = _a.accountNumber, price = _a.price, tva = _a.tva;
                    // Vérification de si toutes les données nécessaire sont présentes
                    if (!name_1 || accountNumber === undefined || price === undefined || tva === undefined)
                        throw new Error('Missing important fields');
                    // Vérification de la validité du numéro de compte
                    if (!verifyDataHelper_1.default.validAccountNumber(accountNumber))
                        throw new Error('Invalid account number');
                    req.body.accountNumber = verifyDataHelper_1.default.validAccountNumber(accountNumber);
                    // Vérification de la validité du prix
                    if (!verifyDataHelper_1.default.validPrice(price))
                        throw new Error('Invalid price format');
                    req.body.price = verifyDataHelper_1.default.validPrice(price);
                    // Vérification de la validité de la tva
                    if (!verifyDataHelper_1.default.validTaxe(tva))
                        throw new Error('Invalid tva format');
                    req.body.tva = verifyDataHelper_1.default.validTaxe(tva);
                    return [4 /*yield*/, Article_1.Article.create(req.body)];
                case 1:
                    article = _b.sent();
                    // Envoi de la réponse
                    responseHelper_1.sendResponse(res, 200, { error: false, message: 'Article successfully created', article: articleUtils_1.articleUtils.generateArticleJSON(article) });
                    return [3 /*break*/, 3];
                case 2:
                    err_2 = _b.sent();
                    if (err_2.message === 'You do not have the required permissions')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '401002', message: err_2.message });
                    else if (err_2.message === 'Missing important fields')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '106101', message: err_2.message });
                    else if (err_2.message === 'Invalid account number')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '106102', message: err_2.message });
                    else if (err_2.message === 'Invalid price format')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '106103', message: err_2.message });
                    else if (err_2.message === 'Invalid tva format')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '106104', message: err_2.message });
                    else
                        responseHelper_1.errorHandler(res, err_2);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    /**
     * Fonction de suppression d'un article (DELETE /article/:id)
     * @param req express Request
     * @param res express Response
     */
    ArticleController.delete = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var hasPermission, id, article, err_3;
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
                    return [4 /*yield*/, globalUtils_1.globalUtils.findOne(Article_1.Article, id)];
                case 1:
                    article = _a.sent();
                    if (!article)
                        throw new Error('Invalid article id');
                    // Suppression de l'article
                    return [4 /*yield*/, globalUtils_1.globalUtils.deleteOne(Article_1.Article, id)];
                case 2:
                    // Suppression de l'article
                    _a.sent();
                    // Envoi de la réponse
                    responseHelper_1.sendResponse(res, 200, { error: false, message: 'Article successfully deleted' });
                    return [3 /*break*/, 4];
                case 3:
                    err_3 = _a.sent();
                    if (err_3.message === 'You do not have the required permissions')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '401002', message: err_3.message });
                    else if (err_3.message === 'Missing id field')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '106151', message: err_3.message });
                    else if (err_3.message === 'Invalid article id')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '106152', message: err_3.message });
                    else
                        responseHelper_1.errorHandler(res, err_3);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    return ArticleController;
}());
exports.ArticleController = ArticleController;
