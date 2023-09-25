import express, { Express, Request, Response } from 'express';
import { AddressInfo } from "net";
import OPCUAclient from './OPCUA_client';
import cors from "cors";
import { WVIService } from './services/WVIService';

const bodyParser = require('body-parser');

const _OPCUAclient = new OPCUAclient();

const app: Express = express();

app.use(cors({
    origin: "*"
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('port', process.env.PORT || 3000);

app.post('/OPCUA/changeopt', (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');
    _OPCUAclient.ChangeOptMode(req, res);
});

app.get('/OPCUA/status', (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');

    _OPCUAclient.GetStatus(req, res);
});

app.all('/test', (req: Request, res: Response) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
});

app.get('/OPCUA/test', (req: Request, res: Response) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    _OPCUAclient.Connect(req, res);
});

const server = app.listen(app.get('port'), function () {
    console.log(`Express server listening on port ${(server.address() as AddressInfo).port}`);
});