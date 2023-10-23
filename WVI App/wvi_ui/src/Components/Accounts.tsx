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

    useEffect(() => {
        routes.ValidateToken().then((status) => {
            if (status === 401) window.location.replace('/');
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
    }, []);

    return (
        <div className="h-[50vh] overflow-y-scroll absolute translate-y-[-50%] translate-x-[-50%] top-[50%] left-[50%]">
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
                    {accounts.map((account, index) => <tr className="bg-[#262739] border-b border-gray-700">
                        <td className="p-6 py-4 text-white">
                            {account.Email}
                        </td>
                        <td className="px-6 py-4">
                            {addOnderhoudsaannemer[index] ? 
                                <><button id="dropdownDefaultButton" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" type="button">Onderhoudsaannemers
                                    <svg className="w-2.5 h-2.5 ml-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4" />
                                    </svg>
                                </button>
                                    <div className="z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700">
                                        <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
                                            <li>
                                                <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Verwijder account</a>
                                            </li>
                                            <li>
                                                <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Rol aanpassen</a>
                                            </li>
                                            <li>
                                                <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">hjhgj</a>
                                            </li>
                                        </ul>
                                    </div>
                                </>
                                : account.Onderhoudsaannemer}
                        </td>
                        <td className="px-6 py-4">
                            {changeRole[index] ?
                                <>
                                    <button id="dropdownDefaultButton" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" type="button">Rollen
                                        <svg className="w-2.5 h-2.5 ml-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4" />
                                        </svg>
                                    </button>
                                    <div className="z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700">
                                        <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
                                            {roles.map((role, index) =>
                                                <li>
                                                    <a href="#" onClick={async () => {
                                                        await routes.UpdateRole(account.Email, role);
                                                        await routes.GetAllAccounts().then((data: IAccount[]) => {
                                                            setAccounts(data);

                                                            let boolarray = [];
                                                            for (var a = 0; a < data.length; a++) {
                                                                boolarray.push(false);
                                                            }
                                                            setDropDown([...boolarray]);
                                                        });
                                                    }} className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">{role}</a>
                                                </li>
                                            )}
                                        </ul>
                                    </div>
                                </> : account.Role}
                        </td>
                        <td>
                            <button id="dropdownDefaultButton" onClick={() => {
                                let boolarray = dropDown;
                                for (var a = 0; a < boolarray.length; a++) {
                                    if (a === index) {
                                        boolarray[index] = !boolarray[index];
                                        continue;
                                    }
                                    boolarray[a] = false;
                                }
                                setDropDown([...boolarray]);
                            }} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" type="button">Acties
                                <svg className="w-2.5 h-2.5 ml-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4" />
                                </svg>
                            </button>
                            {dropDown[index] ? <div className="z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700">
                                <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
                                    <li>
                                        <a href="#" onClick={async () => {
                                            await routes.DeleteAccount(account.Email);
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
                                        <a href="#" onClick={() => {
                                            let boolarray = changeRole;
                                            for (var a = 0; a < boolarray.length; a++) {
                                                if (a === index) {
                                                    boolarray[index] = !boolarray[index];
                                                    continue;
                                                }
                                                boolarray[a] = false;
                                            }
                                            setChangeRole([...boolarray]);
                                        }} className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Rol aanpassen</a>
                                    </li>
                                    <li>
                                        <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"><span>IS aannemer</span>
                                            <input className="ml-[10px]" type="checkbox" value="" onChange={async (e) => {
                                                if (e.target.checked && account.Onderhoudsaannemer == null) {
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
                                                else if (!e.target.checked){
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