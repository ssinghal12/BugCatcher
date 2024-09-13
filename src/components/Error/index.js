import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Error = () => {
    const location = useLocation(); // Access the data passed via navigate
    const navigate = useNavigate();

    const goBack = () => {
        navigate('/'); // Navigate back to the home page
    };

    const { ticketNumber, statusCode, payload, response } = location.state || {}; // Destructure passed state

    return (
        <div>
            <header className="App-header">
                <h1>Error Page</h1>
            </header>
            <div className="container">
                <div className="erroeContent">
                    <div className="erroePage">
                        <p><strong>Ticket Number:</strong> {ticketNumber}</p>
                        <p><strong>Status Code:</strong> {statusCode}</p>
                        <p><strong>Payload Sent:</strong> {payload}</p>
                        <p><strong>Response Received:</strong> {response}</p>
                    </div>
                    <div className="btnBlock">
                        <button className="btn btn-primary" onClick={goBack}>Go Back</button>
                    </div>
                </div>
            </div>  
        </div>
    );
};

export default Error;
