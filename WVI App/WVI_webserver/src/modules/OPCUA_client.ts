import { Request, Response } from "express";
import { AttributeIds, BrowseResult, ClientSession, DataType, DataValue, OPCUAClient, ReferenceDescription, StatusCodes, TimestampsToReturn, UserTokenType, DataTypeIds, FilterContextOnAddressSpace } from "node-opcua-client";
import { Datamodel } from '../enums/datamodel';
import { LogLevel } from "../enums/loglevelEnum";
import Logger from "./loggerModule";
import * as fs from 'fs';

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

            if (req.body.cert) {
                session = await client.createSession({
                type: UserTokenType.Certificate,
                certificateData: fs.readFileSync("../certs/uaexpert.der"),
                privateKey: `MIIEogIBAAKCAQEAzgi1GMLbAHiDGuBiRlSlQxC+OCKls1MKGwXJEjRcJqQYSpf3
                            1rwN8+X7kjBnNA333vQepyBQUK2h+kI+q6DuqmdH6vTI4IgTZo0CpIy21khk+4lb
                            UWeBQfjQWlRECIXr2UqivmcAW5tmYhfmejerRtyqreLRdo/NHkiKH1yl3EAHqU+7
                            mwoacn9btlL6V2ApC8NPjlJ8evacGUj4i/fw1Kn54nHMzK0oGtc7iy7Q64RcW4/Z
                            kehXqhfDfGSnwzBhXsRb5Fw53T2bm7aVKSVYzFRyoAuOXgsMtyEbrmrz/Mq9x2Ig
                            H+BI0g41jsp8TWugwT8ly5j5XXMtvvnEv4ystQIDAQABAoIBABI5ePNgwQhwoIAv
                            GuJHuHqPL5Q9lFShYsJzJ48BrKkKWM+4U4beCYnqbO9IcsiK98Lz6wYzeIc6ZJqD
                            Y5HA4XuXOShSULZzsuueS36Mp9uaebw6MSapNijEvoFO9NmgJvWIgY7AA6sWut6w
                            aIWlCPRyrnJFHuwS2jz0g6s0gcNSifnDHd6E0qW88LByqYejc1NaqBhrilTeECdd
                            z87TASHqZKEtcw/CZYp/R8FmRot8v1h2NzMfi1xuCEH6qD7ZQgfbNH81FRIsx2c1
                            AvIwrPvCcJiTN6pJaSxw4qzLMHhM9ctliC4usMpSe+NGmtTcjRJ97ntAzh68a62W
                            wXB28z0CgYEA5dduZBRbYSSZHmEcSlOujK+YI9/yu10AanrnsfNB7scqRk8ZRo46
                            BuP3kaiFEYOabozkL9ZTycNZSPmmjgEdXsW8mhr6j9gSEi5lyfIx0uu8XDTtcDHE
                            eYBfwaGKuBPPV0SA1NFTPOP7K5h8ckBx0hUaXONUzioLnG69CEyi+5MCgYEA5Xuh
                            UzblyPTjtBuzZggnp3P42gZFIupGsq6ADFIEkmr2x2w3QsHOy1OKuzXnno+Op++L
                            qVIA0KxvOUjlTjLh/zyMF1odbGeRIA9eCQfkgClO5cCqUVVA5vMCknUwjQMElOiR
                            YcDM8s1LguKLEJDd/Sv9LHtPGqkoT6VcLWcEM5cCgYBze9AypuvXHo107zRIwE0m
                            0R+vftm2fJ814TVDe0d4k0fRdfLsOZA8YBTHchYSW76fp1kMFDObX/UfrpiaJ0M7
                            mD0QbVfSKK3Dxt5MHs4b/WhyKAHZapgeuHrkjqdloEaAwaG9zMN3B9Hu8LouqeTG
                            uuW5IFw/Dm8xFY8TeXY20wKBgBYJEgugiN4MDdVcl5RjkhM1Qp8E3RymLFW6Bdep
                            BIFevgWWMZQ6cfX6NqcVXQFPvZ4IlXuTwTpIZIG2qzYgEq1kjfssDwk6xKe0cg4h
                            8OIRlV7gajpXGl1S1ltj316a/JSj5FnjnopuBiMyR7I2huppj+z2hjkEJzfGpBxD
                            +RZPAoGAez+pkRE8t9ZerUIBLKY7L9e3cH73B59RlZV2f5Cx35LpZ/efJhL7Fof7
                            qWuuaEhHp58gMuDtNHOs2KXovvo0/x9h7HeOB+FOVobxiM1tyUUz8zT4wFUwjGWo
                            GDdxirN2OBJSsFwVuw6udFfLe5nHViQ0KdfrvPIN+hw9QKirTsM=`
            });
            }
            else {
                session = await client.createSession({
                    type: UserTokenType.Anonymous
                });
            }

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

    private async RecursiveBrowse(browseResult: BrowseResult, session: ClientSession) {
        let result = [];

        for (var a = 0; a < browseResult.references.length; a++) {
            if (browseResult.references[a].browseName.name === "Alarms") continue;
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