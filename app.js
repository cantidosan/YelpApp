
//launches the webserver
const express = require('express');
const app = express();

//creates the file structure for the website
const path = require('path');
const ejsMate = require('ejs-mate');

//handles parsing the ejs,.js file extensions
app.engine('ejs', ejsMate)


const mongoose = require('mongoose');
const methodOverride = require('method-override');

//CREATES COOKIEs to save states
const session = require('express-session');

//implementing flash-session
const flash = require('connect-flash');

//custom errorclass for error handling
const ExpressError = require('./utils/ExpressError');

//built in library to handle User Auth
const passport = require('passport');
const LocalStrategy = require('passport-local');

//import user class from module
const User = require('./models/user')


//segmented Rest routes?
const userRoutes = require('./routes/users')
const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');

//establishes the connection to the DB
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


//establish file structure for site navigation
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
//allow flash function to be used for pop up notifications
app.use(flash());

//setup the auth process via passport
app.use(passport.initialize());
app.use(passport.session());

//authenitcate the user being created
passport.use(new LocalStrategy(User.authenticate()));
//how we store the user in the session
passport.serializeUser(User.serializeUser());
//how we get a user out of the session
passport.deserializeUser(User.deserializeUser());






//setup middleware for client side flash notifications
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})


app.use('/', userRoutes)
app.use('/campgrounds', campgroundRoutes)
app.use('/campgrounds/:id/reviews', reviewRoutes)


app.get('/', (req, res) => {
    res.render('home')
});


//handles incorrect routes
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
