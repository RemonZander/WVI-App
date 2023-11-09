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
]);

function Home() {
    const [WVIview, setWVIview] = useState(false);
    const [AddWVIview, setAddWVIview] = useState(false);
    const [AccountView, setAccountView] = useState(false);
    const [Addaccountview, setAddaccountview] = useState(false);
    const [roleView, setRoleView] = useState(false);
    const [addRoleView, setAddRoleView] = useState(false);
    const [showButtons, setShowButtons] = useState(false);
    const [isBeheer, setIsBeheer] = useState(false);
    const [account, setAccount] = useState<string>();

    useEffect(() => {
        routes.GetRole().then((res => {
            if (res.status === 404 || res.status === 401) {
                setIsBeheer(false);
            }
            res.json().then((data) => {
                setAccount(data.email);
                if (data.role === "aannemer") {
                    setIsBeheer(false);
                }
                else if (data.role === "beheerder") {
                    setIsBeheer(true);
                }
            });
        }));

        switch (window.location.href.replace(window.location.host, '').replace(window.location.protocol + "//", '').replace("#", "")) {
            case '/':
                setShowButtons(false);
                setWVIview(false);
                setAddWVIview(false);
                setAccountView(false);
                setAddaccountview(false);
                break;
            case "/WVI":
                setWVIview(true);
                setAddWVIview(false);
                setAccountView(false);
                setAddaccountview(false);
                setShowButtons(true);
                break;
            case "/AddWVI":
                setWVIview(false);
                setAddWVIview(true);
                setAccountView(false);
                setAddaccountview(false);
                setShowButtons(true);
                break;
            case "/Accounts":
                setWVIview(false);
                setAddWVIview(false);
                setAccountView(true);
                setAddaccountview(false);
                setShowButtons(true);
                break;
            case "/Addaccount":
                setWVIview(false);
                setAddWVIview(false);
                setAccountView(false);
                setAddaccountview(true);
                setShowButtons(true);
                break;
        }
    }, []);


    return (       
        <div className="bg-[#2F2F31] w-screen h-screen flex flex-col text-gray-300">
                <div className="bg-[#2C2C39] w-screen h-[120px] flex justify-between rounded-b-[0.5vw]">
                    <img className="ml-[1vw]" src={logo} alt="" width="120" height="120" />
                {!WVIview && !AddWVIview && !AccountView && !Addaccountview && !roleView && !addRoleView ? '' : 
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
                <div className="flex mt-[10px] text-[1.2rem]">
                <div className={(showButtons && !isBeheer ? "" : "hidden ") + "rounded-t-[0.5vw] " + (WVIview ? "bg-[#2C2C39]" : "transition-all duration-300 ease-in-out hover:text-[1.4rem] hover:text-white")}>
                        <button className="px-[5px]" onClick={() => {
                            window.location.replace('/WVI');
                            setWVIview(true);
                            setAddWVIview(false);
                            setAccountView(false);
                            setAddaccountview(false);
                            setRoleView(false);
                            setAddRoleView(false);
                        }}>WVI's</button>
                    </div>
                    <div>
                    <button className={(showButtons && isBeheer ? "" : "hidden ") + "px-[5px] rounded-t-[0.5vw] " + (AddWVIview ? "bg-[#2C2C39]" : "transition-all duration-300 ease-in-out hover:text-[1.4rem] hover:text-white")} onClick={() => {
                            window.location.replace('/AddWVI');
                            setWVIview(false);
                            setAddWVIview(true);
                            setAccountView(false);
                            setAddaccountview(false);
                            setRoleView(false);
                            setAddRoleView(false);
                        }}>WVI toevoegen</button>
                    </div>
                    <div>
                    <button className={(showButtons && isBeheer ? "" : "hidden ") + "px-[5px] rounded-t-[0.5vw] " + (AccountView ? "bg-[#2C2C39]" : "transition-all duration-300 ease-in-out hover:text-[1.4rem] hover:text-white")} onClick={() => {
                            window.location.replace('/Accounts');
                            setWVIview(false);
                            setAddWVIview(false);
                            setAccountView(true);
                            setAddaccountview(false);
                            setRoleView(false);
                            setAddRoleView(false);
                        }}>Accounts beheren</button>
                    </div>
                    <div>
                    <button className={(showButtons && isBeheer ? "" : "hidden ") + "px-[5px] rounded-t-[0.5vw] " + (Addaccountview ? "bg-[#2C2C39]" : "transition-all duration-300 ease-in-out hover:text-[1.4rem] hover:text-white")} onClick={() => {
                            window.location.replace('/Addaccount');
                            setWVIview(false);
                            setAddWVIview(false);
                            setAccountView(false);
                            setAddaccountview(true);
                            setRoleView(false);
                            setAddRoleView(false);
                        }}>Accounts toevoegen</button>
                    </div>
                    <div>
                    <button className={(showButtons && isBeheer ? "" : "hidden ") + "px-[5px] rounded-t-[0.5vw] " + (roleView ? "bg-[#2C2C39]" : "transition-all duration-300 ease-in-out hover:text-[1.4rem] hover:text-white")} onClick={() => {
                            window.location.replace('/Addaccount');
                            setWVIview(false);
                            setAddWVIview(false);
                            setAccountView(false);
                            setAddaccountview(false);
                            setRoleView(true);
                            setAddRoleView(false);
                        }}>Roles beheren</button>
                    </div>
                    <div>
                    <button className={(showButtons && isBeheer ? "" : "hidden ") + "px-[5px] rounded-t-[0.5vw] " + (addRoleView ? "bg-[#2C2C39]" : "transition-all duration-300 ease-in-out hover:text-[1.4rem] hover:text-white")} onClick={() => {
                            window.location.replace('/Addaccount');
                            setWVIview(false);
                            setAddWVIview(false);
                            setAccountView(false);
                            setAddaccountview(false);
                            setRoleView(false);
                            setAddRoleView(true);
                        }}>Roles toevoegen</button>
                    </div>
                </div>
            <div className="bg-[#2C2C39] w-screen flex flex-grow">  
                <RouterProvider router={router} />
            </div>
        </div>        
    )
}

export default Home;