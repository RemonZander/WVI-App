import { IAccount } from '../interfaces/interfaces';
import { All, Run, QueryNoParams } from './DBService';

export class UserService {

    public static GetAll(): IAccount[] | boolean {
        return QueryNoParams(`SELECT LOWER(Email) AS Email, "Onderhoudsaannemer", "Role" FROM Accounts`).all();
    }

    public static GetOne(columns: string, filterColumn: string, value: string): string | boolean {
        return All(`SELECT ${columns} FROM Accounts WHERE "${filterColumn}" = ?`, [value]);
    }

    public static GetOneByEmailSelectColumns(columns: string, value: string): any[] | boolean {
        return All(`SELECT ${columns} FROM Accounts WHERE LOWER(Email) = ?`, [value]);
    }

    public static GetOneByEmailAllColumns(email: string): any {
        return All(`SELECT LOWER(Email) AS Email, "Onderhoudsaannemer", "Role", "Wachtwoord" FROM Accounts WHERE Email = ?`, [email]);
    }

    public static InsertOne(data): string | boolean {
        return Run(`INSERT INTO "Accounts" ("Email", "Wachtwoord") 
            VALUES (?,?)`, data);
    }

    public static RemoveOne(value): string | boolean {
        return Run(`DELETE FROM "Accounts" WHERE LOWER(Email) = ?`, value);
    }

    public static UpdateOnderhoudsaannemer(onderhoudsaannemer: string, email: string): string | boolean {
        return Run('UPDATE "Accounts" Set Onderhoudsaannemer = ? WHERE LOWER(Email) = ?', [onderhoudsaannemer, email]);
    }

    public static ListOnderhoudsaannemers(): string | boolean {
        return QueryNoParams(`SELECT DISTINCT Onderhoudsaannemer FROM "Aannemers"`).all();
    }

    public static ListRoles(): string | boolean {
        return QueryNoParams('SELECT "Role" FROM Roles').all();
    }

    public static UpdateRole(role: string, email: string): string | boolean {
        return Run(`UPDATE "Accounts" Set Role = ? WHERE LOWER(Email) = ?`, [role, email]);
    }

    public static GetContractgebiednummers(onderhoudsaannemer: string): boolean | any[] {
        return All(`SELECT "Contractgebiednummer" FROM Aannemers WHERE "Onderhoudsaannemer" = ?`, [onderhoudsaannemer]);
    }

    public static GetAannemerOnContractgebiednummer(contractgebiednummer: string): any[] | boolean {
        return All(`SELECT "Contractgebiednummer", "Onderhoudsaannemer" FROM Aannemers WHERE "Contractgebiednummer" = ?`, [contractgebiednummer]);
    }

    public static AddAannemer(contractgebeidnummer: number, aannemer: string): string | boolean {
        return Run(`INSERT INTO "Aannemers" ("Contractgebiednummer", Onderhoudsaannemer) VALUES(?, ?)`, [contractgebeidnummer, aannemer]);
    }
}

module.exports = {
    UserService
}