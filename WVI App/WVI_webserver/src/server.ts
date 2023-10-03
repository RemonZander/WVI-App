import express, { Express, Request, Response } from 'express';
import { AddressInfo } from "net";
import OPCUAclient from './modules/OPCUA_client';
import cors from "cors";
import router from './modules/routerModule';

//var router = require('./modules/router');

const bodyParser = require('body-parser');

const _OPCUAclient = new OPCUAclient();

const app: Express = express();

app.use(cors({
    origin: "*"
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('port', process.env.PORT || 3000);
app.use(router);
    
const server = app.listen(app.get('port'), function () {
    console.log(`Express server listening on port ${(server.address() as AddressInfo).port}`);
});