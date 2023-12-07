import { useEffect, useState } from 'react';
import { IRoles } from '../interfaces/interfaces';
import routes from '../Services/routes';
import '../tailwind.css';

function Roles() {
    const [roles, setRoles] = useState<IRoles[]>();
    const [show, setShow] = useState<boolean>(false);

    useEffect(() => {
        routes.ValidateToken().then((status) => {
            if (status === 401) window.location.replace('/');
        });

        routes.GetRolesAndPermissions().then((data) => {
            setRoles(data);
            setShow(true);
        });
    }, []);

    return (
        <>
            {show ? <div className="h-[50vh] overflow-y-scroll absolute translate-y-[-50%] translate-x-[-50%] top-[50%] left-[50%]">
                <table className="w-full text-sm text-left text-white mt-[1vh]">
                    <tbody>
                        <td className="p-6 py-4 text-white">
                            Role
                        </td>
                        <td className="px-6 py-4">
                            Permissions
                        </td>
                        <td className="px-6 py-4">
                            Acties
                        </td>
                        {roles.map((role, index) => <tr key={index} className="bg-[#262739] border-b border-gray-700">
                            <td className="p-6 py-4 text-white">
                                {role.Role}
                            </td>
                            <td className="px-6 py-4">
                                {role.Permissions.split(';').map((permission) => (
                                    <div>
                                        {permission}
                                    </div>
                                ))}
                            </td>
                            <td className="px-6 py-4 flex flex-col gap-y-[5px]">
                                {role.Role !== "beheerder" ? <button className="bg-[#181452] p-[5px] rounded-lg hover:text-[1.1rem] transition-all duration-300 ease-in-out" onClick={async () => {
                                    routes.RemoveRole(role.Role).then((status) => {
                                        if (status === 403) {
                                            alert('Er zijn nog accounts die deze rol gebruiken. Verwijder eerst deze accounts voordat u deze rol verwijderd');
                                            return;
                                        }
                                        routes.RebuildEnforcerPolicies();
                                        window.location.reload();
                                    });
                                }}>
                                    Verwijderen
                                </button> : ""}
                                <button className="bg-[#181452] p-[5px] rounded-lg hover:text-[1.1rem] transition-all duration-300 ease-in-out" onClick={async () => {
                                    window.location.replace(`/AddRoles?Role=${role.Role}`);
                                }}>
                                    Bewerken
                                </button>
                            </td>
                        </tr>)}
                    </tbody>
                </table>
            </div> : ""}
        </>
    );
}

export default Roles;