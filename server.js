const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');

const nodemailer = require('nodemailer');

const path = require('path');
const app = express();
const dotenv = require('dotenv').config()

const PORT = process.env.PORT || 5000;


app.engine('handlebars', exphbs({defaultLayout: false}));
 app.set('view engine', 'handlebars');


app.use('/images', express.static('images'));
app.use('/css', express.static('css'));



app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.get('/', (req, res) => {
    res.render('main');
  });

app.post('/send', (req, res) => {
    const output = `
<p>You have a new contact request</p>
<h3> Contact Details </h3>
<ul>
    <li>Name: ${req.body.name} </li>
    <li>Email: ${req.body.email} </li>
    <li>Phone: ${req.body.phone} </li>
</ul>
<h3>Message</h3>
<p>${req.body.message}</p>

`;

    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: 'abraham.sauz7@gmail.com', // generated ethereal user
            pass: process.env.PASSWORD, // generated ethereal password
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    let mailOptions = {
        from: '"NodeMailer Contact" <test@abraham.sauz7.com>', // sender address
        to: "abraham.sauz7@gmail.com", // list of receivers
        subject: "Node contact ✔", // Subject line
        text: "Hello world?", // plain text body
        html: output, // html body
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

        res.render('main', {msg:'Email has been sent'});

    });


});


app.listen(PORT, () => console.log('Server started'));