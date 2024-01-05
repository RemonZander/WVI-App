import { All, Run, QueryNoParams } from './DBService';

export class WVIService {

    public static GetAll() : string[] | boolean {
        return QueryNoParams(`SELECT * FROM WVIs`).all();
    }

    public static GetWVIs(Contractgebiednummer: number): any[] {
        return All('SELECT * FROM WVIs WHERE "Contractgebiednummer" = ?', [Contractgebiednummer]);
    }

    public static GetWVIByName(name: string): any[] {
        return All(`SELECT * FROM WVIs WHERE "PMP_enkelvoudige_objectnaam" = ?`, [name]);
    }

    public static AddWVI(data) : string | boolean {
        return Run(`INSERT INTO "WVIs" ("PMP_enkelvoudige_objectnaam", "PPLG", "Objecttype", "Geocode", "Contractgebiednummer", "Equipmentnummer", "RD X-coordinaat", "RD Y-coordinaat", "Producent", "Endpoint", "Datamodel", "Slaves") 
            VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`, data);
    }

    public static UpdateWVI(data): boolean {
        return Run(`UPDATE "WVIs" SET PMP_enkelvoudige_objectnaam = ?, PPLG = ?, Objecttype = ?, Geocode = ?, Contractgebiednummer = ?, Equipmentnummer = ?, "RD X-coordinaat" = ?, "RD Y-coordinaat" = ?, Producent = ?, Endpoint = ?, Datamodel = ?, Slaves = ? WHERE PMP_enkelvoudige_objectnaam = ?`, data);
    }

    public static RemoveWVI(name): boolean {
        return Run(`DELETE FROM "WVIs" WHERE PMP_enkelvoudige_objectnaam = ?`, [name]);
    }
}

module.exports = {
    WVIService
}