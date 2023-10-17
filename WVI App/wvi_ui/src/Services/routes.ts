export default class routes {

    static GetStatus(nodeId: string) {
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

    static async SetStatus(mode: number, nodeId: string) {
        await fetch('http://localhost:3000/OPCUA/write', {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ data: [mode], nodes: [`${nodeId}.cmdOperationMode`], datatypes: [4] })
        });
    }

    static async GetData(nodeId: string) {
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

    static async IsOnline() {
        return await fetch('http://localhost:3000/OPCUA/isonline', {
            method: "GET",
        }).then((res) => {
            return res.status;
        });
    }

    static async SetHeatingCurve(SetPointHigh : number, SetPointLow : number, nodeId: string) {
        await fetch('http://localhost:3000/OPCUA/write', {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ data: [SetPointHigh, SetPointLow], nodes: [`${nodeId}.HeatingCurve.SetPointHigh`, `${nodeId}.HeatingCurve.SetPointLow`], datatypes: [10, 10] })
        });
    }

    static async SetDefaultHeatingCurve(SetPointHigh: number, SetPointLow: number, nodeId: string) {
        await fetch('http://localhost:3000/OPCUA/write', {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ data: [SetPointHigh, SetPointLow], nodes: [`${nodeId}.Params.DefaultHeatingCurve.SetPointHigh`, `${nodeId}.Params.DefaultHeatingCurve.SetPointLow`], datatypes: [6, 6] })
        });
    }

    static async Login(email: string, password: string) {
        return await fetch('http://localhost:3000/login', {
            method: "POST",
            credentials: 'include',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email: email, password: password })
        }).then((res) => {
            return res.status;
        });
    }

    static async Logout() {
        return await fetch('http://localhost:3000/logout', {
            method: "GET",
            credentials: 'include'
        }).then((res) => {
            return res.status;
        });
    }

    static async ValidateToken() {
        return await fetch('http://localhost:3000/validatetoken', {
            method: "GET",
            credentials: 'include'
        }).then((res) => {
            return res.status;
        });
    }
}