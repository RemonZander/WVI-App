import React, { useEffect, useState } from 'react';
import { INewWVI } from '../interfaces/interfaces';
import routes from '../Services/routes';
import '../tailwind.css';

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

    useEffect(() => {
        routes.ValidateToken().then((status) => {
            if (status === 401) window.location.replace('/');
        });
    }, []);

    return (
        <>
            <div className="flex flex-col gap-y-[20px] absolute translate-y-[-50%] translate-x-[-50%] top-[50%] left-[50%]">
                <div>
                    <span className="text-lg ml-[15px]">Gegevens: </span>
                    <div className="flex gap-x-[50px] mt-[2vh] ml-[15px] justify-between">
                        <div className="flex flex-col gap-y-[20px]">
                            <div className="flex justify-between">
                                <span className="mr-[5px]">Naam: </span>
                                <input className="text-black max-w-[150px]" value={WVIdata.PMP_enkelvoudige_objectnaam}></input>
                            </div>                           
                            <div className="flex justify-between">
                                <span className="mr-[5px]">Datamodel: </span>
                                <input className="text-black max-w-[150px]" value={WVIdata.datamodel}></input>
                            </div>  
                            <div className="flex justify-between">
                                <span className="mr-[5px]">endpoint: </span>
                                <input className="text-black max-w-[150px]" value={WVIdata.Endpoint}></input>
                            </div>  
                            <div className="flex justify-between">
                                <span className="mr-[5px]">Type: </span>
                                <input className="text-black max-w-[150px]" value={WVIdata.Objecttype}></input>
                            </div>  
                            <div className="flex justify-between">
                                <span className="mr-[5px]">Equipmentnummer: </span>
                                <input className="text-black max-w-[150px]" value={WVIdata.Equipmentnummer}></input>
                            </div> 
                            <div className="flex justify-between">
                                <span className="mr-[5px]">Template: </span>
                                <input className="text-black max-w-[150px]" value={WVIdata.Template}></input>
                            </div> 
                        </div>
                        <div className="flex flex-col gap-y-[20px]">
                            <div className="flex justify-between">
                                <span className="mr-[5px]">Contractgebiednummer: </span>
                                <input className="text-black max-w-[150px]" value={WVIdata.Contractgebiednummer}></input>
                            </div>
                            <div className="flex justify-between">
                                <span className="mr-[5px]">Producent: </span>
                                <input className="text-black max-w-[150px]" value={WVIdata.Producent}></input>
                            </div>
                            <div className="flex justify-between">
                                <span className="mr-[5px]">Geocode: </span>
                                <input className="text-black max-w-[150px]" value={WVIdata.Geocode}></input>
                            </div>
                            <div className="flex justify-between">
                                <span className="mr-[5px]">RD X-coordinaat: </span>
                                <input className="text-black max-w-[150px]" value={WVIdata["RD X-coordinaat"]}></input>
                            </div>
                            <div className="flex justify-between">
                                <span className="mr-[5px]">RD y-coordinaat: </span>
                                <input className="text-black max-w-[150px]" value={WVIdata["RD Y-coordinaat"]}></input>
                            </div>
                            <div className="flex justify-between">
                                <span className="mr-[5px]">PPLG: </span>
                                <input className="text-black max-w-[150px]" value={WVIdata.PPLG}></input>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="border-t-4 border-dashed pt-[10px]">
                    <span className="text-lg ml-[15px]">Acties: </span>
                    <div className="flex gap-x-[50px] ml-[15px] mt-[2vh] justify-between">
                        <div className="flex flex-col gap-y-[20px]">
                            <button>Importeer WVI vanuit excel</button>
                            <button>Test WVI connectie</button>
                        </div>
                        <div className="flex flex-col gap-y-[20px]">
                            <button>Test datamodel van WVI</button>
                            <button onClick={() => {
                                
                            }}>Opslaan</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default AddWVI;