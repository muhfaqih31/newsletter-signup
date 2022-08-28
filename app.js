const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const https = require('https');
require('dotenv').config()


const app =  express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (req,res) => {
  res.sendFile(__dirname + "/signup.html");
});

app.post('/', (req,res) => {
  const firstName = req.body.fname
  const lastName = req.body.lname;
  const email = req.body.email;

  var data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  }

  var jsonData = JSON.stringify(data);

  const url = process.env.url_list
  const options = {
    method: "POST",
    auth: process.env.api_key
  };

  const request = https.request(url, options, (response) => {
    if(response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    }

    else {
      res.sendFile(__dirname + "/failure.html");
    }

    response.on("data", data => {
      console.log(JSON.parse(data));
    });
  });

  request.write(jsonData);
  request.end();



});

app.post('/failure', (req,res) => {
  res.redirect('/');
});

app.post('/success', (req,res) => {
  res.redirect('/');
});

app.listen(process.env.PORT || port, () => {
  console.log('Server started on ' + port);
});
