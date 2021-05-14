if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
  }
const express = require('express')
const mongoose = require('mongoose')
const ShortUrl = require('./models/shortUrl')
const User = require('./models/user')
const app = express()
const bcrypt = require('bcrypt')
const passport = require('passport')
const session = require('express-session')
const flash = require('express-flash')
const initializePassport = require('./passport-config')
const methodOverride = require('method-override')
const user = require('./models/user')

app.set('view engine', 'ejs')
app.use(express.urlencoded({extended: false}))
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))

//Initialize Passport initializes passport-an authentication middleware-that will manage our user authentication.
//It takes an instance of passport, a function to find user by email, and a function to find user by id
initializePassport(passport, 
    //
    email =>  User.findOne({email: email}),
    id =>  User.findOne({_id: id})
) 

//connect to mongoDB using a connection string 
mongoose.connect(process.env.CONNECTION_STRING, {
    useNewUrlParser: true, useUnifiedTopology: true
})

//a route of our website that shows user url's -- checkAuthenticated checks that a user is authenticated first --
app.get('/',checkAuthenticated, async (req,res) => {
    //get all url's posted by our current logged-in user
    const shortUrls = await ShortUrl.find({userId: req.user.id})
    //show the user our index page and sending it all url's associated with our logged-in user
    res.render('index', {shortUrls: shortUrls})
})

//a route of our website that posts user url's --checkAuthenticated checks that a user is authenticated first--
app.post('/shortUrls', checkAuthenticated, async (req,res) => {
    //get current logged-in user
    const u = await User.findOne({_id: req.user.id})
    //check this user's usage, not let them post another url if they are past 100 url's to protect against nefarious purposes
    if(u.usage<100){
        await ShortUrl.create({userId: req.user.id, full: req.body.fullUrl})
        u.usage++
        u.save()
    }
    res.redirect('/')
})

//this sends our user to the login page --checkNotAuthenticated ensures that the user is not already logged-in--
app.get('/login', checkNotAuthenticated, (req,res)=>{
    res.render('login')
   })

//this post request is for logging in --we are using passport to authenticate the user--
app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    //after successful login, send user to url page
    successRedirect: '/',
    //after failure, senduser back to login page
    failureRedirect: '/login',
    //if an error occurs, show different log in errors and register button 
    failureFlash: true
 }))
//after get request to register, show register page --checkNotAuthenticated ensures that the user is not already authenticated--
app.get('/register', checkNotAuthenticated, (req,res)=>{
    res.render('register')
})
//after a post request to register, create user
app.post('/register',checkNotAuthenticated,  async (req,res) => {
    //check if email exists
    const u = await User.findOne({email: req.body.email})
    if(u!=null){
        //if it does, show error page
        return res.render('loginError')
    }
    try{
        //hash the user's password
        const hashedPassowrd = await bcrypt.hash(req.body.password, 10)
        const user = await User.create({email: req.body.email, password: hashedPassowrd})
        //send the user to login page
        res.redirect('/login')
    }catch{
        res.render('loginError')
    }
   })
//using passport, we send a delete request to log out of the current user's account.
app.delete('/logout', checkAuthenticated, (req,res) => {
    req.logOut()
    res.redirect('/home')
   })
//send the user to long url using the short one
app.get('/:shortUrl', checkAuthenticated, async (req, res) => {
    //get the short url from the db
    const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl})
    //if not found, send to error page
    if(shortUrl == null){
        return res.render('404')
    } 
    //else increase click count
    shortUrl.clicks++
    //save new click count to db
    shortUrl.save()
    //redirect user to intended location using the full url
    res.redirect(shortUrl.full)
    })
//this is a helper function that check if a user is authenticated before moving forward. If it is not, send to home page.
function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next()
    }
    res.render('home')
  }

  //this is a helper function that check if a user is not authenticated before moving forward. If it is not, send to url page.
  function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return res.redirect('/')
    }
    next()
  }

app.listen(process.env.PORT || 5000);