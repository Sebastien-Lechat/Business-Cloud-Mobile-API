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
Object.defineProperty(exports, "__esModule", { value: true });
exports.expenseUtils = void 0;
var Expense_1 = require("../models/Expense");
var globalUtils_1 = require("./globalUtils");
/**
 * Fonction générer le JSON de retour d'une dépense.
 * @param expense Dépense pour lequel on génère le JSON.
 * @return Retourne le JSON.
 */
var generateExpenseJSON = function (expense) {
    var toReturn = {
        expenseNum: expense.expenseNum,
        id: expense._id,
        price: expense.price,
        accountNumber: expense.accountNumber,
        category: expense.category,
        file: expense.file,
        description: expense.description,
        userId: expense.userId,
        projectId: expense.projectId,
        invoiced: expense.invoiced,
        createdAt: expense.createdAt,
        updatedAt: expense.updatedAt,
    };
    return toReturn;
};
/**
 * Fonction pour retourner la liste des dépenses.
 * @return Retourne le JSON
 */
var getExpenseList = function (projectId) { return __awaiter(void 0, void 0, void 0, function () {
    var expenseList, expenses, userExpenses;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                expenseList = [];
                if (!projectId) return [3 /*break*/, 2];
                return [4 /*yield*/, globalUtils_1.globalUtils.findMany(Expense_1.Expense, { projectId: projectId })];
            case 1:
                expenses = _a.sent();
                // Mise en forme
                expenses.map(function (userExpense) {
                    expenseList.push(generateExpenseJSON(userExpense));
                });
                return [2 /*return*/, expenseList];
            case 2: return [4 /*yield*/, globalUtils_1.globalUtils.findMany(Expense_1.Expense, {})];
            case 3:
                userExpenses = _a.sent();
                // Mise en forme
                userExpenses.map(function (userExpense) {
                    expenseList.push(generateExpenseJSON(userExpense));
                });
                return [2 /*return*/, expenseList];
        }
    });
}); };
var expenseUtils = {
    generateExpenseJSON: generateExpenseJSON,
    getExpenseList: getExpenseList
};
exports.expenseUtils = expenseUtils;
