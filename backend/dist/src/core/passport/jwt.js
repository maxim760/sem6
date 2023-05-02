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
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
var dotenv_1 = __importDefault(require("dotenv"));
var passport_jwt_1 = require("passport-jwt");
var tokens_1 = require("../utils/tokens");
var user_repo_1 = require("../../user/user.repo");
dotenv_1.default.config();
var cookieExtractor = function (req) {
    var token = null;
    if (req && req.cookies) {
        token = req.cookies['refreshToken'];
    }
    return token;
};
var jwtRefreshOptions = {
    jwtFromRequest: cookieExtractor,
    secretOrKey: process.env.JWT_SECRET,
};
var jwtAccessOptions = {
    jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
};
var applyJwtStrategy = function (passport) {
    passport.use("jwt-refresh", new passport_jwt_1.Strategy(jwtRefreshOptions, function (payload, done) { return __awaiter(void 0, void 0, void 0, function () {
        var id, email, user, refreshToken, payload_1, newTokens, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    id = payload.id, email = payload.email;
                    return [4 /*yield*/, user_repo_1.userRepo.findOne({ where: { id: id }, relations: { roles: true } })];
                case 1:
                    user = _a.sent();
                    refreshToken = user === null || user === void 0 ? void 0 : user.refreshToken;
                    if (!refreshToken) return [3 /*break*/, 6];
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    payload_1 = { id: id, email: user.email, roles: user.roles.map(function (item) { return item.name; }) };
                    newTokens = tokens_1.TokenService.generateTokens(payload_1);
                    user.refreshToken = newTokens.refreshToken;
                    return [4 /*yield*/, user_repo_1.userRepo.save(user)];
                case 3:
                    _a.sent();
                    done(null, { tokens: newTokens, user: user });
                    return [3 /*break*/, 5];
                case 4:
                    err_1 = _a.sent();
                    done(err_1);
                    return [3 /*break*/, 5];
                case 5: return [3 /*break*/, 7];
                case 6:
                    done(new Error('Refresh token not found'));
                    _a.label = 7;
                case 7: return [2 /*return*/];
            }
        });
    }); }));
    passport.use("jwt", new passport_jwt_1.Strategy(jwtAccessOptions, function (payload, done) {
        done(null, payload);
    }));
};
exports.default = applyJwtStrategy;
