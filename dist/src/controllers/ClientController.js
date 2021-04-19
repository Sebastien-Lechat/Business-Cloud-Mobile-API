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
exports.ClientController = void 0;
var passwordHelper_1 = require("../helpers/passwordHelper");
var responseHelper_1 = require("../helpers/responseHelper");
var verifyDataHelper_1 = __importDefault(require("../helpers/verifyDataHelper"));
var Client_1 = require("../models/Client");
var User_1 = require("../models/User");
var globalUtils_1 = require("../utils/globalUtils");
var userUtils_1 = require("../utils/userUtils");
var ClientController = /** @class */ (function () {
    function ClientController() {
    }
    /**
     * Fonction de création d'un client  (POST /customer)
     * @param req express Request
     * @param res express Response
     */
    ClientController.create = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var hasPermission, _a, name_1, email, phone, password, address, zip, city, country, numTVA, numSIRET, numRCS, userId, _b, _c, createdEmployee, err_1;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _d.trys.push([0, 6, , 7]);
                    hasPermission = globalUtils_1.globalUtils.checkPermission(userUtils_1.userUtils.getRequestUser(req), 'user');
                    if (!hasPermission)
                        throw new Error('You do not have the required permissions');
                    _a = req.body, name_1 = _a.name, email = _a.email, phone = _a.phone, password = _a.password, address = _a.address, zip = _a.zip, city = _a.city, country = _a.country, numTVA = _a.numTVA, numSIRET = _a.numSIRET, numRCS = _a.numRCS, userId = _a.userId;
                    // Vérification de si toutes les données nécessaire sont présentes
                    if (!name_1 || !email || !password)
                        throw new Error('Missing important fields');
                    // Vérification de l'email du client que l'on veut créer
                    if (!verifyDataHelper_1.default.validEmail(email))
                        throw new Error('Invalid email addresse');
                    return [4 /*yield*/, userUtils_1.userUtils.emailAlreadyExist(email)];
                case 1:
                    // Vérification de si l'email existe déjà
                    if (_d.sent())
                        throw new Error('This email is already used');
                    // Vérification du mot de passe du client que l'on veut créer et encryptage en cas de bon format
                    if (!verifyDataHelper_1.default.validPassword(password))
                        throw new Error('Invalid password format');
                    _b = req.body;
                    return [4 /*yield*/, passwordHelper_1.hashPassword(req.body.password)];
                case 2:
                    _b.password = _d.sent();
                    // Vérification du numéro de téléphone de l'utilisateur
                    if (phone && !verifyDataHelper_1.default.validPhone(phone))
                        throw new Error('Invalid phone number');
                    _c = userId;
                    if (!_c) return [3 /*break*/, 4];
                    return [4 /*yield*/, globalUtils_1.globalUtils.findOne(User_1.User, userId)];
                case 3:
                    _c = !(_d.sent());
                    _d.label = 4;
                case 4:
                    // Vérification de l'id de l'employé référent
                    if (_c)
                        throw new Error('Invalid employee id');
                    return [4 /*yield*/, Client_1.Client.create(req.body)];
                case 5:
                    createdEmployee = _d.sent();
                    // Envoi de la réponse
                    responseHelper_1.sendResponse(res, 200, { error: false, message: 'Customer successfully created', customer: userUtils_1.userUtils.generateUserJSON({ data: createdEmployee, type: 'client' }) });
                    return [3 /*break*/, 7];
                case 6:
                    err_1 = _d.sent();
                    if (err_1.message === 'You do not have the required permissions')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '401002', message: err_1.message });
                    else if (err_1.message === 'Missing important fields')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '103151', message: err_1.message });
                    else if (err_1.message === 'Invalid email addresse')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '103152', message: err_1.message });
                    else if (err_1.message === 'Invalid phone number')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '103153', message: err_1.message });
                    else if (err_1.message === 'Invalid password format')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '103154', message: err_1.message });
                    else if (err_1.message === 'Invalid TVA number')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '103155', message: err_1.message });
                    else if (err_1.message === 'Invalid SIRET number')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '103156', message: err_1.message });
                    else if (err_1.message === 'Invalid RCS number')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '103157', message: err_1.message });
                    else if (err_1.message === 'This email is already used')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '103158', message: err_1.message });
                    else if (err_1.message === 'Invalid employee id')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '103159', message: err_1.message });
                    else
                        responseHelper_1.errorHandler(res, err_1);
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    }); };
    /**
     * Fonction de modification d'un client  (PUT /customer)
     * @param req express Request
     * @param res express Response
     */
    ClientController.update = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var hasPermission, _a, id, name_2, email, phone, address, zip, city, country, numTVA, numSIRET, numRCS, userId, user, _b, _c, toUpdate, err_2;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _d.trys.push([0, 7, , 8]);
                    hasPermission = globalUtils_1.globalUtils.checkPermission(userUtils_1.userUtils.getRequestUser(req), 'user');
                    if (!hasPermission)
                        throw new Error('You do not have the required permissions');
                    _a = req.body, id = _a.id, name_2 = _a.name, email = _a.email, phone = _a.phone, address = _a.address, zip = _a.zip, city = _a.city, country = _a.country, numTVA = _a.numTVA, numSIRET = _a.numSIRET, numRCS = _a.numRCS, userId = _a.userId;
                    // Vérification de si toutes les données nécessaire sont présentes
                    if (!id)
                        throw new Error('Missing id field');
                    return [4 /*yield*/, globalUtils_1.globalUtils.findOne(Client_1.Client, id)];
                case 1:
                    user = _d.sent();
                    if (!user)
                        throw new Error('Invalid customer id');
                    // Vérification de l'email du client que l'on veut modifier
                    if (email && !verifyDataHelper_1.default.validEmail(email))
                        throw new Error('Invalid email addresse');
                    _b = email;
                    if (!_b) return [3 /*break*/, 3];
                    return [4 /*yield*/, userUtils_1.userUtils.emailAlreadyExist(email)];
                case 2:
                    _b = (_d.sent());
                    _d.label = 3;
                case 3:
                    // Vérification de si l'email existe déjà
                    if (_b)
                        throw new Error('This email is already used');
                    // Vérification du numéro de téléphone du client que l'on veut modifier
                    if (phone && !verifyDataHelper_1.default.validPhone(phone))
                        throw new Error('Invalid phone number');
                    _c = userId;
                    if (!_c) return [3 /*break*/, 5];
                    return [4 /*yield*/, globalUtils_1.globalUtils.findOne(User_1.User, userId)];
                case 4:
                    _c = !(_d.sent());
                    _d.label = 5;
                case 5:
                    // Vérification de l'id de l'employé référent
                    if (_c)
                        throw new Error('Invalid employee id');
                    toUpdate = {};
                    if (name_2)
                        toUpdate.name = user.name = name_2;
                    if (email) {
                        toUpdate.email = user.email = email;
                        toUpdate.verify_email = user.verify_email = { code: 0, date: 0, verified: false };
                    }
                    if (address)
                        toUpdate.address = user.address = address;
                    if (phone)
                        toUpdate.phone = user.phone = phone;
                    if (zip)
                        toUpdate.zip = user.zip = zip;
                    if (city)
                        toUpdate.city = user.city = city;
                    if (country)
                        toUpdate.country = user.country = country;
                    if (numTVA)
                        toUpdate.numTVA = user.numTVA = numTVA;
                    if (numSIRET)
                        toUpdate.numSIRET = user.numSIRET = numSIRET;
                    if (numRCS)
                        toUpdate.numRCS = user.numRCS = numRCS;
                    if (userId)
                        toUpdate.userId = user.userId = userId;
                    // Modification du client
                    return [4 /*yield*/, globalUtils_1.globalUtils.updateOneById(Client_1.Client, id, toUpdate)];
                case 6:
                    // Modification du client
                    _d.sent();
                    // Envoi de la réponse
                    responseHelper_1.sendResponse(res, 200, { error: false, message: 'Customer successfully updated', customer: userUtils_1.userUtils.generateUserJSON({ data: user, type: 'client' }) });
                    return [3 /*break*/, 8];
                case 7:
                    err_2 = _d.sent();
                    if (err_2.message === 'You do not have the required permissions')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '401002', message: err_2.message });
                    else if (err_2.message === 'Missing id field')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '103201', message: err_2.message });
                    else if (err_2.message === 'Invalid email addresse')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '103202', message: err_2.message });
                    else if (err_2.message === 'Invalid phone number')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '103203', message: err_2.message });
                    else if (err_2.message === 'Invalid customer id')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '103204', message: err_2.message });
                    else if (err_2.message === 'Invalid TVA number')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '103205', message: err_2.message });
                    else if (err_2.message === 'Invalid SIRET number')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '103206', message: err_2.message });
                    else if (err_2.message === 'Invalid RCS number')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '103207', message: err_2.message });
                    else if (err_2.message === 'This email is already used')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '103208', message: err_2.message });
                    else if (err_2.message === 'Invalid employee id')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '103209', message: err_2.message });
                    else
                        responseHelper_1.errorHandler(res, err_2);
                    return [3 /*break*/, 8];
                case 8: return [2 /*return*/];
            }
        });
    }); };
    /**
     * Fonction de suppression d'un client  (DELETE /customer/:id)
     * @param req express Request
     * @param res express Response
     */
    ClientController.delete = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var hasPermission, id, user, err_3;
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
                    return [4 /*yield*/, globalUtils_1.globalUtils.findOne(Client_1.Client, id)];
                case 1:
                    user = _a.sent();
                    if (!user)
                        throw new Error('Invalid customer id');
                    // Suppression du client
                    return [4 /*yield*/, globalUtils_1.globalUtils.deleteOne(Client_1.Client, id)];
                case 2:
                    // Suppression du client
                    _a.sent();
                    // Désactivation du client
                    // await userUtils.disabledOne(Client, id);
                    // Envoi de la réponse
                    responseHelper_1.sendResponse(res, 200, { error: false, message: 'Customer successfully deleted' });
                    return [3 /*break*/, 4];
                case 3:
                    err_3 = _a.sent();
                    if (err_3.message === 'You do not have the required permissions')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '401002', message: err_3.message });
                    else if (err_3.message === 'Missing id field')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '103251', message: err_3.message });
                    else if (err_3.message === 'Invalid customer id')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '103252', message: err_3.message });
                    else
                        responseHelper_1.errorHandler(res, err_3);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    return ClientController;
}());
exports.ClientController = ClientController;
