const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');

const mailchimp = require('@mailchimp/mailchimp_marketing');
require('dotenv').config()


const app =  express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));



app.get('/', (req,res) => {
  res.sendFile(__dirname + "/signup.html");
});

app.post('/', (req, res) => {
    mailchimp.setConfig({
      apiKey: process.env.api_key,
      server: process.env.server
    });

    const firstName = req.body.fname
    const lastName = req.body.lname;
    const email = req.body.email;
    const listId = process.env.list_id;

    async function run() {
      const response = await mailchimp.lists.addListMember(listId, {
          email_address: email,
          status: "subscribed",
          merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      });

      res.sendFile(__dirname + '/success.html');

      if (response.errors.length) {
        throw new Error(response.errors);
      }
    }

    run()
    .catch(errors => res.sendFile(__dirname + '/failure.html'));
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
