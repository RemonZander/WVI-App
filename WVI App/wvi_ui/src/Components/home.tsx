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
    const [showButtons, setShowButtons] = useState(false);

    useEffect(() => {
        switch (window.location.href.replace(window.location.host, '').replace(window.location.protocol + "//", '')) {
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
        <React.StrictMode>
            <div className="bg-[#2F2F31] w-screen h-screen flex flex-col text-gray-300">
                <div className="bg-[#2C2C39] w-screen h-[120px] flex justify-between rounded-b-[0.5vw]">
                    <img className="ml-[1vw]" src={logo} alt="" width="120" height="120" />
                    {!WVIview && !AddWVIview && !AccountView && !Addaccountview ? '' : 
                        <button className="mr-[8vw] text-lg self-center" onClick={() => {
                            routes.Logout().then((status) => {
                                window.location.replace('/');
                            });
                        }}>Loguit</button>
                    }               
                </div>
                <div className="flex mt-[10px] text-[1.2rem]">
                    <div className={(showButtons ? "" : "hidden ") + "rounded-t-[0.5vw] " + (WVIview ? "bg-[#2C2C39]" : "")}>
                        <button className="px-[5px]" onClick={() => {
                            window.location.replace('/WVI');
                            setWVIview(true);
                            setAddWVIview(false);
                            setAccountView(false);
                            setAddaccountview(false);
                        }}>WVI's</button>
                    </div>
                    <div>
                        <button className={(showButtons ? "" : "hidden ") + "px-[5px] rounded-t-[0.5vw] " + (AddWVIview ? "bg-[#2C2C39]" : "")} onClick={() => {
                            window.location.replace('/AddWVI');
                            setWVIview(false);
                            setAddWVIview(true);
                            setAccountView(false);
                            setAddaccountview(false);
                        }}>WVI toevoegen</button>
                    </div>
                    <div>
                        <button className={(showButtons ? "" : "hidden ") + "px-[5px] rounded-t-[0.5vw] " + (AccountView ? "bg-[#2C2C39]" : "")} onClick={() => {
                            window.location.replace('/Accounts');
                            setWVIview(false);
                            setAddWVIview(false);
                            setAccountView(true);
                            setAddaccountview(false);
                        }}>Accounts</button>
                    </div>
                    <div>
                        <button className={(showButtons ? "" : "hidden ") + "px-[5px] rounded-t-[0.5vw] " + (Addaccountview ? "bg-[#2C2C39]" : "")} onClick={() => {
                            window.location.replace('/Addaccount');
                            setWVIview(false);
                            setAddWVIview(false);
                            setAccountView(false);
                            setAddaccountview(true);
                        }}>Accounts toevoegen</button>
                    </div>
                </div>
                <div className="bg-[#2C2C39] w-screen flex flex-grow">
                    <RouterProvider router={router} />
                </div>
            </div>
        </React.StrictMode>
    )
}

export default Home;