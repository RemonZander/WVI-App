import date from 'date-and-time';
import { LogLevel } from '../enums/loglevelEnum';

export default function Logger(log: any, classname: string = "better-sqlite3", loglevel: LogLevel = LogLevel.INFO) {
    switch (loglevel) {
        case LogLevel.INFO:
            console.log(`\x1b[92m[INFO: ${date.format(new Date(), "DD/MM/YYYY hh:mm:s:SSS")}: ${classname}] ${log} \x1b[0m`);
            break;
        case LogLevel.WARNING:
            console.log(`\x1b[93m[WARNING: ${date.format(new Date(), "DD/MM/YYYY hh:mm:s:SSS")}: ${classname}] ${log} \x1b[0m`);
            break;
        case LogLevel.SERVERE:
            console.log(`\x1b[91m[SERVERE: ${date.format(new Date(), "DD/MM/YYYY hh:mm:s:SSS")}: ${classname}] ${log} \x1b[0m`);
            break;
    }
}