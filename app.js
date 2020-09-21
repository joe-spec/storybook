const express = require('express');
const path = require('path')
const morgan = require('morgan')
const expressLayouts = require('express-ejs-layouts');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const MongoStore = require('connect-mongo')(session)
const app = express();
const port = 3000;

//password config
require('./config/passport')(passport);

//connect mongoose
mongoose.connect('mongodb://localhost/StoryBooks',{
    useNewUrlParser: true,
    useUnifiedTopology: true 
}).then((res) => {
    console.log('connected to story_book database')
}).catch((err) => {
    console.log(err)
})

//ejs
app.use(expressLayouts);
app.set('view engine', 'ejs');

// body parser middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


//method Override
app.use(methodOverride(function(req,res){
    if (req.body && typeof req.body === 'object' && '_method' in req.body){
        let method = req.body._method
        delete req.body._method
        return method
    } 
}))

//express session midleware
app.use(session({
    secret: '({[<>}])',
    saveUninitialized: false, //if saved to true tis session will be saved on the server on each request no matter if something change or not
    resave: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    cookie: { maxAge:Date.now() + 3600000}
}));

//initiallize passport middleware
app.use(passport.initialize());
app.use(passport.session());

//connect flash
app.use(flash());

//morgan
app.use(morgan())

//global variable
app.use((req, res, next)=>{
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
})

//static file
app.use(express.static(path.join(__dirname, 'public')));

// routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));
app.use('/stories', require('./routes/stories'));

app.listen(port, ()=>{console.log(`server listening on port ${port}`)});