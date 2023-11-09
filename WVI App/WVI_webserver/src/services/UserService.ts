import { IAccount } from '../interfaces/interfaces';
import { All, Run, QueryNoParams } from './DBService';

export class UserService {

    public static GetAll(): IAccount[] {
        return QueryNoParams(`SELECT LOWER(Email), "Onderhoudsaannemer", "Role" FROM Accounts`).all();
    }

    public static GetOne(columns: string, filterColumn: string, value: string): string {
        return All(`SELECT ${columns} FROM Accounts WHERE "${filterColumn}" = ?`, [value]);
    }

    public static GetOneByEmailSelectColumns(columns: string, value: string): any[] {
        return All(`SELECT ${columns} FROM Accounts WHERE LOWER(Email) = ?`, [value]);
    }

    public static GetOneByEmailAllColumns(email: string): IAccount[] {
        return All(`SELECT LOWER(Email), "Onderhoudsaannemer", "Role", "Wachtwoord" FROM Accounts WHERE LOWER(Email) = ?`, [email]);
    }

    public static InsertOne(data): string {
        return Run(`INSERT INTO "Accounts" ("Email", "Wachtwoord") 
            VALUES (?,?)`, data);
    }

    public static RemoveOne(value): string {
        return Run(`DELETE FROM "Accounts" WHERE LOWER(Email) = ?`, value);
    }

    public static UpdateOnderhoudsaannemer(onderhoudsaannemer: string, email: string) {
        return Run('UPDATE "Accounts" Set Onderhoudsaannemer = ? WHERE LOWER(Email) = ?', [onderhoudsaannemer, email]);
    }

    public static ListOnderhoudsaannemers() {
        return QueryNoParams(`SELECT DISTINCT Onderhoudsaannemer FROM "Aannemers"`).all();
    }

    public static ListRoles() {
        return QueryNoParams('SELECT "Role" FROM Roles').all();
    }

    public static UpdateRole(role: string, email: string) {
        return Run(`UPDATE "Accounts" Set Role = ? WHERE LOWER(Email) = ?`, [role, email]);
    }

    public static GetContractgebiednummers(onderhoudsaannemer: string) {
        return All(`SELECT "Contractgebiednummer" FROM Aannemers WHERE "Onderhoudsaannemer" = ?`, [onderhoudsaannemer]);
    }
}

module.exports = {
    UserService
}