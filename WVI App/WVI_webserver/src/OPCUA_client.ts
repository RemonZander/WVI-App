import { Request, Response } from "express";
import { Session } from "inspector";
import { AttributeIds, BrowseResult, ClientSession, DataType, DataValue, OPCUAClient, ReferenceDescription, StatusCodes, TimestampsToReturn, UserTokenType } from "node-opcua-client";

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

            const browseResult: BrowseResult = await session.browse("i=85") as BrowseResult;

            browseResult.references.forEach(async (reference) => {
                let browseResult: BrowseResult = await session.browse(reference.nodeId.toString()) as BrowseResult;
                console.log(browseResult.toString());
                res.write(browseResult.references.toString());
            });

            //res.send(browseResult.references.map((r: ReferenceDescription) => r.browseName.toString()).join("\n"));
            //res.send(browseResult);
        }
        catch (err) {
            res.write(`Error !!! ${err}\n`);
            res.end();
            console.log("Error !!!", err);
        }
        session.close();
        client.disconnect();
    }

    private RecursiveBrowse(browseResult: BrowseResult, session) {
        let result = [];
        browseResult.references.forEach(async (reference) => {
            result = this.RecursiveBrowse(await session.browse(reference.nodeId.toString()) as BrowseResult, session);
        });

        return browseResult.references;
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