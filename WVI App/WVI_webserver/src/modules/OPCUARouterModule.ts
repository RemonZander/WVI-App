import express, { Request, Response } from "express";
import { Router } from "express-serve-static-core";
import { UserService } from "../services/UserService";
import OPCUAclient from "./OPCUA_client";
import { TokenService } from "../services/TokenService";
import { WVIService } from "../services/WVIService";
import { createEnforcer } from "../services/CasbinService";

const OPCUARouter: Router = express.Router();

const _OPCUAclient = new OPCUAclient();

OPCUARouter.post('/OPCUA/statusCert', async (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/json');

    _OPCUAclient.GetStatus(req, res);
});

OPCUARouter.post('/OPCUA/status',async (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/json');
    const enforcer = await createEnforcer();
    const email = TokenService.GetEmail(req.cookies["login"])[0];
    if (email == null)
    {
        res.sendStatus(500);
        return;
    }
    const user = UserService.GetOneByEmailAllColumns(email.Email)[0];
    let contractgebiednummers: any = UserService.GetContractgebiednummers(user.Onderhoudsaannemer);
    contractgebiednummers = contractgebiednummers.map(a => a.Contractgebiednummer);
    if (!contractgebiednummers) {
        res.sendStatus(500);
        return;
    }     
    else if (!user)
    {
        res.sendStatus(500);
        return;
    }
    else if (await enforcer.enforce(user.Email, "*") || await enforcer.enforce(user.Email, "wvi.all.list"))
    {
        _OPCUAclient.GetStatus(req, res);
        return;
    }
    else if (contractgebiednummers.includes(req.body.wvi.Contractgebiednummer) && await enforcer.enforce(user.Email, "wvi.own.status"))
    {
        
        _OPCUAclient.GetStatus(req, res);
        return;
    }
    else if (!contractgebiednummers.includes(req.body.wvi.Contractgebiednummer) && await enforcer.enforce(user.Email, `wvi.unique.${req.body.wvi.PMP_enkelvoudige_objectnaam}.status`))
    {
        _OPCUAclient.GetStatus(req, res);
        return;
    }
    res.sendStatus(401);
});

OPCUARouter.post('/OPCUA/data', async (req: Request, res: Response) => {
    const enforcer = await createEnforcer();
    const email = TokenService.GetEmail(req.cookies["login"])[0];
    if (email == null)
    {
        res.sendStatus(500);
        return;
    }
    const user = UserService.GetOneByEmailAllColumns(email.Email)[0];
    const wvi = WVIService.GetWVIByName(req.body.PMP_enkelvoudige_objectnaam)[0];
    let contractgebiednummers: any = UserService.GetContractgebiednummers(user.Onderhoudsaannemer);
    contractgebiednummers = contractgebiednummers.map(a => a.Contractgebiednummer);
    if (!contractgebiednummers) {
        res.sendStatus(500);
        return;
    }
    else if (!user || user == undefined) {
        res.sendStatus(500);
        return;
    }
    else if (await enforcer.enforce(user.Email, "*") || await enforcer.enforce(user.Email, "wvi.all.list"))
    {
        _OPCUAclient.GetData(req, res);
        return;
    }
    else if (contractgebiednummers.includes(wvi.Contractgebiednummer) && await enforcer.enforce(user.Email, "wvi.own.info"))
    {
        _OPCUAclient.GetData(req, res);
        return;
    }
    else if (!contractgebiednummers.includes(wvi.Contractgebiednummer) && await enforcer.enforce(user.Email, `wvi.unique.${wvi.PMP_enkelvoudige_objectnaam}.info`))
    {
        _OPCUAclient.GetData(req, res);
        return;
    }
    res.sendStatus(401);
});

OPCUARouter.post('/OPCUA/isonline', (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'text/html');

    _OPCUAclient.IsOnline(req, res);
});

OPCUARouter.put('/OPCUA/write', async (req: Request, res: Response) => {
    const enforcer = await createEnforcer();
    const email = TokenService.GetEmail(req.cookies["login"])[0];
    if (email == null)
    {
        res.sendStatus(500);
        return;
    }
    const user = UserService.GetOneByEmailAllColumns(email.Email)[0];
    const wvi = WVIService.GetWVIByName(req.body.PMP_enkelvoudige_objectnaam)[0];
    let contractgebiednummers: any = UserService.GetContractgebiednummers(user.Onderhoudsaannemer);
    contractgebiednummers = contractgebiednummers.map(a => a.Contractgebiednummer);

    if (!contractgebiednummers) {
        res.sendStatus(500);
        return;
    }
    else if (!user || user == undefined) {
        res.sendStatus(500);
        return;
    }
    else if (contractgebiednummers.includes(wvi.Contractgebiednummer) && await enforcer.enforce(user.Email, "wvi.own.operate")) {
        _OPCUAclient.WriteToWVI(req, res);
        return;
    }
    else if (!contractgebiednummers.includes(wvi.Contractgebiednummer) && await enforcer.enforce(user.Email, `wvi.unique.${wvi.PMP_enkelvoudige_objectnaam}.operate`)) {
        _OPCUAclient.WriteToWVI(req, res);
        return;
    }
    res.sendStatus(401);
});

export default OPCUARouter;