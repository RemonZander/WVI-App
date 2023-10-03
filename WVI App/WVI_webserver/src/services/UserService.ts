import { All, Run, QueryNoParams } from './DBService';

export class UserService {

    public static GetAll(): string {
        return QueryNoParams(`SELECT * FROM Accounts`).all();
    }

    public static GetOne(columns: string, filterColumn: string, value: string): string {
        return All(`SELECT ${columns} FROM Accounts WHERE "${filterColumn}" = ?`, [value]);
    }

    public static GetOneByEmailSelectColumns(columns: string, value: string): string {
        return All(`SELECT ${columns} FROM Accounts WHERE "Email" = ?`, [value]);
    }

    public static GetOneByEmailAllColumns(value: string): string {
        return All(`SELECT * FROM Accounts WHERE "Email" = ?`, [value]);
    }

    public static GetOneByEmailAndPassword(email: string, passsword: string): string {
        return All(`SELECT * FROM Accounts WHERE "Email" = ? AND "Wachtwoord" = ?`, [email, passsword]);
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