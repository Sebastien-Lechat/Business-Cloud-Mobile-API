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
exports.userUtils = void 0;
var mongoose_1 = __importDefault(require("mongoose"));
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var Client_1 = require("../models/Client");
var User_1 = require("../models/User");
var dotenv_1 = require("dotenv");
dotenv_1.config();
var JWT_KEY = process.env.JWT_KEY;
/**
 * Fonction de vérification de si l'email existe déjà
 * @param emailToFind Email à vérifier si elle existe déjà ou non
 * @returns Retourne un booléen de si l'email existe ou non
 */
var emailAlreadyExist = function (emailToFind) { return __awaiter(void 0, void 0, void 0, function () {
    var alreadyExistC, alreadyExistU;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, Client_1.Client.findOne({ email: emailToFind })];
            case 1:
                alreadyExistC = _a.sent();
                return [4 /*yield*/, User_1.User.findOne({ email: emailToFind })];
            case 2:
                alreadyExistU = _a.sent();
                return [2 /*return*/, (alreadyExistC || alreadyExistU) ? true : false];
        }
    });
}); };
/**
 * Fonction pour trouver un utilisateur
 * @param userEmail Email pour trouver un utilisateur en base de données
 * @param userId ID pour trouver un utilisateur en base de données
 * @returns Retourne l'utilisateur si il est enregistré en base, sinon on retourne null
 */
var findUser = function (option) { return __awaiter(void 0, void 0, void 0, function () {
    var query, alreadyExistC, alreadyExistU;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (option.userId && option.userId.length !== 24)
                    return [2 /*return*/, null];
                if (option.userId && option.userEmail)
                    query = { _id: mongoose_1.default.Types.ObjectId(option.userId), email: option.userEmail };
                else if (option.userId)
                    query = { _id: mongoose_1.default.Types.ObjectId(option.userId) };
                else if (option.userEmail)
                    query = { email: option.userEmail };
                return [4 /*yield*/, Client_1.Client.findOne(query)];
            case 1:
                alreadyExistC = _a.sent();
                return [4 /*yield*/, User_1.User.findOne(query)];
            case 2:
                alreadyExistU = _a.sent();
                return [2 /*return*/, (alreadyExistC) ? { data: alreadyExistC, type: 'client' } : (alreadyExistU) ? { data: alreadyExistU, type: 'user' } : null];
        }
    });
}); };
/**
 * Fonction pour retourner la liste des utilisateur en fonction du rôle.
 * @param user Utilisateur pour lequel on génère la liste
 */
var getUsersList = function (user) { return __awaiter(void 0, void 0, void 0, function () {
    var userList, _a, _b, _c, _d, _e, _f, customers, employees, customers, employees;
    var _g, _h;
    return __generator(this, function (_j) {
        switch (_j.label) {
            case 0:
                userList = [];
                if (!(user.type === 'client')) return [3 /*break*/, 4];
                // Pour un client réucpération du gérant
                _b = (_a = userList).push;
                _c = generateShortUserJSON;
                _g = {};
                return [4 /*yield*/, User_1.User.findOne({ role: 'Gérant' })];
            case 1:
                // Pour un client réucpération du gérant
                _b.apply(_a, [_c.apply(void 0, [(_g.data = _j.sent(), _g.type = 'user', _g)])]);
                if (!user.data.userId) return [3 /*break*/, 3];
                _e = (_d = userList).push;
                _f = generateShortUserJSON;
                _h = {};
                return [4 /*yield*/, User_1.User.findOne({ _id: user.data.userId })];
            case 2:
                _e.apply(_d, [_f.apply(void 0, [(_h.data = _j.sent(), _h.type = 'user', _h)])]);
                _j.label = 3;
            case 3: 
            // Envoi de la liste
            return [2 /*return*/, userList];
            case 4:
                if (!(user.type === 'user')) return [3 /*break*/, 11];
                if (!(user.data.role === 'Gérant')) return [3 /*break*/, 7];
                return [4 /*yield*/, Client_1.Client.find()];
            case 5:
                customers = _j.sent();
                customers.map(function (customer) { return userList.push(generateShortUserJSON({ data: customer, type: 'client' })); });
                return [4 /*yield*/, User_1.User.find()];
            case 6:
                employees = _j.sent();
                employees.map(function (employee) { return userList.push(generateShortUserJSON({ data: employee, type: 'user' })); });
                // On organise par date de création (le plus ancien en premier)
                userList.sort(function (a, b) { return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(); });
                // Envoi de la liste filtrer (on ne s'envoi pas soit même)
                return [2 /*return*/, userList.filter(function (item) { return item.id.toString() !== user.data._id.toString(); })];
            case 7: return [4 /*yield*/, Client_1.Client.find({ userId: user.data._id })];
            case 8:
                customers = _j.sent();
                customers.map(function (customer) { return userList.push(generateShortUserJSON({ data: customer, type: 'client' })); });
                return [4 /*yield*/, User_1.User.find()];
            case 9:
                employees = _j.sent();
                employees.map(function (employee) { return userList.push(generateShortUserJSON({ data: employee, type: 'user' })); });
                // On organise par date de création (le plus ancien en premier)
                userList.sort(function (a, b) { return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(); });
                // Envoi de la liste filtrer (on ne s'envoi pas soit même)
                return [2 /*return*/, userList.filter(function (item) { return item.id.toString() !== user.data._id.toString(); })];
            case 10: return [3 /*break*/, 12];
            case 11: return [2 /*return*/, userList];
            case 12: return [2 /*return*/];
        }
    });
}); };
/**
 * Fonction pour mettre à jour un utilisateur.
 * @param user Utilisateur à mettre à jour
 * @param updateData Données à mettre à jour
 */
