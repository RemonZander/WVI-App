import express, { Express } from 'express';
import { AddressInfo } from "net";
import cors from "cors";
import router from './modules/routerModule';
import session from 'express-session';
import passport from 'passport';
import { IAccount } from './interfaces/interfaces';
import cookieParser from 'cookie-parser';
import localStrategy from './passportStragegies';

const bodyParser = require('body-parser');

const app: Express = express();

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