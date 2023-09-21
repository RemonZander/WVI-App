import { Request, Response } from "express";
import { Session } from "inspector";
import { AttributeIds, BrowseResult, ClientSession, DataType, DataValue, OPCUAClient, ReferenceDescription, StatusCodes, TimestampsToReturn, UserTokenType } from "node-opcua-client";

export default class OPCUAclient {

    async Connect(req: Request, res: Response, next) {
        let client: OPCUAClient;
        let session: ClientSession;
        const endpoint = "opc.tcp://localhost:53530/OPCUA/SimulationServer";
        const nodeId = "ns=3;s=test3";
        res.setHeader('Content-Type', 'text/html');
        res.write("starting OPCUA connection...\n");

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

            res.write("connected!\n");
            
            const browseResult: BrowseResult = await session.browse("RootFolder") as BrowseResult;

            console.log(browseResult.references.map((r: ReferenceDescription) => r.browseName.toString()).join("\n"));

            const dataValue = await session.read({ nodeId, attributeId: AttributeIds.Value });

            if (dataValue.statusCode !== StatusCodes.Good) {
                console.log("Could not read ", nodeId);
            }
            console.log(` value = ${dataValue.value.toString()}`);

            const subscription = await session.createSubscription2({
                requestedPublishingInterval: 1000,
                requestedLifetimeCount: 100,
                requestedMaxKeepAliveCount: 20,
                maxNotificationsPerPublish: 10,
                publishingEnabled: true,
                priority: 10
            });

            subscription
                .on("started", () => console.log("subscription started - subscriptionId=", subscription.subscriptionId))
                .on("keepalive", () => console.log("keepalive"))
                .on("terminated", () => console.log("subscription terminated"));

            const monitoredItem = await subscription.monitor({
                nodeId,
                attributeId: AttributeIds.Value
            },
                {
                    samplingInterval: 100,
                    discardOldest: true,
                    queueSize: 10
                }, TimestampsToReturn.Both);


            monitoredItem.on("changed", (dataValue: DataValue) => {
                console.log(` value = ${dataValue.value.value.toString()}`),
                    res.write(` value = ${dataValue.value.value.toString()}\n`)
            });

            await new Promise((resolve) => setTimeout(resolve, 10000));
            await subscription.terminate();

            res.write("done!\n");
            res.end();
        }
        catch (err) {
            res.write(`Error !!! ${err}\n`);
            res.end();
            console.log("Error !!!", err);
            session.close();
            client.disconnect();
        }
    }

    async GetStatus(req: Request, res: Response) {
        let client: OPCUAClient;
        let session: ClientSession;
        const endpoint = "opc.tcp://localhost:53530/OPCUA/SimulationServer";
        const nodeId = "ns=3;s=GK-MRB-01.cmdOperationMode";
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
        const nodeId = "ns=3;s=GK-MRB-01.cmdOperationMode";
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
}