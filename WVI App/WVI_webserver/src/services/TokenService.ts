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
        const results = All(`SELECT "Email", "Token", "ExpirationDate" FROM "Tokens" WHERE Email = ? AND Token = ?`,
            [Email, token]);

        if (results.length === 0) return false;
        if (results[0].ExpirationDate < new Date()) {
            this.RemoveToken(token);
            return false;
        }
        return true;
    }

    public static TokenExistsByToken(token: string): boolean {
        const results = All(`SELECT "Email", "Token", "ExpirationDate" FROM "Tokens" WHERE Token = ?`,
            [token]);

        if (results.length === 0) return false;
        if (results[0].ExpirationDate < new Date()) {
            this.RemoveToken(token);
            return false;
        }
        return true;
    }

    public static RemoveToken(token: string) {
        Run(`DELETE FROM "Tokens" WHERE "Token" = ?`, [token]);

        return 200;
    }

    public static RemoveTokenByEmail(token: string) {
        Run(`DELETE FROM "Tokens" WHERE "Email" = ?`, [token]);

        return 200;
    }

    public static UpdateToken(Email: string, Token: string) {
        return Run(`UPDATE "Tokens" Set ExpirationDate = ? WHERE Email = ? AND Token = ?`, [date.format(date.addMinutes(new Date(), 10), "DD/MM/YYYY hh:mm:s:SSS"), Email, Token]);
    }

    public static UpdateTokenNoEmail(token: string) {
        return Run(`UPDATE "Tokens" Set ExpirationDate = ? WHERE Token = ?`, [date.format(date.addHours(new Date(), 1), "DD/MM/YYYY hh:mm:s:SSS"), token]);
    }

    public static GetEmail(token: string): any[] {
        return All(`SELECT "Email" FROM "Tokens" WHERE Token = ?`,
            [token]);
    }
}

module.exports = {
    TokenService
}