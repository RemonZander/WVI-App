import express, { Request, Response } from "express";
import { Router } from 'express-serve-static-core';
import passport from "passport";
import { TokenGenerator } from "ts-token-generator";
import { BuildEnforcerPolicies, createEnforcer } from "../services/CasbinService";
import { TokenService } from "../services/TokenService";

const tokgen = new TokenGenerator();
const authenticationRouter: Router = express.Router();

authenticationRouter.post('/login',
    passport.authenticate('local'),
    function (req, res: Response) {

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
);

authenticationRouter.get('/validatetoken', (req: Request, res: Response) => {
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
});

authenticationRouter.get('/logout', (req: Request, res: Response) => {
    const result = TokenService.RemoveToken(req.cookies.login);
    if (result == false) {
        res.sendStatus(500);
        return;
    }
    res.clearCookie("login");
    res.sendStatus(200);
});

authenticationRouter.post('/haspermissions', async (req: Request, res: Response) => {
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
});

authenticationRouter.get('/rebuildenforcerpolicies', (req: Request, res: Response) => {
    BuildEnforcerPolicies();
    res.sendStatus(200);
});

export default authenticationRouter;