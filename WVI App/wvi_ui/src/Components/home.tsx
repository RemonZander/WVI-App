import React, { useEffect, useState } from 'react';
import { createBrowserRouter, Link, RouterProvider } from 'react-router-dom';
import '../tailwind.css';
import logo from '../media/proraillogo.png';
import WVI from './WVI';
import AddWVI from './AddWVI';
import Accounts from './Accounts';
import Addaccount from './Addaccount';
import Login from './Login';
import routes from '../Services/routes';
import { PrimeReactProvider } from 'primereact/api';
import Roles from './Roles';
import AddRoles from './AddRoles';
import Onderhoudsaannemers from './Onderhoudsaannemers';

const router = createBrowserRouter([
    {
        path: "/",
        element: <Login />,
    },
    {
        path: "/WVI",
        element: <WVI />,
    },
    {
        path: "/AddWVI",
        element: <AddWVI />,
    },
    {
        path: "/Accounts",
        element: <Accounts />,
    },
    {
        path: "/Addaccount",
        element: <Addaccount />,
    },
    {
        path: "/Roles",
        element: <Roles />,
    },
    {
        path: "/AddRoles",
        element: <AddRoles />,
    },
    {
        path: "/Onderhoudsaannemers",
        element: <Onderhoudsaannemers/>,
    }
]);

