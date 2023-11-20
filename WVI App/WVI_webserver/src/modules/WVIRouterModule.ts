import express, { Request, Response } from 'express';
import { Router } from 'express-serve-static-core';
import { LogLevel } from '../enums/loglevelEnum';
import { UserService } from '../services/UserService';
import { WVIService } from '../services/WVIService';
import Logger from './loggerModule';

const WVIRouter: Router = express.Router();

WVIRouter.put('/addwvi', (req: Request, res: Response) => {

    const aannemerdata: any = UserService.GetAannemerOnContractgebiednummer(req.body.data[4]);
    if (aannemerdata === false) {
        res.sendStatus(500);
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

WVIRouter.post('/updatewvi', (req: Request, res: Response) => {
/*    const aannemerdata: any = UserService.GetAannemerOnContractgebiednummer(req.body.data[4]);
    if (aannemerdata === false) {
        res.sendStatus(500);
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
    }*/

    const result = WVIService.UpdateWVI(req.body.data.splice(0, 12));
    if (!result)
    { 
        res.sendStatus(500);
        return;
    }

    res.sendStatus(200);
});

WVIRouter.delete('/removewvi', (req: Request, res: Response) => {
    const result = WVIService.RemoveWVI(req.body.name);
    if (!result) {
        res.sendStatus(500);
        return;
    }

    res.sendStatus(200);
});

export default WVIRouter;