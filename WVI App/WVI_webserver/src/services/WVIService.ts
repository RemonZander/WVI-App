import { All, Run, QueryNoParams } from './DBService';

export class WVIService {

    public static GetAll() : string {
        return QueryNoParams(`SELECT * FROM WVIs`).all();
    }

    public static GetOne(columns, filterColumn, value): string {
        return All(`SELECT ${columns} FROM WVIs WHERE "${filterColumn}" = ?`, [value]);
    }

    public static GetOneAllColumns(filterColumn, value): string {
        return All(`SELECT * FROM WVIs WHERE "${filterColumn}" = ?`, [value]);
    }

    public static InsertOne(data) : string {
        return Run(`INSERT INTO "WVIs" ("PMP enkelvoudige objectnaam", "PPLG", "Objecttype", "Geocode", "Contractgebiednummer", "Equipmentnummer", "RD X-coordinaat", "RD Y-coordinaat", "Template", "Producent") 
            VALUES (?,?,?,?,?,?,?,?,?,?)`, data);
    }

    public static RemoveOne(column, value) : string {
        return Run(`DELETE FROM "WVIs" WHERE "${column}" = ?`, value);
    }
}

module.exports = {
    WVIService
}