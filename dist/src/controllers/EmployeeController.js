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
exports.EmployeeController = void 0;
var passwordHelper_1 = require("../helpers/passwordHelper");
var responseHelper_1 = require("../helpers/responseHelper");
var verifyDataHelper_1 = __importDefault(require("../helpers/verifyDataHelper"));
var User_1 = require("../models/User");
var globalUtils_1 = require("../utils/globalUtils");
var userUtils_1 = require("../utils/userUtils");
var EmployeeController = /** @class */ (function () {
    function EmployeeController() {
    }
    /**
     * Fonction de création d'un employé  (POST /employee)
     * @param req express Request
     * @param res express Response
     */
    EmployeeController.create = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var hasPermission, _a, name_1, email, phone, password, role, _b, createdEmployee, err_1;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 4, , 5]);
                    hasPermission = globalUtils_1.globalUtils.checkPermission(userUtils_1.userUtils.getRequestUser(req), 'user', true);
                    if (!hasPermission)
                        throw new Error('You do not have the required permissions');
                    _a = req.body, name_1 = _a.name, email = _a.email, phone = _a.phone, password = _a.password, role = _a.role;
                    // Vérification de si toutes les données nécessaire sont présentes
                    if (!name_1 || !email || !password || !role)
                        throw new Error('Missing important fields');
                    // Vérification de l'email de l'employé que l'on veut créer
                    if (!verifyDataHelper_1.default.validEmail(email))
                        throw new Error('Invalid email addresse');
                    return [4 /*yield*/, userUtils_1.userUtils.emailAlreadyExist(email)];
                case 1:
                    // Vérification de si l'email existe déjà
                    if (_c.sent())
                        throw new Error('This email is already used');
                    // Vérification du mot de passe de l'employé que l'on veut créer et encryptage en cas de bon format
                    if (!verifyDataHelper_1.default.validPassword(password))
                        throw new Error('Invalid password format');
                    _b = req.body;
                    return [4 /*yield*/, passwordHelper_1.hashPassword(req.body.password)];
                case 2:
                    _b.password = _c.sent();
                    // Vérification du role de l'employé que l'on veut créer
                    if (role && !verifyDataHelper_1.default.validRole(role))
                        throw new Error('Invalid enterprise role');
                    // Vérification du numéro de téléphone de l'employé que l'on veut créer
                    if (phone && !verifyDataHelper_1.default.validPhone(phone))
                        throw new Error('Invalid phone number');
                    return [4 /*yield*/, User_1.User.create(req.body)];
                case 3:
                    createdEmployee = _c.sent();
                    // Envoi de la réponse
                    responseHelper_1.sendResponse(res, 200, { error: false, message: 'Employee successfully created', employee: userUtils_1.userUtils.generateEmployeeJSON(createdEmployee) });
                    return [3 /*break*/, 5];
                case 4:
                    err_1 = _c.sent();
                    if (err_1.message === 'You do not have the required permissions')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '401002', message: err_1.message });
                    else if (err_1.message === 'Missing important fields')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '103301', message: err_1.message });
                    else if (err_1.message === 'Invalid email addresse')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '103302', message: err_1.message });
                    else if (err_1.message === 'Invalid phone number')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '103303', message: err_1.message });
                    else if (err_1.message === 'Invalid password format')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '103304', message: err_1.message });
                    else if (err_1.message === 'Invalid enterprise role')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '103305', message: err_1.message });
                    else if (err_1.message === 'This email is already used')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '103306', message: err_1.message });
                    else
                        responseHelper_1.errorHandler(res, err_1);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    /**
     * Fonction de modification d'un employé  (PUT /employee)
     * @param req express Request
     * @param res express Response
     */
    EmployeeController.update = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var hasPermission, _a, id, name_2, email, phone, role, user, _b, toUpdate, err_2;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 5, , 6]);
                    hasPermission = globalUtils_1.globalUtils.checkPermission(userUtils_1.userUtils.getRequestUser(req), 'user', true);
                    if (!hasPermission)
                        throw new Error('You do not have the required permissions');
                    _a = req.body, id = _a.id, name_2 = _a.name, email = _a.email, phone = _a.phone, role = _a.role;
                    // Vérification de si toutes les données nécessaire sont présentes
                    if (!id)
                        throw new Error('Missing id field');
                    return [4 /*yield*/, globalUtils_1.globalUtils.findOne(User_1.User, id)];
                case 1:
                    user = _c.sent();
                    if (!user)
                        throw new Error('Invalid employee id');
                    // Vérification de l'email de l'employé que l'on veut modifier
                    if (email && !verifyDataHelper_1.default.validEmail(email))
                        throw new Error('Invalid email addresse');
                    _b = email;
                    if (!_b) return [3 /*break*/, 3];
                    return [4 /*yield*/, userUtils_1.userUtils.emailAlreadyExist(email)];
                case 2:
                    _b = (_c.sent());
                    _c.label = 3;
                case 3:
                    // Vérification de si l'email existe déjà
                    if (_b)
                        throw new Error('This email is already used');
                    // Vérification du role de l'employé que l'on veut modifier
                    if (role && !verifyDataHelper_1.default.validRole(role))
                        throw new Error('Invalid enterprise role');
                    // Vérification du numéro de téléphone de l'employé que l'on veut modifier
                    if (phone && !verifyDataHelper_1.default.validPhone(phone))
                        throw new Error('Invalid phone number');
                    toUpdate = {};
                    if (name_2)
                        toUpdate.name = user.name = name_2;
                    if (email) {
                        toUpdate.email = user.email = email;
                        toUpdate.verify_email = user.verify_email = { code: 0, date: 0, verified: false };
                    }
                    if (phone)
                        toUpdate.phone = user.phone = phone;
                    if (role)
                        toUpdate.role = user.role = role;
                    // Modification de l'employé
                    return [4 /*yield*/, globalUtils_1.globalUtils.updateOneById(User_1.User, id, toUpdate)];
                case 4:
                    // Modification de l'employé
                    _c.sent();
                    // Envoi de la réponse
                    responseHelper_1.sendResponse(res, 200, { error: false, message: 'Employee successfully updated', employee: userUtils_1.userUtils.generateEmployeeJSON(user) });
                    return [3 /*break*/, 6];
                case 5:
                    err_2 = _c.sent();
                    if (err_2.message === 'You do not have the required permissions')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '401002', message: err_2.message });
                    else if (err_2.message === 'Missing id field')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '103351', message: err_2.message });
                    else if (err_2.message === 'Invalid email addresse')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '103352', message: err_2.message });
                    else if (err_2.message === 'Invalid phone number')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '103353', message: err_2.message });
                    else if (err_2.message === 'Invalid employee id')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '103354', message: err_2.message });
                    else if (err_2.message === 'Invalid enterprise role')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '103355', message: err_2.message });
                    else if (err_2.message === 'This email is already used')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '103356', message: err_2.message });
                    else
                        responseHelper_1.errorHandler(res, err_2);
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    }); };
    /**
     * Fonction de suppression d'un employé  (DELETE /employee/:id)
     * @param req express Request
     * @param res express Response
     */
    EmployeeController.delete = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var hasPermission, id, user, err_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    hasPermission = globalUtils_1.globalUtils.checkPermission(userUtils_1.userUtils.getRequestUser(req), 'user', true);
                    if (!hasPermission)
                        throw new Error('You do not have the required permissions');
                    id = req.params.id;
                    // Vérification de si toutes les données nécessaire sont présentes
                    if (!id)
                        throw new Error('Missing id field');
                    return [4 /*yield*/, globalUtils_1.globalUtils.findOne(User_1.User, id)];
                case 1:
                    user = _a.sent();
                    if (!user)
                        throw new Error('Invalid employee id');
                    // Suppression de l'employé
                    return [4 /*yield*/, globalUtils_1.globalUtils.deleteOne(User_1.User, id)];
                case 2:
                    // Suppression de l'employé
                    _a.sent();
                    // Désactivation de l'employé
                    // await userUtils.disabledOne(User, id);
                    // Envoi de la réponse
                    responseHelper_1.sendResponse(res, 200, { error: false, message: 'Employee successfully deleted' });
                    return [3 /*break*/, 4];
                case 3:
                    err_3 = _a.sent();
                    if (err_3.message === 'You do not have the required permissions')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '401002', message: err_3.message });
                    else if (err_3.message === 'Missing id field')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '103401', message: err_3.message });
                    else if (err_3.message === 'Invalid employee id')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '103402', message: err_3.message });
                    else
                        responseHelper_1.errorHandler(res, err_3);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    return EmployeeController;
}());
exports.EmployeeController = EmployeeController;
