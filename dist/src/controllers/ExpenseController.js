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
exports.ExpenseController = void 0;
var mongoose_1 = __importDefault(require("mongoose"));
var responseHelper_1 = require("../helpers/responseHelper");
var verifyDataHelper_1 = __importDefault(require("../helpers/verifyDataHelper"));
var Expense_1 = require("../models/Expense");
var Project_1 = require("../models/Project");
var User_1 = require("../models/User");
var expenseUtils_1 = require("../utils/expenseUtils");
var globalUtils_1 = require("../utils/globalUtils");
var userUtils_1 = require("../utils/userUtils");
var ExpenseController = /** @class */ (function () {
    function ExpenseController() {
    }
    /**
     * Fonction de récupération de toutes les dépenses  (GET /expenses/:projectId)
     * @param req express Request
     * @param res express Response
     */
    ExpenseController.getExpensesList = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var hasPermission, projectId, project, expenseList, expenseList, err_1;
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
                    return [4 /*yield*/, expenseUtils_1.expenseUtils.getExpenseList(projectId)];
                case 2:
                    expenseList = _a.sent();
                    // Envoi de la réponse
                    responseHelper_1.sendResponse(res, 200, { error: false, message: 'Successful expenses acquisition', expenses: expenseList });
                    return [3 /*break*/, 5];
                case 3: return [4 /*yield*/, expenseUtils_1.expenseUtils.getExpenseList()];
                case 4:
                    expenseList = _a.sent();
                    // Envoi de la réponse
                    responseHelper_1.sendResponse(res, 200, { error: false, message: 'Successful expenses acquisition', expenses: expenseList });
                    _a.label = 5;
                case 5: return [3 /*break*/, 7];
                case 6:
                    err_1 = _a.sent();
                    if (err_1.message === 'You do not have the required permissions')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '401002', message: err_1.message });
                    else if (err_1.message === 'Invalid project id')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '111051', message: err_1.message });
                    else
                        responseHelper_1.errorHandler(res, err_1);
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    }); };
    /**
     * Fonction de création d'une dépense (POST /expense)
     * @param req express Request
     * @param res express Response
     */
    ExpenseController.create = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var hasPermission, _a, expenseNum, price, category, file, description, userId, projectId, accountNumber, invoiced, user, project, expense, err_2;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 5, , 6]);
                    hasPermission = globalUtils_1.globalUtils.checkPermission(userUtils_1.userUtils.getRequestUser(req), 'user');
                    if (!hasPermission)
                        throw new Error('You do not have the required permissions');
                    _a = req.body, expenseNum = _a.expenseNum, price = _a.price, category = _a.category, file = _a.file, description = _a.description, userId = _a.userId, projectId = _a.projectId, accountNumber = _a.accountNumber, invoiced = _a.invoiced;
                    // Vérification de si toutes les données nécessaire sont présentes
                    if (!expenseNum || accountNumber === undefined || price === undefined || !category || !file || !description || !userId || !projectId)
                        throw new Error('Missing important fields');
                    return [4 /*yield*/, verifyDataHelper_1.default.validExpenseNumber(expenseNum)];
                case 1:
                    // Vérification de la validité du numéro de facture
                    if (!(_b.sent()))
                        throw new Error('Invalid expense number');
                    // Vérification de la validité du numéro de compte
                    if (!verifyDataHelper_1.default.validAccountNumber(accountNumber))
                        throw new Error('Invalid account number');
                    req.body.accountNumber = verifyDataHelper_1.default.validAccountNumber(accountNumber);
                    // Vérification de la validité du prix
                    if (!verifyDataHelper_1.default.validPrice(price))
                        throw new Error('Invalid price format');
                    req.body.price = verifyDataHelper_1.default.validPrice(price);
                    // Vérification de la validité du champs facturable
                    if (invoiced && invoiced !== true && invoiced !== false)
                        throw new Error('Invalid invoiced format');
                    return [4 /*yield*/, globalUtils_1.globalUtils.findOne(User_1.User, userId)];
                case 2:
                    user = _b.sent();
                    if (!user)
                        throw new Error('Invalid employee id');
                    return [4 /*yield*/, Project_1.Project.findOne({ _id: mongoose_1.default.Types.ObjectId(projectId) })];
                case 3:
                    project = _b.sent();
                    if (!project)
                        throw new Error('Invalid project id');
                    return [4 /*yield*/, Expense_1.Expense.create(req.body)];
                case 4:
                    expense = _b.sent();
                    // Envoi de la réponse
                    responseHelper_1.sendResponse(res, 200, { error: false, message: 'Expense successfully created', expense: expenseUtils_1.expenseUtils.generateExpenseJSON(expense) });
                    return [3 /*break*/, 6];
                case 5:
                    err_2 = _b.sent();
                    if (err_2.message === 'You do not have the required permissions')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '401002', message: err_2.message });
                    else if (err_2.message === 'Missing important fields')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '111101', message: err_2.message });
                    else if (err_2.message === 'Invalid expense number')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '111102', message: err_2.message });
                    else if (err_2.message === 'Invalid account number')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '111103', message: err_2.message });
                    else if (err_2.message === 'Invalid price format')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '111104', message: err_2.message });
                    else if (err_2.message === 'Invalid invoiced format')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '111105', message: err_2.message });
                    else if (err_2.message === 'Invalid employee id')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '111106', message: err_2.message });
                    else if (err_2.message === 'Invalid project id')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '111107', message: err_2.message });
                    else
                        responseHelper_1.errorHandler(res, err_2);
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    }); };
    /**
     * Fonction de suppression d'une dépense (DELETE /expense/:id)
     * @param req express Request
     * @param res express Response
     */
    ExpenseController.delete = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var hasPermission, id, expense, err_3;
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
                    return [4 /*yield*/, globalUtils_1.globalUtils.findOne(Expense_1.Expense, id)];
                case 1:
                    expense = _a.sent();
                    if (!expense)
                        throw new Error('Invalid expense id');
                    // Suppression de la dépense
                    return [4 /*yield*/, globalUtils_1.globalUtils.deleteOne(Expense_1.Expense, id)];
                case 2:
                    // Suppression de la dépense
                    _a.sent();
                    // Envoi de la réponse
                    responseHelper_1.sendResponse(res, 200, { error: false, message: 'Expense successfully deleted' });
                    return [3 /*break*/, 4];
                case 3:
                    err_3 = _a.sent();
                    if (err_3.message === 'You do not have the required permissions')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '401002', message: err_3.message });
                    else if (err_3.message === 'Missing id field')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '111151', message: err_3.message });
                    else if (err_3.message === 'Invalid expense id')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '111152', message: err_3.message });
                    else
                        responseHelper_1.errorHandler(res, err_3);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    return ExpenseController;
}());
exports.ExpenseController = ExpenseController;