var updateUser = function (user, updateData) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!(user.type === 'user')) return [3 /*break*/, 2];
                return [4 /*yield*/, User_1.User.updateOne({ _id: mongoose_1.default.Types.ObjectId(user.data._id), email: user.data.email }, { $set: updateData })];
            case 1:
                _a.sent();
                _a.label = 2;
            case 2:
                if (!(user.type === 'client')) return [3 /*break*/, 4];
                return [4 /*yield*/, Client_1.Client.updateOne({ _id: mongoose_1.default.Types.ObjectId(user.data._id), email: user.data.email }, { $set: updateData })];
            case 3:
                _a.sent();
                _a.label = 4;
            case 4: return [2 /*return*/];
        }
    });
}); };
/**
 * Fonction pour désactiver un utilisateur.
 * @param model Modèle mongoose
 * @param id Id pour filtrer
 */
var disabledOne = function (model, id) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, model.updateOne({ _id: mongoose_1.default.Types.ObjectId(id) }, { $set: { isActive: false } })];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
/**
 * Fonction pour mettre à jour la dernière date de connexion, et le nombre tentative de l'utilisateur.
 * @param user Utilisateur pour lequel on met à jour la dernière date de connexion, et le nombre tentative.
 * @returns Retourne l'utilisateur modifié
 */
var updateLastLogin = function (user, reset) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (reset)
                    user.data.attempt = 0;
                return [4 /*yield*/, updateUser(user, { lastLogin: Date.now(), attempt: user.data.attempt + 1 })];
            case 1:
                _a.sent();
                return [2 /*return*/, user];
        }
    });
}); };
/**
 * Fonction générer le token de l'utilisateur.
 * @param user Utilisateur pour lequel on génère le token
 * @returns Retourne l'utilisateur modifié
 */
var generateUserToken = function (user) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                user.data.token = jsonwebtoken_1.default.sign({ _id: user.data._id, email: user.data.email }, JWT_KEY, { expiresIn: '24h' });
                return [4 /*yield*/, updateUser(user, { token: user.data.token })];
            case 1:
                _a.sent();
                return [2 /*return*/, user];
        }
    });
}); };
/**
 * Fonction générer le refreshToken de l'utilisateur.
 * @param user Utilisateur pour lequel on génère le refreshToken
 * @returns Retourne l'utilisateur modifié
 */
var generateUserRefreshToken = function (user) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                user.data.refreshToken = jsonwebtoken_1.default.sign({ _id: user.data._id, email: user.data.email }, JWT_KEY, { expiresIn: '30d' });
                return [4 /*yield*/, updateUser(user, { refreshToken: user.data.refreshToken })];
            case 1:
                _a.sent();
                return [2 /*return*/, user];
        }
    });
}); };
/**
 * Fonction générer le JSON de réponse pour les requête lié à l'utilisateur.
 * @param user Utilisateur pour lequel on génère le JSON
 * @returns Retourne JSON
 */
var generateUserJSON = function (user) {
    var _a;
    var toReturn = {
        type: user.type,
        id: user.data._id,
        name: user.data.name,
        email: user.data.email,
        createdAt: user.data.createdAt,
        updatedAt: user.data.updatedAt,
        token: user.data.token,
        refreshToken: user.data.refreshToken,
    };
    if (user.data.avatar)
        toReturn.avatar = user.data.avatar;
    if (user.data.phone)
        toReturn.phone = user.data.phone;
    if (user.data.activity)
        toReturn.activity = user.data.activity;
    if (user.data.address)
        toReturn.address = user.data.address;
    if (user.data.zip)
        toReturn.zip = user.data.zip;
    if (user.data.city)
        toReturn.city = user.data.city;
    if (user.data.country)
        toReturn.country = user.data.country;
    if (user.data.numTVA)
        toReturn.numTVA = user.data.numTVA;
    if (user.data.numSIRET)
        toReturn.numSIRET = user.data.numSIRET;
    if (user.data.numRCS)
        toReturn.numRCS = user.data.numRCS;
    if (user.data.currency)
        toReturn.currency = user.data.currency;
    if (user.data.role)
        toReturn.role = user.data.role;
    if (!((_a = user.data.verify_email) === null || _a === void 0 ? void 0 : _a.verified))
        toReturn.needVerifyEmail = true;
    else
        toReturn.needVerifyEmail = false;
    return toReturn;
};
/**
 * Fonction générer le short JSON de réponse pour les requête lié à l'utilisateur.
 * @param user Utilisateur pour lequel on génère le JSON
 * @returns Retourne JSON
 */
