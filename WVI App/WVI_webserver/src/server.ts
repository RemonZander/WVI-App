import express, { Express, Request, Response } from 'express';
import { AddressInfo } from "net";
import OPCUAclient from './OPCUA_client';

const _OPCUAclient = new OPCUAclient();

const app: Express = express();

app.use('/OPCUA/connect', _OPCUAclient.Connect);
app.use('/OPCUA/status', _OPCUAclient.GetStatus);
app.use('/OPCUA/changeopt', _OPCUAclient.ChangeOptMode);
app.set('port', process.env.PORT || 3000);

app.get('/', (req: Request, res: Response) => {
    res.send("Route is working!");
})

const server = app.listen(app.get('port'), function () {
    console.log(`Express server listening on port ${(server.address() as AddressInfo).port}`);
});