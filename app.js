var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
//nodig voor authentication
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const session = require('express-session')
const mongoDBStore = require("connect-mongodb-session")(session);
//const csrf = require("csurf");

const User = require("./models/user");

const crypto = require('crypto');
const authTokens = {};

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var catalogRouter = require('./routes/catalog');
var adminRouter = require('./routes/admin');

var app = express();

const mongoose = require("mongoose");
const dev_db_url = "mongodb+srv://kai:secret123@cluster1.rzrwysz.mongodb.net/local_library?retryWrites=true&w=majority";
const mongoDB = process.env.MONGODB_URI || dev_db_url;
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

const storeSessions = new mongoDBStore ({
  uri: mongoDB,
  collection: "sessions"
});

//const csrfProtection = csrf();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// creating 24 hours from milliseconds
const oneDay = 1000 * 60 * 60 * 24;

//session middleware
app.use(session({
    secret: crypto.randomBytes(20).toString("hex"),
    saveUninitialized:false,
    cookie: { maxAge: oneDay },
    resave: false,
    store: storeSessions,
}));
//app.use(csrfProtection);

app.use(async (req, res, next) => {
  try {
    if (!req.session.user) {
      return next();
    }
    const user = await User.findById(req.session.user._id);

    if (!user) {
      return next();
    }
    req.user = user;
    next();
  } catch (err) {
    throw new Error(err);
  }
});

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  //res.locals.csrfToken = req.csrfToken();
  res.locals.session = req.session;
  next();
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/catalog', catalogRouter);
app.use('/admin', adminRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(101));
});


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// parsing the incoming data
app.use(express.json());

//serving public file
app.use(express.static(__dirname));

// cookie parser middleware
app.use(cookieParser());

app.use((req, res, next) => {
  const authToken = req.cookies['AuthToken'];
  req.user = authTokens[authToken];
  next();
});


module.exports = app;
