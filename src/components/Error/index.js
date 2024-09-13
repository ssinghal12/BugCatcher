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
            <h1>Error Page</h1>
            <div style={{ padding: '20px', border: '1px solid red', borderRadius: '10px', backgroundColor: 'lightyellow' }}>
                <p><strong>Ticket Number:</strong> {ticketNumber}</p>
                <p><strong>Status Code:</strong> {statusCode}</p>
                <p><strong>Payload Sent:</strong> {payload}</p>
                <p><strong>Response Received:</strong> {response}</p>
            </div>
            <button onClick={goBack} style={{ marginTop: '20px' }}>Go Back</button>
        </div>
    );
};

export default Error;
