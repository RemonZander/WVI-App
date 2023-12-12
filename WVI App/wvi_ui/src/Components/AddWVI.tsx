/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { INewWVI, IWVI } from '../interfaces/interfaces';
import routes from '../Services/routes';
import '../tailwind.css';
import loadingGif from '../media/loading.gif';
import { useSearchParams } from 'react-router-dom';
import 'primereact/resources/themes/bootstrap4-light-blue/theme.css';
import { AutoComplete } from 'primereact/autocomplete';

function AddWVI() {
    const [WVIdata, setWVIdata] = useState<INewWVI>({
        "Datamodel": "",
        "PMP_enkelvoudige_objectnaam": "",
        "PPLG": "",
        "Geocode": null,
        "Contractgebiednummer": null,
        "Equipmentnummer": null,
        "PUIC": "",
        "RD X-coordinaat": null,
        "RD Y-coordinaat": null,
        "Producent": "",
        "Endpoint": "",
        "Objecttype": "",
        Aannemer: ""
    });
    const [errorText, setErrorText] = useState<string>();
    const [connectionStatus, setConnectionStatus] = useState<number>(-1);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [searchParams, setSearchParams] = useSearchParams();
    const [aannemers, setAannemers] = useState<string[]>();
    const [filteredAannemers, setFilteredAannemers] = useState(null);
    const [oldname, setOldname] = useState<string>();

    const search = (event) => {
        setTimeout(() => {
            let _testitems;
            if (!event.query.trim().length) {
                _testitems = [...aannemers];
            }
            else {
                _testitems = aannemers.filter((aannemer) => {
                    return aannemer.toLowerCase().startsWith(event.query.toLowerCase());
                });
            }

            setFilteredAannemers(_testitems);
        }, 250);
    }

    useEffect(() => {
        routes.ValidateToken().then((status) => {
            if (status === 401) window.location.replace('/');
        });

        routes.ListOnderhoudsaannemersUnique().then((data) => {
            setAannemers(data.map((a: { Onderhoudsaannemer: string; }) => a.Onderhoudsaannemer));
        });

        const editWVI = searchParams.get("WVI");
        if (editWVI != null) {
            routes.GetWVIs().then((data: IWVI[]) => {
                const currentWVI = data.find(d => d.PMP_enkelvoudige_objectnaam === editWVI);
                const tempdata: INewWVI = WVIdata;
                tempdata.Contractgebiednummer = currentWVI.Contractgebiednummer;
                tempdata.Endpoint = currentWVI.Endpoint;
                tempdata.Equipmentnummer = currentWVI.Equipmentnummer;
                tempdata.Geocode = currentWVI.Geocode;
                tempdata.Objecttype = currentWVI.Objecttype;
                tempdata.PMP_enkelvoudige_objectnaam = currentWVI.PMP_enkelvoudige_objectnaam;
                tempdata.PPLG = currentWVI.PPLG;
                tempdata.Producent = currentWVI.Producent;
                tempdata['RD X-coordinaat'] = currentWVI['RD X-coordinaat'];
                tempdata['RD Y-coordinaat'] = currentWVI['RD Y-coordinaat'];
                tempdata.Datamodel = currentWVI.Datamodel;
                setOldname(tempdata.PMP_enkelvoudige_objectnaam);

                routes.GetAannemer(currentWVI.Contractgebiednummer).then((data) => {
                    tempdata.Aannemer = data[0].Onderhoudsaannemer;
                    setWVIdata({ ...tempdata });
                });               
            });
        }
    }, []);

    return (
        <>
            <div className="flex flex-col gap-y-[20px] absolute translate-y-[-50%] translate-x-[-50%] top-[40vh] left-[50%]">
                <div>
                    <div><span className="text-red-700">{errorText}</span></div>
                    <span className="text-lg ml-[15px]">Gegevens: </span>
                    <div className="flex gap-x-[50px] mt-[2vh] ml-[15px] justify-between">
                        <div className="flex flex-col gap-y-[20px]">
                            <div className="flex justify-between">
                                <span className="mr-[5px]">* Naam: </span>
                                <input className="text-black max-w-[200px]" onChange={e => {
                                    let tempdata = WVIdata;
                                    WVIdata.PMP_enkelvoudige_objectnaam = e.target.value;
                                    setWVIdata({ ...tempdata });
                                }} value={WVIdata.PMP_enkelvoudige_objectnaam}></input>
                            </div>                           
                            <div className="flex justify-between">
                                <span className="mr-[5px]">* Datamodel versie (1.7, 2.0, 2.1): </span>
                                <input className="text-black max-w-[200px]" onChange={e => {
                                    let tempdata = WVIdata;
                                    WVIdata.Datamodel = e.target.value;
                                    setWVIdata({ ...tempdata });
                                }} value={WVIdata.Datamodel}></input>
                            </div>  
                            <div className="flex justify-between">
                                <span className="mr-[5px]">* endpoint: </span>
                                <input className="text-black max-w-[200px]" onChange={e => {
                                    let tempdata = WVIdata;
                                    WVIdata.Endpoint = e.target.value;
                                    setWVIdata({ ...tempdata });
                                }} value={WVIdata.Endpoint}></input>
                            </div>  
                            <div className="flex justify-between">
                                <span className="mr-[5px]">Type: </span>
                                <input className="text-black max-w-[200px]" onChange={e => {
                                    let tempdata = WVIdata;
                                    WVIdata.Objecttype = e.target.value;
                                    setWVIdata({ ...tempdata });
                                }} value={WVIdata.Objecttype}></input>
                            </div>  
                            <div className="flex justify-between">
                                <span className="mr-[5px]">Equipmentnummer: </span>
                                <input className="text-black max-w-[200px]" type="number" onChange={e => {
                                    let tempdata = WVIdata;
                                    WVIdata.Equipmentnummer = Number.parseInt(e.target.value);
                                    setWVIdata({ ...tempdata });
                                }} value={WVIdata.Equipmentnummer}></input>
                            </div> 
                            <div className="flex justify-between">
                                <span className="mr-[5px]">PPLG: </span>
                                <input className="text-black max-w-[200px]" onChange={e => {
                                    let tempdata = WVIdata;
                                    WVIdata.PPLG = e.target.value;
                                    setWVIdata({ ...tempdata });
                                }} value={WVIdata.PPLG}></input>
                            </div>
                        </div>
                        <div className="flex flex-col gap-y-[20px]">
                            <div className="flex justify-between">
                                <span className="mr-[5px]">* Contractgebiednummer: </span>
                                {searchParams.get("WVI") == null ? <input className="text-black max-w-[200px]" type="number" min="0" step="1" onChange={e => {
                                    if (!/[0-9a-zA-Z]/.test(e.target.value) && e.target.value !== "") return;
                                    let tempdata = WVIdata;
                                    WVIdata.Contractgebiednummer = Number.parseInt(e.target.value);
                                    setWVIdata({ ...tempdata });
                                }} value={WVIdata.Contractgebiednummer}></input> :
                                    <input disabled className="text-black max-w-[200px]" type="number" min="0" step="1" value={WVIdata.Contractgebiednummer}></input>}
                            </div>
                            <div className="flex justify-between">
                                <span className="mr-[5px]">* Aannemer: </span>
                                <AutoComplete className="text-black max-w-[182px]" virtualScrollerOptions={{ itemSize: 35 }} value={WVIdata.Aannemer} suggestions={filteredAannemers} completeMethod={search} onChange={e => {
                                    let tempdata = WVIdata;
                                    tempdata.Aannemer = e.target.value;
                                    setWVIdata({ ...tempdata });
                                }} dropdown />
                            </div>
                            <div className="flex justify-between">
                                <span className="mr-[5px]">Leverancier: </span>
                                <input className="text-black max-w-[200px]" onChange={e => {
                                    let tempdata = WVIdata;
                                    WVIdata.Producent = e.target.value;
                                    setWVIdata({ ...tempdata });
                                }} value={WVIdata.Producent}></input>
                            </div>
                            <div className="flex justify-between">
                                <span className="mr-[5px]">Geocode: </span>
                                <input className="text-black max-w-[200px]" type="number" onChange={e => {
                                    let tempdata = WVIdata;
                                    WVIdata.Geocode = Number.parseInt(e.target.value);
                                    setWVIdata({ ...tempdata });
                                }} value={WVIdata.Geocode}></input>
                            </div>
                            <div className="flex justify-between">
                                <span className="mr-[5px]">RD X-coordinaat: </span>
                                <input className="text-black max-w-[200px]" type="number" onChange={e => {
                                    let tempdata = WVIdata;
                                    WVIdata["RD X-coordinaat"] = Number.parseInt(e.target.value);
                                    setWVIdata({ ...tempdata });
                                }} value={WVIdata["RD X-coordinaat"]}></input>
                            </div>
                            <div className="flex justify-between">
                                <span className="mr-[5px]">RD y-coordinaat: </span>
                                <input className="text-black max-w-[200px]" type="number" onChange={e => {
                                    let tempdata = WVIdata;
                                    WVIdata["RD Y-coordinaat"] = Number.parseInt(e.target.value);
                                    setWVIdata({ ...tempdata });
                                }} value={WVIdata["RD Y-coordinaat"]}></input>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="border-t-4 border-dashed pt-[10px]">
                    <span className="text-lg ml-[15px]">Acties: </span>
                    <div className="flex gap-x-[50px] ml-[15px] mt-[2vh] justify-between">
                        <div className="flex flex-col gap-y-[20px]">
                            {searchParams.get("WVI") == null ? <button className="bg-[#181452] p-[5px] rounded-lg hover:text-[1.1rem] transition-all duration-300 ease-in-out w-fit">Importeer WVI vanuit excel</button> :
                                <button className="bg-[#181452] p-[5px] rounded-lg hover:text-[1.1rem] transition-all duration-300 ease-in-out w-fit" onClick={() => {
                                    routes.DeleteWVI(WVIdata.PMP_enkelvoudige_objectnaam);
                                    window.location.replace('/AddWVI');
                                }}>Verwijderen</button>}
                            <button className="bg-[#181452] p-[5px] rounded-lg hover:text-[1.1rem] transition-all duration-300 ease-in-out w-fit" onClick={() => {
                                setConnectionStatus(2);
                                routes.IsOnline(WVIdata.Endpoint).then((statuscode) => {
                                    setErrorText("");                                 
                                    if (statuscode === 404) {
                                        setConnectionStatus(0);
                                    }
                                    else {
                                        setConnectionStatus(1);
                                    }
                                });
                            }}>Test WVI connectie</button>
                            <div className={"self-center " + (connectionStatus === 0 ? "text-red-700" : "text-green-700")}>
                                {connectionStatus === 0 ? "Kan geen verbinding maken." : connectionStatus === 1 ? "Verbinding gelukt!" : 
                                    connectionStatus === 2 ? <img src={loadingGif} width="30" height="30" alt="loading..." /> : ""}
                            </div>
                        </div>
                        <div className="flex flex-col gap-y-[20px]">
                            <button className="bg-[#181452] p-[5px] rounded-lg hover:text-[1.1rem] transition-all duration-300 ease-in-out w-fit">Test datamodel van WVI</button>
                            {searchParams.get("WVI") == null ? <button className="bg-[#181452] p-[5px] rounded-lg hover:text-[1.1rem] transition-all duration-300 ease-in-out w-fit" onClick={() => {
                                setConnectionStatus(-1);
                                if (WVIdata.PMP_enkelvoudige_objectnaam === "" || WVIdata.Endpoint === "" || WVIdata.Contractgebiednummer == null || WVIdata.Aannemer === "" || WVIdata.Datamodel === "") {
                                    console.log(WVIdata);
                                    setErrorText("De waarden met een * ervoor zijn verplicht.");
                                    return;
                                }

                                routes.AddWVI([WVIdata.PMP_enkelvoudige_objectnaam, WVIdata.PPLG, WVIdata.Objecttype, WVIdata.Geocode, WVIdata.Contractgebiednummer,
                                WVIdata.Equipmentnummer, WVIdata["RD X-coordinaat"], WVIdata["RD Y-coordinaat"], WVIdata.Producent, WVIdata.Endpoint, WVIdata.Datamodel, WVIdata.Aannemer]).then((status => {
                                    if (status === 409) {
                                        setErrorText("Dit contractgebied is al toegewezen aan een andere aannemer.");
                                    }
                                    else if (status === 500) {
                                        setErrorText("Er heeft zich een andere error plaatsgevonden. Is de naam van de kast uniek?");
                                    }
                                    else {
                                        setErrorText("");
                                    }
                                }));
                                window.location.replace('/AddWVI');
                            }}>Opslaan</button> : <button className="bg-[#181452] p-[5px] rounded-lg hover:text-[1.1rem] transition-all duration-300 ease-in-out w-fit" onClick={() => {
                                    setConnectionStatus(-1);
                                    if (WVIdata.PMP_enkelvoudige_objectnaam === "" || WVIdata.Endpoint === "" || WVIdata.Contractgebiednummer == null || WVIdata.Aannemer === "" || WVIdata.Datamodel === "") {
                                        console.log(WVIdata);
                                        setErrorText("De waarden met een * ervoor zijn verplicht.");
                                        return;
                                    }

                                    routes.UpdateWVI([WVIdata.PMP_enkelvoudige_objectnaam, WVIdata.PPLG, WVIdata.Objecttype, WVIdata.Geocode, WVIdata.Contractgebiednummer, WVIdata.Equipmentnummer, WVIdata['RD X-coordinaat'], WVIdata['RD Y-coordinaat'], WVIdata.Producent, WVIdata.Endpoint, WVIdata.Datamodel, oldname, WVIdata.Aannemer]).then((status) => {
                                        if (status === 409) {
                                            setErrorText("Dit contractgebied is al toegewezen aan een andere aannemer.");
                                        }
                                        else if (status === 500) {
                                            setErrorText("Er heeft zich een andere error plaatsgevonden. Is de naam van de kast uniek?");
                                        }
                                        else {
                                            setErrorText("");
                                        }
                                    });
                                    window.location.replace('/WVI');
                            }}>Bewerken</button>}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default AddWVI;