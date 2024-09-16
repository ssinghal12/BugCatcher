

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import html2canvas from 'html2canvas';
// import { image } from 'html2canvas-pro/dist/types/css/types/image';
//import html2canvas from 'html2canvas';





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
        html2canvas(document.body, {scale: 0.5}).then(function(canvas) {
            
            const img = canvas.toDataURL("image/png");
            const img1 = canvas.toDataURL("image1/png")
                
            // Open the image in a new tab
            const link = document.createElement('a');
            link.href = img;
            link.download = 'image/png';
            link.click();

            fetch('http://localhost:3001/send-email', {  // Replace with your server URL
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    to: 'sajcool2012@gmail.com', // Specify the recipient's email
                    subject: 'Bug Report Screenshot',
                    text: 'Attached is the screenshot of the bug report.' ,
                    image: img, // Base64 image of the screenshot
                    img1 : img,
                 apiPayload: apidata.payload  // The API payload

                    // Send the base64 image
                }),
            })
            .then(response => {
                if (!response.ok) {
                    // Handle HTTP errors (like 404 or 500)
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json(); // Parse the JSON response
            })
            .then(data => {
                console.log('Data:', data); // Handle the response data
            })
            .catch(error => {
                // Handle network errors or other issues
                console.log('Fetch Error:', error);
                alert('An error occurred while fetching the data.');
            });
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