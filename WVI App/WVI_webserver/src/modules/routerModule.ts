import express, { Request, Response } from 'express';
import { Router } from 'express-serve-static-core';
import OPCUAclient from './OPCUA_client';
import passport from 'passport';
import { TokenService } from '../services/TokenService';
import { TokenGenerator } from 'ts-token-generator';
import { UserService } from '../services/UserService';

const router: Router = express.Router();

const _OPCUAclient = new OPCUAclient();

const tokgen = new TokenGenerator();

router.post('/OPCUA/status', (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');

    _OPCUAclient.GetStatus(req, res);
});

router.post('/OPCUA/data', (req: Request, res: Response) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    _OPCUAclient.GetData(req, res);
});

router.get('/OPCUA/isonline', (req: Request, res: Response) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Access-Control-Allow-Origin', '*');
    _OPCUAclient.IsOnline(req, res);
});

router.put('/OPCUA/write', (req: Request, res: Response) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    _OPCUAclient.WriteToWVI(req, res);
});

router.get('/validatetoken', (req: Request, res: Response) => {
    if (TokenService.TokenExistsByToken(req.cookies["login"])) {
        TokenService.UpdateTokenNoEmail(req.cookies.login);
        res.sendStatus(200);
        return;
    }
    res.sendStatus(401);
});

router.get('/logout', (req: Request, res: Response) => {
    TokenService.RemoveToken(req.cookies.login);
    res.clearCookie("login");
    res.sendStatus(200);
});

router.get('/role', (req: Request, res: Response) => {
    const results = TokenService.GetEmail(req.cookies.login);
    if (results.length === 0) {
        res.sendStatus(401);
        return;
    }
    const user = UserService.GetOneByEmailSelectColumns(`"Role"`, results[0].Email);
    if (user.length === 0) {
        res.sendStatus(404);
        return;
    }
    res.send(JSON.stringify(user[0].Role));
});

router.post('/login',
    passport.authenticate('local'),
    function (req, res: Response) {

        const token = tokgen.generate();
        if (TokenService.TokenExists(req.body.email, req.cookies.login)) {
            TokenService.UpdateToken(req.body.email, req.cookies.login);
            res.sendStatus(200);
            return;
        }
        TokenService.RemoveToken(req.body.email);
        TokenService.InsertOne(req.body.email, token);
        res.cookie('login', token, { path: '/', httpOnly: true, maxAge: 3600000 });
        res.sendStatus(200);
    }
);

router.get('/accounts', (req: Request, res: Response) => {
    res.send(JSON.stringify(UserService.GetAll()));
});

export default router;