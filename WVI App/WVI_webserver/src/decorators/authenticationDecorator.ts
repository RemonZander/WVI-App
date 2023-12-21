import { createEnforcer } from '../services/CasbinService';
import { TokenService } from '../services/TokenService';

export default function AuthenticationDecorator(permission: string) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = async function (...args: any[]) {
            const email = TokenService.GetEmail(args[0].cookies["login"])[0];
            const enforcer = await createEnforcer();
            if (!email) {
                args[1].sendStatus(500);
                return null;
            }
            else if (!await enforcer.enforce(email.Email, "*") && !await enforcer.enforce(email.Email, permission)) {
                args[1].sendStatus(401);
                return null;
            }
            return originalMethod.apply(this, args);
        };
    };
}