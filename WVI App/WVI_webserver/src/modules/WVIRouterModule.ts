import express, { Request, Response } from 'express';
import { Router } from 'express-serve-static-core';
import { createEnforcer } from '../services/CasbinService';
import { TokenService } from '../services/TokenService';
import { UserService } from '../services/UserService';
import { WVIService } from '../services/WVIService';

const WVIRouter: Router = express.Router();

WVIRouter.put('/addwvi', async (req: Request, res: Response) => {
    const aannemerdata: any = UserService.GetAannemerOnContractgebiednummer(req.body.data[4]);
    const email = TokenService.GetEmail(req.cookies["login"])[0];
    const enforcer = await createEnforcer();
    if (!aannemerdata || email == null) {
        res.sendStatus(500);
        return;
    }
    else if (!await enforcer.enforce(email.Email, "*") && !await enforcer.enforce(email.Email, "wvi.add")) {
        res.sendStatus(401);
        return;
    }

    if (aannemerdata.length === 0) {
        const result = UserService.AddAannemer(req.body.data[4], req.body.data[11]);
        if (result === false) {
            res.sendStatus(500);
            return;
        }
    }
    else if (aannemerdata[0].Onderhoudsaannemer !== req.body.data[11]) {
        res.sendStatus(409);
        return;
    }
    const result = WVIService.AddWVI(req.body.data.splice(0, 11));
    if (result === false) {
        res.sendStatus(500);
        return;
    }
    res.sendStatus(200);
});

WVIRouter.post('/updatewvi', async (req: Request, res: Response) => {
    const email = TokenService.GetEmail(req.cookies["login"])[0];
    const enforcer = await createEnforcer();
    if (email == null)
    { 
        res.sendStatus(500);
        return;
    }
    else if (!await enforcer.enforce(email.Email, "*") && !await enforcer.enforce(email.Email, "wvi.update")) {
        res.sendStatus(401);
        return;
    }
    const result = WVIService.UpdateWVI(req.body.data.splice(0, 12));
    if (!result) {
        res.sendStatus(500);
    }

    res.sendStatus(200);
});

WVIRouter.delete('/removewvi', async (req: Request, res: Response) => {
    const email = TokenService.GetEmail(req.cookies["login"])[0];
    const enforcer = await createEnforcer();
    if (email == null)
    {
        res.sendStatus(500);
        return;
    }
    else if (!await enforcer.enforce(email.Email, "*") && !await enforcer.enforce(email.Email, "wvi.remove")) {
        res.sendStatus(401);
        return;
    }
    const result = WVIService.RemoveWVI(req.body.name);
    if (!result) {
        res.sendStatus(500);
        return;
    }

    res.sendStatus(200);
});

WVIRouter.get('/getWVIs', async (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/json');
    const email = TokenService.GetEmail(req.cookies["login"])[0];
    if (email == null)
    {
        res.sendStatus(500);
        return;
    }
    const user = UserService.GetOneByEmailAllColumns(email.Email)[0];
    const enforcer = await createEnforcer();
    const WVIs = [];
    const allWVIs: any = WVIService.GetAll();
    if (!allWVIs) {
        res.sendStatus(500);
        return;
    }
    else if (!user || user == undefined) {
        res.sendStatus(500);
        return;
    }
    else if (await enforcer.enforce(user.Email, "*") || await enforcer.enforce(user.Email, "wvi.all.list")) {
        res.send(JSON.stringify(allWVIs));
        return;
    }
    else if (await enforcer.enforce(user.Email, "wvi.own.list")) {
        const contractgebiednummers: any = UserService.GetContractgebiednummers(user.Onderhoudsaannemer);
        if (contractgebiednummers == false) {
            res.sendStatus(500);
            return;
        }
        for (var a = 0; a < contractgebiednummers.length; a++) {
            WVIs.push(...WVIService.GetWVIs(contractgebiednummers[a].Contractgebiednummer));
        }
    }

    for (var b = 0; b < allWVIs.length; b++) {
        if (await enforcer.enforce(user.Email, `wvi.unique.${allWVIs[b].PMP_enkelvoudige_objectnaam}.list`)) {
            WVIs.push(allWVIs[b]);
        }
    }

    res.json(WVIs);
});


export default WVIRouter;