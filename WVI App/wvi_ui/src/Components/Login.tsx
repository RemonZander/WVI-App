import React, { Component, useEffect, useState } from 'react';
import '../tailwind.css';
import prorailLogo from '../media/proraillogo.png';
import routes from '../Services/routes';


function Login() {
    const [loginGegevens, setLoginGegevens] = useState(["", ""]);

    return (
        <div className="flex flex-col items-center absolute top-[50%] left-[50%] translate-y-[-50%] translate-x-[-50%] w-[300px] h-[300px]">
            <img className="ml-[1vw]" src={prorailLogo} alt="" width="120" height="120" />
            <span className="text-lg mb-[2vh]">Login to WVI management</span>
            <div className="flex justify-between w-[90%] mb-[1vh]">
                <span>Email: </span>
                <input className="text-black" onChange={e => setLoginGegevens([e.target.value, loginGegevens[1]])} value={loginGegevens[0]}></input>
            </div>
            <div className="flex justify-between w-[90%] mb-[2vh]">
                <span>Password: </span>
                <input className="text-black" type="password" onChange={e => setLoginGegevens([loginGegevens[0], e.target.value])} value={loginGegevens[1]}></input>
            </div>
            <button onClick={() => {
                routes.Login(loginGegevens[0], loginGegevens[1]).then((status) => {
                    console.log(status);
                    if (status === 200) {
                        window.location.replace('/WVI');
                    }
                    else {
                        alert("Onjuiste login gegevens");
                    }
            }); } }>login</button>
        </div>
    );
}

export default Login;