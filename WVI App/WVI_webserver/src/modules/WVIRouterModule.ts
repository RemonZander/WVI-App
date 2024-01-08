import express, { Request, Response } from 'express';
import { Router } from 'express-serve-static-core';
import AuthenticationDecorator from '../decorators/authenticationDecorator';
import { createEnforcer } from '../services/CasbinService';
import { TokenService } from '../services/TokenService';
import { UserService } from '../services/UserService';
import { WVIService } from '../services/WVIService';

class WVIRouter {
    router: Router;
    constructor() {
        this.router = express.Router();
        this.initializeRoutes();
    }

    initializeRoutes() {
        this.router.put('/addwvi', this.AddWVI);
        this.router.post('/updatewvi', this.UpdateWVI);
        this.router.delete('/removewvi', this.RemoveWVI);
        this.router.get('/getWVIs', this.GetWVIs);
    }

    getRouter() {
        return this.router;
    }

    @AuthenticationDecorator("wvi.add")
    async AddWVI(req: Request, res: Response) {
        const result = WVIService.AddWVI(req.body.data.splice(0, 12));
        if (!result) {
            res.sendStatus(500);
            return;
        }
        res.sendStatus(200);
    }

    @AuthenticationDecorator("wvi.update")
    async UpdateWVI(req: Request, res: Response) {
        const result = WVIService.UpdateWVI(req.body.data.splice(0, 13));
        if (!result) {
            res.sendStatus(500);
        }

        res.sendStatus(200);
    }

    @AuthenticationDecorator("wvi.remove")
    async RemoveWVI(req: Request, res: Response) {
        const result = WVIService.RemoveWVI(req.body.name);
        if (!result) {
            res.sendStatus(500);
            return;
        }

        res.sendStatus(200);
    }

    async GetWVIs(req: Request, res: Response) {
        res.setHeader('Content-Type', 'application/json');
        const email = TokenService.GetEmail(req.cookies["login"])[0];
        if (!email) {
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
    }
}

export default new WVIRouter().getRouter();