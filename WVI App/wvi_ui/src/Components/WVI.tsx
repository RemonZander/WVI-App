/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from 'react';
import '../tailwind.css';
import activityGreen from '../media/activity green.png';
import arrow from '../media/arrow.png';
import routes from '../Services/routes';

function Dashboard() {
    const _routes = new routes();
    
    const [dropDown, setDropDown] = useState(false);
    const [status, setStatus] = useState('');

    function DoSetStatus() {
        _routes.GetStatus().then((result : number) => {
            if (result == 0) {
                setStatus("uit");
            }
            else if (result == 1) {
                setStatus("Auto");
            }
            else if (result == 2) {
                console.log("setting status to: Handmatig");
                setStatus("Handmatig");
            }
            else if (result == 3) {
                setStatus("Burner test");
            }
        });
    }

    useEffect(() => {
        DoSetStatus();
    }, []);

return (
    <div className="bg-[#2C2C39] w-screen flex flex-grow">
        <div className="ml-[10vw] mt-[5vh] flex-col items-center gap-y-1 max-h-[60vh] overflow-y-scroll">
            <span className="text-white text-[2rem]">WVI's</span>
            {[0].map(() => <div className="flex flex-col relative bg-[#262739]">
                <span className="text-white ml-[121px] mr-[50px]">GK-MRB-01</span>
                <div className="flex items-center">
                    <span className="text-white ml-[20px]">Status:</span>
                    <span className="text-white ml-[50px]"> Auto</span>
                    <img className="ml-[15px]" src={activityGreen} alt="" width="10" height="10" />
                </div>
                <div>
                    <span className="text-white ml-[20px]">Alarm:</span>
                    <span className="text-white ml-[50px]"> Geen</span>
                </div>
                <button className="absolute self-end left[100%] top-[20px]" onClick={() => { }}><img src={arrow} alt="" width="40" height="40" /></button>
            </div>) }          
        </div>

        <div className="mt-[5vh] flex flex-grow">
            <div className="ml-[10%]">
                <span className="text-white text-[1.5rem]">Huidige operatie modes:</span>
                <div className="flex items-center">
                    <span>{status }</span>
                    <img className="ml-[15px]" src={activityGreen} alt="" width="10" height="10" />
                </div>      
            </div>
            <div className="ml-[10%] flex flex-col items-start">
                <span className="text-white text-[1.5rem]">Set operatie modes:</span>

                <button id="dropdownDefaultButton" onClick={() => { setDropDown(!dropDown) }} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" type="button">Dropdown button
                    <svg className="w-2.5 h-2.5 ml-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4" />
                </svg></button>
                {dropDown ? <div id="dropdown" className="z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700">
                    <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
                        <li>
                            <a href="#" onClick={async () => { setDropDown(!dropDown); await _routes.SetStatus(0); DoSetStatus(); } } className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Uit</a>
                        </li>
                        <li>
                            <a href="#" onClick={async () => { setDropDown(!dropDown); await _routes.SetStatus(1); DoSetStatus(); }} className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Auto</a>
                        </li>
                        <li>
                            <a href="#" onClick={async () => { setDropDown(!dropDown); await _routes.SetStatus(2); DoSetStatus(); }} className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">handmatig</a>
                        </li>
                        <li>
                            <a href="#" onClick={async () => { setDropDown(!dropDown); await _routes.SetStatus(3); DoSetStatus(); }} className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Burner test</a>
                        </li>
                    </ul>
                </div> : '' }
            </div>
        </div>
    </div>
);
}

export default Dashboard;
