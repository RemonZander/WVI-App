import { All, Run, QueryNoParams } from './DBService';

export class WVIService {

    public static GetAll() : string {
        return QueryNoParams(`SELECT * FROM WVIs`).all();
    }

    public static GetWVIs(Contractgebiednummer: number) {
        return All('SELECT * FROM WVIs WHERE "Contractgebiednummer" = ?', [Contractgebiednummer]);
    }

    public static AddWVI(data) : string {
        return Run(`INSERT INTO "WVIs" ("PMP enkelvoudige objectnaam", "PPLG", "Objecttype", "Geocode", "Contractgebiednummer", "Equipmentnummer", "RD X-coordinaat", "RD Y-coordinaat", "Template", "Producent", "Endpoint") 
            VALUES (?,?,?,?,?,?,?,?,?,?,?)`, data);
    }
}

module.exports = {
    WVIService
}