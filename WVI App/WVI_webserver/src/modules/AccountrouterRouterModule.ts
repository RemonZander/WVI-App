import express, { Request, Response } from 'express';
import { Router } from 'express-serve-static-core';
import { TokenService } from '../services/TokenService';
import { UserService } from '../services/UserService';
import bcrypt from "bcrypt";
import AuthenticationDecorator from '../decorators/authenticationDecorator';

class AccountRouter {
    router: Router;
    constructor() {
        this.router = express.Router();
        this.initializeRoutes();
    }

    initializeRoutes() {
        this.router.get('/email', this.GetEmail);
        this.router.get('/accounts', this.GetAccounts);
        this.router.delete('/removeAccount', this.RemoveAccount);
        this.router.post('/removeOnderhoudsaannemer', this.RemoveOnderhoudsaannemer);
        this.router.get('/listRoles', this.ListRoles);
        this.router.get('/getRolesAndPermissions', this.GetRolesAndPermissions);
        this.router.post('/UpdateRoleInAccount', this.UpdateRoleInAccount);
        this.router.delete('/removeRole', this.RemoveRole);
        this.router.put('/addRole', this.AddRole);
        this.router.put('/updateRole', this.UpdateRole);
        this.router.get('/listOnderhoudsaannemersunique', this.ListOnderhoudsaannemersUnique);
        this.router.get('/listOnderhoudsaannemers', this.ListOnderhoudsaannemers);
        this.router.put('/addaccount', this.AddAccount);
        this.router.delete('/removecontractgebied', this.RemoveContractgebied);
        this.router.put('/updatecontractgebied', this.UpdateContractgebied);
        this.router.put('/addcontractgebied', this.AddContractgebied);
        this.router.get('/ownrole', this.GetOwnRole);
    }

    getRouter() {
        return this.router;
    }

    async GetEmail(req: Request, res: Response) {
        try {
            res.send(JSON.stringify(TokenService.GetEmail(req.cookies["login"])[0].Email));
        } catch (e) {
            res.sendStatus(500);
        }   
    }

    @AuthenticationDecorator("account.list")
    async GetAccounts(req: Request, res: Response) {
        res.json(UserService.GetAll());
    }

    @AuthenticationDecorator("account.remove")
    async RemoveAccount(req: Request, res: Response) {
        const email = TokenService.GetEmail(req.cookies["login"])[0].Email;
        if (req.body.email === email || req.body.email === "beheer@prorail.nl") {
            res.sendStatus(403);
            return;
        }
        const result = UserService.RemoveOne(req.body.email);
        if (!result) {
            res.sendStatus(500);
            return;
        }
        res.sendStatus(200);
    }

    @AuthenticationDecorator("account.update")
    async RemoveOnderhoudsaannemer(req: Request, res: Response) {
        const email = TokenService.GetEmail(req.cookies["login"])[0].Email;
        if (req.body.email === email || req.body.email === "beheer@prorail.nl") {
            res.sendStatus(403);
            return;
        }
        const result = UserService.UpdateOnderhoudsaannemer(req.body.onderhoudsaannemer, req.body.email);
        if (!result) {
            res.sendStatus(500);
            return;
        }
        res.sendStatus(200);
    }

    @AuthenticationDecorator("roles.list")
    async ListRoles(req: Request, res: Response) {
        res.setHeader('Content-Type', 'application/json');
        res.json(UserService.ListRoles());
    }

    @AuthenticationDecorator("roles.list")
    async GetRolesAndPermissions(req: Request, res: Response) {
        res.setHeader('Content-Type', 'application/json');
        res.json(UserService.GetRolesAndPermissions());
    }

    @AuthenticationDecorator("account.update")
    async UpdateRoleInAccount(req: Request, res: Response) {
        const email = TokenService.GetEmail(req.cookies["login"])[0].Email;
        if (req.body.email === email || req.body.email === "beheer@prorail.nl") {
            res.sendStatus(403);
            return;
        }
        const result = UserService.UpdateRoleInAccount(req.body.role, req.body.email);
        if (!result) {
            res.sendStatus(500);
            return;
        }
        res.sendStatus(200);
    }

    @AuthenticationDecorator("roles.remove")
    async RemoveRole(req: Request, res: Response) {
        const result = UserService.RemoveRole(req.body.role);
        if (!result) {
            res.sendStatus(403);
            return;
        }
        res.sendStatus(200);
    }

    @AuthenticationDecorator("roles.add")
    async AddRole(req: Request, res: Response) {
        const result = UserService.AddRole(req.body.role, req.body.permissions);
        if (!result) {
            res.sendStatus(500);
            return;
        }
        res.sendStatus(200);
    }

    @AuthenticationDecorator("roles.update")
    async UpdateRole(req: Request, res: Response) {
        const result = UserService.UpdateRole(req.body.role, req.body.permissions);
        if (!result) {
            res.sendStatus(500);
            return;
        }
        res.sendStatus(200);
    }

    async GetOwnRole(req: Request, res: Response) {
        res.setHeader('Content-Type', 'application/json');
        res.json(UserService.GetOne("Role", "Email", TokenService.GetEmail(req.cookies["login"])[0].Email)[0].Role);
    }

    @AuthenticationDecorator("onderhoudsaannemers.list")
    async ListOnderhoudsaannemersUnique(req: Request, res: Response) {
        res.setHeader('Content-Type', 'application/json');
        res.json(UserService.ListOnderhoudsaannemersUnique());
    }

    @AuthenticationDecorator("onderhoudsaannemers.list")
    async ListOnderhoudsaannemers(req: Request, res: Response) {
        res.setHeader('Content-Type', 'application/json');
        res.json(UserService.ListOnderhoudsaannemers());
    }

    @AuthenticationDecorator("accound.add")
    async AddAccount(req: Request, res: Response) {
        let data = req.body.data;
        data[1] = bcrypt.hashSync(data[1], 10);
        const result = UserService.AddAccount(req.body.data);
        if (!result) {
            res.sendStatus(500);
            return;
        }
        res.sendStatus(200);
    }

    @AuthenticationDecorator("onderhoudsaannemers.remove")
    async RemoveContractgebied(req: Request, res: Response) {
        const result = UserService.RemoveContractgebied(req.body.contractgebiednummer);
        if (!result) {
            res.sendStatus(500);
            return;
        }
        res.sendStatus(200);
    }

    @AuthenticationDecorator("onderhoudsaannemers.update")
    async UpdateContractgebied(req: Request, res: Response) {
        const result = UserService.UpdateContractgebied(req.body.onderhoudsaannemer, req.body.contractgebiednummer);
        if (!result) {
            res.sendStatus(500);
            return;
        }
        res.sendStatus(200);
    } 
    
    @AuthenticationDecorator("onderhoudsaannemers.add")
    async AddContractgebied(req: Request, res: Response) {
        const result = UserService.AddContractgebied(req.body.onderhoudsaannemer, req.body.contractgebiednummer);
        if (!result) {
            res.sendStatus(500);
            return;
        }
        res.sendStatus(200);
    }
}

export default new AccountRouter().getRouter();