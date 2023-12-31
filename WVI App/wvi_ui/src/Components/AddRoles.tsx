/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import routes from '../Services/routes';
import '../tailwind.css';
import moreInfo from '../media/more_info.png';
import { IWVI, IWVIPermissions } from '../interfaces/interfaces';
import { AutoComplete } from 'primereact/autocomplete';

function AddRoles() {

    const [errorText, SetErrorText] = useState<string>();
    const [checkboxes, setCheckboxes] = useState<boolean[]>(new Array(21).fill(false));
    const [name, setName] = useState<string>();
    const [roles, setRoles] = useState<string[]>([]);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [searchParams, setSearchParams] = useSearchParams();
    const [uniqueWVIs, setUniqueWVIs] = useState<IWVIPermissions[]>(new Array(0));
    const [WVINames, setWVINames] = useState<string[]>([]);
    const [filteredWVIs, setFilteredWVIs] = useState(null);

    const searchWVIs = (event) => {
        setTimeout(() => {
            let _testitems;
            if (!event.query.trim().length) {
                _testitems = [...WVINames];
            }
            else {
                _testitems = WVINames.filter((WVIname) => {
                    return WVIname.toLowerCase().startsWith(event.query.toLowerCase());
                });
            }

            setFilteredWVIs(_testitems);
        }, 250);
    }

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
                case 17:
                    permissions += "onderhoudsaannemers.add;"
                    break;
                case 18:
                    permissions += "onderhoudsaannemers.update;"
                    break;
                case 19:
                    permissions += "onderhoudsaannemers.remove;"
                    break;
                case 20:
                    permissions += "wvi.defaultheatingcurve;"
                    break;
                default:
            }
        }

        for (var b = 0; b < uniqueWVIs.length; b++) {
            if (!uniqueWVIs[b].name) continue;
            if (uniqueWVIs[b].list) {
                permissions += `wvi.unique.${uniqueWVIs[b].name}.list;`;
            }
            if (uniqueWVIs[b].info) {
                permissions += `wvi.unique.${uniqueWVIs[b].name}.info;`;
            }
            if (uniqueWVIs[b].status) {
                permissions += `wvi.unique.${uniqueWVIs[b].name}.status;`;
            }
            if (uniqueWVIs[b].operate) {
                permissions += `wvi.unique.${uniqueWVIs[b].name}.operate;`;
            }
        }

        permissions = permissions.slice(0, -1);
        return permissions;
    };


    useEffect(() => {
        routes.ValidateToken().then((status) => {
            if (status === 401) window.location.replace('/');
        });

        routes.GetWVIs().then((WVIs: IWVI[]) => {
            setWVINames(WVIs.map((w: { PMP_enkelvoudige_objectnaam: string; }) => w.PMP_enkelvoudige_objectnaam))
        });

        routes.ListRoles().then((data: any[]) => {
            setRoles(data.map((a: { Role: any; }) => a.Role));
            const editRole = searchParams.get("Role");
            if (editRole === null) return;
            let permissions: string[] = data[data.findIndex(d => d.Role === editRole)].Permissions.split(";");
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
                    case "onderhoudsaannemers.add":
                        checkoxesTemp[17] = true;
                        break;
                    case "onderhoudsaannemers.update":
                        checkoxesTemp[18] = true;
                        break;
                    case "onderhoudsaannemers.remove":
                        checkoxesTemp[19] = true;
                        break;
                    case "wvi.defaultheatingcurve":
                        checkoxesTemp[20] = true;
                        break;
                    default:
                }
            }

            permissions = permissions.filter(item => item.includes("unique"));

            const grouped: { [key: string]: string[] } = {};
            for (var d = 0; d < permissions.length; d++) {
                const wvi = permissions[d].slice(11, permissions[d].lastIndexOf("."));
                if (!grouped[wvi]) {
                    grouped[wvi] = [];
                }
                grouped[wvi].push(permissions[d]);
            }
            const jaggedArray = Object.values(grouped);

            let tempArray: IWVIPermissions[] = [];
            for (var c = 0; c < jaggedArray.length; c++) {
                const wviName = jaggedArray[c][0].slice(11, jaggedArray[c][0].lastIndexOf("."));
                tempArray.push({
                    name: wviName,
                    list: false,
                    info: false,
                    status: false,
                    operate: false
                });
                for (var e = 0; e < jaggedArray[c].length; e++) {
                    switch (jaggedArray[c][e]) {
                        case `wvi.unique.${wviName}.list`:
                            tempArray[c].list = true;
                            break;
                        case `wvi.unique.${wviName}.status`:
                            tempArray[c].status = true;
                            break;
                        case `wvi.unique.${wviName}.info`:
                            tempArray[c].info = true;
                            break;
                        case `wvi.unique.${wviName}.operate`:
                            tempArray[c].operate = true;
                            break;
                        default:
                    }
                }
            }

            setUniqueWVIs([...tempArray]);
            setName(editRole);
            setCheckboxes([...checkoxesTemp]);
        });
    }, []);


    return (
        <div className="flex flex-col gap-y-[20px]">
            <div>
                <div><span className="text-red-700">{errorText}</span></div>
                <span className="text-lg">Role toevoegen: </span>
                <div className="flex gap-x-[50px] mt-[2vh] ml-[15px] justify-between">
                    <div className="flex flex-col gap-y-[20px]">
                        <div className="flex justify-between">
                            <span className="mr-[5px]">* Rol naam: </span>
                            {searchParams.get("Role") === null ? <input className="ml-[10px] text-black" value={name} type="text" onChange={async (e) => {
                                setName(e.target.value);
                            }} /> : 
                            <input className="ml-[10px] text-black" value={name} disabled type="text" onChange={async (e) => {
                                setName(e.target.value);
                            }} />}
                        </div>
                        <div className="flex justify-between">
                            <div className="flex">
                                <img title="Dit is nodig om de WVI's die zien die bij de aannemer horen" className="w-[20px] h-[20px] self-center" src={moreInfo} alt="" />
                                <span className="ml-[10px]">Toegang tot eigen WVI's: </span>
                            </div>
                            <input className="ml-[10px]" type="checkbox" checked={checkboxes[0]} onChange={async (e) => {
                                let checkboxesTemp = checkboxes;
                                checkboxesTemp[0] = !checkboxes[0];
                                setCheckboxes([...checkboxesTemp]);
                            }} />
                        </div>
                        <div className="flex justify-between">
                            <div className="flex">
                                <img title="Dit is nodig om de WVI's van de aannemer uit te kunnen lezen" className="w-[20px] h-[20px] self-center" src={moreInfo} alt="" />
                                <span className="ml-[10px]">Eigen WVI's uitlezen: </span>
                            </div>
                            <input className="ml-[10px]" type="checkbox" checked={checkboxes[1]} onChange={async (e) => {
                                let checkboxesTemp = checkboxes;
                                checkboxesTemp[1] = !checkboxes[1];
                                setCheckboxes([...checkboxesTemp]);
                            }} />
                        </div>
                        <div className="flex justify-between">
                            <div className="flex">
                                <img title="Dit is nodig om de status van de WVI's van de aannemer uit te kunnen lezen" className="w-[20px] h-[20px] self-center" src={moreInfo} alt="" />
                                <span className="ml-[10px]">Eigen WVI's status uitlezen: </span>
                            </div>
                            <input className="ml-[10px]" type="checkbox" checked={checkboxes[2]} onChange={async (e) => {
                                let checkboxesTemp = checkboxes;
                                checkboxesTemp[2] = !checkboxes[2];
                                setCheckboxes([...checkboxesTemp]);
                            }} />
                        </div>
                        <div className="flex justify-between">
                            <div className="flex">
                                <img title="Dit is nodig als de aannemer de default heating curve moet kunnen aanpassen." className="w-[20px] h-[20px] self-center" src={moreInfo} alt="" />
                                <span className="ml-[10px]">Default heating curve aanpassen: </span>
                            </div>
                            <input className="ml-[10px]" type="checkbox" checked={checkboxes[20]} onChange={async (e) => {
                                let checkboxesTemp = checkboxes;
                                checkboxesTemp[20] = !checkboxes[20];
                                setCheckboxes([...checkboxesTemp]);
                            }} />
                        </div>
                        <div className="flex justify-between">
                            <div className="flex">
                                <img title="Dit is nodig om de WVI's van de aannemer te kunnen besturen" className="w-[20px] h-[20px] self-center" src={moreInfo} alt="" />
                                <span className="ml-[10px]">Eigen WVI's besturen: </span>
                            </div>
                            <input className="ml-[10px]" type="checkbox" checked={checkboxes[3]} onChange={async (e) => {
                                let checkboxesTemp = checkboxes;
                                checkboxesTemp[3] = !checkboxes[3];
                                setCheckboxes([...checkboxesTemp]);
                            }} />
                        </div>
                        <div className="flex justify-between">
                            <div className="flex">
                                <img title="Dit is nodig om toegang te hebben tot alle WVi's. Dit is een optie voor een beheerders rol" className="w-[20px] h-[20px] self-center" src={moreInfo} alt="" />
                                <span className="ml-[10px]">Toegang tot alle WVI's: </span>
                            </div>
                            <input className="ml-[10px]" type="checkbox" checked={checkboxes[16]} onChange={async (e) => {
                                let checkboxesTemp = checkboxes;
                                checkboxesTemp[16] = !checkboxes[16];
                                setCheckboxes([...checkboxesTemp]);
                            }} />
                        </div>
                    </div>
                    <div className="flex flex-col gap-y-[20px]">
                        <div className="flex justify-between">
                            <div className="flex">
                                <img title="Dit is nodig om een WVI te kunnen toevoegen. Als je ook een WVI mag besturen wordt die optie uitgezet en heeft deze optie voorrang" className="w-[20px] h-[20px] self-center" src={moreInfo} alt="" />
                                <span className="ml-[10px]">WVI's toevoegen: </span>
                            </div>
                            <input className="ml-[10px]" type="checkbox" checked={checkboxes[4]} onChange={async (e) => {
                                let checkboxesTemp = checkboxes;
                                checkboxesTemp[4] = !checkboxes[4];
                                setCheckboxes([...checkboxesTemp]);
                            }} />
                        </div>
                        <div className="flex justify-between">
                            <div className="flex">
                                <img title="Dit is nodig om de informatie van een WVI te kunnen bewerken. Dit is een optie voor een beheerders rol" className="w-[20px] h-[20px] self-center" src={moreInfo} alt="" />
                                <span className="ml-[10px]">WVI's bewerken: </span>
                            </div>
                            <input className="ml-[10px]" type="checkbox" checked={checkboxes[5]} onChange={async (e) => {
                                let checkboxesTemp = checkboxes;
                                checkboxesTemp[5] = !checkboxes[5];
                                setCheckboxes([...checkboxesTemp]);
                            }} />
                        </div>
                        <div className="flex justify-between">
                            <div className="flex">
                                <img title="Dit is nodig om een WVI te kunnen verwijderen. Dit is een optie voor een beheerders rol" className="w-[20px] h-[20px] self-center" src={moreInfo} alt="" />
                                <span className="ml-[10px]">WVI's verwijderen: </span>
                            </div>
                            <input className="ml-[10px]" type="checkbox" checked={checkboxes[6]} onChange={async (e) => {
                                let checkboxesTemp = checkboxes;
                                checkboxesTemp[6] = !checkboxes[6];
                                setCheckboxes([...checkboxesTemp]);
                            }} />
                        </div>
                        <div className="flex justify-between">
                            <div className="flex">
                                <img title="Dit is nodig om alle accounts te kunnen zien en uitlezen. Dit is een optie voor een beheerders rol" className="w-[20px] h-[20px] self-center" src={moreInfo} alt="" />
                                <span className="ml-[10px]">Accounts uitlezen: </span>
                            </div>
                            <input className="ml-[10px]" type="checkbox" checked={checkboxes[7]} onChange={async (e) => {
                                let checkboxesTemp = checkboxes;
                                checkboxesTemp[7] = !checkboxes[7];
                                setCheckboxes([...checkboxesTemp]);
                            }} />
                        </div>
                        <div className="flex justify-between">
                            <div className="flex">
                                <img title="Dit is nodig om een account te kunnen toevoegen. Dit is een optie voor een beheerders rol" className="w-[20px] h-[20px] self-center" src={moreInfo} alt="" />
                                <span className="ml-[10px]">Accounts toevoegen: </span>
                            </div>
                            <input className="ml-[10px]" type="checkbox" checked={checkboxes[8]} onChange={async (e) => {
                                let checkboxesTemp = checkboxes;
                                checkboxesTemp[8] = !checkboxes[8];
                                setCheckboxes([...checkboxesTemp]);
                            }} />
                        </div>
                        <div className="flex justify-between">
                            <div className="flex">
                                <img title="Dit is nodig om een account te kunnen bewerken. Dit is een optie voor een beheerders rol" className="w-[20px] h-[20px] self-center" src={moreInfo} alt="" />
                                <span className="ml-[10px]">Accounts bewerken: </span>
                            </div>
                            <input className="ml-[10px]" type="checkbox" checked={checkboxes[9]} onChange={async (e) => {
                                let checkboxesTemp = checkboxes;
                                checkboxesTemp[9] = !checkboxes[9];
                                setCheckboxes([...checkboxesTemp]);
                            }} />
                        </div>
                        <div className="flex justify-between">
                            <div className="flex">
                                <img title="Dit is nodig om een account te kunnen verwijderen. Dit is een optie voor een beheerders rol" className="w-[20px] h-[20px] self-center" src={moreInfo} alt="" />
                                <span className="ml-[10px]">Accounts verwijderen: </span>
                            </div>
                            <input className="ml-[10px]" type="checkbox" checked={checkboxes[10]} onChange={async (e) => {
                                let checkboxesTemp = checkboxes;
                                checkboxesTemp[10] = !checkboxes[10];
                                setCheckboxes([...checkboxesTemp]);
                            }} />
                        </div>
                    </div>
                    <div className="flex flex-col gap-y-[20px]">
                        <div className="flex justify-between">
                            <div className="flex">
                                <img title="Dit is nodig om alle rollen te kunnen zien en uitlezen. Dit is een optie voor een beheerders rol" className="w-[20px] h-[20px] self-center" src={moreInfo} alt="" />
                                <span className="ml-[10px]">Rollen uitlezen: </span>
                            </div>
                            <input className="ml-[10px]" type="checkbox" checked={checkboxes[11]} onChange={async (e) => {
                                let checkboxesTemp = checkboxes;
                                checkboxesTemp[11] = !checkboxes[11];
                                setCheckboxes([...checkboxesTemp]);
                            }} />
                        </div>
                        <div className="flex justify-between">
                            <div className="flex">
                                <img title="Dit is nodig om een rol te kunnen toevoegen. Dit is een optie voor een beheerders rol" className="w-[20px] h-[20px] self-center" src={moreInfo} alt="" />
                                <span className="ml-[10px]">Rollen toevoegen: </span>
                            </div>
                            <input className="ml-[10px]" type="checkbox" checked={checkboxes[12]} onChange={async (e) => {
                                let checkboxesTemp = checkboxes;
                                checkboxesTemp[12] = !checkboxes[12];
                                setCheckboxes([...checkboxesTemp]);
                            }} />
                        </div>
                        <div className="flex justify-between">
                            <div className="flex">
                                <img title="Dit is nodig om een rol te kunnen bewerken. Dit is een optie voor een beheerders rol" className="w-[20px] h-[20px] self-center" src={moreInfo} alt="" />
                                <span className="ml-[10px]">Rollen bewerken: </span>
                            </div>
                            <input className="ml-[10px]" type="checkbox" checked={checkboxes[13]} onChange={async (e) => {
                                let checkboxesTemp = checkboxes;
                                checkboxesTemp[13] = !checkboxes[13];
                                setCheckboxes([...checkboxesTemp]);
                            }} />
                        </div>
                        <div className="flex justify-between">
                            <div className="flex">
                                <img title="Dit is nodig om een rol te kunnen verwijderen. Dit is een optie voor een beheerders rol" className="w-[20px] h-[20px] self-center" src={moreInfo} alt="" />
                                <span className="ml-[10px]">Rollen verwijderen: </span>
                            </div>
                            <input className="ml-[10px]" type="checkbox" checked={checkboxes[14]} onChange={async (e) => {
                                let checkboxesTemp = checkboxes;
                                checkboxesTemp[14] = !checkboxes[14];
                                setCheckboxes([...checkboxesTemp]);
                            }} />
                        </div>
                        <div className="flex justify-between">
                            <div className="flex">
                                <img title="Dit is nodig om aannemers te kunnen uitlezen. Deze optie is ook nodig als de rol ook accounts kan bewerken / aanmaken. Dit is een optie voor een beheerders rol" className="w-[20px] h-[20px] self-center" src={moreInfo} alt="" />
                                <span className="ml-[10px]">Aannemers uitlezen: </span>
                            </div>
                            <input className="ml-[10px]" type="checkbox" checked={checkboxes[15]} onChange={async (e) => {
                                let checkboxesTemp = checkboxes;
                                checkboxesTemp[15] = !checkboxes[15];
                                setCheckboxes([...checkboxesTemp]);
                            }} />
                        </div>
                        <div className="flex justify-between">
                            <div className="flex">
                                <img title="Dit is nodig om een nieuwe aannemer te kunnen toevoegen. Dit is een optie voor een beheerders rol" className="w-[20px] h-[20px] self-center" src={moreInfo} alt="" />
                                <span className="ml-[10px]">Aannemers toevoegen: </span>
                            </div>
                            <input className="ml-[10px]" type="checkbox" checked={checkboxes[17]} onChange={async (e) => {
                                let checkboxesTemp = checkboxes;
                                checkboxesTemp[17] = !checkboxes[17];
                                setCheckboxes([...checkboxesTemp]);
                            }} />
                        </div>
                        <div className="flex justify-between">
                            <div className="flex">
                                <img title="Dit is nodig om een aannemer te kunnen bewerken. Dit is een optie voor een beheerders rol" className="w-[20px] h-[20px] self-center" src={moreInfo} alt="" />
                                <span className="ml-[10px]">Aannemers bewerken: </span>
                            </div>
                            <input className="ml-[10px]" type="checkbox" checked={checkboxes[18]} onChange={async (e) => {
                                let checkboxesTemp = checkboxes;
                                checkboxesTemp[18] = !checkboxes[18];
                                setCheckboxes([...checkboxesTemp]);
                            }} />
                        </div>
                        <div className="flex justify-between">
                            <div className="flex">
                                <img title="Dit is nodig om een aannemer te kunnen verwijderen. Dit is een optie voor een beheerders rol" className="w-[20px] h-[20px] self-center" src={moreInfo} alt="" />
                                <span className="ml-[10px]">Aannemers verwijderen: </span>
                            </div>
                            <input className="ml-[10px]" type="checkbox" checked={checkboxes[19]} onChange={async (e) => {
                                let checkboxesTemp = checkboxes;
                                checkboxesTemp[19] = !checkboxes[19];
                                setCheckboxes([...checkboxesTemp]);
                            }} />
                        </div>
                    </div>
                </div>
            </div>
            <div className="border-t-4 border-dashed pt-[10px]">
                <span className="text-lg ml-[15px]">Andere WVI toegang: </span>
                <div className="grid grid-cols-3 gap-[10px] p-[10px] w-full border-2 overflow-y-scroll max-h-[260px]">
                    {uniqueWVIs.map((wviPermissions, index) =>
                        <div className="border-2 h-fit flex flex-col p-[5px]">
                            <div className="flex">
                                <span>naam: </span>
                                <AutoComplete onChange={(e) => {
                                    let tempArray = uniqueWVIs;
                                    tempArray[index].name = e.target.value;
                                    setUniqueWVIs([...tempArray]);
                                }} value={uniqueWVIs[index].name} dropdown suggestions={filteredWVIs} completeMethod={searchWVIs} virtualScrollerOptions={{ itemSize: 35 }} className="w-[180px] ml-[10px] text-black"></AutoComplete>
                            </div>
                            <div className="flex justify-between">
                                <span>Toegang: </span>
                                <input onChange={(e) => {
                                    let tempArray = uniqueWVIs;
                                    tempArray[index].list = e.target.checked;
                                    setUniqueWVIs([...tempArray]);
                                }} checked={uniqueWVIs[index].list} type="checkbox"></input>
                            </div>
                            <div className="flex justify-between">
                                <span>status: </span>
                                <input onChange={(e) => {
                                    let tempArray = uniqueWVIs;
                                    tempArray[index].status = e.target.checked;
                                    setUniqueWVIs([...tempArray]);
                                }} checked={uniqueWVIs[index].status} type="checkbox"></input>
                            </div>
                            <div className="flex justify-between">
                                <span>Uitlezen: </span>
                                <input onChange={(e) => {
                                    let tempArray = uniqueWVIs;
                                    tempArray[index].info = e.target.checked;
                                    setUniqueWVIs([...tempArray]);
                                }} checked={uniqueWVIs[index].info} type="checkbox"></input>
                            </div>
                            <div className="flex justify-between">
                                <span>Besturen: </span>
                                <input onChange={(e) => {
                                    let tempArray = uniqueWVIs;
                                    tempArray[index].operate = e.target.checked;
                                    setUniqueWVIs([...tempArray]);
                                }} checked={uniqueWVIs[index].operate} type="checkbox"></input>
                            </div>
                        </div>)
                    }
                    <div className="border-2 h-[134px] relative">
                        <button onClick={() => {
                            let tempArray = uniqueWVIs;
                            tempArray.push({
                                name: "",
                                list: true,
                                info: true,
                                status: true,
                                operate: false
                            });
                            setUniqueWVIs([...tempArray]);
                        }} className="bg-[#181452] p-[5px] rounded-lg hover:text-[1.1rem] transition-all duration-300 ease-in-out w-fit absolute translate-y-[-50%] translate-x-[-50%] top-[50%] left-[50%]">Toevoegen</button>
                    </div>
                </div>
            </div>
            <div className="border-t-4 border-dashed pt-[10px]">
                <span className="text-lg ml-[15px]">Acties: </span>
                <div className="flex gap-x-[50px] ml-[15px] mt-[2vh] justify-between">
                    <div className="flex flex-col gap-y-[20px]">
                        <button className="bg-[#181452] p-[5px] rounded-lg hover:text-[1.1rem] transition-all duration-300 ease-in-out w-fit" onClick={() => {
                            let checkboxesTemp = checkboxes;
                            checkboxesTemp[0] = true;
                            checkboxesTemp[1] = true;
                            checkboxesTemp[2] = true;
                            checkboxesTemp[3] = true;
                            setCheckboxes([...checkboxesTemp]);
                        }}>Aannemer template toepassen</button>
                        <button className="bg-[#181452] p-[5px] rounded-lg hover:text-[1.1rem] transition-all duration-300 ease-in-out w-fit" onClick={() => {
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
                            checkboxesTemp[17] = true;
                            checkboxesTemp[18] = true;
                            checkboxesTemp[19] = true;
                            setCheckboxes([...checkboxesTemp]);
                        }}>beheerder template toepassen</button>
                    </div>
                    <div className="flex flex-col gap-y-[20px]">
                        {searchParams.get("Role") === null ? <button className="bg-[#181452] p-[5px] rounded-lg hover:text-[1.1rem] transition-all duration-300 ease-in-out w-fit" onClick={() => {
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
                            <button className="bg-[#181452] p-[5px] rounded-lg hover:text-[1.1rem] transition-all duration-300 ease-in-out w-fit" onClick={() => {
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