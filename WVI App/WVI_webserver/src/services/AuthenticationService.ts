import { IAccount } from "../interfaces/interfaces";
import { UserService } from "./UserService";
import bcrypt from "bcrypt";

const LocalStrategy = require("passport-local");
var passport = require('passport');

function auth() {
    passport.use(
        "local",
        new LocalStrategy(
            {
                usernameField: "email",
                passwordField: "password",
            },
            async (email, password, done) => {
                try {
                    // check if user exists
                    const account: IAccount[] = UserService.GetOneByEmailAllColumns(email);
                    if (account.length === 0) return done(null, 404);

                    bcrypt.compare(password, account[0].Wachtwoord).then(async hashResult => {
                        if (hashResult) return done(null, account);
                        else done(null, 401);

                    }).catch(error => { throw error })

                } catch (error) {
                    done(error);
                }
            }
        )
    );
}

module.exports = {
    auth
}