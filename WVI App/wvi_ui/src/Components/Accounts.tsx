/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from 'react';
import { IAccount } from '../interfaces/interfaces';
import routes from '../Services/routes';
import '../tailwind.css';

function Accounts() {
    const [accounts, setAccounts] = useState<IAccount[]>([]);
    const [dropDown, setDropDown] = useState<boolean[]>([]);
    const [addOnderhoudsaannemer, setAddOnderhoudsaannemer] = useState<boolean[]>([]);
    const [changeRole, setChangeRole] = useState<boolean[]>([]);
    const [roles, setRoles] = useState<string[]>([]);
    const [showRoles, setShowRoles] = useState(false);
    const [showOnderhoudsaannemers, setShowOnderhoudsaannemers] = useState(false);
    const [onderhoudsaannemers, setOnderhoudsaannemers] = useState<string[]>([]);
    const [ownEmail, setOwnEmail] = useState<string>();

    useEffect(() => {
        routes.ValidateToken().then((status) => {
            if (status === 401) window.location.replace('/');
        });

        routes.GetEmail().then((res) => {
            res.json().then((email) => {
                setOwnEmail(email);
            });
        });

        routes.GetAllAccounts().then((data: IAccount[]) => {
            setAccounts(data);

            let boolarray = [];
            for (var a = 0; a < data.length; a++) {
                boolarray.push(false);
            }

            setChangeRole([...boolarray]);
            setAddOnderhoudsaannemer([...boolarray]);
            setDropDown([...boolarray]);
        });

        routes.ListRoles().then((data) => {
            setRoles(data.map((a: { Role: any; }) => a.Role));
        });

        routes.ListOnderhoudsaannemersUnique().then((data) => {
            setOnderhoudsaannemers(data.map((a: { Onderhoudsaannemer: any; }) => a.Onderhoudsaannemer));
        });
    }, []);

    return (
        <div className="h-[50vh] overflow-y-scroll mt-[100px]">
            <table className="w-full text-sm text-left text-white mt-[1vh]">
                <tbody>
                    <td className="p-6 py-4 text-white">
                        Account
                    </td>
                    <td className="px-6 py-4">
                        Onderhoudsaannemer
                    </td>
                    <td className="px-6 py-4">
                        Role
                    </td>
                    <td className="px-6 py-4">
                        Acties
                    </td>
                    {accounts.map((account, index) => <tr key={index} className="bg-[#262739] border-b border-gray-700">
                        <td className="p-6 py-4 text-white">
                            {account.Email}
                        </td>
                        <td className="px-6 py-4">
                            {addOnderhoudsaannemer[index] ? 
                                <><button id="dropdownDefaultButton" onClick={() => { setShowOnderhoudsaannemers(!showOnderhoudsaannemers); } } className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" type="button">Onderhoudsaannemers
                                    <svg className="w-2.5 h-2.5 ml-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
                                    </svg>
                                </button>
                                    {showOnderhoudsaannemers ? <div className="z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700">
                                        <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
                                            {onderhoudsaannemers.map((onderhoudsaannemer, index) =>
                                                <li>
                                                    <a href="#" onClick={async () => {
                                                        await routes.UpdateOnderhoudsaannemer(account.Email, onderhoudsaannemer);
                                                        await routes.GetAllAccounts().then((data: IAccount[]) => {
                                                            setAccounts(data);

                                                            let boolarray = [];
                                                            for (var a = 0; a < data.length; a++) {
                                                                boolarray.push(false);
                                                            }
                                                            setDropDown([...boolarray]);
                                                            setAddOnderhoudsaannemer([...boolarray]);
                                                            setShowOnderhoudsaannemers(false);
                                                        });
                                                    }} className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">{onderhoudsaannemer}</a>
                                                </li>
                                            )}
                                        </ul>
                                    </div> : ''}
                                </>
                                : account.Onderhoudsaannemer}
                        </td>
                        <td className="px-6 py-4">
                            {changeRole[index] ?
                                <>
                                    <button id="dropdownDefaultButton" onClick={() => { setShowRoles(!showRoles); } } className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" type="button">Rollen
                                        <svg className="w-2.5 h-2.5 ml-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
                                        </svg>
                                    </button>
                                    {showRoles ? <div className="z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700">
                                        <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
                                            {roles.map((role, index) =>
                                                <li>
                                                    <a href="#" onClick={async () => {
                                                        await routes.UpdateRoleInAccount(account.Email, role);
                                                        await routes.RebuildEnforcerPolicies();
                                                        await routes.GetAllAccounts().then((data: IAccount[]) => {
                                                            setAccounts(data);

                                                            let boolarray = [];
                                                            for (var a = 0; a < data.length; a++) {
                                                                boolarray.push(false);
                                                            }
                                                            setDropDown([...boolarray]);
                                                            setChangeRole([...boolarray]);
                                                            setShowRoles(false);
                                                        });
                                                    }} className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">{role}</a>
                                                </li>
                                            )}
                                        </ul>
                                    </div> : ''}
                                </> : account.Role}
                        </td>
                        <td>
                            {account.Email !== ownEmail && account.Email !== "beheer@prorail.nl" ? <button id="dropdownDefaultButton" onClick={() => {
                                let boolarray = dropDown;
                                for (var a = 0; a < boolarray.length; a++) {
                                    if (a === index) {
                                        boolarray[index] = !boolarray[index];
                                        continue;
                                    }
                                    boolarray[a] = false;
                                }
                                if (!boolarray[index]) {
                                    setChangeRole([...boolarray]);
                                    setAddOnderhoudsaannemer([...boolarray]);
                                    setShowRoles(false);
                                    setShowOnderhoudsaannemers(false);
                                }
                                setDropDown([...boolarray]);
                                boolarray[index] = false;
                                setChangeRole([...boolarray]);
                                setAddOnderhoudsaannemer([...boolarray]);
                                setShowRoles(false);
                                setShowOnderhoudsaannemers(false);
                            }} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" type="button">Acties
                                <svg className="w-2.5 h-2.5 ml-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
                                </svg>
                            </button> : ""}
                            {dropDown[index] ? <div className="z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700">
                                <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
                                    <li>
                                        <a href="#" onClick={async () => {
                                            await routes.DeleteAccount(account.Email);
                                            await routes.RebuildEnforcerPolicies();
                                            await routes.GetAllAccounts().then((data: IAccount[]) => {
                                                setAccounts(data);

                                                let boolarray = [];
                                                for (var a = 0; a < data.length; a++) {
                                                    boolarray.push(false);
                                                }
                                                setDropDown([...boolarray]);
                                            });
                                        }} className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Verwijder account</a>
                                    </li>
                                    <li>
                                        <a href="#" onClick={async () => {
                                            let boolarray = changeRole;
                                            for (var a = 0; a < boolarray.length; a++) {
                                                if (a === index) {
                                                    boolarray[index] = !boolarray[index];
                                                    continue;
                                                }
                                                boolarray[a] = false;
                                            }
                                            setChangeRole([...boolarray]);
                                            setShowRoles(false);
                                        }} className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Rol aanpassen</a>
                                    </li>
                                    <li>
                                        <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"><span>IS aannemer</span>
                                            <input className="ml-[10px]" type="checkbox" value="" onChange={async (e) => {
                                                setShowOnderhoudsaannemers(false);
                                                if (e.target.checked && (account.Onderhoudsaannemer == null || account.Onderhoudsaannemer === "")) {
                                                    let boolarray = addOnderhoudsaannemer;
                                                    for (var a = 0; a < boolarray.length; a++) {
                                                        if (a === index) {
                                                            boolarray[index] = !boolarray[index];
                                                            continue;
                                                        }
                                                        boolarray[a] = false;
                                                    }
                                                    setAddOnderhoudsaannemer([...boolarray]);
                                                }
                                                else if (!e.target.checked && account.Onderhoudsaannemer !== null) {
                                                    await routes.UpdateOnderhoudsaannemer(account.Email, "");
                                                    await routes.GetAllAccounts().then((data: IAccount[]) => {
                                                        setAccounts(data);

                                                        let boolarray = [];
                                                        for (var a = 0; a < data.length; a++) {
                                                            boolarray.push(false);
                                                        }
                                                        setDropDown([...boolarray]);
                                                    });
                                                }
                                                else if (!e.target.checked) {
                                                    let boolarray = addOnderhoudsaannemer;
                                                    for (var b = 0; b < boolarray.length; b++) {
                                                        boolarray[b] = false;
                                                    }
                                                    setAddOnderhoudsaannemer([...boolarray]);
                                                }
                                            }} defaultChecked={account.Onderhoudsaannemer !== null && account.Onderhoudsaannemer !== ""}/></a>
                                    </li>
                                </ul>
                            </div> : ''}
                        </td>
                    </tr>)}
                </tbody>
            </table>
        </div>       
    );
}

export default Accounts;