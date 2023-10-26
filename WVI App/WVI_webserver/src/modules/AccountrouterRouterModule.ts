import express, { Request, Response } from 'express';
import { Router } from 'express-serve-static-core';
import { TokenService } from '../services/TokenService';
import { UserService } from '../services/UserService';

const Accountrouter: Router = express.Router();

Accountrouter.get('/role', (req: Request, res: Response) => {
    const results = TokenService.GetEmail(req.cookies.login);
    if (results.length === 0) {
        res.sendStatus(401);
        return;
    }
    const user = UserService.GetOneByEmailSelectColumns(`"Role"`, results[0].Email);
    if (user.length === 0) {
        res.sendStatus(404);
        return;
    }
    res.send(JSON.stringify(user[0].Role));
});

Accountrouter.get('/accounts', (req: Request, res: Response) => {
    res.send(JSON.stringify(UserService.GetAll()));
});

Accountrouter.delete('/removeAccount', (req: Request, res: Response) => {
    UserService.RemoveOne(req.body.email);
    res.sendStatus(200);
});

Accountrouter.post('/removeOnderhoudsaannemer', (req: Request, res: Response) => {
    UserService.UpdateOnderhoudsaannemer(req.body.onderhoudsaannemer, req.body.email);
    res.sendStatus(200);
});

Accountrouter.get('/listRoles', (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(UserService.ListRoles()));
});

Accountrouter.post('/updateRole', (req: Request, res: Response) => {
    UserService.UpdateRole(req.body.role, req.body.email);
    res.sendStatus(200);
});

Accountrouter.get('/listOnderhoudsaannemers', (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(UserService.ListOnderhoudsaannemers()));
});

export default Accountrouter;