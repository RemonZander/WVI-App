export default class routes{
    GetStatus(nodeId: string) {
        return fetch('http://localhost:3000/OPCUA/status', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ nodeId: nodeId })
        }).then((res) => {
           return res.json();
       }).then((data : number) => { return data });
    }

    async SetStatus(mode: number, nodeId: string) {
        await fetch('http://localhost:3000/OPCUA/write', {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ data: [mode], nodes: [`${nodeId}.cmdOperationMode`], datatypes: [4] })
        });
    }

    async GetData(nodeId: string) {
        return await fetch('http://localhost:3000/OPCUA/data', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ nodeId: nodeId })
        }).then((res) => {
            if (res.status == 404) return "404";
            return res.json();
        });
    }

    async IsOnline() {
        return await fetch('http://localhost:3000/OPCUA/isonline', {
            method: "GET",
        }).then((res) => {
            return res.status;
        });
    }

    async SetHeatingCurve(SetPointHigh : number, SetPointLow : number, nodeId: string) {
        await fetch('http://localhost:3000/OPCUA/write', {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ data: [SetPointHigh, SetPointLow], nodes: [`${nodeId}.HeatingCurve.SetPointHigh`, `${nodeId}.HeatingCurve.SetPointLow`], datatypes: [10, 10] })
        });
    }

    async SetDefaultHeatingCurve(SetPointHigh: number, SetPointLow: number, nodeId: string) {
        await fetch('http://localhost:3000/OPCUA/write', {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ data: [SetPointHigh, SetPointLow], nodes: [`${nodeId}.Params.DefaultHeatingCurve.SetPointHigh`, `${nodeId}.Params.DefaultHeatingCurve.SetPointLow`], datatypes: [6, 6] })
        });
    }
}