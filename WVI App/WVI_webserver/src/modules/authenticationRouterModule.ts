import express, { Request, Response } from "express";
import { Router } from 'express-serve-static-core';
import passport from "passport";
import { TokenGenerator } from "ts-token-generator";
import { BuildEnforcerPolicies, createEnforcer } from "../services/CasbinService";
import { TokenService } from "../services/TokenService";

const tokgen = new TokenGenerator();

class AuthenticationRouter {
    router: Router;
    constructor() {
        this.router = express.Router();
        this.initializeRoutes();
    }

    initializeRoutes() {
        this.router.post('/login', passport.authenticate('local'), this.Login.bind(this))
        this.router.get('/validatetoken', this.ValidateToken);
        this.router.get('/logout', this.Logout);
        this.router.post('/haspermissions', this.HasPermissions);
        this.router.get('rebuildenforcerpolicies', this.RebuildEnforcerPolicies);
    }

    getRouter() {
        return this.router;
    }

    Login(req: Request, res: Response) {
        const token = tokgen.generate();
        if (TokenService.TokenExists(req.body.email, req.cookies.login)) {
            const result = TokenService.UpdateToken(req.body.email, req.cookies.login); {
                if (result == false) {
                    res.sendStatus(500);
                    return;
                }
            }
            res.sendStatus(200);
            return;
        }
        let result = TokenService.RemoveTokenByEmail(req.body.email);
        if (result == false) {
            res.sendStatus(500);
            return;
        }
        result = TokenService.InsertOne(req.body.email, token);
        if (result == false) {
            res.sendStatus(500);
            return;
        }
        res.cookie('login', token, { path: '/', httpOnly: true, maxAge: 3600000, sameSite: "strict" });
        res.sendStatus(200);    
    }

    ValidateToken(req: Request, res: Response) {
        if (TokenService.TokenExistsByToken(req.cookies["login"])) {
            const result = TokenService.UpdateTokenNoEmail(req.cookies.login);
            if (result == false) {
                res.sendStatus(500);
                return;
            }
            res.sendStatus(200);
            return;
        }
        res.sendStatus(401);
    }

    Logout(req: Request, res: Response) {
        const result = TokenService.RemoveToken(req.cookies.login);
        if (result == false) {
            res.sendStatus(500);
            return;
        }
        res.clearCookie("login");
        res.sendStatus(200);
    }

    async HasPermissions(req: Request, res: Response) {
        const enforcer = await createEnforcer();
        const email = TokenService.GetEmail(req.cookies["login"])[0];
        if (email == null) {
            res.sendStatus(500);
            return;
        }

        if (await enforcer.enforce(email.Email, "*")) {
            res.sendStatus(200);
            return;
        }

        for (var a = 0; a < req.body.permissions.length; a++) {
            if (await enforcer.enforce(email.Email, req.body.permissions[a])) {
                res.sendStatus(200);
                return;
            }
        }
        res.sendStatus(401);
    }

    RebuildEnforcerPolicies(req: Request, res: Response) {
        BuildEnforcerPolicies();
        res.sendStatus(200);
    }
}

export default new AuthenticationRouter().getRouter();