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
exports.globalUtils = void 0;
var mongoose_1 = __importDefault(require("mongoose"));
/**
 * Fonction de vérification des permissions pour une requête
 * @param user Utilisateur qui fait la requête
 * @param type Type requis pour faire la requête
 * @param admin Rôle requis pour faire la requête
 * @returns Retourne un booléen de si l'email existe ou non
 */
var checkPermission = function (user, type, admin) {
    if (user.type === 'client') {
        if (type === 'client')
            return true;
        else
            return false;
    }
    else if (user.type === 'user') {
        if (type === 'client')
            return true;
        else if (type === 'user' && admin && user.data.role === 'Gérant')
            return true;
        else if (type === 'user' && admin && user.data.role !== 'Gérant')
            return false;
        else
            return true;
    }
    else
        return false;
};
/**
 * Fonction pour trouver un document dans une collection.
 * @param model Modèle mongoose
 * @param id Id pour filtrer
 */
var findOne = function (model, id) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (id.length !== 24)
                    return [2 /*return*/, null];
                return [4 /*yield*/, model.findOne({ _id: mongoose_1.default.Types.ObjectId(id) })];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
/**
 * Fonction pour trouver un document dans une collection et le populate.
 * @param model Modèle mongoose
 * @param id Id pour filtrer
 * @param populate Données à populate
 */
var findOneAndPopulate = function (model, id, populate) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (id.length !== 24)
                    return [2 /*return*/, null];
                return [4 /*yield*/, model.findOne({ _id: mongoose_1.default.Types.ObjectId(id) }).populate(populate)];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
/**
 * Fonction pour trouver plusieurs documents dans une collection en fonction d'un filtre.
 * @param model Modèle mongoose
 * @param filter Filtre
 */
var findMany = function (model, filter) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, model.find(filter)];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
/**
 * Fonction pour trouver plusieurs documents dans une collectionen fonction d'un filtre.
 * @param model Modèle mongoose
 * @param filter Filtre
 * @param populate Données à populate
 */
var findManyAndPopulate = function (model, filter, populate) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, model.find(filter).populate(populate)];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
/**
 * Fonction pour mettre à jour un document dans une collection.
 * @param model Modèle mongoose
 * @param filter filtre
 * @param updateData Données à mettre à jour
 */
var updateOne = function (model, filter, updateData) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, model.updateOne(filter, { $set: updateData })];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
/**
 * Fonction pour mettre à jour un document dans une collection.
 * @param model Modèle mongoose
 * @param id Id pour filtrer
 * @param updateData Données à mettre à jour
 */
var updateOneById = function (model, id, updateData) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (id.length !== 24)
                    return [2 /*return*/, null];
                return [4 /*yield*/, model.updateOne({ _id: mongoose_1.default.Types.ObjectId(id) }, { $set: updateData })];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
/**
 * Fonction pour supprimer un document dans une collection.
 * @param model Modèle mongoose
 * @param id Id pour filtrer
 */
var deleteOne = function (model, id) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (id.length !== 24)
                    return [2 /*return*/, null];
                return [4 /*yield*/, model.deleteOne({ _id: mongoose_1.default.Types.ObjectId(id) })];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
var globalUtils = {
    findOne: findOne,
    findOneAndPopulate: findOneAndPopulate,
    findMany: findMany,
    findManyAndPopulate: findManyAndPopulate,
    updateOne: updateOne,
    updateOneById: updateOneById,
    deleteOne: deleteOne,
    checkPermission: checkPermission
};
exports.globalUtils = globalUtils;
