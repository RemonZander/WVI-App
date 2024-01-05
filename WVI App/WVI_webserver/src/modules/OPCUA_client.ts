import { Request, Response } from "express";
import { AttributeIds, BrowseResult, ClientSession, DataType, DataValue, OPCUAClient, ReferenceDescription, StatusCodes, TimestampsToReturn, UserTokenType, DataTypeIds, FilterContextOnAddressSpace, MessageSecurityMode, SecurityPolicy, OPCUACertificateManager } from "node-opcua";
import { Datamodel } from '../enums/datamodel';
import { LogLevel } from "../enums/loglevelEnum";
import Logger from "./loggerModule";
import * as fs from 'fs';
const path = require('path');

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
/*                securityMode: MessageSecurityMode.SignAndEncrypt,
                securityPolicy: SecurityPolicy.Basic256Sha256,
                certificateFile: path.resolve("./src/certs/OPCUA_client.der"),
                privateKeyFile: path.resolve("./src/certs/OPCUA_client.pem"),
                applicationUri: "urn:WVIAPP:OPCUA:client",
                clientCertificateManager: new OPCUACertificateManager({
                    automaticallyAcceptUnknownCertificate: true,
                    rootFolder: path.resolve("./src/OPCUAPKI")
                }),*/
            });
            client.on("backoff", () => Logger("retrying connection", OPCUAclient.name, LogLevel.WARNING));
            await client.connect(req.body.endpoint);


            session = await client.createSession({
                type: UserTokenType.Anonymous
            });

/*            session = await client.createSession({
                type: UserTokenType.UserName,
                userName: "admin",
                password: "admin"
            });*/


        } catch (err) {
            console.log(err);
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
            client.on("backoff", () => Logger("retrying connection", OPCUAclient.name, LogLevel.WARNING));

            await client.connect(req.body.endpoint);

            session = await client.createSession({
                type: UserTokenType.Anonymous
            });

            let nodeId = req.body.nodeId[0];
            Logger(nodeId, "OPC UA client", LogLevel.INFO);
            let data = [await session.read({ nodeId, attributeId: AttributeIds.Value })];

            if (data[0].statusCode !== StatusCodes.Good) {
                console.log("Could not read ", nodeId);
            }

            nodeId = req.body.nodeId[1];
            Logger(nodeId, "OPC UA client", LogLevel.INFO);
            data.push(await session.read({ nodeId, attributeId: AttributeIds.Value }));

            if (data[1].statusCode !== StatusCodes.Good) {
                console.log("Could not read ", nodeId);
            }

            res.json([data[0].value.value, data[1].value.value]);
        }
        catch (err)
        {
            Logger(err.stack, OPCUAclient.name, LogLevel.SERVERE);
            res.json(`Error: ${err}`);
        }
        client.disconnect();
    }

    async GetData(req: Request, res: Response) {
        let client: OPCUAClient;
        let session: ClientSession;
        let slaves: string[] = [];
        if (req.body.slaves) slaves = req.body.slaves.split(";");
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
            await this.RecursiveBrowse(await session.browse(req.body.nodeId) as BrowseResult, session, slaves, req.body.nodeId).then((results) => {
                for (var a = 0; a < results.length; a++) {
                    if (results[a].NodeId.includes("ns=2") && !results[a].NodeId.includes("/0:Id")) {
                        nodes.push({ DisplayName: results[a].browseName, Nodes: results[a].NodeId, Data: "", dataType: results[a].dataType })
                    }  
                }
            });

            await this.ReadData(session, nodes).then((data) => {
                for (var a = 0; a < data.length; a++) {
                    nodes[a].Data = data[a].data;
                }
            });

            res.json(nodes);
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

    private async RecursiveBrowse(browseResult: BrowseResult, session: ClientSession, slaves: string[], nodeId: string) {
        let result = [];

        for (var a = 0; a < browseResult.references.length; a++) {
            if (browseResult.references[a].browseName.name === "Alarms" ||
                (slaves.filter(s => browseResult.references[a].browseName.name.includes(s)).length > 0 && !slaves.includes(nodeId))) continue;
            if (browseResult.references[a].nodeClass != 1) {
                result.push({ browseName: browseResult.references[a].browseName.name, NodeId: browseResult.references[a].nodeId.toString(), dataType: Datamodel[browseResult.references[a].browseName.name] });
            }
            const browseResultNested = await session.browse(browseResult.references[a].nodeId.toString()) as BrowseResult;

            await this.RecursiveBrowse(browseResultNested, session, slaves, nodeId).then((data) => {
                result = result.concat(data);
            });
        }

        return result;
    }
}