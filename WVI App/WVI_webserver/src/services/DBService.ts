import sqlite from 'better-sqlite3';
import path from 'path';
import { LogLevel } from '../enums/loglevelEnum';
import Logger from '../modules/loggerModule';
const db = new sqlite(path.resolve('./src/database.db'), { fileMustExist: true, verbose: Logger });

export function All(sql, params) {
    try {
        return db.prepare(sql).all(params);
    } catch (e) {
        Logger(e, "DBservice", LogLevel.WARNING);
        return false;
    }
}

export function Run(sql, params) {
    try {
        return db.prepare(sql).run(params);
    } catch (e) {
        Logger(e.stack, "DBservice", LogLevel.WARNING);
        return false;
    }
}


export function QueryNoParams(sql) {
    try {
        return db.prepare(sql);
    } catch (e) {
        Logger(e, "DBservice", LogLevel.WARNING);
        return false;
    }
}

module.exports = {
    All,
    Run,
    QueryNoParams
}