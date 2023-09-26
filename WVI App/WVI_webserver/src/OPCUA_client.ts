import { Request, Response } from "express";
import { Session } from "inspector";
import { AttributeIds, BrowseResult, ClientSession, DataType, DataValue, OPCUAClient, ReferenceDescription, StatusCodes, TimestampsToReturn, UserTokenType } from "node-opcua-client";
import { Interface } from "readline";

export default class OPCUAclient {

    async Connect(req: Request, res: Response) {
        let client: OPCUAClient;
        let session: ClientSession;
        const endpoint = "opc.tcp://localhost:53530/OPCUA/SimulationServer";
        const nodeId = "ns=3;s=test3";
        res.setHeader('Content-Type', 'text/html');

        try {
            client = OPCUAClient.create({
                endpointMustExist: false,
                connectionStrategy: {
                    maxRetry: 2,
                    initialDelay: 2000,
                    maxDelay: 10 * 1000
                },
            });
            client.on("backoff", () => console.log("retrying connection"));

            await client.connect(endpoint);

            session = await client.createSession({
                type: UserTokenType.UserName,
                userName: "admin",
                password: "admin",
            });

            await this.RecursiveBrowse(await session.browse("ns=7;s=GK-MRB-01") as BrowseResult, session).then((results) => {
                results.forEach((result) => {
                    res.write(result.NodeId + "\n");
                });

            });
        }
        catch (err) {
            res.write(`Error !!! ${err}\n`);
            res.end();
            console.log("Error !!!", err);
        }
        res.end();
        session.close();
        client.disconnect();
    }

    private async RecursiveBrowse(browseResult: BrowseResult, session: ClientSession) {
        let result = [];

        for (var a = 0; a < browseResult.references.length; a++) {
            result.push({ browseName: browseResult.references[a].browseName.toString(), NodeId: browseResult.references[a].nodeId.toString() });

            const browseResultNested = await session.browse(browseResult.references[a].nodeId.toString()) as BrowseResult;

            await this.RecursiveBrowse(browseResultNested, session).then((data) => {
                console.log(result);
                result = result.concat(data);
            });
        }

        return result;
    }

    async GetStatus(req: Request, res: Response) {
        let client: OPCUAClient;
        let session: ClientSession;
        const endpoint = "opc.tcp://localhost:53530/OPCUA/SimulationServer";
        const nodeId = "ns=7;s=GK-MRB-01.cmdOperationMode";
        res.setHeader('Content-Type', 'text/html');
        res.setHeader('Access-Control-Allow-Origin', '*');

        try {
            client = OPCUAClient.create({
                endpointMustExist: false,
                connectionStrategy: {
                    maxRetry: 2,
                    initialDelay: 2000,
                    maxDelay: 10 * 1000
                },
            });
            client.on("backoff", () => console.log("retrying connection"));


            await client.connect(endpoint);

            session = await client.createSession({
                type: UserTokenType.UserName,
                userName: "admin",
                password: "admin",
            });

            let dataValue = await session.read({ nodeId, attributeId: AttributeIds.Value });

            if (dataValue.statusCode !== StatusCodes.Good) {
                console.log("Could not read ", nodeId);
            }

            res.send(JSON.stringify(dataValue.value.value.toString()));
        }
        catch (err)
        {
            res.send(JSON.stringify(`Error: ${err}`));
        }
        client.disconnect();
    }

    async ChangeOptMode(req: Request, res: Response) {
        let client: OPCUAClient;
        let session: ClientSession;

        const endpoint = "opc.tcp://localhost:53530/OPCUA/SimulationServer";
        const nodeId = "ns=7;s=GK-MRB-01.cmdOperationMode";
        res.setHeader('Content-Type', 'text/html');

        try {
            client = OPCUAClient.create({
                endpointMustExist: false,
                connectionStrategy: {
                    maxRetry: 2,
                    initialDelay: 2000,
                    maxDelay: 10 * 1000
                },
            });
            client.on("backoff", () => console.log("retrying connection"));


            await client.connect(endpoint);

            session = await client.createSession({
                type: UserTokenType.UserName,
                userName: "admin",
                password: "admin",
            });

            var nodeToWrite = {
                nodeId: nodeId,
                attributeId: AttributeIds.Value,
                indexRange: null,
                value: {
                    value: {
                        dataType: DataType.Int16,
                        value: req.body.mode
                    }
                }
            };

            session.write(nodeToWrite);

            res.sendStatus(200);

        }
        catch (err) {
            res.send(`Error: ${err}`);
        }
        client.disconnect();
    }

    async GetData(req: Request, res: Response) {
        let client: OPCUAClient;
        let session: ClientSession;
        const endpoint = "opc.tcp://localhost:53530/OPCUA/SimulationServer";
        const nodeId = "ns=3;s=test3";
        res.setHeader('Content-Type', 'text/html');

        try {
            client = OPCUAClient.create({
                endpointMustExist: false,
                connectionStrategy: {
                    maxRetry: 2,
                    initialDelay: 2000,
                    maxDelay: 10 * 1000
                },
            });
            client.on("backoff", () => console.log("retrying connection"));


            await client.connect(endpoint);

            session = await client.createSession({
                type: UserTokenType.UserName,
                userName: "admin",
                password: "admin",
            });

            this.ReadData(session, ["ns=7;s=GK-MRB-01.BatteryVoltage"]).then((data) => console.log(data));

        }
        catch (err) {
            res.send(JSON.stringify(`Error: ${err}`));
        }
        client.disconnect();

    }

    private async ReadData(session: ClientSession, nodes) {
        let dataValues = [];
        for (var a = 0; a < nodes.length; a++) {
            const nodeId = nodes[a];
            await session.read({ nodeId, attributeId: AttributeIds.Value }).then((data) => {
                dataValues.push(data.value.value);
            });
        }

        return dataValues;
    }
}