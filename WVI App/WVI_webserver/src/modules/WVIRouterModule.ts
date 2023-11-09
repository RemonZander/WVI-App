import express, { Request, Response } from 'express';
import { Router } from 'express-serve-static-core';
import { WVIService } from '../services/WVIService';

const WVIRouter: Router = express.Router();

WVIRouter.put('/addwvi', (req: Request, res: Response) => {
    WVIService.AddWVI(req.body.data);
    res.send(200);
});

export default WVIRouter;