import React, { useEffect } from 'react';
import routes from '../Services/routes';
import '../tailwind.css';

function AddWVI() {

    useEffect(() => {
        routes.ValidateToken().then((status) => {
            if (status === 401) window.location.replace('/');
        });
    }, []);

    return (
        <></>
    );
}

export default AddWVI;