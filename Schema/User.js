require('dotenv').config();
const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const passport = require('passport');

const userSchema = new mongoose.Schema({
    username: String,
    password: String
});

var options = {
    errorMessages: {
        MissingPasswordError: 'No password was given',
        AttemptTooSoonError: 'Account is currently locked. Try again later',
        TooManyAttemptsError: 'Account locked due to too many failed login attempts',
        NoSaltValueStoredError: 'Authentication not possible. No salt value stored',
        IncorrectPasswordError: 'Password or username are incorrect',
        IncorrectUsernameError: 'Password or username are incorrect',
        MissingUsernameError: 'No username was given',
        UserExistsError: 'A user with the given username is already registered'
    }
};

userSchema.plugin(passportLocalMongoose,options);

const User = mongoose.model("User", userSchema);

// passport-local-mongoose

passport.use(User.createStrategy());
// we need to serialize data before save
passport.serializeUser(User.serializeUser());
// we need to deserialize data read/get
passport.deserializeUser(User.deserializeUser());

module.exports = User;