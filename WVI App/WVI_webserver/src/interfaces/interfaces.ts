export interface IAccount {
    ID: number,
    Email: string,
    Onderhoudsaannemer: string,
    Wachtwoord: string,
    Role: string
}

export interface IRoles {
    ID: number,
    Role: string,
    Permissions: string
}