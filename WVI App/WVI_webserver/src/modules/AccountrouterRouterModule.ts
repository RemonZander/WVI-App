import express, { Request, Response } from 'express';
import { Router } from 'express-serve-static-core';
import { TokenService } from '../services/TokenService';
import { UserService } from '../services/UserService';
import bcrypt from "bcrypt";
import { createEnforcer } from '../services/CasbinService';
import { userInfo } from 'os';

const Accountrouter: Router = express.Router();

Accountrouter.get('/role', (req: Request, res: Response) => {
    const results: any = TokenService.GetEmail(req.cookies.login);
    if (!results) {
        res.sendStatus(500);
        return;
    }
    else if (results.length === 0) {
        res.sendStatus(401);
        return;
    }
    const user: any = UserService.GetOneByEmailSelectColumns(`"Role"`, results[0].Email);
    if (user == false) {
        res.sendStatus(500);
        return;
    }
    if (user.length === 0) {
        res.sendStatus(404);
        return;
    }
    res.send(JSON.stringify({ role: user[0].Role, email: results[0].Email }));
});

Accountrouter.get('/accounts', async (req: Request, res: Response) => {
    const email = TokenService.GetEmail(req.cookies["login"])[0];
    const enforcer = await createEnforcer();
    if (email == null)
    {
        res.sendStatus(500);
        return;
    }
    else if (!await enforcer.enforce(email.Email, "*") && !await enforcer.enforce(email.Email, "account.list")) {
        res.sendStatus(401);
        return;
    }
    res.send(JSON.stringify(UserService.GetAll()));
});

Accountrouter.delete('/removeAccount', async (req: Request, res: Response) => {
    const email = TokenService.GetEmail(req.cookies["login"])[0];
    const enforcer = await createEnforcer();
    if (email == null)
    {
        res.sendStatus(500);
        return;
    }
    else if (!await enforcer.enforce(email.Email, "*") && !await enforcer.enforce(email.Email, "account.remove")) {
        res.sendStatus(401);
        return;
    }

    const result = UserService.RemoveOne(req.body.email);
    if (!result) {
        res.sendStatus(500);
        return;
    }
    res.sendStatus(200);
});

Accountrouter.post('/removeOnderhoudsaannemer', async (req: Request, res: Response) => {
    const email = TokenService.GetEmail(req.cookies["login"])[0];
    const enforcer = await createEnforcer();
    if (email == null)
    {
        res.sendStatus(500);
        return;
    }
    else if (!await enforcer.enforce(email.Email, "*") && !await enforcer.enforce(email.Email, "account.update")) {
        res.sendStatus(401);
        return;
    }

    const result = UserService.UpdateOnderhoudsaannemer(req.body.onderhoudsaannemer, req.body.email);
    if (!result) {
        res.sendStatus(500);
        return;
    }
    res.sendStatus(200);
});

Accountrouter.get('/listRoles', async (req: Request, res: Response) => {
    const email = TokenService.GetEmail(req.cookies["login"])[0];
    const enforcer = await createEnforcer();
    if (email == null)
    {
        res.sendStatus(500);
        return;
    }
    else if (!await enforcer.enforce(email.Email, "*") && !await enforcer.enforce(email.Email, "roles.list")) {
        res.sendStatus(401);
        return;
    }

    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(UserService.ListRoles()));
});

Accountrouter.get('/getRolesAndPermissions', async (req: Request, res: Response) => {
    const email = TokenService.GetEmail(req.cookies["login"])[0];
    const enforcer = await createEnforcer();
    if (email == null) {
        res.sendStatus(500);
        return;
    }
    else if (!await enforcer.enforce(email.Email, "*") && !await enforcer.enforce(email.Email, "roles.list")) {
        res.sendStatus(401);
        return;
    }

    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(UserService.GetRolesAndPermissions()));
});

Accountrouter.post('/UpdateRoleInAccount', async (req: Request, res: Response) => {
    const email = TokenService.GetEmail(req.cookies["login"])[0];
    const enforcer = await createEnforcer();
    if (email == null)
    {
        res.sendStatus(500);
        return;
    }
    else if (!await enforcer.enforce(email.Email, "*") && !await enforcer.enforce(email.Email, "account.update")) {
        res.sendStatus(401);
        return;
    }

    const result = UserService.UpdateRoleInAccount(req.body.role, req.body.email);
    if (!result) {
        res.sendStatus(500);
        return;
    }
    res.sendStatus(200);
});

Accountrouter.delete('/removeRole', async (req: Request, res: Response) => {
    const email = TokenService.GetEmail(req.cookies["login"])[0];
    const enforcer = await createEnforcer();
    if (email == null) {
        res.sendStatus(500);
        return;
    }
    else if (!await enforcer.enforce(email.Email, "*") && !await enforcer.enforce(email.Email, "roles.remove")) {
        res.sendStatus(401);
        return;
    }

    const result = UserService.RemoveRole(req.body.role);
    if (!result) {
        res.sendStatus(403);
        return;
    }
    res.sendStatus(200);
});

Accountrouter.put('/addRole', async (req: Request, res: Response) => {
    const email = TokenService.GetEmail(req.cookies["login"])[0];
    const enforcer = await createEnforcer();
    if (email == null) {
        res.sendStatus(500);
        return;
    }
    else if (!await enforcer.enforce(email.Email, "*") && !await enforcer.enforce(email.Email, "roles.add")) {
        res.sendStatus(401);
        return;
    }


    const result = UserService.AddRole(req.body.role, req.body.permissions);
    if (!result) {
        res.sendStatus(500);
        return;
    }
    res.sendStatus(200);
});

Accountrouter.get('/listOnderhoudsaannemers', async (req: Request, res: Response) => {
    const email = TokenService.GetEmail(req.cookies["login"])[0];
    const enforcer = await createEnforcer();
    if (email == null) {
        res.sendStatus(500);
        return;
    }
    else if (!await enforcer.enforce(email.Email, "*") && !await enforcer.enforce(email.Email, "onderhoudsaannemers.list")) {
        res.sendStatus(401);
        return;
    }

    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(UserService.ListOnderhoudsaannemers()));
});

Accountrouter.post('/getaannemer', async (req: Request, res: Response) => {
    const email = TokenService.GetEmail(req.cookies["login"])[0];
    const enforcer = await createEnforcer();
    if (email == null) {
        res.sendStatus(500);
        return;
    }
    else if (!await enforcer.enforce(email.Email, "*") && !await enforcer.enforce(email.Email, "account.list")) {
        res.sendStatus(401);
        return;
    }

    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(UserService.GetAannemerOnContractgebiednummer(req.body.contractgebiednummer)));
});

Accountrouter.put('/addaccount', async (req: Request, res: Response) => {
    const email = TokenService.GetEmail(req.cookies["login"])[0];
    const enforcer = await createEnforcer();
    if (email == null) {
        res.sendStatus(500);
        return;
    }
    else if (!await enforcer.enforce(email.Email, "*") && !await enforcer.enforce(email.Email, "account.add")) {
        res.sendStatus(401);
        return;
    }

    let data = req.body.data;
    data[1] = bcrypt.hashSync(data[1], 10);
    const result = UserService.AddAccount(req.body.data);
    if (!result) {
        res.sendStatus(500);
        return;
    }
    res.sendStatus(200);
});

export default Accountrouter;