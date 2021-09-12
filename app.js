
//launches the webserver
const express = require('express');
const app = express();

//creates the file structure for the website
const path = require('path');
const ejsMate = require('ejs-mate');

//handles parsing the ejs,.js file extensions
app.engine('ejs', ejsMate)
/// used for server side validation
const Joi = require('joi');


const mongoose = require('mongoose');
const methodOverride = require('method-override');

//CREATES COOKIEs to save states
const session = require('express-session');

//custom errorclass for error handling
const ExpressError = require('./utils/ExpressError');

//database instances
const Campground = require('./models/campground');
const Review = require('./models/review');

//decoupled Rest routes?
const campgrounds = require('./routes/campgrounds');
const reviews = require('./routes/reviews')

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    /*useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true */
});

//basic db connection setup
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))


app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')))

///cookie session details
const sessionConfig = {
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig))



app.use('/campgrounds', campgrounds)
app.use('/campgrounds/:id/reviews', reviews)


app.get('/', (req, res) => {
    res.render('home')
});


app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))

})


app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = "Oh,No Something went wrong!"
    res.status(statusCode).render('errors', { err })

})

app.listen(3000, () => {
    console.log('Serving on Port 3000')
});
