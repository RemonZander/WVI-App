import React, { useEffect, useState } from 'react';
import '../tailwind.css';
import prorailLogo from '../media/proraillogo.png';
import routes from '../Services/routes';

function Login() {
    const [loginGegevens, setLoginGegevens] = useState(["", ""]);
    const [result, setResult] = useState("");
    const [autherised, setAutherised] = useState(true);

    function Login() {
        routes.Login(loginGegevens[0].toLowerCase(), loginGegevens[1]).then((status) => {
            if (status === 200) {
                window.location.replace('/WVI');
            }
            else if (status === 401) {
                setResult("Onjuiste login gegevens");
            }
        });
    }

    useEffect(() => {
        routes.ValidateToken().then((status) => {
            if (status === 200) {
                window.location.replace('/WVI');
                return;
            }

            setAutherised(false);
        });
    }, []);

    return (
        <>
            {!autherised ?
                <div className="flex flex-col items-center mt-[100px] w-[300px] h-[300px]">
                    <img className="ml-[1vw]" src={prorailLogo} alt="" width="120" height="120" />
                    <span className="text-lg">Login to WVI management</span>
                    <span className="text-lg mb-[2vh] text-red-600">{result}</span>
                    <div className="flex justify-between w-[90%] mb-[1vh]">
                        <span>Email: </span>
                        <input className="text-black" onChange={e => setLoginGegevens([e.target.value, loginGegevens[1]])} value={loginGegevens[0]}></input>
                    </div>
                    <div className="flex justify-between w-[90%] mb-[2vh]">
                        <span>Password: </span>
                        <input className="text-black" type="password" onKeyDown={(e) => { if (e.key === "Enter") Login(); }} onChange={(e) => { setLoginGegevens([loginGegevens[0], e.target.value]); }} value={loginGegevens[1]}></input>
                    </div>
                    <button onClick={() => {
                        Login();
                    }}>login</button>
                </div> : ''
            }
        </>
    );
}

export default Login;