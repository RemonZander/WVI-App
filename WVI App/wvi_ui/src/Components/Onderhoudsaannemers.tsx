import React, { useEffect, useState } from 'react';
import '../tailwind.css';
import routes from '../Services/routes';

function Onderhoudsaannemers() {
    const [onderhoudsaannemers, setOnderhoudsaannemers] = useState([{ Contractgebiednummer: 0, Onderhoudsaannemer: "" }]);

    useEffect(() => {
        routes.ValidateToken().then((status) => {
            if (status !== 200) {
                window.location.replace('/');
                return;
            }
        });

        routes.ListOnderhoudsaannemers().then((data) => {
            setOnderhoudsaannemers(data);
        });
    }, []);

    return (
        <div className="absolute translate-y-[-50%] translate-x-[-50%] top-[40vh] left-[50%]">
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
                                {aannemer.Onderhoudsaannemer}
                            </td>
                            <td className="px-6 py-4 flex flex-col gap-y-[5px]">
                                <button className="bg-[#181452] p-[5px] rounded-lg hover:text-[1.1rem] transition-all duration-300 ease-in-out" onClick={async () => {

                                }}>
                                    Verwijderen
                                </button>
                                <button className="bg-[#181452] p-[5px] rounded-lg hover:text-[1.1rem] transition-all duration-300 ease-in-out" onClick={async () => {
                                
                                }}>
                                    Bewerken
                                </button>
                            </td>
                        </tr>)}
                    </tbody>
                </table>
            </div>
            <div>
                <button>
                    entry toevoegen
                </button>
            </div>
        </div>
    );
}

export default Onderhoudsaannemers;