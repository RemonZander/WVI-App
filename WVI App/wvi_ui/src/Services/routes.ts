export default class routes{
    GetStatus() {
       return fetch('http://localhost:3000/OPCUA/status').then((res) => {
           return res.json();
       }).then((data) => { return data });
    }

    async SetStatus(mode: number) {
        await fetch('http://localhost:3000/OPCUA/changeopt', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ mode: mode })
        });
    }
}