require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');

const User = require('./Schema/User');

const app = express();

app.use(express.static('public'));
app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));

// Its necessary to put session code under the all 'app.use' sessions and above the 'mongoose.connect'

// This is used to setup our sessions
app.use(session({
    secret: 'Our little secret.',
    resave: false,
    saveUninitialized: true
}));
// This is used to initialize our passport
app.use(passport.initialize());
// This is used to tell our app to use passport to also setup our session
app.use(passport.session());

mongoose.set("strictQuery", false);
mongoose.connect('mongodb://127.0.0.1:27017/Udemy_Cookies_and_Sessions', { useNewUrlParser: true });
mongoose.connection.once('open', () => {
    console.log('Database is connected');
});

app.get('/home', (req, res) => {
    res.sendFile(__dirname + '/views/home.html')
});

app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/views/login.html')
});

app.get('/register', (req, res) => {
    res.sendFile(__dirname + '/views/register.html')
});

app.get('/secrets', (req, res) => {
    if (req.isAuthenticated()) {
        res.sendFile(__dirname + '/views/secrets.html');
    } else {
        res.sendFile(__dirname + '/views/login.html');
    }
});

app.get('/logout', (req, res) => {
    req.logout((err)=>{
        if(err){
            console.log(err);
        } else {
            res.sendFile(__dirname + '/views/home.html');
        }
    });
});

// user registration
app.post('/register', (req, res) => {

    User.register({ username: req.body.username }, req.body.password, (err, user) => {
        if (err) {
            console.log(err);
            res.sendFile(__dirname + '/views/register.html');
        } else {
            passport.authenticate('local')(req, res, () => {
                res.sendFile(__dirname + '/views/secrets.html');
            });
        };
    });
});

// user login
app.post('/login', (req, res) => {
    const user = new User({
        username: req.body.username,
        password: req.body.password
    });

    req.login(user, (err) => {
        if (err) {
            console.log(err);
        } else {
            passport.authenticate('local')(req, res, () => {
                res.sendFile(__dirname + '/views/secrets.html');
            });
        };
    });
});


app.listen(4000, () => {
    console.log('Port is connected at 4000');
});

