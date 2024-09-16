

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import html2canvas from 'html2canvas';
// import { image } from 'html2canvas-pro/dist/types/css/types/image';
//import html2canvas from 'html2canvas';





const Home = () => {
    const [errorMessage, setErrorMessage] = useState(''); // State for error message
    const [errorModal, setErrorModal] = useState(false); // State for modal visibility
    const [bugTickets, setBugTickets] = useState([]); // manage the bug tickets list
    const [message, setMessage] = useState(''); 
    const [chatHistory, setChatHistory] = useState([]);
    const [apidata, setapidata]  =  useState(null);
    const [chatModal, setChatModal] = useState(false);
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

        
       

        const apiEndpoint = '/api/users/23';
        const apiResponse = JSON.stringify(apidata.data);

        navigate('/error', {
            state: {
                ticketNumber: Math.floor(Math.random() * 1000), // generating the ticket number
                statusCode: apidata.response.status,
                payload: JSON.stringify(apidata.payload), // Payload sent
                response: JSON.stringify(apidata.data), // Response received
            },
        });
        


        html2canvas(document.body, {scale: 0.5}).then(function(canvas) {
            
            const img = canvas.toDataURL("image/png");
            //const img1 = canvas.toDataURL("image1/png")
                
            // Open the image in a new tab
            const link = document.createElement('a');
            link.href = img;
            link.download = 'image/png';
            link.click();

            fetch('http://localhost:3001/send-email', {  // server URL
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    to: 'sajcool2012@gmail.com', 
                    subject: `Bug Report - ${apiEndpoint} `,
                    text: `Attached is the screenshot of the bug report.\n\nAPI Response: ${apiResponse}`,
                    image: img, // 
                    img1 : img,
                 apiPayload: apidata.payload  

                    
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
                
                console.log('Fetch Error:', error);
                alert('An error occurred while fetching the data.');
            });
        });
    };

    

    const handleSubmit = (event) => {
        event.preventDefault();
        if (message.trim()) {
            // Add the new message to chat history
            setChatHistory([...chatHistory, message]);
            setMessage(''); // Clear the input field after submission
        }
    };


    const closePopup = () => {
        setErrorModal(false); // Close the error modal without adding a bug ticket
    };

    const callApi = async () => {

        const payload = {
            userId: 23,
        };
        try {
        let response = await fetch(`https://reqres.in/api/users/${payload.userId}`); 
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
        <>
            <div>
                <header className="App-header">
                    <h1>API Error Handling</h1>
                </header>

                <div className="apiButton">
                    <button className="btn btn-primary" type="button" onClick={callApi}>
                        Call API
                    </button>
                </div>

                <div className="chatButton">
                    <button className="btn btn-primary" type="button" onClick={() => setChatModal(true)}>
                        <svg height="24px" viewBox="0 0 24 24" width="24px" fill="#FFFFFF">
                            <path d="M0 0h24v24H0V0z" fill="none"/>
                            <path d="M15 4v7H5.17l-.59.59-.58.58V4h11m1-2H3c-.55 0-1 .45-1 1v14l4-4h10c.55 0 1-.45 1-1V3c0-.55-.45-1-1-1zm5 4h-2v9H6v2c0 .55.45 1 1 1h11l4 4V7c0-.55-.45-1-1-1z"/>
                        </svg>
                    </button>
                    {chatModal && (
                        <div className="chat-container">
                            <h2>Chat with Support</h2>
                            <button className="closeModal" type="button" onClick={() => setChatModal(false)}>X</button>
                
                            {/* Chat history display */}
                            <div className="chat-history">
                                {chatHistory.map((msg, index) => (
                                    <div key={index} className="chat-message">
                                        <strong>User:</strong> {msg}
                                    </div>
                                ))}
                            </div>
                
                            {/* Chat form */}
                            <form onSubmit={handleSubmit} className="chat-form">
                                <input
                                    type="text"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Type your message..."
                                    className="chat-input"
                                />
                                <button type="submit" className="submit-btn">Send</button>
                            </form>
                        </div>
                    )}
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
            
        </>
    )
}

export default Home;