export default class routes {

    static GetStatus(nodeId: string, endpoint: string, datamodel: string, wvi) {
        return fetch(`http://${process.env.REACT_APP_SERVER}:3000/OPCUA/status`, {
            method: "POST",
            credentials: 'include',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ endpoint: endpoint, nodeId: datamodel === "2.0" ? `${nodeId}.statOperationMode` : `${nodeId}.CurrentOperationMode`, wvi: wvi })
        }).then((res) => {
           return res.json();
       }).then((data: number) => { return data });
    }

    static async SetStatus(mode: number, nodeId: string, endpoint: string, datamodel: string, PMP_enkelvoudige_objectnaam: string) {
        await fetch(`http://${process.env.REACT_APP_SERVER}:3000/OPCUA/write`, {
            method: "PUT",
            credentials: 'include',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ endpoint: endpoint, data: [mode], nodes: datamodel === "2.0" ? [`${nodeId}.cmdOperationMode`, `${nodeId}.statOperationMode`] : [`${nodeId}.CurrentOperationMode`], datatypes: [4], PMP_enkelvoudige_objectnaam: PMP_enkelvoudige_objectnaam })
        });
    }

    static async GetWVIs() {
        return await fetch(`http://${process.env.REACT_APP_SERVER}:3000/getWVIs`, {
            method: "GET",
            credentials: 'include',
        }).then((res) => {
            return res.json();
        });
    }

    static async GetData(nodeId: string, endpoint: string, PMP_enkelvoudige_objectnaam: string) {
        return await fetch(`http://${process.env.REACT_APP_SERVER}:3000/OPCUA/data`, {
            method: "POST",
            credentials: 'include',
            headers: {  
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ endpoint: endpoint, nodeId: nodeId, PMP_enkelvoudige_objectnaam: PMP_enkelvoudige_objectnaam })
        }).then((res) => {
            if (res.status === 404) return "404";
            return res.json();
        });
    }

    static async IsOnline(endpoint: string) {
        return await fetch(`http://${process.env.REACT_APP_SERVER}:3000/OPCUA/isonline`, {
            method: "POST",
            credentials: 'include',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ endpoint: endpoint})
        }).then((res) => {
            return res.status;
        });
    }

    static async SetHeatingCurve(SetPointHigh: number, SetPointLow: number, nodeId: string, endpoint: string, datamodel: string, PMP_enkelvoudige_objectnaam: string) {
        await fetch(`http://${process.env.REACT_APP_SERVER}:3000/OPCUA/write`, {
            method: "PUT",
            credentials: 'include',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ endpoint: endpoint, data: [SetPointHigh, SetPointLow], nodes: [datamodel === "2.0" ? `${nodeId}.HeatingCurve.SetPointHigh` : `${nodeId}.CurrentHeatingcurveSetPoints.SetPointHigh`, datamodel === "2.0" ? `${nodeId}.HeatingCurve.SetPointLow` : `${nodeId}.CurrentHeatingcurveSetPoints.SetPointLow`], datatypes: [10, 10], PMP_enkelvoudige_objectnaam: PMP_enkelvoudige_objectnaam })
        });
    }

    static async SetDefaultHeatingCurve(SetPointHigh: number, SetPointLow: number, nodeId: string, endpoint: string, datamodel: string, PMP_enkelvoudige_objectnaam: string) {
        await fetch(`http://${process.env.REACT_APP_SERVER}:3000/OPCUA/write`, {
            method: "PUT",
            credentials: 'include',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ endpoint: endpoint, data: [SetPointHigh, SetPointLow], nodes: [datamodel === "2.0" ? `${nodeId}.Params.DefaultHeatingCurve.SetPointHigh` : `${nodeId}.Params.DefaultHeatingcurveSetPointHigh`, datamodel === "2.0" ? `${nodeId}.Params.DefaultHeatingCurve.SetPointLow` : `${nodeId}.Params.DefaultHeatingcurveSetPointLow`], datatypes: [6, 6], PMP_enkelvoudige_objectnaam: PMP_enkelvoudige_objectnaam })
        });
    }

    static async Login(email: string, password: string) {
        return await fetch(`http://${process.env.REACT_APP_SERVER}:3000/login`, {
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
        return await fetch(`http://${process.env.REACT_APP_SERVER}:3000/logout`, {
            method: "GET",
            credentials: 'include'
        }).then((res) => {
            return res.status;
        });
    }

    static async ValidateToken() {
        return await fetch(`http://${process.env.REACT_APP_SERVER}:3000/validatetoken`, {
            method: "GET",
            credentials: 'include'
        }).then((res) => {
            return res.status;
        });
    }

    static async GetEmail() {
        return await fetch(`http://${process.env.REACT_APP_SERVER}:3000/email`, {
            method: "GET",
            credentials: 'include'
        }).then((res) => {
            return res;
        });
    }

    static async GetAllAccounts() {
        return await fetch(`http://${process.env.REACT_APP_SERVER}:3000/accounts`, {
            method: "GET",
            credentials: 'include'
        }).then((res) => {
            return res.json();
        });
    }

    static async DeleteAccount(email: string) {
        return await fetch(`http://${process.env.REACT_APP_SERVER}:3000/removeAccount`, {
            method: "DELETE",
            credentials: 'include',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email: email })
        }).then((res => {
            return res.status;
        }));
    }

    static async UpdateOnderhoudsaannemer(email: string, onderhoudsaannemer: string) {
        return await fetch(`http://${process.env.REACT_APP_SERVER}:3000/removeOnderhoudsaannemer`, {
            method: "POST",
            credentials: 'include',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ onderhoudsaannemer: onderhoudsaannemer, email: email })
        }).then((res => {
            return res.status;
        }));
    }

    static async ListRoles() {
        return await fetch(`http://${process.env.REACT_APP_SERVER}:3000/listRoles`, {
            method: "GET",
            credentials: 'include'
        }).then((res) => {
            return res.json();
        });
    }

    static async GetRolesAndPermissions() {
        return await fetch(`http://${process.env.REACT_APP_SERVER}:3000/getRolesAndPermissions`, {
            method: "GET",
            credentials: 'include'
        }).then((res) => {
            return res.json();
        });
    }

    static async ListOnderhoudsaannemers() {
        return await fetch(`http://${process.env.REACT_APP_SERVER}:3000/listOnderhoudsaannemers`, {
            method: "GET",
            credentials: 'include'
        }).then((res) => {
            return res.json();
        });
    }

    static async UpdateRoleInAccount(email: string, role: string) {
        return await fetch(`http://${process.env.REACT_APP_SERVER}:3000/UpdateRoleInAccount`, {
            method: "POST",
            credentials: 'include',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ role: role, email: email })
        }).then((res => {
            return res.status;
        }));
    }

    static async RemoveRole(role: string) {
        return await fetch(`http://${process.env.REACT_APP_SERVER}:3000/removeRole`, {
            method: "DELETE",
            credentials: 'include',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ role: role })
        }).then((res => {
            return res.status;
        }));
    }

    static async AddWVI(data: any) {
        return await fetch(`http://${process.env.REACT_APP_SERVER}:3000/addwvi`, {
            method: "PUT",
            credentials: 'include',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ data: data })
        }).then((res => {
            return res.status;
        }));
    }

    static async UpdateWVI(data: any) {
        return await fetch(`http://${process.env.REACT_APP_SERVER}:3000/updatewvi`, {
            method: "POST",
            credentials: 'include',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ data: data })
        }).then(res => {
            return res.status;
        });
    }

    static async DeleteWVI(name: string) {
        return await fetch(`http://${process.env.REACT_APP_SERVER}:3000/removewvi`, {
            method: "DELETE",
            credentials: 'include',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name: name })
        }).then((res => {
            return res.status;
        }));
    }

    static async GetAannemer(contractgebiednummer: number) {
        return await fetch(`http://${process.env.REACT_APP_SERVER}:3000/getaannemer`, {
            method: "POST",
            credentials: 'include',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ contractgebiednummer: contractgebiednummer })
        }).then((res) => {
            return res.json();
        });
    }

    static async AddAccount(Email: string, Wachtwoord: string, Role: string, Onderhoudsaannemer: string) {
        return await fetch(`http://${process.env.REACT_APP_SERVER}:3000/addaccount`, {
            method: "PUT",
            credentials: 'include',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ data: [Email, Wachtwoord, Role, Onderhoudsaannemer] })
        }).then((res => {
            return res.status;
        }));
    }

    static async AddRole(role: string, permissions: string) {
        return await fetch(`http://${process.env.REACT_APP_SERVER}:3000/addRole`, {
            method: "PUT",
            credentials: 'include',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ role: role, permissions: permissions })
        }).then((res => {
            return res.status;
        }));
    }

    static async UpdateRole(role: string, permissions: string) {
        return await fetch(`http://${process.env.REACT_APP_SERVER}:3000/updateRole`, {
            method: "PUT",
            credentials: 'include',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ role: role, permissions: permissions })
        }).then((res => {
            return res.status;
        }));
    }

    static async HasPermissions(permissions: string[]) {
        return await fetch(`http://${process.env.REACT_APP_SERVER}:3000/haspermissions`, {
            method: "POST",
            credentials: 'include',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ permissions: permissions })
        }).then((res) => {
            return res.status;
        });
    }

    static async RebuildEnforcerPolicies() {
        return await fetch(`http://${process.env.REACT_APP_SERVER}:3000/rebuildenforcerpolicies`, {
            method: "GET",
            credentials: 'include'
        }).then((res) => {
            return res.status;
        });
    }
}