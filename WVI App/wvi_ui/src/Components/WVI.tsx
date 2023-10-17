/* eslint-disable no-loop-func */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from 'react';
import '../tailwind.css';
import activityGreen from '../media/activity green.png';
import activityOrange from '../media/activity orange.png';
import activityRed from '../media/activity red.png';
import activityWhite from '../media/activity white.png';
import arrow from '../media/arrow.png';
import routes from '../Services/routes';
import refreshArrow from '../media/refreshArrow.png';
import noActivity from '../media/no activity.png';


function Dashboard() {
    const [dropDownOperationChoice, setDropDownOperationChoice] = useState(false);
    const [dropDown, setDropDown] = useState(false);
    const [operationChoice, setOperationChoice] = useState("");
    const [nodeData, setNodeData] = useState([{ DisplayName: "", Nodes: "", Data: "", dataType: "" }]);
    const [heatingCurve, setHeatingCurve] = useState([""]);
    const [defaultHeatingCurve, setDefaultHeatingCurve] = useState([""]);
    const [currentNode, setCurrentNode] = useState("");
    const [status, setStatus] = useState([{ status: "", activityLed: noActivity }, { status: "", activityLed: noActivity }]);

    const WVIs = [{ Name: "GK-MBR-01", NodeId: "ns=7;s=GK-MRB-01" }, { Name: "GK.AKM.03", NodeId: "ns=7;s=GK.AKM.03" }];
        
    async function DoSetStatus(pos: number, node: string) {
        await routes.GetStatus(node).then((result: number) => {
            if (result == 0) {
                let newStatus = status;
                newStatus[pos] = { status: "uit", activityLed: activityWhite };
                setStatus([...newStatus]);
            }
            else if (result == 1) {
                let newStatus = status;
                newStatus[pos] = { status: "auto", activityLed: activityGreen };
                setStatus([...newStatus]);
            }
            else if (result == 2) {
                let newStatus = status;
                newStatus[pos] = { status: "handmatig", activityLed: activityOrange };
                setStatus([...newStatus]);
            }
            else if (result == 3) {
                let newStatus = status;
                newStatus[pos] = { status: "burner test", activityLed: activityRed };
                setStatus([...newStatus]);
            }
        });
    }

    async function GetData(nodeId: string) {
        await routes.GetData(nodeId).then((data: [{ DisplayName: string, Nodes: string, Data: string, dataType: string }]) => {
            let newdata = [];
            let removeIndexes = [];
            for (var a = 0; a < data.length; a++) {
                if (data[a].DisplayName === "cmdOperationMode" || data[a].DisplayName === "SetPointHigh" || data[a].DisplayName === "SetPointLow") {
                    if (data[a].Nodes.includes("DefaultHeatingCurve")) data[a].DisplayName = "DefaultHeatingCurve." + data[a].DisplayName;

                    newdata.push(data[a]);
                    removeIndexes.push(a);
                }
            }
            newdata.push({ DisplayName: "", Nodes: "", Data: "", dataType: "" });
            for (var b = 0; b < removeIndexes.length; b++) {
                data.splice(removeIndexes[b], 1);
            }
            newdata = newdata.concat(data);
            setNodeData(newdata);
        });

        DoSetStatus(WVIs.findIndex(wvi => wvi.NodeId === currentNode), currentNode);
    }

    useEffect(() => {
        routes.ValidateToken().then((status) => {
            if (status === 401) window.location.replace('/');
        });

        (async () => {
            for (var a = 0; a < WVIs.length; a++) {
                await routes.IsOnline().then((statuscode) => {
                    if (statuscode == 404) {
                        let newStatus = status;
                        newStatus[a] = { status: "Geen verbinding", activityLed: noActivity };
                        setStatus(newStatus);
                        return;
                    }
                    DoSetStatus(a, WVIs[a].NodeId);
                });
            }
        })();
    }, []);

return (
    <div className="bg-[#2C2C39] w-screen flex flex-grow">
        <div className="ml-[10vw] mt-[5vh] flex-col items-center gap-y-1 max-h-[60vh] w-[280px] overflow-y-scroll">
            <span className="text-white text-[2rem]">WVI's</span>
            {WVIs.map((WVI, index) => <div className="flex flex-col relative bg-[#262739] mb-[1vh]">
                <span className="text-white ml-[87px]">{WVI.Name}</span>
                <div className="flex items-center">
                    <span className="text-white ml-[20px]">Status:</span>
                    <span className="text-white ml-[20px]"> {status[index].status}</span>
                    <img className="ml-[15px]" src={status[index].activityLed} alt="" width="10" height="10" />
                </div>
                <div>
                    <span className="text-white ml-[20px]">Alarm:</span>
                    <span className="text-white ml-[16px]"> Geen</span>
                </div>
                <button className="absolute self-end left[100%] top-[20px]" onClick={() => {
                    setOperationChoice("");
                    GetData(WVI.NodeId);
                    setCurrentNode(WVI.NodeId);
                }}>
                    <img src={arrow} alt="" width="40" height="40" /></button>
            </div>) }
        </div>

        {currentNode !== "" && nodeData.length > 1 ? <div className="mt-[5vh] hidden md:flex flex-grow">
            <div className="w-[40%] h-[70vh] flex flex-col">
                <div className="flex justify-between">
                    <span className="text-lg ml-[42%]">WVI Data</span>
                    <button className="mr-[2vw] self-center" onClick={() => {
                        GetData(currentNode);
                    }}><img src={refreshArrow} alt="" width="30" height="30" /></button>
                </div>
                <div className="ml-[1%] overflow-y-scroll">
                    <table className="w-full text-sm text-left text-white mt-[1vh]">
                        <tbody>
                            {nodeData.map((datapoint) => <tr className="bg-[#262739] border-b border-gray-700">
                                <th scope="row" className="p-6 py-4 text-white">
                                    {datapoint.DisplayName}
                                </th>
                                <td className="px-6 py-4">
                                    {datapoint.dataType === "Volts" || datapoint.dataType === "Hours" ? Number(datapoint.Data).toFixed(1) : datapoint.Data}
                                </td>
                                <td className="px-6 py-4">
                                    {datapoint.dataType}
                                </td>
                            </tr>)}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="ml-[10%] flex flex-col gap-[120px]">
                <div className="h-[10vh] flex flex-col items-start">
                    <span className="text-white text-[1.5rem]">Operate WVI:</span>
                    <button id="dropdownDefaultButton" onClick={() => { setDropDown(!dropDown) }} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" type="button">Operation menu
                        <svg className="w-2.5 h-2.5 ml-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4" />
                        </svg></button>
                    {dropDown ? <div id="dropdown" className="z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700">
                        <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
                            <li>                          
                                <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white" onClick={async () => {
                                    setOperationChoice(operationChoice === "OperationMode" ? "" : "OperationMode");
                                    setDropDown(!dropDown);
                                }}>OperationMode</a>
                            </li>
                            <li>
                                <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white" onClick={async () => {
                                    setOperationChoice(operationChoice === "Heating curve" ? "" : "Heating curve");
                                    setDropDown(!dropDown);
                                    setHeatingCurve([nodeData.filter(node => node.Nodes.includes("HeatingCurve.SetPointHigh"))[0].Data, nodeData.filter(node => node.Nodes.includes("HeatingCurve.SetPointLow"))[0].Data]);
                                }}>Heating curve</a>                              
                            </li>
                            <li>
                                <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white" onClick={async () => {
                                    setOperationChoice(operationChoice === "Default heating curve" ? "" : "Default heating curve");
                                    setDropDown(!dropDown);
                                    setDefaultHeatingCurve([nodeData.filter(node => node.Nodes.includes("DefaultHeatingCurve.SetPointHigh"))[0].Data, nodeData.filter(node => node.Nodes.includes("DefaultHeatingCurve.SetPointLow"))[0].Data]);
                                }}>Default heating curve</a>
                            </li>
                        </ul>
                    </div> : ''}
                </div>
                {operationChoice === "OperationMode" ? <div className="flex flex-col items-start h-[10vh]">
                    <span className="text-white text-[1.5rem]">Set operation modes:</span>

                    <button id="dropdownDefaultButton" onClick={() => { setDropDownOperationChoice(!dropDownOperationChoice) }} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" type="button">Operation modes
                        <svg className="w-2.5 h-2.5 ml-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4" />
                        </svg></button>
                    {dropDownOperationChoice ? <div id="dropdown" className="z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700">
                        <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
                            <li>
                                <a href="#" onClick={async () => { setDropDownOperationChoice(!dropDownOperationChoice); await routes.SetStatus(0, currentNode); GetData(currentNode); setOperationChoice("");  }} className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Uit</a>
                            </li>
                            <li>
                                <a href="#" onClick={async () => { setDropDownOperationChoice(!dropDownOperationChoice); await routes.SetStatus(1, currentNode); GetData(currentNode); setOperationChoice(""); }} className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Auto</a>
                            </li>
                            <li>
                                <a href="#" onClick={async () => { setDropDownOperationChoice(!dropDownOperationChoice); await routes.SetStatus(2, currentNode); GetData(currentNode); setOperationChoice(""); }} className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">handmatig</a>
                            </li>
                            <li>
                                <a href="#" onClick={async () => { setDropDownOperationChoice(!dropDownOperationChoice); await routes.SetStatus(3, currentNode); GetData(currentNode); setOperationChoice(""); }} className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Burner test</a>
                            </li>
                        </ul>
                    </div> : ''}
                </div> : operationChoice === "Heating curve" ? <div className="flex flex-col gap-[20px]">
                        <div className="flex justify-between">
                            <span>SetPointHigh: </span>
                            <input onChange={e => setHeatingCurve([e.target.value, heatingCurve[1]])} className="text-black max-w-[50px]" value={heatingCurve[0]}></input>
                        </div>
                        <div className="flex justify-between">
                        <span>SetPointLow: </span>
                            <input onChange={e => setHeatingCurve([heatingCurve[0], e.target.value])} className="text-black max-w-[50px]" value={heatingCurve[1]}></input>
                        </div>
                        <button onClick={() => { routes.SetHeatingCurve(Number(heatingCurve[0]), Number(heatingCurve[1]), currentNode); GetData(currentNode); setOperationChoice(""); } } className="font-medium text-white bg-blue-700 hover:bg-blue-800 rounded-lg text-sm px-5 py-2.5 text-center items-center">toepassen</button>
                    </div> : operationChoice === "Default heating curve" ? <div className="flex flex-col gap-[20px]">
                        <div className="flex justify-between">
                            <span>SetPointHigh: </span>
                                <input onChange={e => setDefaultHeatingCurve([e.target.value, defaultHeatingCurve[1]])} className="text-black max-w-[50px]" value={defaultHeatingCurve[0]}></input>
                        </div>
                        <div className="flex justify-between">
                            <span>SetPointLow: </span>
                                <input onChange={e => setDefaultHeatingCurve([defaultHeatingCurve[0], e.target.value])} className="text-black max-w-[50px]" value={defaultHeatingCurve[1]}></input>
                        </div>
                            <button onClick={() => { routes.SetDefaultHeatingCurve(Number(defaultHeatingCurve[0]), Number(defaultHeatingCurve[1]), currentNode); GetData(currentNode); setOperationChoice(""); }} className="font-medium text-white bg-blue-700 hover:bg-blue-800 rounded-lg text-sm px-5 py-2.5 text-center items-center">toepassen</button>
                    </div> : '' }
            </div>
        </div> : ""}
    </div>
);
}

export default Dashboard;
