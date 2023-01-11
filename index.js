const express=require('express');
const cookieParser=require('cookie-parser');
const port=8000;
const app=express();
const expressLayouts=require('express-ejs-layouts');
const db=require('./config/mongoose');
//passport used for session cookie
const session=require('express-session');
const passport=require('passport');
const passportLocal=require('./config/passport-local-strategy');
// const MongoStore=require('connect-mongo')(session);
const MongoStore=require('connect-mongo');
app.use(express.urlencoded());
app.use(cookieParser());
app.use(express.static('./assets'));
app.use(expressLayouts);

app.set('layout extractStyles',true);
app.set('layout extractScripts',true);

app.set('view engine','ejs');
app.set('views','./views');
//mongo store is used to store session cookie in the db
// app.use(session({
//     name:'nodews',
//     secret:'blahsomething',
//     saveUninitialized:false,
//     resave:false,
//     cookie:{
//         maxAge:(1000*60*100)
//     },
//     store: new MongoStore(
//         {
//             mongooseConnection:db,
//             autoRemove:'disabled'
//         },
//         function(err){
//             console.log(err || 'connect-mongodb setup ok');
//         }
//     )
// }));
app.use(session({
    name:'nodews',
    secret:'blahsomething',
    saveUninitialized:false,
    resave:false,
    cookie:{
        maxAge:(1000*60*100)
    },
    store:MongoStore.create({
        // mongooseConnection:db,
        mongoUrl:'mongodb://localhost/codeial_development',
        autoRemove:'disabled'
    },
    function(err){
        console.log(err || 'connect-mongodb setup ok');
    })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);
app.use('/',require('./routes'));
app.listen(port,function(err){
    if(err){
        console.log(`error ${err}`);
        return;
    }
    console.log(`server is running on port ${port}`);
});