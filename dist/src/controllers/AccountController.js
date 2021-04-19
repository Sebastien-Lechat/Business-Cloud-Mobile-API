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
exports.AccountController = void 0;
var passwordHelper_1 = require("../helpers/passwordHelper");
var responseHelper_1 = require("../helpers/responseHelper");
var verifyDataHelper_1 = __importDefault(require("../helpers/verifyDataHelper"));
var Client_1 = require("../models/Client");
var User_1 = require("../models/User");
var globalUtils_1 = require("../utils/globalUtils");
var userUtils_1 = require("../utils/userUtils");
var Entreprise_1 = require("../models/Entreprise");
var AccountController = /** @class */ (function () {
    function AccountController() {
    }
    /**
     * Fonction de récupération de tous les utilisateurs (GET /users)
     * @param req express Request
     * @param res express Response
     */
    AccountController.getUsersList = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var user, userList, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    user = userUtils_1.userUtils.getRequestUser(req);
                    return [4 /*yield*/, userUtils_1.userUtils.getUsersList(user)];
                case 1:
                    userList = _a.sent();
                    // Envoi de la réponse
                    responseHelper_1.sendResponse(res, 200, { error: false, message: 'Successful users acquisition', users: userList });
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
     * Fonction de récupération d'un utilisateur (GET /user)
     * @param req express Request
     * @param res express Response
     */
    AccountController.getUser = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var id, user, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    id = req.params.id;
                    // Vérification de si toutes les données nécessaire sont présentes
                    if (!id)
                        throw new Error('Missing id field');
                    return [4 /*yield*/, userUtils_1.userUtils.findUser({ userId: id })];
                case 1:
                    user = _a.sent();
                    if (!user)
                        throw new Error('Invalid user id');
                    // Envoi de la réponse
                    responseHelper_1.sendResponse(res, 200, { error: false, message: 'Successful user acquisition', user: userUtils_1.userUtils.generateUserJSON(user) });
                    return [3 /*break*/, 3];
                case 2:
                    err_2 = _a.sent();
                    if (err_2.message === 'Invalid user id')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '104101', message: err_2.message });
                    else
                        responseHelper_1.errorHandler(res, err_2);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    /**
     * Fonction de récupération du profil  (GET /account)
     * @param req express Request
     * @param res express Response
     */
    AccountController.getProfile = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var user;
        return __generator(this, function (_a) {
            try {
                user = userUtils_1.userUtils.getRequestUser(req);
                // Envoi de la réponse
                responseHelper_1.sendResponse(res, 200, { error: false, message: 'Successful profil acquisition', user: userUtils_1.userUtils.generateUserJSON(user) });
            }
            catch (err) {
                responseHelper_1.errorHandler(res, err);
            }
            return [2 /*return*/];
        });
    }); };
    /**
     * Fonction de modification des informations personnelles  (PUT /account/information)
     * @param req express Request
     * @param res express Response
     */
    AccountController.modifyPersonnalInfo = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var user, _a, avatar, name_1, email, phone, birthdayDate, _b, toUpdate, err_3;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 4, , 5]);
                    user = userUtils_1.userUtils.getRequestUser(req);
                    _a = req.body, avatar = _a.avatar, name_1 = _a.name, email = _a.email, phone = _a.phone, birthdayDate = _a.birthdayDate;
                    // Vérification de l'email de l'utilisateur
                    if (email && !verifyDataHelper_1.default.validEmail(email))
                        throw new Error('Invalid email addresse');
                    _b = email;
                    if (!_b) return [3 /*break*/, 2];
                    return [4 /*yield*/, userUtils_1.userUtils.emailAlreadyExist(email)];
                case 1:
                    _b = (_c.sent());
                    _c.label = 2;
                case 2:
                    // Vérification de si l'email existe déjà
                    if (_b)
                        throw new Error('This email is already used');
                    // Vérification du numéro de téléphone de l'utilisateur
                    if (phone && !verifyDataHelper_1.default.validPhone(phone))
                        throw new Error('Invalid phone number');
                    // Vérification de la date de naissance de l'utilisateur
                    if (birthdayDate && !verifyDataHelper_1.default.validDate(birthdayDate))
                        throw new Error('Invalid date format');
                    toUpdate = {};
                    if (name_1)
                        toUpdate.name = user.data.name = name_1;
                    if (email) {
                        toUpdate.email = user.data.email = email;
                        toUpdate.verify_email = user.data.verify_email = { code: 0, date: 0, verified: false };
                    }
                    if (phone)
                        toUpdate.phone = user.data.phone = phone;
                    if (birthdayDate)
                        toUpdate.birthdayDate = user.data.birthdayDate = birthdayDate;
                    // Modification du client
                    return [4 /*yield*/, globalUtils_1.globalUtils.updateOneById((user.type === 'user') ? User_1.User : Client_1.Client, user.data._id, toUpdate)];
                case 3:
                    // Modification du client
                    _c.sent();
                    // Envoi de la réponse
                    responseHelper_1.sendResponse(res, 200, { error: false, message: 'Profile successfully updated', user: userUtils_1.userUtils.generateUserJSON(user) });
                    return [3 /*break*/, 5];
                case 4:
                    err_3 = _c.sent();
                    if (err_3.message === 'Invalid email addresse')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '102051', message: err_3.message });
                    else if (err_3.message === 'Invalid phone number')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '102052', message: err_3.message });
                    else if (err_3.message === 'Invalid date format')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '102053', message: err_3.message });
                    else if (err_3.message === 'This email is already used')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '102054', message: err_3.message });
                    else if (err_3.message === 'Internal server error, avatar can not be saved')
                        responseHelper_1.sendResponse(res, 500, { error: true, code: '500004', message: err_3.message });
                    else
                        responseHelper_1.errorHandler(res, err_3);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    /**
     * Fonction de modification du mot de passe (PUT /account/password)
     * @param req express Request
     * @param res express Response
     */
    AccountController.modifyPassword = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var user, _a, email, oldPassword, newPassword, _b, toUpdate, err_4;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 4, , 5]);
                    user = userUtils_1.userUtils.getRequestUser(req);
                    _a = req.body, email = _a.email, oldPassword = _a.oldPassword, newPassword = _a.newPassword;
                    // Vérification de si toutes les données nécessaire sont présentes
                    if (!email || !oldPassword || !newPassword)
                        throw new Error('Missing important fields');
                    return [4 /*yield*/, passwordHelper_1.comparePassword(oldPassword, user.data.password)];
                case 1:
                    // Vérification de si l'ancien mot de passe est le bon
                    if (!(_c.sent()))
                        throw new Error('Invalid old password');
                    // Vérification du mot de passe de l'utilisateur et encryptage en cas de bon format
                    if (!verifyDataHelper_1.default.validPassword(newPassword))
                        throw new Error('Invalid password format');
                    _b = req.body;
                    return [4 /*yield*/, passwordHelper_1.hashPassword(newPassword)];
                case 2:
                    _b.password = _c.sent();
                    toUpdate = {};
                    if (newPassword)
                        toUpdate.password = user.data.password = req.body.password;
                    // Modification du client
                    return [4 /*yield*/, globalUtils_1.globalUtils.updateOneById((user.type === 'user') ? User_1.User : Client_1.Client, user.data._id, toUpdate)];
                case 3:
                    // Modification du client
                    _c.sent();
                    // Envoi de la réponse
                    responseHelper_1.sendResponse(res, 200, { error: false, message: 'Profile successfully updated', user: userUtils_1.userUtils.generateUserJSON(user) });
                    return [3 /*break*/, 5];
                case 4:
                    err_4 = _c.sent();
                    if (err_4.message === 'Missing important fields')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '102101', message: err_4.message });
                    if (err_4.message === 'Invalid old password')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '102102', message: err_4.message });
                    else if (err_4.message === 'Invalid password format')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '102103', message: err_4.message });
                    else
                        responseHelper_1.errorHandler(res, err_4);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    /**
     * Fonction de modification d'addresse  (PUT /account/address)
     * @param req express Request
     * @param res express Response
     */
    AccountController.modifyAddress = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var user, _a, address, zip, city, country, toUpdate, err_5;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 7, , 8]);
                    user = userUtils_1.userUtils.getRequestUser(req);
                    if (!(user.type === 'client' || user.data.role === 'Gérant')) return [3 /*break*/, 5];
                    _a = req.body, address = _a.address, zip = _a.zip, city = _a.city, country = _a.country;
                    toUpdate = {};
                    if (address)
                        toUpdate.address = user.data.address = address;
                    if (zip)
                        toUpdate.zip = user.data.zip = zip;
                    if (city)
                        toUpdate.city = user.data.city = city;
                    if (country)
                        toUpdate.country = user.data.country = country;
                    if (!(user.data.role === 'Gérant')) return [3 /*break*/, 2];
                    return [4 /*yield*/, globalUtils_1.globalUtils.updateOne(Entreprise_1.Enterprise, { userId: user.data._id }, toUpdate)];
                case 1:
                    _b.sent();
                    return [3 /*break*/, 4];
                case 2: // Modification du client
                return [4 /*yield*/, globalUtils_1.globalUtils.updateOneById(Client_1.Client, user.data._id, toUpdate)];
                case 3:
                    _b.sent();
                    _b.label = 4;
                case 4:
                    // Envoi de la réponse
                    responseHelper_1.sendResponse(res, 200, { error: false, message: 'Profile successfully updated', user: userUtils_1.userUtils.generateUserJSON(user) });
                    return [3 /*break*/, 6];
                case 5: throw new Error('You cannot edit your address with this account');
                case 6: return [3 /*break*/, 8];
                case 7:
                    err_5 = _b.sent();
                    if (err_5.message === 'You cannot edit your address with this account')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '102151', message: err_5.message });
                    else
                        responseHelper_1.errorHandler(res, err_5);
                    return [3 /*break*/, 8];
                case 8: return [2 /*return*/];
            }
        });
    }); };
    /**
     * Fonction de modification des informations de l'entreprise  (PUT /account/enterprise)
     * @param req express Request
     * @param res express Response
     */
    AccountController.modifyEnterprise = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var user, _a, activity, numTVA, numSIRET, numRCS, currency, toUpdate, err_6;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 7, , 8]);
                    user = userUtils_1.userUtils.getRequestUser(req);
                    if (!(user.type === 'client' || user.data.role === 'Gérant')) return [3 /*break*/, 5];
                    _a = req.body, activity = _a.activity, numTVA = _a.numTVA, numSIRET = _a.numSIRET, numRCS = _a.numRCS, currency = _a.currency;
                    toUpdate = {};
                    if (activity)
                        toUpdate.activity = user.data.activity = activity;
                    if (numTVA)
                        toUpdate.numTVA = user.data.numTVA = numTVA;
                    if (numSIRET)
                        toUpdate.numSIRET = user.data.numSIRET = numSIRET;
                    if (numRCS)
                        toUpdate.numRCS = user.data.numRCS = numRCS;
                    if (currency)
                        toUpdate.currency = user.data.currency = currency;
                    if (!(user.data.role === 'Gérant')) return [3 /*break*/, 2];
                    return [4 /*yield*/, globalUtils_1.globalUtils.updateOne(Entreprise_1.Enterprise, { userId: user.data._id }, toUpdate)];
                case 1:
                    _b.sent();
                    return [3 /*break*/, 4];
                case 2: // Modification du client
                return [4 /*yield*/, globalUtils_1.globalUtils.updateOneById(Client_1.Client, user.data._id, toUpdate)];
                case 3:
                    _b.sent();
                    _b.label = 4;
                case 4:
                    // Envoi de la réponse
                    responseHelper_1.sendResponse(res, 200, { error: false, message: 'Profile successfully updated', user: userUtils_1.userUtils.generateUserJSON(user) });
                    return [3 /*break*/, 6];
                case 5: throw new Error('You cannot edit your enterprise with this account');
                case 6: return [3 /*break*/, 8];
                case 7:
                    err_6 = _b.sent();
                    if (err_6.message === 'You cannot edit your enterprise with this account')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '102201', message: err_6.message });
                    else
                        responseHelper_1.errorHandler(res, err_6);
                    return [3 /*break*/, 8];
                case 8: return [2 /*return*/];
            }
        });
    }); };
    return AccountController;
}());
exports.AccountController = AccountController;
