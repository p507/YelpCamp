if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

// require('dotenv').config();

const express = require('express');                             //  For Creating the server
const path = require('path');                                   //  Defining the path of the files
const methodOverride = require('method-override');              //  PUT/DELETE verbs
const ejsMate = require('ejs-mate');                            //  ejs templates for templets
const mongoose = require('mongoose');                           //  Database connection with express
const morgan = require('morgan');                               //  Logging Middleware
const Joi = require('joi');                                     //  For validating the schemas
const session = require('express-session');                     //  For creating the sessions
const flash = require('connect-flash');                         //  Scema of middlewares
const passport = require('passport');                           //  Login password
const passportLocal = require('passport-local');                //  Login password
const expressSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const MongoDBStore = require('connect-mongo')(session);
const ExpressError = require('./utilities/ExpressError');       //  Error class for handling errors
const campgroundRouts = require('./routs/campgrounds');             //  Campground routs
const reviewRouts = require('./routs/reviews');                     //  Review Routs
const userRouts = require('./routs/users')
const User = require('./models/user');                          //  User Model for DB
const port = 3005;
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/yelp-camp';

mongoose.connect(dbUrl, {       //  Database Connection
    useUnifiedTopology: true,
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false
})
    .then((data) => {                                           //  If connection successful 
        console.log(`mongoDB connection established :)`);
    })
    .catch((err) => {                                           //  If got any error while connecting the MongoDB
        console.log(`mongoDB Connection Error :(`);
        console.log(err);
    })

const app = express();

app.set('view engine', 'ejs');                                  //  ejs template 
app.set('views', path.join(__dirname, 'views'));                //  views directory
app.engine('ejs', ejsMate);                                     //  ejsmate for ejs template (templet inside templet)

// --------     Middlewares     --------------
app.use(express.urlencoded({ extended: true }));                //  to encode the url like body, query etc
app.use(express.static(path.join(__dirname, 'public')));        //  public directory path
app.use(methodOverride('_method'));                             //  PUT/PATCH/DELETE
app.use(morgan('dev'));
app.use(expressSanitize());                                       //  Logging the middleware

const secret = process.env.SECRET || 'thisisthetopsecret';
const store = new MongoDBStore({
    url: dbUrl,
    secret,
    touchAfter: 24 * 60 * 60
})

store.on('error', function (err) {
    console.log('Sesstion Store Error', err);
})

const sessionConfig = {
    store,                                         //  Configuration of the session
    secret,
    resave: true,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig));                                //  Storing the data at server side (known as session)
app.use(flash());                                               //  Flashing the message
app.use(helmet({ contentSecurityPolicy: false}));


const scriptSrcUrls = [
    "https://cdn.jsdelivr.net",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
    "https://cdn.jsdelivr.net",
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dmaluloab/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT!
                "https://images.unsplash.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);


app.use(passport.initialize());
app.use(passport.session());                                    //  passport.session should placed after the session configuration
passport.use(new passportLocal(User.authenticate()));           //  For user authentication
passport.serializeUser(User.serializeUser());                   //  Storing the user in the session
passport.deserializeUser(User.deserializeUser());               //  Destroying the yser from the session

app.use((req, res, next) => {                              //  Middleware for flashing the message
    res.locals.currentUser = req.user;                          //  data of current user (inside session with passport) 
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.get('/', (req, res) => {
    res.render('home');
})

app.get('/fakeUser', async (req, res) => {
    const user = new User({ email: 'avikal@outlook.com', username: 'avikal' });
    const newUser = await User.register(user, 'Avikal@123')                             //  Creating a hash password (predefined methode in passportLocalMongoose)
    res.send(newUser);
})


app.use('/', userRouts);                                        //  User Authentication Routs
app.use('/campgrounds', campgroundRouts);                       //  Campground routs
app.use('/campgrounds/:id/reviews', reviewRouts);               //  Review Routs


app.all('*', (req, res, next) => {                              //  Rout for all the unknwon request
    next(new ExpressError('Page Not Found', 404));
})

app.use((err, req, res, next) => {                              //  Middleware for unpredictable/error while requesting the rout
    const { message = `Something Went Wrong`, status = 500 } = err;
    res.status(status).render('error', { err });
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})