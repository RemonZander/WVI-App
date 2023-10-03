import { Request, Response } from 'express';
import { Router } from 'express-serve-static-core';
import OPCUAclient from './OPCUA_client';
import { UserService } from '../services/UserService';
var router: Router = require('express').Router();


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

router.post('/login', (req: Request, res: Response) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    const result = UserService.GetOneByEmailAndPassword(req.body.email, req.body.password);

    if (result.length > 0) {
        res.sendStatus(200);
    }
    res.sendStatus(401);
});

export default router;