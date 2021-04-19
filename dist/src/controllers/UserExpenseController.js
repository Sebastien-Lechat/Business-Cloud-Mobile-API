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
exports.UserExpenseController = void 0;
var responseHelper_1 = require("../helpers/responseHelper");
var verifyDataHelper_1 = __importDefault(require("../helpers/verifyDataHelper"));
var User_1 = require("../models/User");
var UserExpense_1 = require("../models/UserExpense");
var globalUtils_1 = require("../utils/globalUtils");
var userExpenseUtils_1 = require("../utils/userExpenseUtils");
var userUtils_1 = require("../utils/userUtils");
var UserExpenseController = /** @class */ (function () {
    function UserExpenseController() {
    }
    /**
     * Fonction de récupération de tous  (GET /expenses-employee)
     * @param req express Request
     * @param res express Response
     */
    UserExpenseController.getUserExpensesList = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var user, hasPermission, userExpenseList, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    user = userUtils_1.userUtils.getRequestUser(req);
                    hasPermission = globalUtils_1.globalUtils.checkPermission(user, 'user');
                    if (!hasPermission)
                        throw new Error('You do not have the required permissions');
                    return [4 /*yield*/, userExpenseUtils_1.userExpenseUtils.getUserExpenseList(user)];
                case 1:
                    userExpenseList = _a.sent();
                    // Envoi de la réponse
                    responseHelper_1.sendResponse(res, 200, { error: false, message: 'Successful expenses acquisition', expenses: userExpenseList });
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
     * Fonction de création (POST /expense-employee)
     * @param req express Request
     * @param res express Response
     */
    UserExpenseController.create = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var hasPermission, _a, userExpenseNum, price, category, file, description, userId, accountNumber, user, expense, err_2;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 4, , 5]);
                    hasPermission = globalUtils_1.globalUtils.checkPermission(userUtils_1.userUtils.getRequestUser(req), 'user');
                    if (!hasPermission)
                        throw new Error('You do not have the required permissions');
                    _a = req.body, userExpenseNum = _a.userExpenseNum, price = _a.price, category = _a.category, file = _a.file, description = _a.description, userId = _a.userId, accountNumber = _a.accountNumber;
                    // Vérification de si toutes les données nécessaire sont présentes
                    if (!userExpenseNum || accountNumber === undefined || price === undefined || !category || !file || !description || !userId)
                        throw new Error('Missing important fields');
                    return [4 /*yield*/, verifyDataHelper_1.default.validUserExpenseNumber(userExpenseNum)];
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
                    return [4 /*yield*/, globalUtils_1.globalUtils.findOne(User_1.User, userId)];
                case 2:
                    user = _b.sent();
                    if (!user)
                        throw new Error('Invalid employee id');
                    return [4 /*yield*/, UserExpense_1.UserExpense.create(req.body)];
                case 3:
                    expense = _b.sent();
                    // Envoi de la réponse
                    responseHelper_1.sendResponse(res, 200, { error: false, message: 'Expense successfully created', expense: userExpenseUtils_1.userExpenseUtils.generateUserExpenseJSON(expense) });
                    return [3 /*break*/, 5];
                case 4:
                    err_2 = _b.sent();
                    if (err_2.message === 'You do not have the required permissions')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '401002', message: err_2.message });
                    else if (err_2.message === 'Missing important fields')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '107101', message: err_2.message });
                    else if (err_2.message === 'Invalid expense number')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '107102', message: err_2.message });
                    else if (err_2.message === 'Invalid account number')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '107103', message: err_2.message });
                    else if (err_2.message === 'Invalid price format')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '107104', message: err_2.message });
                    else if (err_2.message === 'Invalid employee id')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '107105', message: err_2.message });
                    else
                        responseHelper_1.errorHandler(res, err_2);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    /**
     * Fonction de suppression (DELETE /expense-employee/:id)
     * @param req express Request
     * @param res express Response
     */
    UserExpenseController.delete = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var hasPermission, id, userExpense, err_3;
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
                    return [4 /*yield*/, globalUtils_1.globalUtils.findOne(UserExpense_1.UserExpense, id)];
                case 1:
                    userExpense = _a.sent();
                    if (!userExpense)
                        throw new Error('Invalid expense id');
                    // Suppression de la note de frais
                    return [4 /*yield*/, globalUtils_1.globalUtils.deleteOne(UserExpense_1.UserExpense, id)];
                case 2:
                    // Suppression de la note de frais
                    _a.sent();
                    // Envoi de la réponse
                    responseHelper_1.sendResponse(res, 200, { error: false, message: 'Expense successfully deleted' });
                    return [3 /*break*/, 4];
                case 3:
                    err_3 = _a.sent();
                    if (err_3.message === 'You do not have the required permissions')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '401002', message: err_3.message });
                    else if (err_3.message === '')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '107151', message: err_3.message });
                    else
                        responseHelper_1.errorHandler(res, err_3);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    return UserExpenseController;
}());
exports.UserExpenseController = UserExpenseController;
