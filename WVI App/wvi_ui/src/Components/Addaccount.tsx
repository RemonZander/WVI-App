import { AutoComplete } from 'primereact/autocomplete';
import React, { useEffect, useState } from 'react';
import { INewAccount } from '../interfaces/interfaces';
import routes from '../Services/routes';
import '../tailwind.css';

function Addaccount() {
    const [acccountGegevens, setAccountGegevens] = useState<INewAccount>({
        "Email": "",
        "Onderhoudsaannemer": "",
        "Wachtwoord": "",
        "Role": ""
    });
    const [roles, setRoles] = useState<string[]>();
    const [filteredRoles, setFilteredRoles] = useState(null);
    const [filteredAannemers, setFilteredAannemers] = useState(null);
    const [aannemers, setAannemers] = useState<string[]>();
    const [errorText, SetErrorText] = useState<string>();

    const searchRoles = (event) => {
        setTimeout(() => {
            let _testitems;
            if (!event.query.trim().length) {
                _testitems = [...roles];
            }
            else {
                _testitems = roles.filter((role) => {
                    return role.toLowerCase().startsWith(event.query.toLowerCase());
                });
            }

            setFilteredRoles(_testitems);
        }, 250);
    }

    const searchAannemers = (event) => {
        setTimeout(() => {
            let _testitems;
            if (!event.query.trim().length) {
                _testitems = [...aannemers];
            }
            else {
                _testitems = aannemers.filter((role) => {
                    return role.toLowerCase().startsWith(event.query.toLowerCase());
                });
            }

            setFilteredAannemers(_testitems);
        }, 250);
    }

    useEffect(() => {
        routes.ValidateToken().then((status) => {
            if (status === 401) window.location.replace('/');
        });

        routes.ListRoles().then((data) => {
            setRoles(data.map((a: { Role: string; }) => a.Role));
        });

        routes.ListOnderhoudsaannemers().then((data) => {
            setAannemers(data.map((a: { Onderhoudsaannemer: string; }) => a.Onderhoudsaannemer));
        });
    }, []);


    return (
        <div className="flex flex-col gap-y-[20px] absolute translate-y-[-50%] translate-x-[-50%] top-[50%] left-[50%]">
            <div>
                <div><span className="text-red-700">{errorText}</span></div>
                <span className="text-lg">Account gegevens: </span>
                <div className="flex gap-x-[50px] mt-[2vh] ml-[15px] justify-between">
                    <div className="flex flex-col gap-y-[20px]">
                        <div className="flex justify-between">
                            <span className="mr-[5px]">* Email: </span>
                            <input className="text-black max-w-[200px]" onChange={e => {
                                let tempdata = acccountGegevens;
                                acccountGegevens.Email = e.target.value;
                                setAccountGegevens({ ...tempdata });
                            }} value={acccountGegevens.Email}></input>
                        </div>
                        <div className="flex justify-between">
                            <span className="mr-[5px]">* Wachtwoord: </span>
                            <input className="text-black max-w-[200px]" onChange={e => {
                                let tempdata = acccountGegevens;
                                acccountGegevens.Wachtwoord = e.target.value;
                                setAccountGegevens({ ...tempdata });
                            }} value={acccountGegevens.Wachtwoord}></input>
                        </div>
                    </div>
                    <div className="flex flex-col gap-y-[20px]">
                        <div className="flex justify-between">
                            <span className="mr-[5px]">* Role: </span>
                            <AutoComplete className="text-black max-w-[200px]" virtualScrollerOptions={{ itemSize: 35 }} value={acccountGegevens.Role} suggestions={filteredRoles} completeMethod={searchRoles} onChange={e => {
                                let tempdata = acccountGegevens;
                                acccountGegevens.Role = e.target.value;
                                setAccountGegevens({ ...tempdata });
                            }} dropdown />
                        </div>
                        <div className="flex justify-between">
                            <span className="mr-[5px]">Onderhoudsaannemer: </span>
                            <AutoComplete className="text-black max-w-[200px]" virtualScrollerOptions={{ itemSize: 35 }} value={acccountGegevens.Onderhoudsaannemer} suggestions={filteredAannemers} completeMethod={searchAannemers} onChange={e => {
                                let tempdata = acccountGegevens;
                                acccountGegevens.Onderhoudsaannemer = e.target.value;
                                setAccountGegevens({ ...tempdata });
                            }} dropdown />
                        </div>
                    </div>
                </div>
            </div>
            <div className="border-t-4 border-dashed pt-[10px]">
                <span className="text-lg ml-[15px]">Acties: </span>
                <div className="flex gap-x-[50px] ml-[15px] mt-[2vh] justify-between">
                    <div className="flex flex-col gap-y-[20px]">
                        <button onClick={() => {
                            if (acccountGegevens.Email === "" || acccountGegevens.Wachtwoord === "" || acccountGegevens.Role === "") {
                                SetErrorText("De waarden met een * ervoor zijn verplicht.");
                                return;
                            }
                            SetErrorText("");
                            routes.AddAccount(acccountGegevens.Email, acccountGegevens.Wachtwoord, acccountGegevens.Role, acccountGegevens.Onderhoudsaannemer).then((status) => {
                                if (status === 200)
                                {
                                    routes.RebuildEnforcerPolicies();
                                    window.location.replace("/Addaccount");
                                }
                            });
                        }}>Opslaan</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Addaccount;