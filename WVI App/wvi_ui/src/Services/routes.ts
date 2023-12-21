export default class routes {

    static GetStatus(nodeId: string, endpoint: string, datamodel: string, wvi) {
        try {
            return fetch(`http://${process.env.REACT_APP_SERVER}:3000/OPCUA/status`, {
                method: "POST",
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    endpoint: endpoint, nodeId: [datamodel === "2.0" || datamodel === "2.1" ? `${nodeId}.statOperationMode` : `${nodeId}.CurrentOperationMode`,
                    datamodel === "2.0" || datamodel === "2.1" ? `${nodeId}.cmdOperationMode` : `${nodeId}.CurrentOperationMode`], wvi: wvi
                })
            }).then((res) => {
                return res.json();
            }).then((data: number) => { return data });
        } catch (e) {

        }
    }

    static async SetStatus(mode: number, nodeId: string, endpoint: string, datamodel: string, PMP_enkelvoudige_objectnaam: string) {
        try {
            await fetch(`http://${process.env.REACT_APP_SERVER}:3000/OPCUA/write`, {
                method: "PUT",
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ endpoint: endpoint, data: [mode], nodes: datamodel === "2.0" || datamodel === "2.1" ? [`${nodeId}.cmdOperationMode`] : [`${nodeId}.CurrentOperationMode`], datatypes: [4], PMP_enkelvoudige_objectnaam: PMP_enkelvoudige_objectnaam })
            });
        } catch (e) {

        }
    }

    static async GetWVIs() {
        try {
            return await fetch(`http://${process.env.REACT_APP_SERVER}:3000/getWVIs`, {
                method: "GET",
                credentials: 'include',
            }).then((res) => {
                return res.json();
            });
        } catch (e) {

        }
    }

    static async GetData(nodeId: string, endpoint: string, PMP_enkelvoudige_objectnaam: string) {
        try {
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
        } catch (e) {

        }
    }

    static async IsOnline(endpoint: string) {
        try {
            return await fetch(`http://${process.env.REACT_APP_SERVER}:3000/OPCUA/isonline`, {
                method: "POST",
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ endpoint: endpoint })
            }).then((res) => {
                return res.status;
            });
        } catch (e) {

        }
    }

    static async SetHeatingCurve(SetPointHigh: number, SetPointLow: number, nodeId: string, endpoint: string, datamodel: string, PMP_enkelvoudige_objectnaam: string) {
        try {
            await fetch(`http://${process.env.REACT_APP_SERVER}:3000/OPCUA/write`, {
                method: "PUT",
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ endpoint: endpoint, data: [SetPointHigh, SetPointLow], nodes: [datamodel === "2.0" || datamodel === "2.1" ? `${nodeId}.HeatingCurve.SetPointHigh` : `${nodeId}.CurrentHeatingcurveSetPoints.SetPointHigh`, datamodel === "2.0" || datamodel === "2.1" ? `${nodeId}.HeatingCurve.SetPointLow` : `${nodeId}.CurrentHeatingcurveSetPoints.SetPointLow`], datatypes: [10, 10], PMP_enkelvoudige_objectnaam: PMP_enkelvoudige_objectnaam })
            });
        } catch (e) {

        }
    }

    static async SetDefaultHeatingCurve(SetPointHigh: number, SetPointLow: number, nodeId: string, endpoint: string, datamodel: string, PMP_enkelvoudige_objectnaam: string) {
        try {
            await fetch(`http://${process.env.REACT_APP_SERVER}:3000/OPCUA/write`, {
                method: "PUT",
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ endpoint: endpoint, data: [SetPointHigh, SetPointLow], nodes: [datamodel === "2.0" || datamodel === "2.1" ? `${nodeId}.Params.DefaultHeatingCurve.SetPointHigh` : `${nodeId}.Params.DefaultHeatingcurveSetPointHigh`, datamodel === "2.0" || datamodel === "2.1" ? `${nodeId}.Params.DefaultHeatingCurve.SetPointLow` : `${nodeId}.Params.DefaultHeatingcurveSetPointLow`], datatypes: [6, 6], PMP_enkelvoudige_objectnaam: PMP_enkelvoudige_objectnaam })
            });
        } catch (e) {

        }
    }

    static async Login(email: string, password: string) {
        try {
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
        } catch (e) {

        }
    }

    static async Logout() {
        try {
            return await fetch(`http://${process.env.REACT_APP_SERVER}:3000/logout`, {
                method: "GET",
                credentials: 'include'
            }).then((res) => {
                return res.status;
            });
        } catch (e) {

        }
    }

    static async ValidateToken() {
        try {
            return await fetch(`http://${process.env.REACT_APP_SERVER}:3000/validatetoken`, {
                method: "GET",
                credentials: 'include'
            }).then((res) => {
                return res.status;
            });
        } catch (e) {

        }
    }

    static async GetEmail() {
        try {
            return await fetch(`http://${process.env.REACT_APP_SERVER}:3000/email`, {
                method: "GET",
                credentials: 'include'
            }).then((res) => {
                return res;
            });
        } catch (e) {

        }
    }

    static async GetAllAccounts() {
        try {
            return await fetch(`http://${process.env.REACT_APP_SERVER}:3000/accounts`, {
                method: "GET",
                credentials: 'include'
            }).then((res) => {
                return res.json();
            });
        } catch (e) {

        }
    }

    static async DeleteAccount(email: string) {
        try {
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
        } catch (e) {

        }
    }

    static async UpdateOnderhoudsaannemer(email: string, onderhoudsaannemer: string) {
        try {
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
        } catch (e) {

        }
    }

    static async ListRoles() {
        try {
            return await fetch(`http://${process.env.REACT_APP_SERVER}:3000/listRoles`, {
                method: "GET",
                credentials: 'include'
            }).then((res) => {
                return res.json();
            });
        } catch (e) {

        }
    }

    static async GetRolesAndPermissions() {
        try {
            return await fetch(`http://${process.env.REACT_APP_SERVER}:3000/getRolesAndPermissions`, {
                method: "GET",
                credentials: 'include'
            }).then((res) => {
                return res.json();
            });
        } catch (e) {

        }
    }

    static async ListOnderhoudsaannemersUnique() {
        try {
            return await fetch(`http://${process.env.REACT_APP_SERVER}:3000/listOnderhoudsaannemersunique`, {
                method: "GET",
                credentials: 'include'
            }).then((res) => {
                return res.json();
            });
        } catch (e) {

        }
    }

    static async RemoveContractgebied(contractgebiednummer: number) {
        try {
            return await fetch(`http://${process.env.REACT_APP_SERVER}:3000/removecontractgebied`, {
                method: "DELETE",
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ contractgebiednummer: contractgebiednummer })
            }).then((res) => {
                return res.status;
            });
        } catch (e) {

        }
    }

    static async UpdateContractgebied(onderhoudsaannemer: string, contractgebiednummer: number) {
        try {
            return await fetch(`http://${process.env.REACT_APP_SERVER}:3000/updatecontractgebied`, {
                method: "PUT",
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ onderhoudsaannemer: onderhoudsaannemer, contractgebiednummer: contractgebiednummer })
            }).then((res) => {
                return res.status;
            });
        } catch (e) {

        }
    }

    static async AddContractgebied(onderhoudsaannemer: string, contractgebiednummer: number) {
        try {
            return await fetch(`http://${process.env.REACT_APP_SERVER}:3000/addcontractgebied`, {
                method: "PUT",
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ onderhoudsaannemer: onderhoudsaannemer, contractgebiednummer: contractgebiednummer })
            }).then((res) => {
                return res.status;
            });
        } catch (e) {

        }
    }

    static async ListOnderhoudsaannemers() {
        try {
            return await fetch(`http://${process.env.REACT_APP_SERVER}:3000/listOnderhoudsaannemers`, {
                method: "GET",
                credentials: 'include'
            }).then((res) => {
                return res.json();
            });
        } catch (e) {

        }
    }

    static async UpdateRoleInAccount(email: string, role: string) {
        try {
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
        } catch (e) {

        }
    }

    static async RemoveRole(role: string) {
        try {
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
        } catch (e) {

        }
    }

    static async AddWVI(data: any) {
        try {
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
        } catch (e) {

        }
    }

    static async UpdateWVI(data: any) {
        try {
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
        } catch (e) {

        }
    }

    static async DeleteWVI(name: string) {
        try {
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
        } catch (e) {

        }
    }

    static async AddAccount(Email: string, Wachtwoord: string, Role: string, Onderhoudsaannemer: string) {
        try {
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
        } catch (e) {

        }
    }

    static async AddRole(role: string, permissions: string) {
        try {
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
        } catch (e) {

        }
    }

    static async UpdateRole(role: string, permissions: string) {
        try {
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
        } catch (e) {

        }
    }

    static async HasPermissions(permissions: string[]) {
        try {
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
        } catch (e) {

        }
    }

    static async RebuildEnforcerPolicies() {
        try {
            return await fetch(`http://${process.env.REACT_APP_SERVER}:3000/rebuildenforcerpolicies`, {
                method: "GET",
                credentials: 'include'
            }).then((res) => {
                return res.status;
            });
        } catch (e) {

        }
    }
}