import express, { Express, Request, Response } from 'express';
import { AddressInfo } from "net";
import OPCUAclient from './modules/OPCUA_client';
import cors from "cors";
import { WVIService } from './services/WVIService';
import { request } from 'http';

const bodyParser = require('body-parser');

const _OPCUAclient = new OPCUAclient();

const app: Express = express();

app.use(cors({
    origin: "*"
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('port', process.env.PORT || 3000);

app.post('/OPCUA/status', (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');

    _OPCUAclient.GetStatus(req, res);
});

app.post('/OPCUA/data', (req: Request, res: Response) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    _OPCUAclient.GetData(req, res);
});

app.get('/OPCUA/isonline', (req: Request, res: Response) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Access-Control-Allow-Origin', '*');
    _OPCUAclient.IsOnline(req, res);
});

app.put('/OPCUA/write', (req: Request, res: Response) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    _OPCUAclient.WriteToWVI(req, res);
});
    
const server = app.listen(app.get('port'), function () {
    console.log(`Express server listening on port ${(server.address() as AddressInfo).port}`);
});