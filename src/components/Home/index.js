

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import html2canvas from 'html2canvas';


const Home = () => {
    const [errorMessage, setErrorMessage] = useState(''); // State for error message
    const [errorModal, setErrorModal] = useState(false); // State for modal visibility
    const [bugTickets, setBugTickets] = useState([]); // State to manage the bug tickets list
    const [apidata, setapidata]  =  useState(null);
    const navigate = useNavigate();



    const showErrorPopup = (message) => {
        setErrorMessage(message); // Set the error message
        setErrorModal(true); // Show the error modal
    };

    const createBugTicket = (response) => {
        setBugTickets((prevTickets) => [
        ...prevTickets,
        'Bug reported due to API error.',
        ]); // Add a new bug ticket
        setErrorModal(false); // Hide the error modal
        if(apidata == null){
            return;
        }
        navigate('/error', {
            state: {
                ticketNumber: Math.floor(Math.random() * 1000), // Simulated ticket number
                statusCode: apidata.response.status,
                payload: JSON.stringify(apidata.payload), // Payload sent
                response: JSON.stringify(apidata.data), // Response received
            },
        });
        html2canvas(document.body).then(function(canvas) {
            const img = canvas.toDataURL("image/png");
                
            // Open the image in a new tab
            const link = document.createElement('a');
            link.href = img;
            link.download = 'screenshot.png';
            link.click();
        });
    };

    const closePopup = () => {
        setErrorModal(false); // Close the error modal without adding a bug ticket
    };

    const callApi = async () => {

        const payload = {
            userId: 23,
        };
        try {
        let response = await fetch(`https://reqres.in/api/users/${payload.userId}`); // Example API call
        const data = await response.json();
        setapidata({
            payload,
            response,
            data,
        })
        if (![200, 204].includes(response.status)) {
            showErrorPopup(`Error: Received status code ${response.status}`);
        } else {
            alert('API call successful');
        }
        } catch (error) {
            showErrorPopup(`Error: ${error.message}`);
        }
    };

    return (
        <div>
            <header className="App-header">
                <h1>API Error Handling</h1>
            </header>

            <div className="apiButton">
                <button className="btn btn-primary" type="button" onClick={callApi}>
                    Call API
                </button>
            </div>
            

            {errorModal && (
                <div className="modalContailer">
                    <div className="modalContent">
                        <div className="contentBlock">
                            <div className="modalTitle">API status</div>
                            <p>{errorMessage}</p>
                        </div>
                        <div className="btnBlock">
                            <button className="btn btn-primary" onClick={() => createBugTicket()}>Yes</button>
                            <button className="btn btn-primary" onClick={closePopup}>No</button>
                        </div>
                    </div>
                </div>
            )}
            <ul>
                {bugTickets.map((ticket, index) => (
                <li key={index}>{ticket}</li>
                ))}
            </ul>
        </div>
    )
}

export default Home;