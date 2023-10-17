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
            console.log("ExpirationDate: " + results[0].ExpirationDate);
            console.log("new Date()" + new Date());

            this.RemoveToken(Email);
            return false;
        }
        return true;
    }

    public static TokenExistsByToken(token: string): boolean {
        const results = All(`SELECT "Email", "Token", "ExpirationDate" FROM "Tokens" WHERE Token = ?`,
            [token]);

        if (results.length === 0) return false;
        if (results[0].ExpirationDate < new Date()) {
            console.log("ExpirationDate: " + results[0].ExpirationDate);
            console.log("new Date()" + new Date());

            this.RemoveToken(results.Email);
            return false;
        }
        return true;
    }

    public static RemoveToken(Email: string) {
        Run(`DELETE FROM "Tokens" WHERE "Email" = ?`, [Email]);

        return 200;
    }

    public static UpdateToken(Email: string, Token: string) {
        return Run(`UPDATE "Tokens" Set ExpirationDate = ? WHERE Email = ? AND Token = ?`, [date.format(date.addHours(new Date(), 1), "DD/MM/YYYY hh:mm:s:SSS"), Email, Token]);
    }

    public static UpdateTokenNoEmail(token: string) {
        return Run(`UPDATE "Tokens" Set ExpirationDate = ? WHERE Token = ?`, [date.format(date.addHours(new Date(), 1), "DD/MM/YYYY hh:mm:s:SSS"), token]);
    }
}

module.exports = {
    TokenService
}