import React, { useEffect, useState } from 'react';
import { IAccount } from '../interfaces/interfaces';
import routes from '../Services/routes';
import '../tailwind.css';

function Accounts() {
    const [accounts, setAccounts] = useState<IAccount[]>([]);

    useEffect(() => {
        routes.GetAllAccounts().then((data: IAccount[]) => {
            setAccounts(data);
            console.log(data);
        });
    }, []);

    return (
        <div className="ml-[1%] overflow-y-scroll">
            <table className="w-full text-sm text-left text-white mt-[1vh]">
                <tbody>
                    <td className="p-6 py-4 text-white">
                        Email address
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
                    {accounts.map((account) => <tr className="bg-[#262739] border-b border-gray-700">
                        <td className="p-6 py-4 text-white">
                            {account.Email}
                        </td>
                        <td className="px-6 py-4">
                            {account.Onderhoudsaannemer}
                        </td>
                        <td className="px-6 py-4">
                            {account.Role}
                        </td>
                    </tr>)}
                </tbody>
            </table>
        </div>
    );
}

export default Accounts;