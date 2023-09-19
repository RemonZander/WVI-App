export default class routes{
    GetStatus() {
       return fetch('http://localhost:3000/OPCUA/status').then((res) => {
           return res.json();
       }).then((data) => { return data });
    }

    SetStatus() {
        fetch('http://localhost:3000/OPCUA/changeopt', {
            method: "POST",
            mode: "no-cors",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ mode: 0 })
        });
    }
}