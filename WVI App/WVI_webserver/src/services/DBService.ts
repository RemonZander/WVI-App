//const sqlite = require('better-sqlite3');
import sqlite from 'better-sqlite3';
import path from 'path';
//const path = require('path');
const db = new sqlite(path.resolve('./database.db'), { fileMustExist: true, verbose: console.log });

export function All(sql, params) {
    return db.prepare(sql).all(params);
}

export function Run(sql, params) {
    return db.prepare(sql).run(params);
}


export function QueryNoParams(sql) {
    return db.prepare(sql);
}

module.exports = {
    All,
    Run,
    QueryNoParams
}