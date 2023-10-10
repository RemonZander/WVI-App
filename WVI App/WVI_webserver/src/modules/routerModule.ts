import express, { Request, Response } from 'express';
import { Router } from 'express-serve-static-core';
import OPCUAclient from './OPCUA_client';
import { UserService } from '../services/UserService';
import bcrypt from "bcrypt";
import { IAccount } from '../interfaces/interfaces';
import passport from 'passport';

const LocalStrategy = require("passport-local");

const router: Router = express.Router();

const _OPCUAclient = new OPCUAclient();

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

/*router.post('/login', (req: Request, res: Response) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    const account: IAccount[] = UserService.GetOneByEmailAllColumns(req.body.email);
    if (account.length === 0) res.sendStatus(404);

    bcrypt.compare(req.body.password, account[0].Wachtwoord).then(async hashResult => {
        if (hashResult) res.sendStatus(200);
        else res.sendStatus(401);
        console.log(hashResult);
    }).catch(error => { throw error })
});*/

export default router;