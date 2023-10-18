import { IAccount } from '../interfaces/interfaces';
import { All, Run, QueryNoParams } from './DBService';

export class UserService {

    public static GetAll(): IAccount[] {
        return QueryNoParams(`SELECT "Email", "Onderhoudsaannemer", "Role" FROM Accounts`).all();
    }

    public static GetOne(columns: string, filterColumn: string, value: string): string {
        return All(`SELECT ${columns} FROM Accounts WHERE "${filterColumn}" = ?`, [value]);
    }

    public static GetOneByEmailSelectColumns(columns: string, value: string): any[] {
        return All(`SELECT ${columns} FROM Accounts WHERE "Email" = ?`, [value]);
    }

    public static GetOneByEmailAllColumns(email: string): IAccount[] {
        return All(`SELECT "Email", "Onderhoudsaannemer", "Role", "Wachtwoord" FROM Accounts WHERE "Email" = ?`, [email]);
    }

    public static InsertOne(data): string {
        return Run(`INSERT INTO "Accounts" ("Email", "Wachtwoord") 
            VALUES (?,?)`, data);
    }

    public static RemoveOne(column, value): string {
        return Run(`DELETE FROM "Accounts" WHERE "${column}" = ?`, value);
    }
}

module.exports = {
    UserService
}