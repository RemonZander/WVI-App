import { Request, Response } from "express";
import { AttributeIds, BrowseResult, ClientSession, DataType, DataValue, OPCUAClient, ReferenceDescription, StatusCodes, TimestampsToReturn, UserTokenType, DataTypeIds, FilterContextOnAddressSpace } from "node-opcua-client";
import { Datamodel } from '../enums/datamodel';
import { LogLevel } from "../enums/loglevelEnum";
import Logger from "./loggerModule";

export default class OPCUAclient {

    async IsOnline(req: Request, res: Response) {
        let client: OPCUAClient;
        let session: ClientSession;

        try {
            client = OPCUAClient.create({
                endpointMustExist: false,
                connectionStrategy: {
                    maxRetry: 2,
                    initialDelay: 2000,
                    maxDelay: 10 * 1000
                },
            });
            client.on("backoff", () => Logger("retrying connection", OPCUAclient.name, LogLevel.WARNING));
            await client.connect(req.body.endpoint);

            session = await client.createSession({
                type: UserTokenType.Anonymous
            });

        } catch (err) {
            Logger(err.stack, OPCUAclient.name, LogLevel.SERVERE);
            res.sendStatus(404);
            return;
        }
        session.close();
        client.disconnect();
        res.sendStatus(200);
    }

    async GetStatus(req: Request, res: Response) {
        let client: OPCUAClient;
        let session: ClientSession;
        const nodeId = req.body.nodeId;
        res.setHeader('Content-Type', 'text/html');

        Logger(nodeId, "OPC UA client", LogLevel.INFO);

        try {
            client = OPCUAClient.create({
                endpointMustExist: false,
                connectionStrategy: {
                    maxRetry: 2,
                    initialDelay: 2000,
                    maxDelay: 10 * 1000
                },
            });
            client.on("backoff", () => Logger("retrying connection", OPCUAclient.name, LogLevel.WARNING));

            await client.connect(req.body.endpoint);

            session = await client.createSession({
                type: UserTokenType.Anonymous
            });

            let dataValue = await session.read({ nodeId, attributeId: AttributeIds.Value });

            if (dataValue.statusCode !== StatusCodes.Good) {
                console.log("Could not read ", nodeId);
            }

            res.send(JSON.stringify(dataValue.value.value.toString()));
        }
        catch (err)
        {
            Logger(err.stack, OPCUAclient.name, LogLevel.SERVERE);
            res.send(JSON.stringify(`Error: ${err}`));
        }
        client.disconnect();
    }

    async GetData(req: Request, res: Response) {
        let client: OPCUAClient;
        let session: ClientSession;
        res.setHeader('Content-Type', 'application/json');

        try {
            client = OPCUAClient.create({
                endpointMustExist: false,
                connectionStrategy: {
                    maxRetry: 2,
                    initialDelay: 2000,
                    maxDelay: 10 * 1000
                },
            });
            client.on("backoff", () => Logger("retrying connection", OPCUAclient.name, LogLevel.WARNING));

            await client.connect(req.body.endpoint);

            session = await client.createSession({
                type: UserTokenType.Anonymous
            });

            let nodes = [];
            await this.RecursiveBrowse(await session.browse(req.body.nodeId) as BrowseResult, session).then((results) => {
                results.forEach((result) => {
                    if (result.NodeId.includes("ns=2") && !result.NodeId.includes("/0:Id")) {
                        nodes.push({ DisplayName: result.browseName, Nodes: result.NodeId, Data: "", dataType: result.dataType })
                    }                 
                });

            });

            await this.ReadData(session, nodes).then((data) => {
                for (var a = 0; a < data.length; a++) {
                    nodes[a].Data = data[a].data;
                }
            });

            res.send(JSON.stringify(nodes));
        }
        catch (err) {
            Logger(err.stack, OPCUAclient.name, LogLevel.SERVERE);
            res.sendStatus(404);
        }
        res.end();
        client.disconnect();

    }

    async WriteToWVI(req: Request, res: Response) {
        let client: OPCUAClient;
        let session: ClientSession;
        const nodes = req.body.nodes;

        try {
            client = OPCUAClient.create({
                endpointMustExist: false,
                connectionStrategy: {
                    maxRetry: 2,
                    initialDelay: 2000,
                    maxDelay: 10 * 1000
                },
            });
            client.on("backoff", () => Logger("retrying connection", OPCUAclient.name, LogLevel.WARNING));


            await client.connect(req.body.endpoint);

            session = await client.createSession({
                type: UserTokenType.Anonymous
            });

            for (var a = 0; a < nodes.length; a++) {
                var nodeToWrite = {
                    nodeId: nodes[a],
                    attributeId: AttributeIds.Value,
                    indexRange: null,
                    value: {
                        value: {
                            dataType: req.body.datatypes[a],
                            value: req.body.data[a]
                        }
                    }
                };

                session.write(nodeToWrite);
            }

            res.sendStatus(200);

        }
        catch (err) {
            Logger(err.stack, OPCUAclient.name, LogLevel.SERVERE);
            res.send(`Error: ${err}`);
        }
        client.disconnect();
    }

    private async ReadData(session: ClientSession, nodes) {
        let dataValues = [];
        for (var a = 0; a < nodes.length; a++) {
            const nodeId = nodes[a].Nodes;
            await session.read({ nodeId, attributeId: AttributeIds.Value }).then((data) => {
                dataValues.push({ data: data.value.value });
            });
        }

        return dataValues;
    }

    private async RecursiveBrowse(browseResult: BrowseResult, session: ClientSession) {
        let result = [];

        for (var a = 0; a < browseResult.references.length; a++) {
            if (browseResult.references[a].nodeClass != 1) {
                result.push({ browseName: browseResult.references[a].browseName.name, NodeId: browseResult.references[a].nodeId.toString(), dataType: Datamodel[browseResult.references[a].browseName.name] });
            }
            const browseResultNested = await session.browse(browseResult.references[a].nodeId.toString()) as BrowseResult;

            await this.RecursiveBrowse(browseResultNested, session).then((data) => {
                result = result.concat(data);
            });
        }

        return result;
    }
}