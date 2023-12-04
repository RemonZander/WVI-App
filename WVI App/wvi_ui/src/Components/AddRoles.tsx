/* eslint-disable react-hooks/exhaustive-deps */
import React, { Component, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import routes from '../Services/routes';
import '../tailwind.css';

function AddRoles() {

    const [errorText, SetErrorText] = useState<string>();
    const [checkboxes, setCheckboxes] = useState<boolean[]>(new Array(17).fill(false));
    const [name, setName] = useState<string>();
    const [roles, setRoles] = useState<string[]>([]);
    const [searchParams, setSearchParams] = useSearchParams();


    const MakePermissionString = (): string => {
        let permissions = "";
        for (var a = 0; a < checkboxes.length; a++) {
            if (!checkboxes[a]) continue;
            switch (a) {
                case 0:
                    permissions += "wvi.own.list;"
                    break;
                case 1:
                    permissions += "wvi.own.info;"
                    break;
                case 2:
                    permissions += "wvi.own.status;"
                    break;
                case 3:
                    permissions += "wvi.own.operate;"
                    break;
                case 4:
                    permissions += "wvi.add;"
                    break;
                case 5:
                    permissions += "wvi.update;"
                    break;
                case 6:
                    permissions += "wvi.remove;"
                    break;
                case 7:
                    permissions += "account.list;"
                    break;
                case 8:
                    permissions += "account.add;"
                    break;
                case 9:
                    permissions += "account.update;"
                    break;
                case 10:
                    permissions += "account.remove;"
                    break;
                case 11:
                    permissions += "roles.list;"
                    break;
                case 12:
                    permissions += "roles.add;"
                    break;
                case 13:
                    permissions += "roles.update;"
                    break;
                case 14:
                    permissions += "roles.remove;"
                    break;
                case 15:
                    permissions += "onderhoudsaannemers.list;"
                    break;
                case 16:
                    permissions += "wvi.all.list;"
                    break;
                default:
            }
        }

        permissions = permissions.slice(0, -1);
        return permissions;
    };


    useEffect(() => {
        routes.ValidateToken().then((status) => {
            if (status === 401) window.location.replace('/');
        });

        routes.ListRoles().then((data: any[]) => {
            setRoles(data.map((a: { Role: any; }) => a.Role));
            const editRole = searchParams.get("Role");
            if (editRole === null) return;
            const permissions = data[data.findIndex(d => d.Role === editRole)].Permissions.split(";");
            let checkoxesTemp = new Array(17).fill(false);
            for (var a = 0; a < permissions.length; a++) {
                switch (permissions[a]) {
                    case "wvi.own.list":
                        checkoxesTemp[0] = true;
                        break;
                    case "wvi.own.info":
                        checkoxesTemp[1] = true;
                        break;
                    case "wvi.own.status":
                        checkoxesTemp[2] = true;
                        break;
                    case "wvi.own.operate":
                        checkoxesTemp[3] = true;
                        break;
                    case "wvi.add":
                        checkoxesTemp[4] = true;
                        break;
                    case "wvi.update":
                        checkoxesTemp[5] = true;
                        break;
                    case "wvi.remove":
                        checkoxesTemp[6] = true;
                        break;
                    case "account.list":
                        checkoxesTemp[7] = true;
                        break;
                    case "account.add":
                        checkoxesTemp[8] = true;
                        break;
                    case "account.update":
                        checkoxesTemp[9] = true;
                        break;
                    case "account.remove":
                        checkoxesTemp[10] = true;
                        break;
                    case "roles.list":
                        checkoxesTemp[11] = true;
                        break;
                    case "roles.add":
                        checkoxesTemp[12] = true;
                        break;
                    case "roles.update":
                        checkoxesTemp[13] = true;
                        break;
                    case "roles.remove":
                        checkoxesTemp[14] = true;
                        break;
                    case "onderhoudsaannemers.list":
                        checkoxesTemp[15] = true;
                        break;
                    case "wvi.all.list":
                        checkoxesTemp[16] = true;
                        break;
                    default:
                }
            }
            setName(editRole);
            setCheckboxes([...checkoxesTemp]);
        });
    }, []);


    return (
        <div className="flex flex-col gap-y-[20px] absolute translate-y-[-50%] translate-x-[-50%] top-[50%] left-[50%]">
            <div>
                <div><span className="text-red-700">{errorText}</span></div>
                <span className="text-lg">Role toevoegen: </span>
                <div className="flex gap-x-[50px] mt-[2vh] ml-[15px] justify-between">
                    <div className="flex flex-col gap-y-[20px]">
                        <div className="flex justify-between">
                            <span className="mr-[5px]">* Naam: </span>
                            {searchParams.get("Role") === null ? <input className="ml-[10px] text-black" value={name} type="text" onChange={async (e) => {
                                setName(e.target.value);
                            }} /> : 
                            <input className="ml-[10px] text-black" value={name} disabled type="text" onChange={async (e) => {
                                setName(e.target.value);
                            }} />}
                        </div>
                        <div className="flex justify-between">
                            <span className="mr-[5px]">Toegang tot eigen WVI's: </span>
                            <input className="ml-[10px]" type="checkbox" checked={checkboxes[0]} onChange={async (e) => {
                                let checkboxesTemp = checkboxes;
                                checkboxesTemp[0] = !checkboxes[0];
                                setCheckboxes([...checkboxesTemp]);
                            }} />
                        </div>
                        <div className="flex justify-between">
                            <span className="mr-[5px]">Eigen WVI's uitlezen: </span>
                            <input className="ml-[10px]" type="checkbox" checked={checkboxes[1]} onChange={async (e) => {
                                let checkboxesTemp = checkboxes;
                                checkboxesTemp[1] = !checkboxes[1];
                                setCheckboxes([...checkboxesTemp]);
                            }} />
                        </div>
                        <div className="flex justify-between">
                            <span className="mr-[5px]">Eigen WVI's status uitlezen: </span>
                            <input className="ml-[10px]" type="checkbox" checked={checkboxes[2]} onChange={async (e) => {
                                let checkboxesTemp = checkboxes;
                                checkboxesTemp[2] = !checkboxes[2];
                                setCheckboxes([...checkboxesTemp]);
                            }} />
                        </div>
                        <div className="flex justify-between">
                            <span className="mr-[5px]">Eigen WVI's besturen: </span>
                            <input className="ml-[10px]" type="checkbox" checked={checkboxes[3]} onChange={async (e) => {
                                let checkboxesTemp = checkboxes;
                                checkboxesTemp[3] = !checkboxes[3];
                                setCheckboxes([...checkboxesTemp]);
                            }} />
                        </div>
                        <div className="flex justify-between">
                            <span className="mr-[5px]">Toegang tot alle WVI's: </span>
                            <input className="ml-[10px]" type="checkbox" checked={checkboxes[16]} onChange={async (e) => {
                                let checkboxesTemp = checkboxes;
                                checkboxesTemp[16] = !checkboxes[16];
                                setCheckboxes([...checkboxesTemp]);
                            }} />
                        </div>
                    </div>
                    <div className="flex flex-col gap-y-[20px]">
                        <div className="flex justify-between">
                            <span className="mr-[5px]">WVI's toevoegen: </span>
                            <input className="ml-[10px]" type="checkbox" checked={checkboxes[4]} onChange={async (e) => {
                                let checkboxesTemp = checkboxes;
                                checkboxesTemp[4] = !checkboxes[4];
                                setCheckboxes([...checkboxesTemp]);
                            }} />
                        </div>
                        <div className="flex justify-between">
                            <span className="mr-[5px]">WVI's bewerken: </span>
                            <input className="ml-[10px]" type="checkbox" checked={checkboxes[5]} onChange={async (e) => {
                                let checkboxesTemp = checkboxes;
                                checkboxesTemp[5] = !checkboxes[5];
                                setCheckboxes([...checkboxesTemp]);
                            }} />
                        </div>
                        <div className="flex justify-between">
                            <span className="mr-[5px]">WVI's verwijderen: </span>
                            <input className="ml-[10px]" type="checkbox" checked={checkboxes[6]} onChange={async (e) => {
                                let checkboxesTemp = checkboxes;
                                checkboxesTemp[6] = !checkboxes[6];
                                setCheckboxes([...checkboxesTemp]);
                            }} />
                        </div>
                        <div className="flex justify-between">
                            <span className="mr-[5px]">Accounts uitlezen: </span>
                            <input className="ml-[10px]" type="checkbox" checked={checkboxes[7]} onChange={async (e) => {
                                let checkboxesTemp = checkboxes;
                                checkboxesTemp[7] = !checkboxes[7];
                                setCheckboxes([...checkboxesTemp]);
                            }} />
                        </div>
                        <div className="flex justify-between">
                            <span className="mr-[5px]">Accounts toevoegen: </span>
                            <input className="ml-[10px]" type="checkbox" checked={checkboxes[8]} onChange={async (e) => {
                                let checkboxesTemp = checkboxes;
                                checkboxesTemp[8] = !checkboxes[8];
                                setCheckboxes([...checkboxesTemp]);
                            }} />
                        </div>
                        <div className="flex justify-between">
                            <span className="mr-[5px]">Accounts bewerken: </span>
                            <input className="ml-[10px]" type="checkbox" checked={checkboxes[9]} onChange={async (e) => {
                                let checkboxesTemp = checkboxes;
                                checkboxesTemp[9] = !checkboxes[9];
                                setCheckboxes([...checkboxesTemp]);
                            }} />
                        </div>
                       
                    </div>
                    <div className="flex flex-col gap-y-[20px]">
                        <div className="flex justify-between">
                            <span className="mr-[5px]">Accounts verwijderen: </span>
                            <input className="ml-[10px]" type="checkbox" checked={checkboxes[10]} onChange={async (e) => {
                                let checkboxesTemp = checkboxes;
                                checkboxesTemp[10] = !checkboxes[10];
                                setCheckboxes([...checkboxesTemp]);
                            }} />
                        </div>
                        <div className="flex justify-between">
                            <span className="mr-[5px]">Rollen uitlezen: </span>
                            <input className="ml-[10px]" type="checkbox" checked={checkboxes[11]} onChange={async (e) => {
                                let checkboxesTemp = checkboxes;
                                checkboxesTemp[11] = !checkboxes[11];
                                setCheckboxes([...checkboxesTemp]);
                            }} />
                        </div>
                        <div className="flex justify-between">
                            <span className="mr-[5px]">Rollen toevoegen: </span>
                            <input className="ml-[10px]" type="checkbox" checked={checkboxes[12]} onChange={async (e) => {
                                let checkboxesTemp = checkboxes;
                                checkboxesTemp[12] = !checkboxes[12];
                                setCheckboxes([...checkboxesTemp]);
                            }} />
                        </div>
                        <div className="flex justify-between">
                            <span className="mr-[5px]">Rollen bewerken: </span>
                            <input className="ml-[10px]" type="checkbox" checked={checkboxes[13]} onChange={async (e) => {
                                let checkboxesTemp = checkboxes;
                                checkboxesTemp[13] = !checkboxes[13];
                                setCheckboxes([...checkboxesTemp]);
                            }} />
                        </div>
                        <div className="flex justify-between">
                            <span className="mr-[5px]">Rollen verwijderen: </span>
                            <input className="ml-[10px]" type="checkbox" checked={checkboxes[14]} onChange={async (e) => {
                                let checkboxesTemp = checkboxes;
                                checkboxesTemp[14] = !checkboxes[14];
                                setCheckboxes([...checkboxesTemp]);
                            }} />
                        </div>
                        <div className="flex justify-between">
                            <span className="mr-[5px]">Aannemers uitlezen: </span>
                            <input className="ml-[10px]" type="checkbox" checked={checkboxes[15]} onChange={async (e) => {
                                let checkboxesTemp = checkboxes;
                                checkboxesTemp[15] = !checkboxes[15];
                                setCheckboxes([...checkboxesTemp]);
                            }} />
                        </div>
                    </div>
                </div>
            </div>
            <div className="border-t-4 border-dashed pt-[10px]">
                <span className="text-lg ml-[15px]">Acties: </span>
                <div className="flex gap-x-[50px] ml-[15px] mt-[2vh] justify-between">
                    <div className="flex flex-col gap-y-[20px]">
                        <button onClick={() => {
                            let checkboxesTemp = checkboxes;
                            checkboxesTemp[0] = true;
                            checkboxesTemp[1] = true;
                            checkboxesTemp[2] = true;
                            checkboxesTemp[3] = true;
                            setCheckboxes([...checkboxesTemp]);
                        }}>Aannemer template toepassen</button>
                        <button onClick={() => {
                            let checkboxesTemp = checkboxes;
                            checkboxesTemp[4] = true;
                            checkboxesTemp[5] = true;
                            checkboxesTemp[6] = true;
                            checkboxesTemp[7] = true;
                            checkboxesTemp[8] = true;
                            checkboxesTemp[9] = true;
                            checkboxesTemp[10] = true;
                            checkboxesTemp[11] = true;
                            checkboxesTemp[12] = true;
                            checkboxesTemp[13] = true;
                            checkboxesTemp[14] = true;
                            checkboxesTemp[15] = true;
                            checkboxesTemp[16] = true;
                            setCheckboxes([...checkboxesTemp]);
                        }}>beheerder template toepassen</button>
                    </div>
                    <div className="flex flex-col gap-y-[20px]">
                        {searchParams.get("Role") === null ? <button onClick={() => {
                            if (name === "" || name == null) {
                                SetErrorText("U moet wel een naam voor een rol invullen");
                                return;
                            }
                            else if (roles.includes(name)) {
                                SetErrorText("Er is al een rol met deze naam");
                                return;
                            }
                            SetErrorText("");

                            const permissions = MakePermissionString();                  
                            routes.AddRole(name, permissions).then((status) => {
                                if (status === 200) {
                                    routes.RebuildEnforcerPolicies();
                                    window.location.replace("/AddRoles");
                                }
                            });
                        }}>Opslaan</button> : 
                            <button onClick={() => {
                                const permissions = MakePermissionString();
                                routes.UpdateRole(name, permissions).then((status) => {
                                    if (status === 200) {
                                        routes.RebuildEnforcerPolicies();
                                        window.location.replace("/Roles");
                                    }
                                });
                            }}>Bewerken</button>}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddRoles;