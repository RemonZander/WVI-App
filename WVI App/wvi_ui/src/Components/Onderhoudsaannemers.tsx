import React, { useEffect, useState } from 'react';
import '../tailwind.css';
import routes from '../Services/routes';
import { AutoComplete } from 'primereact/autocomplete';

function Onderhoudsaannemers() {
    const [onderhoudsaannemers, setOnderhoudsaannemers] = useState([{ Contractgebiednummer: 0, Onderhoudsaannemer: "" }]);
    const [aannemers, setAannemers] = useState<string[]>();
    const [showOnderhoudsaannemers, setShowOnderhoudsaannemers] = useState<boolean[]>([]);
    const [filteredAannemers, setFilteredAannemers] = useState(null);
    const [showScreen, setShowScreen] = useState<boolean>(false);
    const [addNewOnderhoudsaannemerView, setAddNewOnderhoudsaannemerView] = useState<boolean>(false);
    const [newContractgebied, setNewContractgebied] = useState<number>();
    const [newAannemer, setNewAannemer] = useState<string>();

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
            if (status !== 200) {
                window.location.replace('/');
                return;
            }
        });

        routes.ListOnderhoudsaannemersUnique().then((data) => {
            setAannemers(data.map((a: { Onderhoudsaannemer: string; }) => a.Onderhoudsaannemer));
            setShowOnderhoudsaannemers([...new Array(data.length).fill(false)]);
        });

        routes.ListOnderhoudsaannemers().then((data) => {
            setOnderhoudsaannemers(data);
        });

        setShowScreen(true);
    }, []);

    return (
        <>
            {showScreen ?
            <div className="mt-[100px]">
                <div className="h-[50vh] overflow-y-scroll">
                    <table>
                        <tbody>
                            <td className="p-6 py-4 text-white">
                                Contractgebiednummer
                            </td>
                            <td className="px-6 py-4">
                                Onderhoudsaannemer
                            </td>
                            <td className="px-6 py-4">
                                Acties
                            </td>
                            {onderhoudsaannemers.map((aannemer, index) => <tr key={index} className="bg-[#262739] border-b border-gray-700">
                                <th scope="row" className="p-6 py-4 text-white">
                                    {aannemer.Contractgebiednummer}
                                </th>
                                <td className="px-6 py-4">
                                    {showOnderhoudsaannemers[index] ?
                                        <AutoComplete className="text-black max-w-[182px]" virtualScrollerOptions={{ itemSize: 35 }} value={aannemer.Onderhoudsaannemer} suggestions={filteredAannemers} completeMethod={search} onChange={e => {
                                            let tempdata = onderhoudsaannemers;
                                            tempdata[index].Onderhoudsaannemer = e.target.value;
                                            setOnderhoudsaannemers([...tempdata]);
                                        }} dropdown />
                                        : aannemer.Onderhoudsaannemer}
                                </td>
                                <td className="px-6 py-4 flex flex-col gap-y-[5px]">
                                    <button className="bg-[#181452] p-[5px] rounded-lg hover:text-[1.1rem] transition-all duration-300 ease-in-out" onClick={async () => {
                                        routes.RemoveContractgebied(aannemer.Contractgebiednummer).then((status) => {
                                            if (status === 500) {
                                                alert("Er zijn nog WVI's geregistreerd met dit contractgebiednummer. Verwijder deze eerst.");
                                                return;
                                            }
                                            window.location.reload();
                                        });
                                    }}>
                                        Verwijderen
                                    </button>
                                    <button className="bg-[#181452] p-[5px] rounded-lg hover:text-[1.1rem] transition-all duration-300 ease-in-out" onClick={async () => {
                                        if (showOnderhoudsaannemers[index]) {
                                            routes.UpdateContractgebied(aannemer.Onderhoudsaannemer, aannemer.Contractgebiednummer);
                                        }
                                        let tempData = showOnderhoudsaannemers;
                                        tempData[index] = !tempData[index];
                                        setShowOnderhoudsaannemers([...tempData]);
                                    }}>
                                        Bewerken
                                    </button>
                                </td>
                            </tr>)}
                        </tbody>
                    </table>
                </div>
                <div className="flex-col pt-[10px] relative">
                        {addNewOnderhoudsaannemerView ?
                            <table>
                                <tbody>
                                    <tr className="bg-[#262739] border-b border-gray-700">
                                        <td className="p-6 py-4 text-white">
                                            <span>Contractgebied: </span>
                                            <input className="max-w-[75px] text-black" onChange={(e) => {
                                                if (e.target.value.includes("-")) {
                                                    setNewContractgebied(NaN);
                                                    return;
                                                }
                                                setNewContractgebied(Number.parseInt(e.target.value));
                                            }} type="number" min="0" value={newContractgebied}></input>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span>Aannemer: </span>
                                            <input className="max-w-[150px] text-black" onChange={(e) => { setNewAannemer(e.target.value); }} type="text" value={newAannemer}></input>
                                        </td>
                                        <td className="px-6 py-4">
                                   
                                        </td>
                                    </tr>  
                                </tbody>
                            </table> : ""}
                        <button className="absolute left-[50%] translate-x-[-50%] bg-[#181452] p-[5px] rounded-lg hover:text-[1.1rem] transition-all duration-300 ease-in-out mt-[10px]" onClick={() => {
                            if (!addNewOnderhoudsaannemerView) setAddNewOnderhoudsaannemerView(!addNewOnderhoudsaannemerView);
                            if (onderhoudsaannemers.find(a => a.Contractgebiednummer === newContractgebied)){
                                alert(`Het contractgebied nummer: ${newContractgebied} is al toegewezen aan een aannemer, bewerk of verwijder deze entry of kies een ander nummer.`);
                                return;
                            }
                            else if (newContractgebied && newAannemer) {
                                routes.AddContractgebied(newAannemer, newContractgebied).then((status) => {
                                    console.log(status);
                                    if (status === 200) {
                                        setNewContractgebied(NaN);
                                        setNewAannemer("");
                                        setAddNewOnderhoudsaannemerView(false);
                                    }
                                });
                            }
                            setAddNewOnderhoudsaannemerView(!addNewOnderhoudsaannemerView);
                        }}>
                            entry toevoegen
                        </button>
                </div>
            </div> : ""}
        </>
    );
}

export default Onderhoudsaannemers;