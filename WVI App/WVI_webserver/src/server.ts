import express, { Express, Request, Response } from 'express';
import { AddressInfo } from "net";
import cors from "cors";
import Accountrouter from './modules/AccountrouterRouterModule';
import session from 'express-session';
import passport from 'passport';
import { IAccount } from './interfaces/interfaces';
import cookieParser from 'cookie-parser';
import localStrategy from './passportStragegies';
import authenticationRouter from './modules/authenticationRouterModule';
import OPCUARouter from './modules/OPCUARouterModule';
import 'dotenv/config'

const bodyParser = require('body-parser');

const app: Express = express();

//https://www.npmjs.com/package/csrf-csrf
//https://www.npmjs.com/package/react-helmet    ook X-XSS-Protection

app.disable('x-powered-by');

app.use(cors({
    origin: function (origin, callback) {
        const allowedOrigins = [`http://${process.env.REACT_APP_CLIENT}`];
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            console.log(`allowed connection from origin: ${origin}`);
            callback(null, true);
        } else {
            console.log(`Blocked CORS request from origin: ${origin}`);
            callback(null, false);
        }
    },
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
app.use(Accountrouter);
app.use(authenticationRouter);
app.use(OPCUARouter);

app.use(passport.initialize());
app.use(passport.authenticate('session'));

passport.use(localStrategy);

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
    
const server = app.listen(app.get('port'), function () {
    console.log(`Express server listening on port ${(server.address() as AddressInfo).port}`);
});