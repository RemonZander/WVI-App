import express, { Request, Response } from "express";
import { Router } from 'express-serve-static-core';
import passport from "passport";
import { TokenGenerator } from "ts-token-generator";
import { TokenService } from "../services/TokenService";

const tokgen = new TokenGenerator();
const authenticationRouter: Router = express.Router();

authenticationRouter.post('/login',
    passport.authenticate('local'),
    function (req, res: Response) {

        const token = tokgen.generate();
        if (TokenService.TokenExists(req.body.email, req.cookies.login)) {
            TokenService.UpdateToken(req.body.email, req.cookies.login);
            res.sendStatus(200);
            return;
        }
        TokenService.RemoveTokenByEmail(req.body.email);
        TokenService.InsertOne(req.body.email, token);
        res.cookie('login', token, { path: '/', httpOnly: true, maxAge: 3600000, sameSite: "strict" });
        res.sendStatus(200);
    }
);

authenticationRouter.get('/validatetoken', (req: Request, res: Response) => {
    if (TokenService.TokenExistsByToken(req.cookies["login"])) {
        TokenService.UpdateTokenNoEmail(req.cookies.login);
        res.sendStatus(200);
        return;
    }
    res.sendStatus(401);
});

authenticationRouter.get('/logout', (req: Request, res: Response) => {
    TokenService.RemoveToken(req.cookies.login);
    res.clearCookie("login");
    res.sendStatus(200);
});



export default authenticationRouter;