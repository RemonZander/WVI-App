import { Enforcer, newEnforcer } from "casbin";
import { LogLevel } from "../enums/loglevelEnum";
import Logger from "../modules/loggerModule";
import { UserService } from "./UserService";

let enforcerInstance;

export async function createEnforcer(): Promise<Enforcer> {
    if (!enforcerInstance) {
        Logger("Creating new Enforcer", "CasbinService", LogLevel.WARNING);
        enforcerInstance = await newEnforcer('./src/casbin/model.conf', './src/casbin/policy.csv');
        BuildEnforcerPolicies();
    }
    return enforcerInstance;
}

export async function BuildEnforcerPolicies() {
    enforcerInstance.clearPolicy();
    const RolesAndPermissions = UserService.GetRolesAndPermissions();
    for (var a = 0; a < RolesAndPermissions.length; a++) {
        const permissions = RolesAndPermissions[a].Permissions.split(';');
        for (var b = 0; b < permissions.length; b++) {
            await enforcerInstance.addPermissionForUser(RolesAndPermissions[a].Role, permissions[b]);
        }
    }
    const users = UserService.GetAll();
    for (var c = 0; c < users.length; c++) {
        await enforcerInstance.addRoleForUser(users[c].Email, users[c].Role);
    }
    const policies = await enforcerInstance.getPolicy();
    const groups = await enforcerInstance.getGroupingPolicy();
    console.log(policies);
    console.log(groups);
}