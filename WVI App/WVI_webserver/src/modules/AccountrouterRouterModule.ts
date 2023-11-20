import express, { Request, Response } from 'express';
import { Router } from 'express-serve-static-core';
import { TokenService } from '../services/TokenService';
import { UserService } from '../services/UserService';
import bcrypt from "bcrypt";

const Accountrouter: Router = express.Router();

Accountrouter.get('/role', (req: Request, res: Response) => {
    const results: any = TokenService.GetEmail(req.cookies.login);
    if (results == false) {
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

Accountrouter.get('/accounts', (req: Request, res: Response) => {
    res.send(JSON.stringify(UserService.GetAll()));
});

Accountrouter.delete('/removeAccount', (req: Request, res: Response) => {
    const result = UserService.RemoveOne(req.body.email);
    if (result == false) {
        res.sendStatus(500);
        return;
    }
    res.sendStatus(200);
});

Accountrouter.post('/removeOnderhoudsaannemer', (req: Request, res: Response) => {
    const result = UserService.UpdateOnderhoudsaannemer(req.body.onderhoudsaannemer, req.body.email);
    if (result == false) {
        res.sendStatus(500);
        return;
    }
    res.sendStatus(200);
});

Accountrouter.get('/listRoles', (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(UserService.ListRoles()));
});

Accountrouter.post('/updateRole', (req: Request, res: Response) => {
    const result = UserService.UpdateRole(req.body.role, req.body.email);
    if (result == false) {
        res.sendStatus(500);
        return;
    }
    res.sendStatus(200);
});

Accountrouter.get('/listOnderhoudsaannemers', (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(UserService.ListOnderhoudsaannemers()));
});

Accountrouter.post('/getaannemer', (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(UserService.GetAannemerOnContractgebiednummer(req.body.contractgebiednummer)));
});

Accountrouter.put('/addaccount', (req: Request, res: Response) => {
    let data = req.body.data;
    data[1] = bcrypt.hashSync(data[1], 10);
    const result = UserService.AddAccount(req.body.data);
    if (result == false) {
        res.sendStatus(500);
        return;
    }
    res.sendStatus(200);
});

export default Accountrouter;