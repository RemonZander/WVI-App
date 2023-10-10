import { All, Run, QueryNoParams } from './DBService';
import date from 'date-and-time';

export class TokenService {
    public static InsertOne(Email: string, token: string) {
        const CreationDate = new Date();
        const ExpirationDate = date.addHours(CreationDate, 1);

        return Run(`INSERT INTO "Tokens" ("Email", "Token", "CreationDate", "ExpirationDate") 
            VALUES (?,?,?,?)`, [Email, token, date.format(CreationDate, "DD/MM/YYYY hh:mm:s:SSS"), date.format(ExpirationDate, "DD/MM/YYYY hh:mm:s:SSS")]);
    }

    public static TokenExists(Email: string, token: string): boolean {
        const results = All(`SELECT "Email", "Token" FROM "Tokens" WHERE Email = ? AND Token = ?`,
            [Email, token]);

        if (results.length === 0) return false;
        return true;
    }

    public static UpdateToken(Email: string, Token: string) {
        const ExpirationDate = date.parse(All(`SELECT "ExpirationDate" from "Tokens" WHERE Email = ? AND Token = ?`, [Email, Token])[0].ExpirationDate, "DD/MM/YYYY hh:mm:s:SSS");
        return Run(`UPDATE "Tokens" Set ExpirationDate = ? WHERE Email = ? AND Token = ?`, [date.format(date.addHours(ExpirationDate, 1), "DD/MM/YYYY hh:mm:s:SSS"), Email, Token]);
    }
}

module.exports = {
    TokenService
}