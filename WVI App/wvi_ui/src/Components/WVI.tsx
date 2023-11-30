/* eslint-disable no-loop-func */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from 'react';
import '../tailwind.css';
import activityGreen from '../media/activity green.png';
import activityOrange from '../media/activity orange.png';
import activityRed from '../media/activity red.png';
import activityWhite from '../media/activity white.png';
import routes from '../Services/routes';
import refreshArrow from '../media/refreshArrow.png';
import noActivity from '../media/no activity.png';
import { IWVI, IWVIStatus } from '../interfaces/interfaces';
import loadingGif from '../media/loading.gif';

function Dashboard() {
    const [dropDownOperationChoice, setDropDownOperationChoice] = useState(false);
    const [nodeData, setNodeData] = useState([{ DisplayName: "", Nodes: "", Data: "", dataType: "" }]);
    const [heatingCurve, setHeatingCurve] = useState([""]);
    const [defaultHeatingCurve, setDefaultHeatingCurve] = useState([""]);
    const [currentNode, setCurrentNode] = useState({ Node: "", endpoint: "", datamodel: "" });
    const [status, setStatus] = useState<IWVIStatus[]>([]);
    const [WVIs, setWVIs] = useState<IWVI[]>([]);
    const [showWVIs, setShowWVIs] = useState(false);
    const [showData, SetShowData] = useState<boolean>(false);
    const [showOperateMenu, setShowOperateMenu] = useState<boolean>(false);
    const [canEditWVI, setCanEditWVI] = useState<boolean>(false);
    const [canOperateWVI, setCanOperateWVI] = useState<boolean>(false);

    let nodeDataVariable = [];
        
    async function DoSetStatus(pos: number, node: string, eindpoint: string, newStatus: IWVIStatus[], datamodel: string, wvi) {
        await routes.GetStatus(node, eindpoint, datamodel, wvi).then((result: number) => {
            if (result == 0) {
                newStatus[pos] = { status: "uit", activityLed: activityWhite };
            }
            else if (result == 1) {
                newStatus[pos] = { status: "auto", activityLed: activityGreen };
            }
            else if (result == 2) {
                newStatus[pos] = { status: "handmatig", activityLed: activityOrange };
            }
            else if (result == 3) {
                newStatus[pos] = { status: "burner test", activityLed: activityRed };
            }
            else {
                newStatus[pos] = { status: "Geen verbinding", activityLed: noActivity };
            }
            setStatus([...newStatus]);
        });
    }

    async function GetData(nodeId: string, eindpoint: string, status: IWVIStatus[], datamodel: string, PMP_enkelvoudige_objectnaam: string) {
        await routes.GetData(nodeId, eindpoint, PMP_enkelvoudige_objectnaam).then((data: [{ DisplayName: string, Nodes: string, Data: string, dataType: string }]) => {
            let newdata = [];
            let removeIndexes: string[] = [];
            for (var a = 0; a < data.length; a++) {
                if (data[a].DisplayName === "cmdOperationMode" || data[a].DisplayName === "HeatingCurve.SetPointHigh" || data[a].DisplayName === "HeatingCurve.SetPointLow" ||
                    data[a].DisplayName === "Params.DefaultHeatingCurve.SetPointHigh" || data[a].DisplayName === "Params.DefaultHeatingCurve.SetPointLow") {

                    newdata.push(data[a]);
                    removeIndexes.push(data[a].DisplayName);
                }
            }

            newdata.push({ DisplayName: "", Nodes: "", Data: "", dataType: "" });
            for (var b = 0; b < removeIndexes.length; b++) {
                data.splice(data.findIndex(d => d.DisplayName === removeIndexes[b]), 1);
            }
            newdata = newdata.concat(data);
            nodeDataVariable = newdata;
            setNodeData([...newdata]);
        });

        DoSetStatus(WVIs.findIndex(wvi => nodeId.includes(wvi.PMP_enkelvoudige_objectnaam)), nodeId, eindpoint, status, datamodel, WVIs[WVIs.findIndex(wvi => nodeId.includes(wvi.PMP_enkelvoudige_objectnaam))]);
    }

    useEffect(() => {
        routes.ValidateToken().then((status) => {
            if (status === 401) window.location.replace('/');
        });

        routes.HasPermissions(["wvi.own.operate"]).then((status) => {
            if (status === 200) {
                setCanOperateWVI(true);
            }
            else setCanOperateWVI(false);
        });

        routes.HasPermissions(["wvi.update"]).then((status) => {
            if (status === 200) {
                setCanEditWVI(true);
            }
            else setCanEditWVI(false);
        });

        routes.GetWVIs().then((data: IWVI[]) => {
            setWVIs([...data]);
        
            let newStatus: IWVIStatus[] = [];
            for (var b = 0; b < data.length; b++) { 
                newStatus.push({ status: "Geen verbinding", activityLed: noActivity });
            }

            (async () => {
                for (var a = 0; a < data.length; a++) {
                    await routes.IsOnline(data[a].Endpoint).then((statuscode) => {
                        if (statuscode != 404) {  
                            DoSetStatus(a, "ns=2;s=" + data[a].PMP_enkelvoudige_objectnaam, data[a].Endpoint, newStatus, data[a].Datamodel, data[a]);
                        }
                    });
                }   

                setShowWVIs(true);
                setStatus([...newStatus]);
            })();
        });
    }, []);

return (
    <div className="bg-[#2C2C39] w-screen flex flex-grow">
        <div className="ml-[8vw] mt-[5vh] flex-col items-center gap-y-1 max-h-[60vh] w-[340px] overflow-y-scroll">
            <span className="text-white text-[2rem]">WVI's</span>
            {showWVIs ? WVIs.map((WVI, index) => <div className="flex flex-col relative bg-[#262739] mb-[1vh] h-[85px]">
                <span className="text-white ml-[87px]">{WVI.PMP_enkelvoudige_objectnaam}</span>
                <div className="flex items-center">
                    <span className="text-white ml-[20px]">Status:</span>
                    <span className="text-white ml-[20px]"> {status[index].status}</span>
                    <img className="ml-[15px]" src={status[index].activityLed} alt="" width="10" height="10" />
                </div>
                <div>
                    <span className="text-white ml-[20px]">Alarm:</span>
                    <span className="text-white ml-[16px]"> Geen</span>
                </div>
                {status[index].status !== "Geen verbinding" ? <button className="absolute self-end left[100%] top-[5px] mr-[5px] bg-[#181452] p-[5px] rounded-lg hover:text-[1.1rem] transition-all duration-300 ease-in-out" onClick={async() => {
                    setShowOperateMenu(false);
                    if (!showData)
                    {
                        SetShowData(!showData);
                    }
                    if ((showData && WVI.PMP_enkelvoudige_objectnaam !== currentNode.Node) || !showData)
                    {
                        setCurrentNode({ Node: WVI.PMP_enkelvoudige_objectnaam, endpoint: WVI.Endpoint, datamodel: WVI.Datamodel });
                        await GetData("ns=2;s=" + WVI.PMP_enkelvoudige_objectnaam, WVI.Endpoint, status, WVI.Datamodel, WVI.PMP_enkelvoudige_objectnaam);
                    }
                    else
                    {
                        SetShowData(!showData);
                        setCurrentNode({ Node: null, endpoint: null, datamodel: null });
                    }
                }}>Toon info</button> : ""}
                {canOperateWVI && !canEditWVI && status[index].status !== "Geen verbinding" ? <button className="absolute self-end left[100%] bottom-0 mr-[5px] mb-[5px] bg-[#181452] p-[5px] rounded-lg hover:text-[1.1rem] transition-all duration-300 ease-in-out" onClick={async() => {
                    SetShowData(false); 
                    if (!showOperateMenu)
                    {
                        setShowOperateMenu(!showOperateMenu);
                    }
                    if ((showOperateMenu && WVI.PMP_enkelvoudige_objectnaam !== currentNode.Node) || !showOperateMenu) 
                    {
                        setCurrentNode({ Node: WVI.PMP_enkelvoudige_objectnaam, endpoint: WVI.Endpoint, datamodel: WVI.Datamodel });
                        await GetData("ns=2;s=" + WVI.PMP_enkelvoudige_objectnaam, WVI.Endpoint, status, WVI.Datamodel, WVI.PMP_enkelvoudige_objectnaam);
                        if (WVI.Datamodel === "2.0") {
                            setHeatingCurve([nodeDataVariable.filter(node => node.Nodes.includes("HeatingCurve.SetPointHigh"))[0].Data, nodeDataVariable.filter(node => node.Nodes.includes("HeatingCurve.SetPointLow"))[0].Data]);
                            setDefaultHeatingCurve([nodeDataVariable.filter(node => node.Nodes.includes("DefaultHeatingCurve.SetPointHigh"))[0].Data, nodeDataVariable.filter(node => node.Nodes.includes("DefaultHeatingCurve.SetPointLow"))[0].Data]);
                        }
                        else if (WVI.Datamodel === "1.7") {
                            setHeatingCurve([nodeDataVariable.filter(node => node.Nodes.includes("CurrentHeatingcurveSetPoints.SetPointHigh"))[0].Data, nodeDataVariable.filter(node => node.Nodes.includes("CurrentHeatingcurveSetPoints.SetPointLow"))[0].Data]);
                            setDefaultHeatingCurve([nodeDataVariable.filter(node => node.Nodes.includes("Params.DefaultHeatingcurveSetPointHigh"))[0].Data, nodeDataVariable.filter(node => node.Nodes.includes("Params.DefaultHeatingcurveSetPointLow"))[0].Data]);
                        }
                    }
                    else
                    {
                        setCurrentNode({ Node: null, endpoint: null, datamodel: null });
                        setShowOperateMenu(!showOperateMenu);
                        return;
                    }                             
                }}>
                    Bestuur WVI
                </button> : canEditWVI ? <button className="absolute self-end left[100%] bottom-0 mr-[5px] mb-[5px] bg-[#181452] p-[5px] rounded-lg hover:text-[1.1rem] transition-all duration-300 ease-in-out" onClick={() => {
                        window.location.replace(`/AddWVI?WVI=${WVI.PMP_enkelvoudige_objectnaam}`);
                }}>WVI aanpassen</button> : ""}
            </div>) : <img className="relative translate-y-[-30%] translate-x-[-50%] top-[30%] left-[50%]" src={loadingGif} width="40" height="40" alt="loading..." /> }
        </div>

        {currentNode?.Node !== "" && nodeData.length > 1 && showData ? <div className="mt-[5vh] ml-[8vw] hidden md:flex flex-grow">
            <div className="w-[50%] h-[70vh] flex flex-col">
                <div className="flex justify-between">
                    <span className="text-lg ml-[42%]">{ currentNode.Node }</span>
                    <button className="mr-[2vw] self-center" onClick={() => {
                        GetData("ns=2;s=" + currentNode.Node, currentNode.endpoint, status, currentNode.datamodel, currentNode.Node);
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
        </div> : ""}

        {!canEditWVI && showOperateMenu ? <div className="flex flex-col ml-[10%]"><span className="text-[1.5rem] self-center mb-[8vh] mt-[50px]">{currentNode.Node}</span><div className="flex gap-[50px] items-center">
            <div className="flex flex-col items-start h-[10vh]">
                <span className="text-white text-[1.2rem]">Set operation modes:</span>

                <button id="dropdownDefaultButton" onClick={() => { setDropDownOperationChoice(!dropDownOperationChoice); } } className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" type="button">Operation modes
                    <svg className="w-2.5 h-2.5 ml-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
                    </svg></button>
                {dropDownOperationChoice ? <div id="dropdown" className="z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700">
                    <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
                        <li>
                            <a href="#" onClick={async () => { setDropDownOperationChoice(!dropDownOperationChoice); await routes.SetStatus(0, "ns=2;s=" + currentNode.Node, currentNode.endpoint, currentNode.datamodel, currentNode.Node); GetData("ns=2;s=" + currentNode.Node, currentNode.endpoint, status, currentNode.datamodel, currentNode.Node); } } className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Uit</a>
                        </li>
                        <li>
                            <a href="#" onClick={async () => { setDropDownOperationChoice(!dropDownOperationChoice); await routes.SetStatus(1, "ns=2;s=" + currentNode.Node, currentNode.endpoint, currentNode.datamodel, currentNode.Node); GetData("ns=2;s=" + currentNode.Node, currentNode.endpoint, status, currentNode.datamodel, currentNode.Node); } } className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Auto</a>
                        </li>
                        <li>
                            <a href="#" onClick={async () => { setDropDownOperationChoice(!dropDownOperationChoice); await routes.SetStatus(2, "ns=2;s=" + currentNode.Node, currentNode.endpoint, currentNode.datamodel, currentNode.Node); GetData("ns=2;s=" + currentNode.Node, currentNode.endpoint, status, currentNode.datamodel, currentNode.Node); } } className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">handmatig</a>
                        </li>
                        <li>
                            <a href="#" onClick={async () => { setDropDownOperationChoice(!dropDownOperationChoice); await routes.SetStatus(3, "ns=2;s=" + currentNode.Node, currentNode.endpoint, currentNode.datamodel, currentNode.Node); GetData("ns=2;s=" + currentNode.Node, currentNode.endpoint, status, currentNode.datamodel, currentNode.Node); } } className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Burner test</a>
                        </li>
                    </ul>
                </div> : ''}
            </div>
            <div className="flex flex-col gap-[50px]">
                <div className="flex flex-col gap-[20px]">
                    <span className="text-[1.1rem]">Heating curve:</span>
                    <div className="flex justify-between">
                        <span>SetPointHigh: </span>
                        <input onChange={e => setHeatingCurve([e.target.value, heatingCurve[1]])} className="text-black max-w-[50px] ml-[5px]" value={heatingCurve[0]} type="number" min="0"></input>
                    </div>
                    <div className="flex justify-between">
                        <span>SetPointLow: </span>
                        <input onChange={e => setHeatingCurve([heatingCurve[0], e.target.value])} className="text-black max-w-[50px] ml-[5px]" value={heatingCurve[1]} type="number" min="0"></input>
                    </div>
                    <button onClick={() => { routes.SetHeatingCurve(Number(heatingCurve[0]), Number(heatingCurve[1]), "ns=2;s=" + currentNode.Node, currentNode.endpoint, currentNode.datamodel, currentNode.Node); GetData("ns=2;s=" + currentNode.Node, currentNode.endpoint, status, currentNode.datamodel, currentNode.Node); } } className="font-medium text-white bg-blue-700 hover:bg-blue-800 rounded-lg text-sm px-5 py-2.5 text-center items-center">toepassen</button>
                </div>
                <div className="flex flex-col gap-[20px]">
                    <span className="text-[1.1rem]">Default heating curve:</span>
                    <div className="flex justify-between">
                        <span>SetPointHigh: </span>
                        <input onChange={e => setDefaultHeatingCurve([e.target.value, defaultHeatingCurve[1]])} className="text-black max-w-[50px] ml-[5px]" value={defaultHeatingCurve[0]} type="number" min="0"></input>
                    </div>
                    <div className="flex justify-between">
                        <span>SetPointLow: </span>
                        <input onChange={e => setDefaultHeatingCurve([defaultHeatingCurve[0], e.target.value])} className="text-black max-w-[50px] ml-[5px]" value={defaultHeatingCurve[1]} type="number" min="0"></input>
                    </div>
                    <button onClick={() => { routes.SetDefaultHeatingCurve(Number(defaultHeatingCurve[0]), Number(defaultHeatingCurve[1]), "ns=2;s=" + currentNode.Node, currentNode.endpoint, currentNode.datamodel, currentNode.Node); GetData("ns=2;s=" + currentNode.Node, currentNode.endpoint, status, currentNode.datamodel, currentNode.Node); } } className="font-medium text-white bg-blue-700 hover:bg-blue-800 rounded-lg text-sm px-5 py-2.5 text-center items-center">toepassen</button>
                </div>
            </div>
        </div></div> : '' }     
    </div>
);
}

export default Dashboard;
