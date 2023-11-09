export interface IAccount {
    ID: number,
    Email: string,
    Onderhoudsaannemer: string,
    Role: string
}

export interface IWVI {
    ID: number,
    PMP_enkelvoudige_objectnaam: string,
    PPLG: string,
    Geocode: number,
    Contractgebiednummer: number,
    Equipmenetnummer: number,
    PUIC: string,
    "RD X-coordinaat": number,
    "RD Y-coordinaat": number,
    Template: string,
    Producent: string,
    Endpoint: string
}

export interface IWVIStatus {
    status: string,
    activityLed: any
}

export interface INewWVI {
    datamodel: [],
    PMP_enkelvoudige_objectnaam: string,
    PPLG: string,
    Geocode: number,
    Contractgebiednummer: number,
    Equipmentnummer: number,
    PUIC: string,
    "RD X-coordinaat": number,
    "RD Y-coordinaat": number,
    Template: string,
    Producent: string,
    Endpoint: string,
    Objecttype: string
}