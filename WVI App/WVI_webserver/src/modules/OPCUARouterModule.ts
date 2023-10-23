import express, { Request, Response } from "express";
import { Router } from "express-serve-static-core";
import OPCUAclient from "./OPCUA_client";


const OPCUARouter: Router = express.Router();

const _OPCUAclient = new OPCUAclient();

OPCUARouter.post('/OPCUA/status', (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');

    _OPCUAclient.GetStatus(req, res);
});

OPCUARouter.post('/OPCUA/data', (req: Request, res: Response) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    _OPCUAclient.GetData(req, res);
});

OPCUARouter.get('/OPCUA/isonline', (req: Request, res: Response) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Access-Control-Allow-Origin', '*');
    _OPCUAclient.IsOnline(req, res);
});

OPCUARouter.put('/OPCUA/write', (req: Request, res: Response) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    _OPCUAclient.WriteToWVI(req, res);
});

export default OPCUARouter;