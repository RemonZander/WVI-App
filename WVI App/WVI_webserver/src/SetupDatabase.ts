const sqlite = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

try {
	fs.unlinkSync(path.resolve('./src/database.db'));
} catch (e) {

}
const db = new sqlite(path.resolve('./src/database.db'), { fileMustExist: false, verbose: console.log });

//create WVi table
db.prepare(`CREATE TABLE "WVIs" (
	"ID"	INTEGER NOT NULL UNIQUE,
	"PMP_enkelvoudige_objectnaam"	TEXT NOT NULL UNIQUE,
	"PPLG"	TEXT NOT NULL,
	"Objecttype"	TEXT NOT NULL,
	"Geocode"	INTEGER NOT NULL,
	"Contractgebiednummer"	INTEGER NOT NULL,
	"Equipmentnummer"	INTEGER NOT NULL,
	"PUIC"	TEXT,
	"RD X-coordinaat"	NUMERIC,
	"RD Y-coordinaat"	NUMERIC,
	"Template"	TEXT NOT NULL,
	"Producent"	TEXT NOT NULL,
	"Endpoint"	TEXT NOT NULL,
	FOREIGN KEY("Contractgebiednummer") REFERENCES "Aannemers"("Contractgebiednummer"),
	PRIMARY KEY("ID" AUTOINCREMENT)
); `).run();

//Create table roles
db.prepare(`CREATE TABLE "Roles" (
	"ID"			INTEGER NOT NULL UNIQUE,
	"Role"			TEXT NOT NULL UNIQUE,
	"Permissions"	TEXT,
	PRIMARY KEY("ID" AUTOINCREMENT)
);`).run();

//Create accounts table
db.prepare(`CREATE TABLE "Accounts" (
	"ID"	INTEGER NOT NULL UNIQUE,
	"Email"	NOT NULL UNIQUE,
	"Wachtwoord" NOT NULL,
	"Onderhoudsaannemer"	TEXT,
	"Role"	TEXT NOT NULL,
	FOREIGN KEY("Role") REFERENCES "Roles"("Role"),
	PRIMARY KEY("ID" AUTOINCREMENT)
);`).run();

//create Aannemers table
db.prepare(`CREATE TABLE "Aannemers" (
	"ID"	INTEGER NOT NULL UNIQUE,
	"Contractgebiednummer"	INTEGER NOT NULL UNIQUE,
	"Onderhoudsaannemer"	TEXT NOT NULL,
	PRIMARY KEY("ID" AUTOINCREMENT)
); `).run();


db.prepare(`CREATE TABLE "Tokens" (
	"ID"	INTEGER NOT NULL UNIQUE,
	"Email"	TEXT NOT NULL UNIQUE,
	"Token"	TEXT NOT NULL UNIQUE,
	"CreationDate"	TEXT NOT NULL,
	"ExpirationDate"	TEXT NOT NULL,
	FOREIGN KEY("Email") REFERENCES "Accounts"("Email") ON DELETE CASCADE,
	PRIMARY KEY("ID" AUTOINCREMENT)
)`).run();


//first insert aannemers data because of foreign key
db.prepare(`INSERT INTO "Aannemers" ("Contractgebiednummer", Onderhoudsaannemer) VALUES(?, ?)`).run(["36", "Strukton Rail"]);
db.prepare(`INSERT INTO "Aannemers" ("Contractgebiednummer", Onderhoudsaannemer) VALUES(?, ?)`).run(["28", "ASSET Rail"]);
db.prepare(`INSERT INTO "Aannemers" ("Contractgebiednummer", Onderhoudsaannemer) VALUES(?, ?)`).run(["30", "ASSET Rail"]);
db.prepare(`INSERT INTO "Aannemers" ("Contractgebiednummer", Onderhoudsaannemer) VALUES(?, ?)`).run(["34", "ASSET Rail"]);
db.prepare(`INSERT INTO "Aannemers" ("Contractgebiednummer", Onderhoudsaannemer) VALUES(?, ?)`).run(["32", "VolkerRail"]);
db.prepare(`INSERT INTO "Aannemers" ("Contractgebiednummer", Onderhoudsaannemer) VALUES(?, ?)`).run(["27", "ASSET Rail"]);
db.prepare(`INSERT INTO "Aannemers" ("Contractgebiednummer", Onderhoudsaannemer) VALUES(?, ?)`).run(["19", "Strukton Rail"]);

//inset roles
db.prepare(`INSERT INTO "Roles" ("Role") VALUES(?)`).run(["aannemer"]);
db.prepare(`INSERT INTO "Roles" ("Role") VALUES(?)`).run(["beheerder"]);

//insert accounts
db.prepare(`INSERT INTO "Accounts" ("Email", "Wachtwoord", "Onderhoudsaannemer", "Role") VALUES(?, ?, ?, ?)`).run(["Strukton@test.nl", "$2b$10$mn06oPdHs0f2euVp2adqo.hMq9BT9IXwXj7mkIZoNGyfnRVkgLpFy", "Strukton Rail", "aannemer"]);
db.prepare(`INSERT INTO "Accounts" ("Email", "Wachtwoord", "Onderhoudsaannemer", "Role") VALUES(?, ?, ?, ?)`).run(["ASSETRail@test.nl", "$2b$10$BQ5nvVrm57ebFc8VykTsDe5nno32uXQOqdsZFdt3eovJWVaQwuwkq", "ASSET Rail", "aannemer"]);
db.prepare(`INSERT INTO "Accounts" ("Email", "Wachtwoord", "Role") VALUES(?, ?, ?)`).run(["beheer@prorail.nl", "$2b$10$pPT4Ai0egvTwhoCJ4bw4CuknQkCkmp8QA3cY7/GHpoaighK/PeSN2", "beheerder"]);

