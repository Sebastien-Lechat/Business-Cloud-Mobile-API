"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv_1 = require("dotenv");
dotenv_1.config();
require('./src/db/db');
var express_1 = __importDefault(require("express"));
var cors_1 = __importDefault(require("cors"));
var express_rate_limit_1 = __importDefault(require("express-rate-limit"));
var routes_1 = require("./src/routes");
var port = process.env.PORT || 5000;
var app = express_1.default();
app.use(cors_1.default());
// let http = require('http').createServer(app);
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.use(function (error, request, response, next) {
    if (error !== null) {
        return response.status(400).json({ success: false, message: 'Invalid json' });
    }
    return next();
});
var limiter = express_rate_limit_1.default({
    windowMs: 1 * 60 * 1000,
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);
app.use(routes_1.RouteIndex);
app.listen(port, function () {
    console.log("Server running on port " + port);
});
