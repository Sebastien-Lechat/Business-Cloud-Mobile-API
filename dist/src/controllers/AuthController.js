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
exports.AuthController = void 0;
var validator_1 = __importDefault(require("validator"));
var emailHelper_1 = require("../helpers/emailHelper");
var passwordHelper_1 = require("../helpers/passwordHelper");
var responseHelper_1 = require("../helpers/responseHelper");
var verifyDataHelper_1 = __importDefault(require("../helpers/verifyDataHelper"));
var Client_1 = require("../models/Client");
var emailTemplate_1 = require("../templates/emailTemplate");
var userUtils_1 = require("../utils/userUtils");
var AuthController = /** @class */ (function () {
    function AuthController() {
    }
    /**
     * Fonction de connexion à l'application (POST /auth/login)
     * @param req express Request
     * @param res express Response
     */
    AuthController.login = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, email, password, code, user, timeBetweenLastLogin, time, err_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 10, , 11]);
                    _a = req.body, email = _a.email, password = _a.password, code = _a.code;
                    // Vérification de si toutes les données nécessaire sont présentes
                    if (!email || !password)
                        throw new Error('Missing email or password field');
                    // Vérification de l'email de l'utilisateur
                    if (!verifyDataHelper_1.default.validEmail(email))
                        throw new Error('Invalid email addresse');
                    return [4 /*yield*/, userUtils_1.userUtils.findUser({ userEmail: email })];
                case 1:
                    user = _b.sent();
                    if (!user)
                        throw new Error('Invalid login credential');
                    timeBetweenLastLogin = (Date.now() - user.data.lastLogin) / 1000;
                    if (!(user.data.attempt >= 5 && timeBetweenLastLogin > 300)) return [3 /*break*/, 3];
                    return [4 /*yield*/, userUtils_1.userUtils.updateLastLogin(user, true)];
                case 2:
                    _b.sent();
                    _b.label = 3;
                case 3:
                    // On vérifie le nombre de connnexion et le temps depuis la dernière connexion
                    if (user.data.attempt >= 5 && timeBetweenLastLogin < 300)
                        throw new Error('Too many attempts on this email (5 max) - Please wait (5min)');
                    return [4 /*yield*/, passwordHelper_1.comparePassword(password, user.data.password)];
                case 4:
                    if (!!(_b.sent())) return [3 /*break*/, 6];
                    return [4 /*yield*/, userUtils_1.userUtils.updateLastLogin(user)];
                case 5:
                    _b.sent();
                    throw new Error('Invalid login credential');
                case 6:
                    // Vérification de si le compte est actif ou non
                    if (!user.data.isActive)
                        throw new Error('This account is disabled');
                    // Si tout ce passe bien remise des essais de connexion à 0
                    return [4 /*yield*/, userUtils_1.userUtils.updateLastLogin(user, true)];
                case 7:
                    // Si tout ce passe bien remise des essais de connexion à 0
                    _b.sent();
                    // Vérification de si l'adresse email est vérifié ou non
                    if (!user.data.verify_email || !user.data.verify_email.verified)
                        throw new Error('Email address is not verified');
                    // Vérification de si la double authentification est activé, et si elle l'est on vérifie également la présence et la validité du code
                    if (user.data.double_authentification && user.data.double_authentification.activated) {
                        if (!code)
                            throw new Error('Double authentification is activated, code is required');
                        if (user.data.double_authentification.code !== code)
                            throw new Error('Wrong code');
                        time = (Date.now() - user.data.double_authentification.date) / 1000;
                        if (time > 600)
                            return [2 /*return*/, res.status(400).send({ success: false, message: 'This code is no longer valid' })];
                    }
                    return [4 /*yield*/, userUtils_1.userUtils.generateUserToken(user)];
                case 8:
                    // Génération des tokens de l'utilisateur et de la réponse
                    user = _b.sent();
                    return [4 /*yield*/, userUtils_1.userUtils.generateUserRefreshToken(user)];
                case 9:
                    user = _b.sent();
                    // Envoi de la réponse
                    responseHelper_1.sendResponse(res, 200, { error: false, message: 'Successfully connected', user: userUtils_1.userUtils.generateUserJSON(user) });
                    return [3 /*break*/, 11];
                case 10:
                    err_1 = _b.sent();
                    if (err_1.message === 'Missing email or password field')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '101001', message: err_1.message });
                    else if (err_1.message === 'Invalid email addresse')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '101002', message: err_1.message });
                    else if (err_1.message === 'Invalid login credential')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '101003', message: err_1.message });
                    else if (err_1.message === 'Email address is not verified')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '101004', message: err_1.message });
                    else if (err_1.message === 'Double authentification is activated, code is required')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '101205', message: err_1.message });
                    else if (err_1.message === 'Wrong code')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '101006', message: err_1.message });
                    else if (err_1.message === 'This code is no longer valid')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '101007', message: err_1.message });
                    else if (err_1.message === 'This account is disabled')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '101008', message: err_1.message });
                    else if (err_1.message === 'Too many attempts on this email (5 max) - Please wait (5min)')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '101009', message: err_1.message });
                    else
                        responseHelper_1.errorHandler(res, err_1);
                    return [3 /*break*/, 11];
                case 11: return [2 /*return*/];
            }
        });
    }); };
    /**
     * Fonction d'inscription dans l'application (POST /auth/register)
     * @param req express Request
     * @param res express Response
     */
    AuthController.register = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, name_1, email, password, phone, birthdayDate, address, zip, city, country, numTVA, numSIRET, numRCS, _b, client, err_2;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 4, , 5]);
                    _a = req.body, name_1 = _a.name, email = _a.email, password = _a.password, phone = _a.phone, birthdayDate = _a.birthdayDate, address = _a.address, zip = _a.zip, city = _a.city, country = _a.country, numTVA = _a.numTVA, numSIRET = _a.numSIRET, numRCS = _a.numRCS;
                    // Vérification de si toutes les données nécessaire sont présentes
                    if (!name_1 || !email || !password)
                        throw new Error('Missing important fields');
                    // Vérification de l'email de l'utilisateur
                    if (!verifyDataHelper_1.default.validEmail(email))
                        throw new Error('Invalid email addresse');
                    return [4 /*yield*/, userUtils_1.userUtils.emailAlreadyExist(email)];
                case 1:
                    // Vérification de si l'email existe déjà
                    if (_c.sent())
                        throw new Error('This email is already used');
                    // Vérification du mot de passe de l'utilisateur et encryptage en cas de bon format
                    if (!verifyDataHelper_1.default.validPassword(password))
                        throw new Error('Invalid password format');
                    _b = req.body;
                    return [4 /*yield*/, passwordHelper_1.hashPassword(req.body.password)];
                case 2:
                    _b.password = _c.sent();
                    // Vérification du numéro de téléphone de l'utilisateur
                    if (phone && !verifyDataHelper_1.default.validPhone(phone))
                        throw new Error('Invalid phone number');
                    // Vérification de la date de naissance de l'utilisateur
                    if (birthdayDate && !verifyDataHelper_1.default.validDate(birthdayDate))
                        throw new Error('Invalid date format');
                    return [4 /*yield*/, Client_1.Client.create(req.body)];
                case 3:
                    client = _c.sent();
                    // Envoi de la réponse
                    responseHelper_1.sendResponse(res, 200, { error: false, message: 'Successfully registred', user: { id: client._id, name: client.name, email: client.email } });
                    return [3 /*break*/, 5];
                case 4:
                    err_2 = _c.sent();
                    if (err_2.message === 'Missing important fields')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '101051', message: err_2.message });
                    else if (err_2.message === 'Invalid email addresse')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '101052', message: err_2.message });
                    else if (err_2.message === 'Invalid phone number')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '101053', message: err_2.message });
                    else if (err_2.message === 'Invalid password format')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '101054', message: err_2.message });
                    else if (err_2.message === 'Invalid TVA number')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '101055', message: err_2.message });
                    else if (err_2.message === 'Invalid SIRET number')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '101056', message: err_2.message });
                    else if (err_2.message === 'Invalid RCS number')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '101057', message: err_2.message });
                    else if (err_2.message === 'Invalid date format')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '101058', message: err_2.message });
                    else if (err_2.message === 'This email is already used')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '101059', message: err_2.message });
                    else
                        responseHelper_1.errorHandler(res, err_2);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    /**
     * Fonction pour envoyer le mail lors du mot de passe oublié (POST /auth/request-password-lost)
     * @param req express Request
     * @param res express Response
     */
    AuthController.requestPasswordLost = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var email, user, token, err_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    email = req.body.email;
                    // Vérification de si toutes les données nécessaire sont présentes
                    if (!email)
                        throw new Error('Missing email field');
                    // Vérification de l'email de l'utilisateur
                    if (!verifyDataHelper_1.default.validEmail(email))
                        throw new Error('Invalid email addresse');
                    return [4 /*yield*/, userUtils_1.userUtils.findUser({ userEmail: email })];
                case 1:
                    user = _a.sent();
                    if (!user) return [3 /*break*/, 3];
                    return [4 /*yield*/, userUtils_1.userUtils.generatePasswordToken(user)];
                case 2:
                    token = _a.sent();
                    // Envoi du mail de récupération de mot de passe
                    emailHelper_1.sendMail(email, 'Mot de passe oublié', emailTemplate_1.passwordLostModel(user.data.name, token));
                    // Envoi de la réponse
                    responseHelper_1.sendResponse(res, 200, { error: false, message: 'Email successfully send' });
                    return [3 /*break*/, 4];
                case 3:
                    responseHelper_1.sendResponse(res, 200, { error: false, message: 'Email successfully send' });
                    _a.label = 4;
                case 4: return [3 /*break*/, 6];
                case 5:
                    err_3 = _a.sent();
                    if (err_3.message === 'Missing email field')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '101101', message: err_3.message });
                    else if (err_3.message === 'Invalid email addresse')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '101102', message: err_3.message });
                    else
                        responseHelper_1.errorHandler(res, err_3);
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    }); };
    /**
     * Fonction pour envoyer le mail lors de la vérification du mail (POST /auth/request-verify-email)
     * @param req express Request
     * @param res express Response
     */
    AuthController.requestVerifyEmail = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var email, user, code, err_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    email = req.body.email;
                    // Vérification de si toutes les données nécessaire sont présentes
                    if (!email)
                        throw new Error('Missing email field');
                    // Vérification de l'email de l'utilisateur
                    if (!verifyDataHelper_1.default.validEmail(email))
                        throw new Error('Invalid email addresse');
                    return [4 /*yield*/, userUtils_1.userUtils.findUser({ userEmail: email })];
                case 1:
                    user = _a.sent();
                    if (!user) return [3 /*break*/, 3];
                    return [4 /*yield*/, userUtils_1.userUtils.generateVerifyEmailCode(user)];
                case 2:
                    code = _a.sent();
                    if (!code)
                        throw new Error('Email already verified');
                    // Envoi du mail de vérification du mail avec le code
                    emailHelper_1.sendMail(email, 'Vérification de l\' email', emailTemplate_1.sendCodeModel(user.data.name, code, 'pour la vérification de votre mail'));
                    // Envoi de la réponse
                    responseHelper_1.sendResponse(res, 200, { error: false, message: 'Email successfully send' });
                    return [3 /*break*/, 4];
                case 3:
                    responseHelper_1.sendResponse(res, 200, { error: false, message: 'Email successfully send' });
                    _a.label = 4;
                case 4: return [3 /*break*/, 6];
                case 5:
                    err_4 = _a.sent();
                    if (err_4.message === 'Missing email field')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '101151', message: err_4.message });
                    else if (err_4.message === 'Invalid email addresse')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '101152', message: err_4.message });
                    else if (err_4.message === 'Email already verified')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '101153', message: err_4.message });
                    else
                        responseHelper_1.errorHandler(res, err_4);
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    }); };
    /**
     * Fonction de vérification de l'email utilisateur (POST /auth/verify-email)
     * @param req express Request
     * @param res express Response
     */
    AuthController.verifyEmail = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, email, code, user, time, err_5;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 3, , 4]);
                    _a = req.body, email = _a.email, code = _a.code;
                    // Vérification de si toutes les données nécessaire sont présentes
                    if (!email || !code)
                        throw new Error('Missing email or code field');
                    // Vérification de l'email de l'utilisateur
                    if (!verifyDataHelper_1.default.validEmail(email))
                        throw new Error('Invalid email addresse');
                    return [4 /*yield*/, userUtils_1.userUtils.findUser({ userEmail: email })];
                case 1:
                    user = _b.sent();
                    if (!user)
                        throw new Error('Invalid user information');
                    // Vérification de si l'utilisateur à bien fait une requête de vérification de son mail
                    if (!user.data.verify_email || !user.data.verify_email.code || user.data.verify_email.verified === undefined)
                        throw new Error('You need to make a request to check this email');
                    // Vérification de si le code est toujours valide et si c'est le bon code
                    if (code !== user.data.verify_email.code)
                        throw new Error('Wrong code');
                    time = (Date.now() - user.data.verify_email.date) / 1000;
                    if (time > 600)
                        throw new Error('This code is no longer valid');
                    // Changement du statut de vérification de l'email
                    return [4 /*yield*/, userUtils_1.userUtils.updateUser(user, { verify_email: { code: 0, date: 0, verified: true } })];
                case 2:
                    // Changement du statut de vérification de l'email
                    _b.sent();
                    // Envoi de la réponse
                    responseHelper_1.sendResponse(res, 200, { error: false, message: 'Successful verification' });
                    return [3 /*break*/, 4];
                case 3:
                    err_5 = _b.sent();
                    if (err_5.message === 'Missing email or code field')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '101201', message: err_5.message });
                    else if (err_5.message === 'Invalid email addresse')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '101202', message: err_5.message });
                    else if (err_5.message === 'Invalid user information')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '101203', message: err_5.message });
                    else if (err_5.message === 'You need to make a request to check this email')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '101204', message: err_5.message });
                    else if (err_5.message === 'Wrong code')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '101205', message: err_5.message });
                    else if (err_5.message === 'This code is no longer valid')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '101206', message: err_5.message });
                    else
                        responseHelper_1.errorHandler(res, err_5);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    /**
     * Fonction pour envoyer le mail lors de la double authentification (POST /auth/request-double-auth)
     * @param req express Request
     * @param res express Response
     */
    AuthController.requestDoubleAuth = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var email, user, code, err_6;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 3, , 4]);
                    email = req.body.email;
                    // Vérification de si toutes les données nécessaire sont présentes
                    if (!email)
                        throw new Error('Missing email or userId field');
                    // Vérification de l'email de l'utilisateur
                    if (!verifyDataHelper_1.default.validEmail(email))
                        throw new Error('Invalid email addresse');
                    return [4 /*yield*/, userUtils_1.userUtils.findUser({ userEmail: email })];
                case 1:
                    user = _b.sent();
                    if (!user)
                        throw new Error('Invalid user information');
                    // Vérification de si la double authentification est activé
                    if (!((_a = user.data.double_authentification) === null || _a === void 0 ? void 0 : _a.activated))
                        throw new Error('Double authentification is not activated on this account');
                    return [4 /*yield*/, userUtils_1.userUtils.generateDoubleAuthCode(user)];
                case 2:
                    code = _b.sent();
                    // Envoi du mail de double authentification avec le code
                    emailHelper_1.sendMail(email, 'Double authentification', emailTemplate_1.sendCodeModel(user.data.name, code, 'pour la double authentification de votre compte'));
                    // Envoi de la réponse
                    responseHelper_1.sendResponse(res, 200, { error: false, message: 'Email successfully send' });
                    return [3 /*break*/, 4];
                case 3:
                    err_6 = _b.sent();
                    if (err_6.message === 'Missing email field')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '101251', message: err_6.message });
                    else if (err_6.message === 'Invalid email addresse')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '101252', message: err_6.message });
                    else if (err_6.message === 'Invalid user information')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '101253', message: err_6.message });
                    else if (err_6.message === 'Double authentification is not activated on this account')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '101254', message: err_6.message });
                    else
                        responseHelper_1.errorHandler(res, err_6);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    /**
     * Fonction pour activer la double authentification (POST /auth/activate-double-auth)
     * @param req express Request
     * @param res express Response
     */
    AuthController.activateDoubleAuth = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var isActive, user, err_7;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    isActive = req.body.isActive;
                    // On assure que la donnée est un booléen
                    isActive = validator_1.default.toBoolean(isActive);
                    // Vérification de si toutes les données nécessaire sont présentes
                    if (isActive === undefined)
                        throw new Error('Missing isActive field');
                    user = userUtils_1.userUtils.getRequestUser(req);
                    // On met à jour l'option de double authentification
                    return [4 /*yield*/, userUtils_1.userUtils.updateUser(user, { double_authentification: { activated: isActive, code: 0, date: 0 } })];
                case 1:
                    // On met à jour l'option de double authentification
                    _a.sent();
                    // Envoi de la réponse
                    responseHelper_1.sendResponse(res, 200, { error: false, message: 'Double authentification successfully updated' });
                    return [3 /*break*/, 3];
                case 2:
                    err_7 = _a.sent();
                    if (err_7.message === 'Missing isActive field')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '101301', message: err_7.message });
                    else
                        responseHelper_1.errorHandler(res, err_7);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    /**
     * Fonction pour déconnecter l'utilisateur (DELETE /auth/disconnect)
     * @param req express Request
     * @param res express Response
     */
    AuthController.logout = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var user, err_8;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    user = userUtils_1.userUtils.getRequestUser(req);
                    // Suppression des tokens d'authentification de l'utilisateur
                    return [4 /*yield*/, userUtils_1.userUtils.updateUser(user, { token: '', refreshToken: '' })];
                case 1:
                    // Suppression des tokens d'authentification de l'utilisateur
                    _a.sent();
                    // Envoi de la réponse
                    responseHelper_1.sendResponse(res, 200, { error: false, message: 'Successfully logout' });
                    return [3 /*break*/, 3];
                case 2:
                    err_8 = _a.sent();
                    if (err_8.message === 'Missing isActive field')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '101301', message: err_8.message });
                    else
                        responseHelper_1.errorHandler(res, err_8);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    return AuthController;
}());
exports.AuthController = AuthController;