var generateShortUserJSON = function (user) {
    var toReturn = {
        type: user.type,
        id: user.data._id,
        name: user.data.name,
        email: user.data.email,
        createdAt: user.data.createdAt,
        updatedAt: user.data.updatedAt,
    };
    if (user.data.avatar)
        toReturn.avatar = user.data.avatar;
    if (user.data.phone)
        toReturn.phone = user.data.phone;
    if (user.data.role)
        toReturn.role = user.data.role;
    if (user.data.userId)
        toReturn.userId = user.data.userId;
    return toReturn;
};
/**
 * Fonction générer le JSON de réponse pour les requête lié à l'employé.
 * @param user Utilisateur pour lequel on génère le JSON
 * @returns Retourne JSON
 */
var generateEmployeeJSON = function (user) {
    var toReturn = {
        type: 'user',
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    };
    if (user.avatar)
        toReturn.avatar = user.avatar;
    if (user.phone)
        toReturn.phone = user.phone;
    return toReturn;
};
/**
 * Fonction générer le token de récupération de mot de passe d'un utilisateur.
 * @param user Utilisateur pour lequel on génère le token
 * @returns Retourne le token
 */
var generatePasswordToken = function (user) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                user.data.reset_password = genPasswordToken();
                if (!(user.type === 'user')) return [3 /*break*/, 2];
                return [4 /*yield*/, updateUser(user, { reset_password: user.data.reset_password })];
            case 1:
                _a.sent();
                _a.label = 2;
            case 2:
                if (!(user.type === 'client')) return [3 /*break*/, 4];
                return [4 /*yield*/, updateUser(user, { reset_password: user.data.reset_password })];
            case 3:
                _a.sent();
                _a.label = 4;
            case 4: return [2 /*return*/, user.data.reset_password.token];
        }
    });
}); };
/**
 * Fonction générer le code de vérification de mail d'un utilisateur.
 * @param user Utilisateur pour lequel on génère le code
 * @returns Retourne le code créé
 */
var generateVerifyEmailCode = function (user) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (user.data.verify_email && user.data.verify_email.verified)
                    return [2 /*return*/, false];
                user.data.verify_email = genCodePasswordLost();
                if (!(user.type === 'user')) return [3 /*break*/, 2];
                return [4 /*yield*/, updateUser(user, { verify_email: user.data.verify_email })];
            case 1:
                _a.sent();
                _a.label = 2;
            case 2:
                if (!(user.type === 'client')) return [3 /*break*/, 4];
                return [4 /*yield*/, updateUser(user, { verify_email: user.data.verify_email })];
            case 3:
                _a.sent();
                _a.label = 4;
            case 4: return [2 /*return*/, user.data.verify_email.code];
        }
    });
}); };
/**
 * Fonction générer le code de double authentification d'un utilisateur.
 * @param user Utilisateur pour lequel on génère le code
 * @returns Retourne le code créé
 */
var generateDoubleAuthCode = function (user) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                user.data.double_authentification = genCodeDoubleAuth();
                if (!(user.type === 'user')) return [3 /*break*/, 2];
                return [4 /*yield*/, updateUser(user, { double_authentification: user.data.double_authentification })];
            case 1:
                _a.sent();
                _a.label = 2;
            case 2:
                if (!(user.type === 'client')) return [3 /*break*/, 4];
                return [4 /*yield*/, updateUser(user, { double_authentification: user.data.double_authentification })];
            case 3:
                _a.sent();
                _a.label = 4;
            case 4: return [2 /*return*/, user.data.double_authentification.code];
        }
    });
}); };
/**
 * Fonction de récupération de l'utilisateur dans la requête grâce au token
 * @param req Requête contenant l'utilisateur
 * @returns Retourne l'utilisateur
 */
var getRequestUser = function (req) {
    // Récupération de l'utilisateur grâce au Authmiddleware qui rajoute le token dans req
    var request = req;
    var user = request.user;
    return user;
};
var userUtils = {
    emailAlreadyExist: emailAlreadyExist,
    findUser: findUser,
    getUsersList: getUsersList,
    updateUser: updateUser,
    disabledOne: disabledOne,
    updateLastLogin: updateLastLogin,
    generateUserToken: generateUserToken,
    generateUserRefreshToken: generateUserRefreshToken,
    generateUserJSON: generateUserJSON,
    generateShortUserJSON: generateShortUserJSON,
    generateEmployeeJSON: generateEmployeeJSON,
    generatePasswordToken: generatePasswordToken,
    generateVerifyEmailCode: generateVerifyEmailCode,
    generateDoubleAuthCode: generateDoubleAuthCode,
    getRequestUser: getRequestUser
};
exports.userUtils = userUtils;
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
var genCodePasswordLost = function () {
    var between = function (min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    };
    return {
        date: Date.now(),
        code: between(100000, 999999),
        verified: false,
    };
};
var genCodeDoubleAuth = function () {
    var between = function (min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    };
    return {
        activated: true,
        date: Date.now(),
        code: between(100000, 999999),
    };
};
var genPasswordToken = function () {
    return {
        date: Date.now(),
        token: '',
    };
};
