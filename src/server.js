const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors'); 
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(cors()); 

app.use(bodyParser.json({ limit: '10mb' })); 
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));



const transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
        user: 'suraj.singhal@ofbusiness.in',  
        pass: 'fsiz flzp abxt kvxd',   
    },
});

app.post('/send-email', (req, res) => {
    const { to, subject, text, image , apipayload} = req.body;

    console.log("something happened");
    const mailOptions = {
        from: 'suraj.singhal@ofbusiness.in', 
        to,
        subject,
        text,
        attachments: [
             {
             filename: 'screenshot.png',
                content: image.split('base64,')[1], // Extract base64 content
             encoding: 'base64',
            },
        ],
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            return res.status(500).send(error.toString());
        }
        console.log(info)
        res.status(200).send('Email sent: ' + info.response);
    });
});

app.listen(3001, () => {
    console.log('Server is running on port 3001');
});
