import express, { Request, Response } from "express";
import { Router } from "express-serve-static-core";
import { UserService } from "../services/UserService";
import OPCUAclient from "./OPCUA_client";
import { TokenService } from "../services/TokenService";
import { WVIService } from "../services/WVIService";


const OPCUARouter: Router = express.Router();

const _OPCUAclient = new OPCUAclient();

OPCUARouter.post('/OPCUA/status', (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/json');

    _OPCUAclient.GetStatus(req, res);
});

OPCUARouter.get('/getWVIs', (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/json');
    const user = UserService.GetOneByEmailAllColumns(TokenService.GetEmail(req.cookies["login"])[0].Email)[0];
    if (user == false) {
        res.sendStatus(500);
        return;
    }
    else if (user.Role === "beheerder") {
        res.send(JSON.stringify(WVIService.GetAll()));
        return;
    }
    const contractgebiednummers: any = UserService.GetContractgebiednummers(user.Onderhoudsaannemer);
    if (contractgebiednummers == false) {
        res.sendStatus(500);
        return;
    }
    const WVIs = [];
    for (var a = 0; a < contractgebiednummers.length; a++) {
        WVIs.push(...WVIService.GetWVIs(contractgebiednummers[a].Contractgebiednummer));
    }

    res.send(JSON.stringify(WVIs));
});

OPCUARouter.post('/OPCUA/data', (req: Request, res: Response) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    _OPCUAclient.GetData(req, res);
});

OPCUARouter.post('/OPCUA/isonline', (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'text/html');

    _OPCUAclient.IsOnline(req, res);
});

OPCUARouter.put('/OPCUA/write', (req: Request, res: Response) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    _OPCUAclient.WriteToWVI(req, res);
});

export default OPCUARouter;