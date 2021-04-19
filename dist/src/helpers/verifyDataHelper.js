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
var validator_1 = __importDefault(require("validator"));
var Bill_1 = require("../models/Bill");
var Estimate_1 = require("../models/Estimate");
var Expense_1 = require("../models/Expense");
var Project_1 = require("../models/Project");
var UserExpense_1 = require("../models/UserExpense");
var globalUtils_1 = require("../utils/globalUtils");
var VerifyData = /** @class */ (function () {
    function VerifyData() {
    }
    /**
     * Vérification de si l'email est bien au bon format
     * @param email Email à vérifier
     */
    VerifyData.validEmail = function (email) {
        return validator_1.default.isEmail(email);
    };
    /**
     * Vérification de si le téléphone est au bon format
     * @param phone Téléphone à vérifier
     */
    VerifyData.validPhone = function (phone) {
        return validator_1.default.isMobilePhone(phone);
    };
    /**
     * Vérification de si le mot de passe est assez fort
     * @param password Mot de passe à vérifier
     */
    VerifyData.validPassword = function (password) {
        var regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{7,}$/;
        if (password.trim().length < 7 || password.trim().length > 30)
            return false;
        else
            return regex.test(password);
    };
    /**
     * Vérification de si la date est au bon format
     * @param date Date à vérifier
     */
    VerifyData.validDate = function (date) {
        return validator_1.default.isDate(date, { format: 'DD-MM-YYYY', strictMode: true, delimiters: ['-', '/', '.'] });
    };
    /**
     * Vérification de si le rôle est au bon format
     * @param role Rôle à vérifier
     */
    VerifyData.validRole = function (role) {
        return (role === 'Gérant') ? false : true;
    };
    /**
     * Vérification de si le numéro de tva est au bon format
     * @param zip Code postal à vérifier
     */
    VerifyData.validPostalCode = function (zip) {
        return validator_1.default.isPostalCode(zip, 'FR');
    };
    /**
     * Vérification du statut de la facture
     * @param status Statut à vérifier
     */
    VerifyData.validBillStatus = function (status) {
        return (status === 'Non payée' || status === 'Partiellement payée' || status === 'Payée' || status === 'En retard') ? true : false;
    };
    /**
     * Vérification du statut du devis
     * @param status Statut à vérifier
     */
    VerifyData.validEstimateStatus = function (status) {
        return (status === 'En attente' || status === 'Refusé' || status === 'Accepté' || status === 'En retard') ? true : false;
    };
    /**
     * Vérification du statut du projet
     * @param status Statut à vérifier
     */
    VerifyData.validProjectStatus = function (status) {
        return (status === 'En attente' || status === 'En cours' || status === 'Terminé' || status === 'En retard') ? true : false;
    };
    /**
     * Vérification du numéro de facture
     * @param billNumber Numéro à vérifier
     */
    VerifyData.validBillNumber = function (billNumber) {
        return __awaiter(this, void 0, void 0, function () {
            var bills;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (billNumber.substring(0, 3) !== 'FAC')
                            return [2 /*return*/, false];
                        if (billNumber.length !== 9)
                            return [2 /*return*/, false];
                        return [4 /*yield*/, globalUtils_1.globalUtils.findMany(Bill_1.Bill, { billNum: billNumber })];
                    case 1:
                        bills = _a.sent();
                        if (bills.length !== 0)
                            return [2 /*return*/, false];
                        return [2 /*return*/, true];
                }
            });
        });
    };
    /**
     * Vérification du numéro de devis
     * @param estimateNumber Numéro à vérifier
     */
    VerifyData.validEstimateNumber = function (estimateNumber) {
        return __awaiter(this, void 0, void 0, function () {
            var estimates;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (estimateNumber.substring(0, 3) !== 'EST')
                            return [2 /*return*/, false];
                        if (estimateNumber.length !== 9)
                            return [2 /*return*/, false];
                        return [4 /*yield*/, globalUtils_1.globalUtils.findMany(Estimate_1.Estimate, { estimateNum: estimateNumber })];
                    case 1:
                        estimates = _a.sent();
                        if (estimates.length !== 0)
                            return [2 /*return*/, false];
                        return [2 /*return*/, true];
                }
            });
        });
    };
    /**
     * Vérification du numéro de note de frais
     * @param userExpenseNumber Numéro à vérifier
     */
    VerifyData.validUserExpenseNumber = function (userExpenseNumber) {
        return __awaiter(this, void 0, void 0, function () {
            var userExpenses;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (userExpenseNumber.substring(0, 4) !== 'UEXP')
                            return [2 /*return*/, false];
                        if (userExpenseNumber.length !== 10)
                            return [2 /*return*/, false];
                        return [4 /*yield*/, globalUtils_1.globalUtils.findMany(UserExpense_1.UserExpense, { userExpenseNum: userExpenseNumber })];
                    case 1:
                        userExpenses = _a.sent();
                        if (userExpenses.length !== 0)
                            return [2 /*return*/, false];
                        return [2 /*return*/, true];
                }
            });
        });
    };
    /**
     * Vérification du numéro de note de frais
     * @param expenseNumber Numéro à vérifier
     */
    VerifyData.validExpenseNumber = function (expenseNumber) {
        return __awaiter(this, void 0, void 0, function () {
            var expenses;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (expenseNumber.substring(0, 3) !== 'EXP')
                            return [2 /*return*/, false];
                        if (expenseNumber.length !== 9)
                            return [2 /*return*/, false];
                        return [4 /*yield*/, globalUtils_1.globalUtils.findMany(Expense_1.Expense, { expenseNum: expenseNumber })];
                    case 1:
                        expenses = _a.sent();
                        if (expenses.length !== 0)
                            return [2 /*return*/, false];
                        return [2 /*return*/, true];
                }
            });
        });
    };
    /**
     * Vérification du numéro de projet
     * @param projectNumber Numéro à vérifier
     */
    VerifyData.validProjectNumber = function (projectNumber) {
        return __awaiter(this, void 0, void 0, function () {
            var projects;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (projectNumber.substring(0, 3) !== 'PRO')
                            return [2 /*return*/, false];
                        if (projectNumber.length !== 9)
                            return [2 /*return*/, false];
                        return [4 /*yield*/, globalUtils_1.globalUtils.findMany(Project_1.Project, { projectNum: projectNumber })];
                    case 1:
                        projects = _a.sent();
                        if (projects.length !== 0)
                            return [2 /*return*/, false];
                        return [2 /*return*/, true];
                }
            });
        });
    };
    /**
     * Vérification de la validité de la deadline
     * @param deadline Deadline à vérifier
     */
    VerifyData.validDeadline = function (deadline) {
        // if (!validator.isDate(deadline, { format: 'DD-MM-YYYY', strictMode: true, delimiters: ['-', '/', '.'] })) return false;
        return ((new Date(deadline).getTime() - Date.now()) > 0) ? true : false;
    };
    /**
     * Vérification de la taxe
     * @param taxe Taxe à vérifier
     */
    VerifyData.validTaxe = function (taxe) {
        if (typeof taxe === 'number')
            return validator_1.default.toFloat(taxe.toFixed(2));
        return validator_1.default.toFloat(taxe);
    };
    /**
     * Vérification de la validité d'un nombre
     * @param num Nombre à vérifier
     */
    VerifyData.validFloat = function (num) {
        if (typeof num === 'number')
            return validator_1.default.toFloat(num.toFixed(2));
        else
            return validator_1.default.toFloat(num);
    };
    /**
     * Vérification de la validité d'un nombre
     * @param num Nombre à vérifier
     */
    VerifyData.validInt = function (num) {
        if (typeof num === 'number')
            return Math.round(num);
        else
            return validator_1.default.toInt(num);
    };
    /**
     * Vérification du prix
     * @param price Prix à vérifier
     */
    VerifyData.validPrice = function (price) {
        if (typeof price === 'number')
            return validator_1.default.toFloat(price.toFixed(2));
        else
            return validator_1.default.toFloat(price);
    };
    /**
     * Vérification du numéro de compte
     * @param accountNumber Numéro de compte à vérifier
     */
    VerifyData.validAccountNumber = function (accountNumber) {
        if (typeof accountNumber === 'number')
            return Math.round(accountNumber);
        else
            return validator_1.default.toInt(accountNumber);
    };
    return VerifyData;
}());
exports.default = VerifyData;
