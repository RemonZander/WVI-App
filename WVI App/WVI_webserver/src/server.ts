import express, { Express, Request, Response } from 'express';
import { AddressInfo } from "net";
import OPCUAclient from './OPCUA_client';
import cors from "cors";

const bodyParser = require('body-parser');

const _OPCUAclient = new OPCUAclient();

const app: Express = express();

app.use(cors({
    origin: "*"
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/OPCUA/connect', _OPCUAclient.Connect);
app.use('/OPCUA/status', _OPCUAclient.GetStatus);
app.set('port', process.env.PORT || 3000);

app.post('/OPCUA/changeopt', (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');
    _OPCUAclient.ChangeOptMode(req, res);
});

app.use('/OPCUA/GetData', (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    _OPCUAclient.GetData(req, res);
});

const server = app.listen(app.get('port'), function () {
    console.log(`Express server listening on port ${(server.address() as AddressInfo).port}`);
});