import express, { Express, Request, Response } from 'express';
import { AddressInfo } from "net";
import OPCUAclient from './modules/OPCUA_client';
import cors from "cors";
import router from './modules/routerModule';
import session from 'express-session';
import passport from 'passport';
import { IAccount } from './interfaces/interfaces';
import { UserService } from './services/UserService';
import bcrypt from "bcrypt";
import cookieParser from 'cookie-parser';
import { TokenGenerator } from 'ts-token-generator';
import { TokenService } from './services/TokenService';

const LocalStrategy = require("passport-local");

const bodyParser = require('body-parser');

const _OPCUAclient = new OPCUAclient();

const app: Express = express();

const tokgen = new TokenGenerator();

app.use(cors({
    origin: "http://localhost:3001",
    withCredentials: true,
    credentials: true,
}));
app.use(session({
    secret: "keyboard cat",
    resave: true,
    saveUninitialized: false,
    cookie: {
        expires: 10800000,
        httpOnly: true,
        secure: false,
        SameSite: 'none'
    }
}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('port', process.env.PORT || 3000);
app.use(router);

app.use(passport.initialize());
app.use(passport.authenticate('session'));


passport.use(
    new LocalStrategy(
        {
            usernameField: "email",
            passwordField: "password",
        },
        async (email: string, password: string, done) => {
            try {
                const account: IAccount[] = UserService.GetOneByEmailAllColumns(email);
                if (account.length === 0) {
                    console.log("not found");
                    return done(null, false);
                }

                bcrypt.compare(password, account[0].Wachtwoord).then(async hashResult => {
                    if (hashResult) {
                        console.log("success");
                        return done(null, account[0]);
                    }
                    else return done(null, false);

                }).catch(error => { throw error })

            } catch (error) {
                done(error);
            }
        }
    )
);

passport.serializeUser(function (user: IAccount, cb) {
    process.nextTick(function () {
        cb(null, { email: user.Email });
    });
});

passport.deserializeUser(function (user, cb) {
    process.nextTick(function () {
        return cb(null, user);
    });
});

app.post('/login/password',
    passport.authenticate('local'),
    function (req, res: Response) {      

        const token = tokgen.generate();
        if (TokenService.TokenExists(req.body.email, req.cookies.login)) {
            TokenService.UpdateToken(req.body.email, req.cookies.login);
            res.sendStatus(401);
            return;
        }
        //TokenService.InsertOne(req.body.email, token);
        res.cookie('login', token, { path: '/', httpOnly: true, maxAge: 3600000 });
        res.sendStatus(200);
});
    
const server = app.listen(app.get('port'), function () {
    console.log(`Express server listening on port ${(server.address() as AddressInfo).port}`);
});