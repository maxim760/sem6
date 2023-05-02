"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
var express_1 = require("express");
var passport_1 = __importDefault(require("passport"));
var auth_controller_1 = __importDefault(require("./auth.controller"));
var authRouter = (0, express_1.Router)();
exports.authRouter = authRouter;
authRouter.post("/registration", auth_controller_1.default.registration);
authRouter.post("/registration/oauth2", auth_controller_1.default.registrationOauth2);
authRouter.post("/login", auth_controller_1.default.login);
authRouter.post("/logout", auth_controller_1.default.logout);
authRouter.get("/refresh", passport_1.default.authenticate('jwt-refresh', { session: false }), auth_controller_1.default.refresh);
authRouter.get("/me", passport_1.default.authenticate('jwt', { session: false }), auth_controller_1.default.me);
authRouter.get("/users", passport_1.default.authenticate('jwt', { session: false }), auth_controller_1.default.getAllUsers);
authRouter.get("/yandex", passport_1.default.authenticate('yandex', { session: false }));
authRouter.get("/yandex/callback", passport_1.default.authenticate("yandex", { display: "popup", session: false }), auth_controller_1.default.oauthCallback);
authRouter.get("/vk", passport_1.default.authenticate('vkontakte', { scope: ["email"], session: false }));
authRouter.get("/vk/callback", passport_1.default.authenticate("vkontakte", { display: "popup", session: false }), auth_controller_1.default.oauthCallback);
authRouter.get("/slack", passport_1.default.authenticate('slack', { session: false }));
authRouter.get("/slack/callback", passport_1.default.authenticate("slack", { display: "popup", session: false }), auth_controller_1.default.oauthCallback);
authRouter.get("/google", passport_1.default.authenticate('google', { session: false }));
authRouter.get("/google/callback", passport_1.default.authenticate("google", { display: "popup", session: false }), auth_controller_1.default.oauthCallback);
authRouter.get("/github", passport_1.default.authenticate('github', { session: false, scope: ["user"] }));
authRouter.get("/github/callback", passport_1.default.authenticate("github", { display: "popup", session: false }), auth_controller_1.default.oauthCallback);
authRouter.get("/users", passport_1.default.authenticate('jwt', { session: false }), auth_controller_1.default.getAllUsers);
authRouter.put("/address", passport_1.default.authenticate('jwt', { session: false }), auth_controller_1.default.updateUserAddress);
authRouter.put("/cash", passport_1.default.authenticate('jwt', { session: false }), auth_controller_1.default.updateUserCash);
authRouter.put("/contact", passport_1.default.authenticate('jwt', { session: false }), auth_controller_1.default.updateUserContact);
authRouter.delete("/", passport_1.default.authenticate('jwt', { session: false }), auth_controller_1.default.deleteUser);
