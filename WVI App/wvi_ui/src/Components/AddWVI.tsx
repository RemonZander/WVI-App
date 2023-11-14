/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { INewWVI, IWVI } from '../interfaces/interfaces';
import routes from '../Services/routes';
import '../tailwind.css';
import loadingGif from '../media/loading.gif';
import { useSearchParams } from 'react-router-dom';

function AddWVI() {
    const [WVIdata, setWVIdata] = useState<INewWVI>({
        "datamodel": [],
        "PMP_enkelvoudige_objectnaam": "",
        "PPLG": "",
        "Geocode": null,
        "Contractgebiednummer": null,
        "Equipmentnummer": null,
        "PUIC": "",
        "RD X-coordinaat": null,
        "RD Y-coordinaat": null,
        "Template": "",
        "Producent": "",
        "Endpoint": "",
        "Objecttype": ""
    });
    const [errorText, setErrorText] = useState<string>();
    const [connectionStatus, setConnectionStatus] = useState<number>(-1);
    const [searchParams, setSearchParams] = useSearchParams();
    //const [currentWVI, setCurentWVI] = useState<IWVI>();

    useEffect(() => {
        routes.ValidateToken().then((status) => {
            if (status === 401) window.location.replace('/');
        });

        const editWVI = searchParams.get("WVI");
        if (editWVI != null) {
            routes.GetWVIs().then((data: IWVI[]) => {
                console.log(data);
                const currentWVI = data.find(d => d.PMP_enkelvoudige_objectnaam === editWVI);
                WVIdata.Contractgebiednummer = currentWVI.Contractgebiednummer;
                WVIdata.Endpoint = currentWVI.Endpoint;
                WVIdata.Equipmentnummer = currentWVI.Equipmenetnummer;
                WVIdata.Geocode = currentWVI.Geocode;
                WVIdata.Objecttype = currentWVI.Objecttype;
                WVIdata.PMP_enkelvoudige_objectnaam = currentWVI.PMP_enkelvoudige_objectnaam;
                WVIdata.PPLG = currentWVI.PPLG;
                WVIdata.Producent = currentWVI.Producent;
                WVIdata['RD X-coordinaat'] = currentWVI['RD X-coordinaat'];
                WVIdata['RD Y-coordinaat'] = currentWVI['RD Y-coordinaat'];
                WVIdata.Template = currentWVI.Template;
            });
        }
    }, []);

    return (
        <>
            <div className="flex flex-col gap-y-[20px] absolute translate-y-[-50%] translate-x-[-50%] top-[50%] left-[50%]">
                <div>
                    <div><span className="text-red-700">{errorText}</span></div>
                    <span className="text-lg ml-[15px]">Gegevens: </span>
                    <div className="flex gap-x-[50px] mt-[2vh] ml-[15px] justify-between">
                        <div className="flex flex-col gap-y-[20px]">
                            <div className="flex justify-between">
                                <span className="mr-[5px]">* Naam: </span>
                                <input className="text-black max-w-[150px]" onChange={e => {
                                    let tempdata = WVIdata;
                                    WVIdata.PMP_enkelvoudige_objectnaam = e.target.value;
                                    setWVIdata({ ...tempdata });
                                }} value={WVIdata.PMP_enkelvoudige_objectnaam}></input>
                            </div>                           
                            <div className="flex justify-between">
                                <span className="mr-[5px]">Datamodel: </span>
                                <input className="text-black max-w-[150px]" onChange={e => {
                                    //let tempdata = WVIdata;
                                    //WVIdata.datamodel = e.target.value;
                                    //setWVIdata({ ...tempdata });
                                }} value={WVIdata.datamodel}></input>
                            </div>  
                            <div className="flex justify-between">
                                <span className="mr-[5px]">* endpoint: </span>
                                <input className="text-black max-w-[150px]" onChange={e => {
                                    let tempdata = WVIdata;
                                    WVIdata.Endpoint = e.target.value;
                                    setWVIdata({ ...tempdata });
                                }} value={WVIdata.Endpoint}></input>
                            </div>  
                            <div className="flex justify-between">
                                <span className="mr-[5px]">Type: </span>
                                <input className="text-black max-w-[150px]" onChange={e => {
                                    let tempdata = WVIdata;
                                    WVIdata.Objecttype = e.target.value;
                                    setWVIdata({ ...tempdata });
                                }} value={WVIdata.Objecttype}></input>
                            </div>  
                            <div className="flex justify-between">
                                <span className="mr-[5px]">Equipmentnummer: </span>
                                <input className="text-black max-w-[150px]" type="number" onChange={e => {
                                    let tempdata = WVIdata;
                                    WVIdata.Equipmentnummer = Number.parseInt(e.target.value);
                                    setWVIdata({ ...tempdata });
                                }} value={WVIdata.Equipmentnummer}></input>
                            </div> 
                            <div className="flex justify-between">
                                <span className="mr-[5px]">Template: </span>
                                <input className="text-black max-w-[150px]" onChange={e => {
                                    let tempdata = WVIdata;
                                    WVIdata.Template = e.target.value;
                                    setWVIdata({ ...tempdata });
                                }} value={WVIdata.Template}></input>
                            </div> 
                        </div>
                        <div className="flex flex-col gap-y-[20px]">
                            <div className="flex justify-between">
                                <span className="mr-[5px]">* Contractgebiednummer: </span>
                                <input className="text-black max-w-[150px]" type="number" min="0" step="1" onChange={e => {
                                    let tempdata = WVIdata;
                                    WVIdata.Contractgebiednummer = Number.parseInt(e.target.value);
                                    setWVIdata({ ...tempdata });
                                }} value={WVIdata.Contractgebiednummer}></input>
                            </div>
                            <div className="flex justify-between">
                                <span className="mr-[5px]">* Producent: </span>
                                <input className="text-black max-w-[150px]" onChange={e => {
                                    let tempdata = WVIdata;
                                    WVIdata.Producent = e.target.value;
                                    setWVIdata({ ...tempdata });
                                }} value={WVIdata.Producent}></input>
                            </div>
                            <div className="flex justify-between">
                                <span className="mr-[5px]">Geocode: </span>
                                <input className="text-black max-w-[150px]" type="number" onChange={e => {
                                    let tempdata = WVIdata;
                                    WVIdata.Geocode = Number.parseInt(e.target.value);
                                    setWVIdata({ ...tempdata });
                                }} value={WVIdata.Geocode}></input>
                            </div>
                            <div className="flex justify-between">
                                <span className="mr-[5px]">RD X-coordinaat: </span>
                                <input className="text-black max-w-[150px]" type="number" onChange={e => {
                                    let tempdata = WVIdata;
                                    WVIdata["RD X-coordinaat"] = Number.parseInt(e.target.value);
                                    setWVIdata({ ...tempdata });
                                }} value={WVIdata["RD X-coordinaat"]}></input>
                            </div>
                            <div className="flex justify-between">
                                <span className="mr-[5px]">RD y-coordinaat: </span>
                                <input className="text-black max-w-[150px]" type="number" onChange={e => {
                                    let tempdata = WVIdata;
                                    WVIdata["RD Y-coordinaat"] = Number.parseInt(e.target.value);
                                    setWVIdata({ ...tempdata });
                                }} value={WVIdata["RD Y-coordinaat"]}></input>
                            </div>
                            <div className="flex justify-between">
                                <span className="mr-[5px]">PPLG: </span>
                                <input className="text-black max-w-[150px]" onChange={e => {
                                    let tempdata = WVIdata;
                                    WVIdata.PPLG = e.target.value;
                                    setWVIdata({ ...tempdata });
                                }} value={WVIdata.PPLG}></input>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="border-t-4 border-dashed pt-[10px]">
                    <span className="text-lg ml-[15px]">Acties: </span>
                    <div className="flex gap-x-[50px] ml-[15px] mt-[2vh] justify-between">
                        <div className="flex flex-col gap-y-[20px]">
                            <button>Importeer WVI vanuit excel</button>
                            <button onClick={() => {
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
                            <button>Test datamodel van WVI</button>
                            {searchParams.get("WVI") == null ? <button onClick={() => {
                                setConnectionStatus(-1);
                                if (WVIdata.PMP_enkelvoudige_objectnaam === "" || WVIdata.Endpoint === "" || WVIdata.Contractgebiednummer == null || WVIdata.Producent === "") {
                                    setErrorText("De waarden met een * ervoor zijn verplicht.");
                                    return;
                                }

                                routes.AddWVI([WVIdata.PMP_enkelvoudige_objectnaam, WVIdata.PPLG, WVIdata.Objecttype, WVIdata.Geocode, WVIdata.Contractgebiednummer,
                                WVIdata.Equipmentnummer, WVIdata["RD X-coordinaat"], WVIdata["RD Y-coordinaat"], WVIdata.Template, WVIdata.Producent, WVIdata.Endpoint]).then((status => {
                                    if (status === 409) {
                                        setErrorText("Dit contractgebied is al toegewezen aan een andere aannemer.");
                                    }
                                    else if (status === 500) {
                                        setErrorText("Er heeft zich een andere error plaatsgevonden. IS de naam van de kast uniek?");
                                    }
                                    else {
                                        setErrorText("");
                                    }
                                }));
                            }}>Opslaan</button> : <button onClick={() => {
                                    routes.UpdateWVI([WVIdata.PMP_enkelvoudige_objectnaam, WVIdata.PPLG, WVIdata.Objecttype, WVIdata.Geocode, WVIdata.Contractgebiednummer, WVIdata.Equipmentnummer, WVIdata['RD X-coordinaat'], WVIdata['RD Y-coordinaat'], WVIdata.Template, WVIdata.Producent, WVIdata.Endpoint, WVIdata.PMP_enkelvoudige_objectnaam]);
                            }}>Bewerken</button>}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default AddWVI;