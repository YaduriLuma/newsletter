const express = require('express');
const request = require('request');
const https = require('https');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"))

const apiKey = '632e1a89d37f86a4c84c7b0d71538376-us21';
const auId = 'a702c5e98b'

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/signup.html")
})

app.post('/', (req, res) => {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;

    const data = {
        members: [
            {
                email_address: email,
                status: 'subscribed',
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ],
        update_existing: true
    };

    const jsonData = JSON.stringify(data);

    const url = 'https://us21.api.mailchimp.com/3.0/lists/' + auId;

    const options = {
        method: "POST",
        auth: "yago:" + apiKey
    }

    const request = https.request(url, options, (response) => {

        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html")
        } else {
            res.sendFile(__dirname + "/failure.html")
        }
        response.on("data", (data) => {
            console.log(JSON.parse(data));
        })
    })

    //request.write(jsonData);
    request.end()
})

app.post('/failure', (req, res) => {
    res.redirect('/')
})

app.listen(3000, () => {
    console.log('Servidor iniciado na porta 3000')
})