export interface IAccount {
    ID: number,
    Email: string,
    Onderhoudsaannemer: string,
    Role: string
}

export interface INewAccount {
    Email: string,
    Onderhoudsaannemer: string,
    Role: string,
    Wachtwoord: string
}

export interface IWVI {
    PMP_enkelvoudige_objectnaam: string,
    PPLG: string,
    Geocode: number,
    Contractgebiednummer: number,
    Equipmentnummer: number,
    Objecttype: string,
    PUIC: string,
    "RD X-coordinaat": string,
    "RD Y-coordinaat": string,
    Producent: string,
    Endpoint: string,
    Slaves: string,
    Datamodel: string
}

export interface IWVIStatus {
    status: string,
    activityLed: any
}

export interface INewWVI extends IWVI {
    Aannemer: string
}

export interface IRoles {
    ID: number,
    Role: string,
    Permissions: string
}

export interface IWVIPermissions {
    name: string,
    list: boolean,
    info: boolean,
    status: boolean,
    operate: boolean
}