//insert WVI data
db.prepare(`INSERT INTO "WVIs" ("PMP_enkelvoudige_objectnaam", "PPLG", "Objecttype", "Geocode", "Contractgebiednummer", "Equipmentnummer", "RD X-coordinaat", "RD Y-coordinaat", "Template", "Producent", "Endpoint") 
VALUES (?,?,?,?,?,?,?,?,?,?,?)`).run(["GK.AKM.03", "AKM", "CB Gasketel", "9", "36", "11236483", "185404,439", "562933,511", "CB", "Heatpoint", "opc.tcp://localhost:10000/OPCUA-Player"]);
db.prepare(`INSERT INTO "WVIs" ("PMP_enkelvoudige_objectnaam", "PPLG", "Objecttype", "Geocode", "Contractgebiednummer", "Equipmentnummer", "RD X-coordinaat", "RD Y-coordinaat", "Template", "Producent", "Endpoint") 
VALUES (?,?,?,?,?,?,?,?,?,?,?)`).run(["GK.KTR.01", "KTR", "Electrisch 230V", "42", "28", "10177685", "168057,575", "438094,826", "Elektrisch", "Heatpoint", "opc.tcp://localhost:10002/OPCUA-Player"]);
db.prepare(`INSERT INTO "WVIs" ("PMP_enkelvoudige_objectnaam", "PPLG", "Objecttype", "Geocode", "Contractgebiednummer", "Equipmentnummer", "RD X-coordinaat", "RD Y-coordinaat", "Template", "Producent", "Endpoint") 
VALUES (?,?,?,?,?,?,?,?,?,?,?)`).run(["GK.WW.01", "WW", "Electrisch 230V", "607", "30", "11309660", "246427,143", "442796,435", "Elektrisch", "Pintsch Aben", "opc.tcp://localhost:10006/OPCUA-Player"]);
db.prepare(`INSERT INTO "WVIs" ("PMP_enkelvoudige_objectnaam", "PPLG", "Objecttype", "Geocode", "Contractgebiednummer", "Equipmentnummer", "RD X-coordinaat", "RD Y-coordinaat", "Template", "Producent", "Endpoint") 
VALUES (?,?,?,?,?,?,?,?,?,?,?)`).run(["GK.MRB.01", "MRB", "CB Gasketel", "751", "34", "10609732", "235550,797", "502968,725", "CB", "Pro-Emium BV", "opc.tcp://localhost:10003/OPCUA-Player"]);
db.prepare(`INSERT INTO "WVIs" ("PMP_enkelvoudige_objectnaam", "PPLG", "Objecttype", "Geocode", "Contractgebiednummer", "Equipmentnummer", "RD X-coordinaat", "RD Y-coordinaat", "Template", "Producent", "Endpoint") 
VALUES (?,?,?,?,?,?,?,?,?,?,?)`).run(["GK.GO.01", "GO", "Gasbrander LD", "31", "32", "11490221", "236596,456", "472054,759", "Gasbrander", "Pintsch Aben", "opc.tcp://localhost:10001/OPCUA-Player"]);
db.prepare(`INSERT INTO "WVIs" ("PMP_enkelvoudige_objectnaam", "PPLG", "Objecttype", "Geocode", "Contractgebiednummer", "Equipmentnummer", "RD X-coordinaat", "RD Y-coordinaat", "Template", "Producent", "Endpoint") 
VALUES (?,?,?,?,?,?,?,?,?,?,?)`).run(["GK.RV.01", "RV", "Electrisch 230V", "60", "27", "11117013", "203172,945", "366014,489", "Elektrisch", "Pro-Emium BV", "opc.tcp://localhost:10004/OPCUA-Player"]);
db.prepare(`INSERT INTO "WVIs" ("PMP_enkelvoudige_objectnaam", "PPLG", "Objecttype", "Geocode", "Contractgebiednummer", "Equipmentnummer", "RD X-coordinaat", "RD Y-coordinaat", "Template", "Producent", "Endpoint") 
VALUES (?,?,?,?,?,?,?,?,?,?,?)`).run(["GK.RV.02", "RV", "Electrisch 230V", "60", "27", "10124573", "203366,237", "366317,603", "Elektrisch", "Pro-Emium BV", "opc.tcp://localhost:10005/OPCUA-Player"]);
db.prepare(`INSERT INTO "WVIs" ("PMP_enkelvoudige_objectnaam", "PPLG", "Objecttype", "Geocode", "Contractgebiednummer", "Equipmentnummer", "RD X-coordinaat", "RD Y-coordinaat", "Template", "Producent", "Endpoint") 
VALUES (?,?,?,?,?,?,?,?,?,?,?)`).run(["GK.ZLW.10", "ZLW", "Electrisch 230V", "625", "19", "11594845", "104954,929", "411492,092", "Elektrisch", "Pro-Emium BV", "opc.tcp://localhost:10007/OPCUA-Player"]);
db.prepare(`INSERT INTO "WVIs" ("PMP_enkelvoudige_objectnaam", "PPLG", "Objecttype", "Geocode", "Contractgebiednummer", "Equipmentnummer", "RD X-coordinaat", "RD Y-coordinaat", "Template", "Producent", "Endpoint") 
VALUES (?,?,?,?,?,?,?,?,?,?,?)`).run(["GK.ZLW.11", "ZLW", "Electrisch 230V", "625", "19", "11594846", "104563,713", "412461,022", "Elektrisch", "Pro-Emium BV", "opc.tcp://localhost:10008/OPCUA-Player"]);