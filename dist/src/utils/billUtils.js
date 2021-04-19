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
exports.billUtils = void 0;
var mongoose_1 = __importDefault(require("mongoose"));
var Bill_1 = require("../models/Bill");
var articleUtils_1 = require("./articleUtils");
var globalUtils_1 = require("./globalUtils");
/**
 * Fonction générer le JSON de réponse d'une facture.
 * @param bill Facture pour laquelle on génère le JSON
 * @return Retourne le JSON
 */
var generateBillJSON = function (bill) {
    var toReturn = {
        billNum: bill.billNum,
        id: bill.id,
        status: bill.status,
        clientId: bill.clientId,
        enterpriseId: bill.enterpriseId,
        articles: bill.articles,
        currency: (bill.currency) ? bill.currency : undefined,
        totalHT: bill.totalHT,
        totalTTC: bill.totalTTC,
        deadline: bill.deadline,
        amountPaid: (bill.amountPaid !== undefined) ? bill.amountPaid : undefined,
        payementDate: (bill.payementDate) ? bill.payementDate : undefined,
        createdAt: bill.createdAt,
        updatedAt: bill.updatedAt,
    };
    return toReturn;
};
/**
 * Fonction pour retourner la liste des factures en fonction du rôle.
 * @param user Utilisateur pour lequel on génère la liste
 * @return Retourne le JSON
 */
var getBillList = function (user) { return __awaiter(void 0, void 0, void 0, function () {
    var billList;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                billList = [];
                if (!(user.type === 'client')) return [3 /*break*/, 2];
                return [4 /*yield*/, globalUtils_1.globalUtils.findManyAndPopulate(Bill_1.Bill, { clientId: mongoose_1.default.Types.ObjectId(user.data._id) }, ['articles.articleId'])];
            case 1:
                // Récupération de toutes les factures concernants ce client
                billList = _a.sent();
                // Mise en forme
                billList = billList.map(function (bill) {
                    bill.articles.map(function (article) {
                        article.articleId = articleUtils_1.articleUtils.generateArticleJSON(article.articleId);
                    });
                    return billUtils.generateBillJSON(bill);
                });
                // Envoi de la liste
                return [2 /*return*/, billList];
            case 2:
                if (!(user.type === 'user')) return [3 /*break*/, 7];
                if (!(user.data.role === 'Gérant')) return [3 /*break*/, 4];
                return [4 /*yield*/, globalUtils_1.globalUtils.findManyAndPopulate(Bill_1.Bill, {}, ['articles.articleId'])];
            case 3:
                // Récupération de toutes les factures
                billList = _a.sent();
                // Mise en forme
                billList = billList.map(function (bill) {
                    bill.articles.map(function (article) {
                        article.articleId = articleUtils_1.articleUtils.generateArticleJSON(article.articleId);
                    });
                    return billUtils.generateBillJSON(bill);
                });
                // Envoi de la liste
                return [2 /*return*/, billList];
            case 4: return [4 /*yield*/, globalUtils_1.globalUtils.findManyAndPopulate(Bill_1.Bill, {}, ['clientId', 'articles.articleId'])];
            case 5:
                // Récupération de toutes les factures
                billList = _a.sent();
                // Filtre de tout ce qui ne concerne pas l'employé
                billList = billList.filter(function (bill) {
                    var client = bill.clientId;
                    bill.clientId = client._id;
                    return (client.userId) ? client.userId.toString() === user.data._id.toString() : false;
                });
                // Mise en forme
                billList = billList.map(function (bill) {
                    bill.articles.map(function (article) {
                        article.articleId = articleUtils_1.articleUtils.generateArticleJSON(article.articleId);
                    });
                    return billUtils.generateBillJSON(bill);
                });
                // Envoi de la liste
                return [2 /*return*/, billList];
            case 6: return [3 /*break*/, 8];
            case 7: return [2 /*return*/, billList];
            case 8: return [2 /*return*/];
        }
    });
}); };
var billUtils = {
    generateBillJSON: generateBillJSON,
    getBillList: getBillList
};
exports.billUtils = billUtils;
