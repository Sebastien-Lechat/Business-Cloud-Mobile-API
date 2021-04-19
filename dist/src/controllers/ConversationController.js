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
exports.ConversationController = void 0;
var responseHelper_1 = require("../helpers/responseHelper");
var Conversation_1 = require("../models/Conversation");
var conversationUtils_1 = require("../utils/conversationUtils");
var globalUtils_1 = require("../utils/globalUtils");
var userUtils_1 = require("../utils/userUtils");
var ConversationController = /** @class */ (function () {
    function ConversationController() {
    }
    /**
     * Fonction de récupération de toutes les conversation (GET /conversations)
     * @param req express Request
     * @param res express Response
     */
    ConversationController.getConversationsList = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var user, conversationList, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    user = userUtils_1.userUtils.getRequestUser(req);
                    return [4 /*yield*/, conversationUtils_1.conversationUtils.getConversationList(user.data._id)];
                case 1:
                    conversationList = _a.sent();
                    // Envoi de la réponse
                    responseHelper_1.sendResponse(res, 200, { error: false, message: 'Successful conversations acquisition', conversations: conversationList });
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
     * Fonction de création d'une conversation (GET /conversations)
     * @param req express Request
     * @param res express Response
     */
    ConversationController.create = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var user, userId, targetUser, alreadyExiste, conversation, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 6, , 7]);
                    user = userUtils_1.userUtils.getRequestUser(req);
                    userId = req.body.userId;
                    // Vérification de si toutes les données nécessaire sont présentes
                    if (!userId)
                        throw new Error('Missing important fields');
                    // Vérification que l'on ne créer pas une conversation avec sois même
                    if (user.data._id.toString() === userId)
                        throw new Error('Can\'t create conversation with yourself');
                    return [4 /*yield*/, userUtils_1.userUtils.findUser({ userId: userId })];
                case 1:
                    targetUser = _a.sent();
                    if (!targetUser)
                        throw new Error('Invalid user id');
                    return [4 /*yield*/, conversationUtils_1.conversationUtils.findConversation(user.data._id, userId)];
                case 2:
                    alreadyExiste = _a.sent();
                    if (!alreadyExiste) return [3 /*break*/, 3];
                    responseHelper_1.sendResponse(res, 200, { error: false, message: 'Conversation already exist', conversation: conversationUtils_1.conversationUtils.generateConversationJSON(alreadyExiste) });
                    return [3 /*break*/, 5];
                case 3: return [4 /*yield*/, Conversation_1.Conversation.create({ userId: user.data._id, userId1: userId })];
                case 4:
                    conversation = _a.sent();
                    // Envoi de la réponse
                    responseHelper_1.sendResponse(res, 200, { error: false, message: 'Conversation successfully created', conversation: conversationUtils_1.conversationUtils.generateConversationJSON(conversation) });
                    _a.label = 5;
                case 5: return [3 /*break*/, 7];
                case 6:
                    err_2 = _a.sent();
                    if (err_2.message === 'Missing important fields')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '112101', message: err_2.message });
                    else if (err_2.message === 'Can\'t create conversation with yourself')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '112102', message: err_2.message });
                    else if (err_2.message === 'Invalid user id')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '112103', message: err_2.message });
                    else
                        responseHelper_1.errorHandler(res, err_2);
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    }); };
    /**
     * Fonction de suppression d'une conversation (GET /conversations)
     * @param req express Request
     * @param res express Response
     */
    ConversationController.delete = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var id, conversation, err_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    id = req.params.id;
                    // Vérification de si toutes les données nécessaire sont présentes
                    if (!id)
                        throw new Error('Missing id field');
                    return [4 /*yield*/, globalUtils_1.globalUtils.findOne(Conversation_1.Conversation, id)];
                case 1:
                    conversation = _a.sent();
                    if (!conversation)
                        throw new Error('Invalid conversation id');
                    // Suppression du devis
                    return [4 /*yield*/, globalUtils_1.globalUtils.deleteOne(Conversation_1.Conversation, id)];
                case 2:
                    // Suppression du devis
                    _a.sent();
                    // Envoi de la réponse
                    responseHelper_1.sendResponse(res, 200, { error: false, message: 'Conversation successfully deleted' });
                    return [3 /*break*/, 4];
                case 3:
                    err_3 = _a.sent();
                    if (err_3.message === 'Missing id field')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '112151', message: err_3.message });
                    else if (err_3.message === 'Invalid conversation id')
                        responseHelper_1.sendResponse(res, 400, { error: true, code: '112152', message: err_3.message });
                    else
                        responseHelper_1.errorHandler(res, err_3);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    return ConversationController;
}());
exports.ConversationController = ConversationController;