function Home() {
    const [WVIview, setWVIview] = useState(false);
    const [AddWVIview, setAddWVIview] = useState(false);
    const [AccountView, setAccountView] = useState(false);
    const [Addaccountview, setAddaccountview] = useState(false);
    const [roleView, setRoleView] = useState(false);
    const [onderhoudsaannemersView, setOnderhoudsaannemersView] = useState<boolean>(false);
    const [addRoleView, setAddRoleView] = useState(false);
    const [showButtons, setShowButtons] = useState(false);
    const [account, setAccount] = useState<string>();
    const [canEditWVI, setCanEditWVI] = useState<boolean>(false);
    const [canViewAccounts, setCanViewAccounts] = useState<boolean>(false);
    const [canEditAccounts, setCanEditAccounts] = useState<boolean>(false);
    const [canViewRoles, setCanViewRoles] = useState<boolean>(false);
    const [canEditRoles, setCanEditRoles] = useState<boolean>(false);
    const [canViewOnderhoudsaannemers, setCanViewOnderhoudsaannemers] = useState<boolean>(false);
    const [hasLoaded, setHasLoaded] = useState<boolean>(false);

    useEffect(() => {
        routes.GetEmail().then((res => {
            if (res.status === 401) return;
            res.json().then((data) => {
                setAccount(data);
            });

            routes.HasPermissions(["wvi.update", "wvi.add"]).then((status) => {
                if (status === 200) setCanEditWVI(true);
                else setCanEditWVI(false);
            });

            routes.HasPermissions(["account.list"]).then((status) => {
                if (status === 200) setCanViewAccounts(true);
                else setCanViewAccounts(false);
            });

            routes.HasPermissions(["account.update", "account.add"]).then((status) => {
                if (status === 200) setCanEditAccounts(true);
                else setCanEditAccounts(false);
            });

            routes.HasPermissions(["roles.list"]).then((status) => {
                if (status === 200) setCanViewRoles(true);
                else setCanViewRoles(false);
            });

            routes.HasPermissions(["roles.add"]).then((status) => {
                if (status === 200) setCanEditRoles(true);
                else setCanEditRoles(false);
            });

            routes.HasPermissions(["onderhoudsaannemers.list"]).then((status) => {
                if (status === 200) setCanViewOnderhoudsaannemers(true);
                else setCanViewOnderhoudsaannemers(false);
            });

            let timer = setInterval(async () => {
                routes.ValidateToken().then((status) => {
                    if (status === 401 && window.location.pathname !== "/") window.location.replace('/');
                });
            }, 120000);

            setHasLoaded(true);
            return () => clearInterval(timer);
        }));

        switch (window.location.pathname) {
            case '/':
                setShowButtons(false);
                setWVIview(false);
                setAddWVIview(false);
                setAccountView(false);
                setAddaccountview(false);
                setRoleView(false);
                setAddRoleView(false);
                break;
            case "/WVI":
                setWVIview(true);
                setAddWVIview(false);
                setAccountView(false);
                setAddaccountview(false);
                setShowButtons(true);
                setRoleView(false);
                setAddRoleView(false);
                break;
            case "/AddWVI":
                setWVIview(false);
                setAddWVIview(true);
                setAccountView(false);
                setAddaccountview(false);
                setShowButtons(true);
                setRoleView(false);
                setAddRoleView(false);
                break;
            case "/Accounts":
                setWVIview(false);
                setAddWVIview(false);
                setAccountView(true);
                setAddaccountview(false);
                setShowButtons(true);
                setRoleView(false);
                setAddRoleView(false);
                break;
            case "/Addaccount":
                setWVIview(false);
                setAddWVIview(false);
                setAccountView(false);
                setAddaccountview(true);
                setShowButtons(true);
                setRoleView(false);
                setAddRoleView(false);
                break;
            case "/Roles":
                setWVIview(false);
                setAddWVIview(false);
                setAccountView(false);
                setAddaccountview(false);
                setShowButtons(true);
                setRoleView(true);
                setAddRoleView(false);
                break;
            case "/AddRoles":
                setWVIview(false);
                setAddWVIview(false);
                setAccountView(false);
                setAddaccountview(false);
                setShowButtons(true);
                setRoleView(false);
                setAddRoleView(true);
                break;
            case "/Onderhoudsaannemers":
                setWVIview(false);
                setAddWVIview(false);
                setAccountView(false);
                setAddaccountview(false);
                setShowButtons(true);
                setRoleView(false);
                setAddRoleView(false);
                setOnderhoudsaannemersView(true);
                break;
        }
    }, []);


    return (       
        <PrimeReactProvider>
            {hasLoaded ? <div className="bg-[#2F2F31] w-full h-screen flex flex-col text-gray-300">
                <div className="bg-[#2C2C39] w-full h-[120px] flex justify-between rounded-b-[0.5vw]">
                    <img className="ml-[1vw]" src={logo} alt="" width="120" height="120" />
                    {!WVIview && !AddWVIview && !AccountView && !Addaccountview && !roleView && !addRoleView && !onderhoudsaannemersView ? '' :
                        <>
                            <div className="mr-[8vw] text-lg self-center flex gap-x-[50px]">
                                <span>Ingelogd als: {account}</span>
                                <button className="transition-all duration-300 ease-in-out hover:text-[1.4rem] hover:text-white" onClick={() => {
                                    routes.Logout().then((status) => {
                                        window.location.replace('/');
                                    });
                                }}>Uitloggen</button>
                            </div>
                        </>
                    }
                </div>
                <div className="flex mt-[10px] sm:text-[1.2rem] text-[0.6rem] flex-wrap">
                    <div className={(showButtons ? "" : "hidden ") + "rounded-t-[0.5vw] " + (WVIview ? "bg-[#2C2C39]" : "transition-all duration-300 ease-in-out sm:hover:text-[1.4rem] hover:text-[0.8rem] hover:text-white")}>
                        <button className="px-[5px]" onClick={() => {
                            window.location.replace('/WVI');
                            setWVIview(true);
                            setAddWVIview(false);
                            setAccountView(false);
                            setAddaccountview(false);
                            setRoleView(false);
                            setAddRoleView(false);
                            setOnderhoudsaannemersView(false);
                        }}>WVI's</button>
                    </div>
                    <div>
                        <button className={(showButtons && canEditWVI ? "" : "hidden ") + "px-[5px] rounded-t-[0.5vw] " + (AddWVIview ? "bg-[#2C2C39]" : "transition-all duration-300 ease-in-out sm:hover:text-[1.4rem] hover:text-[0.8rem]hover:text-white")} onClick={() => {
                            window.location.replace('/AddWVI');
                            setWVIview(false);
                            setAddWVIview(true);
                            setAccountView(false);
                            setAddaccountview(false);
                            setRoleView(false);
                            setAddRoleView(false);
                            setOnderhoudsaannemersView(false);
                        }}>WVI toevoegen</button>
                    </div>
                    <div>
                        <button className={(showButtons && canViewAccounts ? "" : "hidden ") + "px-[5px] rounded-t-[0.5vw] " + (AccountView ? "bg-[#2C2C39]" : "transition-all duration-300 ease-in-out sm:hover:text-[1.4rem] hover:text-[0.8rem] hover:text-white")} onClick={() => {
                            window.location.replace('/Accounts');
                            setWVIview(false);
                            setAddWVIview(false);
                            setAccountView(true);
                            setAddaccountview(false);
                            setRoleView(false);
                            setAddRoleView(false);
                            setOnderhoudsaannemersView(false);
                        }}>Accounts beheren</button>
                    </div>
                    <div>
                        <button className={(showButtons && canEditAccounts ? "" : "hidden ") + "px-[5px] rounded-t-[0.5vw] " + (Addaccountview ? "bg-[#2C2C39]" : "transition-all duration-300 ease-in-out sm:hover:text-[1.4rem] hover:text-[0.8rem] hover:text-white")} onClick={() => {
                            window.location.replace('/Addaccount');
                            setWVIview(false);
                            setAddWVIview(false);
                            setAccountView(false);
                            setAddaccountview(true);
                            setRoleView(false);
                            setAddRoleView(false);
                            setOnderhoudsaannemersView(false);
                        }}>Accounts toevoegen</button>
                    </div>
                    <div>
                        <button className={(showButtons && canViewRoles ? "" : "hidden ") + "px-[5px] rounded-t-[0.5vw] " + (roleView ? "bg-[#2C2C39]" : "transition-all duration-300 ease-in-out sm:hover:text-[1.4rem] hover:text-[0.8rem] hover:text-white")} onClick={() => {
                            window.location.replace('/Roles');
                            setWVIview(false);
                            setAddWVIview(false);
                            setAccountView(false);
                            setAddaccountview(false);
                            setRoleView(true);
                            setAddRoleView(false);
                            setOnderhoudsaannemersView(false);
                        }}>Roles beheren</button>
                    </div>
                    <div>
                        <button className={(showButtons && canEditRoles ? "" : "hidden ") + "px-[5px] rounded-t-[0.5vw] " + (addRoleView ? "bg-[#2C2C39]" : "transition-all duration-300 ease-in-out sm:hover:text-[1.4rem] hover:text-[0.8rem] hover:text-white")} onClick={() => {
                            window.location.replace('/AddRoles');
                            setWVIview(false);
                            setAddWVIview(false);
                            setAccountView(false);
                            setAddaccountview(false);
                            setRoleView(false);
                            setAddRoleView(true);
                            setOnderhoudsaannemersView(false);
                        }}>Roles toevoegen</button>
                    </div>
                    <div>
                        <button className={(showButtons && canViewOnderhoudsaannemers ? "" : "hidden ") + "px-[5px] rounded-t-[0.5vw] " + (onderhoudsaannemersView ? "bg-[#2C2C39]" : "transition-all duration-300 ease-in-out sm:hover:text-[1.4rem] hover:text-[0.8rem] hover:text-white")} onClick={() => {
                            window.location.replace('/Onderhoudsaannemers');
                            setWVIview(false);
                            setAddWVIview(false);
                            setAccountView(false);
                            setAddaccountview(false);
                            setRoleView(false);
                            setAddRoleView(false);
                            setOnderhoudsaannemersView(true);
                        }}>Onderhoudsaannemers beheren</button>
                    </div>
                </div>
                <div className="bg-[#2C2C39] w-full flex grow justify-center items-start pt-[40px]">
                    <RouterProvider router={router} />
                </div>
            </div> : ""}
        </PrimeReactProvider>
    )
}

export default Home;