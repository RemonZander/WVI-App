import { IAccount } from "./interfaces/interfaces";
import { UserService } from "./services/UserService";
import bcrypt from "bcrypt";
const LocalStrategy = require("passport-local");


const localStrategy = new LocalStrategy(
    {
        usernameField: "email",
        passwordField: "password",
    },
    async (email: string, password: string, done) => {
        try {
            const account: IAccount[] = UserService.GetOneByEmailAllColumns(email);
            if (account.length === 0) {
                return done(null, false);
            }
            
            bcrypt.compare(password, account[0].Wachtwoord).then(async hashResult => {
                if (hashResult) return done(null, account[0]);
                else return done(null, false);

            }).catch(error => { throw error })

        } catch (error) {
            done(error);
        }
    }
);

export default localStrategy;