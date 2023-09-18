import React, { useEffect, useState } from 'react';
import { createBrowserRouter, Link, RouterProvider } from 'react-router-dom';
import './tailwind.css';
import logo from './proraillogo.png';
import WVI from './WVI';
import AddWVI from './AddWVI';
import Accounts from './Accounts';
import Addaccount from './Addaccount';


const router = createBrowserRouter([
    {
        path: "/",
        element: <></>,
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

    useEffect(() => {
        switch (window.location.href.replace(window.location.host, '').replace(window.location.protocol + "//", '')) {
            case "/WVI":
                setWVIview(true);
                setAddWVIview(false);
                setAccountView(false);
                setAddaccountview(false);
                break;
            case "/AddWVI":
                setWVIview(false);
                setAddWVIview(true);
                setAccountView(false);
                setAddaccountview(false);
                break;
            case "/Accounts":
                setWVIview(false);
                setAddWVIview(false);
                setAccountView(true);
                setAddaccountview(false);
                break;
            case "/Addaccount":
                setWVIview(false);
                setAddWVIview(false);
                setAccountView(false);
                setAddaccountview(true);
                break;
        }
    }, []);


    return (
        <React.StrictMode>
            <div className="bg-[#2F2F31] w-screen h-screen flex flex-col">
                <div className="bg-[#2C2C39] w-screen h-[120px] flex rounded-b-[0.5vw]">
                    <img src={logo} alt="" width="120" height="120" />
                </div>
                <div className="flex mt-[10px] text-[1.2rem]">
                    <div className={"rounded-t-[0.5vw] " + (WVIview ? "bg-[#2C2C39]" : "")}>
                        <button className="px-[5px]" onClick={() => {
                            window.location.replace('/WVI');
                            setWVIview(true);
                            setAddWVIview(false);
                            setAccountView(false);
                            setAddaccountview(false);
                        }}>WVI's</button>
                    </div>
                    <div>
                        <button className={"px-[5px] rounded-t-[0.5vw] " + (AddWVIview ? "bg-[#2C2C39]" : "")} onClick={() => {
                            window.location.replace('/AddWVI');
                            setWVIview(false);
                            setAddWVIview(true);
                            setAccountView(false);
                            setAddaccountview(false);
                        }}>WVI toevoegen</button>
                    </div>
                    <div>
                        <button className={"px-[5px] rounded-t-[0.5vw] " + (AccountView ? "bg-[#2C2C39]" : "")} onClick={() => {
                            window.location.replace('/Accounts');
                            setWVIview(false);
                            setAddWVIview(false);
                            setAccountView(true);
                            setAddaccountview(false);
                        }}>Accounts</button>
                    </div>
                    <div>
                        <button className={"px-[5px] rounded-t-[0.5vw] " + (Addaccountview ? "bg-[#2C2C39]" : "")} onClick={() => {
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