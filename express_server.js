const express = require('express');
const cookieSession = require('cookie-session');
const bcrypt = require('bcryptjs');
const methodOverride = require('method-override');
const morgan = require('morgan');

const app = express();
const PORT = 8080;

// Server Config ------------------------------------------------
app.set('view engine', 'ejs');

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(methodOverride('_method'));
app.use(morgan('dev'))

app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2'],
  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));

// Helper Functions ------------------------------------------------
const { generateRandomString, findUserByEmail, urlsForUser, generateNewUser, saveUserToDataBase } = require('./helpers');

// Databases
const { urlDatabase, usersDatabase, errorMessages } = require('./databses');



// Routes ------------------------------------------------


// Login ------------------------------------------------

app.get('/login', (req, res) => {

  if (req.session.user_id) {
    return res.redirect('/urls');
  }
  res.render('login');
});


app.post('/login', (req, res) => {

  if (!req.body.email || !req.body.password) {
    return res.status(400).render('login', { errorMessage: errorMessages.emptyEmailOrPassword });
  }

  const user = findUserByEmail(req.body.email, usersDatabase);

  if (!user) {
    return res.status(401).render('login', { errorMessage: errorMessages.userNotFound });
  }

  if (!bcrypt.compareSync(req.body.password, user.password)) {
    return res.status(401).render('login', { errorMessage: errorMessages.wrongPassword });
  }

  req.session.user_id = user.id;
  res.redirect('/urls');
});

// Logout ------------------------------------------------

app.post('/logout', (req, res) => {
  req.session = null;
  res.redirect('/login');
});

// Register ------------------------------------------------

app.get('/register', (req, res) => {

  if (req.session.user_id) {
    return res.redirect('/urls');
  }
  res.render('register');

});

app.post('/register', (req, res) => {


  if (!req.body.email || !req.body.password) {
    return res.status(400).render('register', { errorMessage: errorMessages.emptyEmailOrPassword });
  }

  if (findUserByEmail(req.body.email, usersDatabase)) {
    return res.status(409).render('register', { errorMessage: errorMessages.exisitingEmail });
  }
  const newUser = generateNewUser(req.body.email, req.body.password);
  saveUserToDataBase(newUser, usersDatabase);
  req.session.user_id = newUser.id;
  res.redirect('/urls');

});

//Home Page ------------------------------------------------

app.get('/', (req, res) => {
  res.redirect('/urls');
});

app.get('/urls', (req, res) => {

  const userId = req.session.user_id;
  if (!userId) {
    return res.status(403).render('forbidden');
  }
  const templateVars = { urls: urlsForUser(userId, urlDatabase), user: usersDatabase[userId] };
  res.render('urls_index', templateVars);

});

//Create ------------------------------------------------

app.get('/urls/new', (req, res) => {

  if (!req.session.user_id) {
    return res.status(403).redirect('/login');
  }
  res.render('urls_new', { user: usersDatabase[req.session.user_id] });
});

app.post('/urls', (req, res) => {

  if (!req.session.user_id) {
    return res.status(403).render('forbidden');
  }

  const shortUrl = generateRandomString();
  urlDatabase[shortUrl] = {
    longURL: req.body.longURL,
    createdDate: new Date().toISOString().split('T')[0],
    userID: req.session.user_id
  };
  res.redirect(`/urls/${shortUrl}`);

});

//Read ------------------------------------------------
app.get('/urls/:id', (req, res) => {

  const userId = req.session.user_id;
  if (!userId) {
    return res.status(403).render('forbidden');
  }

  if (!urlDatabase[req.params.id]) {
    return res.status(404).render('not_found', { user: usersDatabase[req.session.user_id] });
  }

  if (urlDatabase[req.params.id].userID !== userId) {
    return res.status(403).render('no_permission', { user: usersDatabase[req.session.user_id] });
  }

  const templateVars = {
    id: req.params.id,
    longURL: urlDatabase[req.params.id].longURL,
    user: usersDatabase[userId]
  };
  return res.render('urls_show', templateVars);

});

//Update ------------------------------------------------

app.put('/urls/:id', (req, res) => {

  const userId = req.session.user_id;

  if (!userId) {
    return res.status(403).render('forbidden');
  }
  const shortUrl = req.params.id;

  if (!urlDatabase[shortUrl]) {
    return res.status(404).render('not_found', { user: usersDatabase[req.session.user_id] });
  }

  if (urlDatabase[shortUrl].userID !== userId) {
    return res.status(403).render('no_permission', { user: usersDatabase[req.session.user_id] });
  }

  const newLongURL = req.body.longURL;
  urlDatabase[shortUrl].longURL = newLongURL;
  return res.redirect('/urls');


});

//Delete ------------------------------------------------

app.delete('/urls/:id', (req, res) => {

  const userId = req.session.user_id;
  if (!userId) {
    return res.status(403).render('forbidden');
  }
  if (!urlDatabase[req.params.id]) {
    return res.status(404).render('not_found', { user: usersDatabase[req.session.user_id] });
  }
  if (urlDatabase[req.params.id].userID !== userId) {
    return res.status(403).render('no_permission', { user: usersDatabase[req.session.user_id] });
  }

  delete urlDatabase[req.params.id];
  return res.redirect('/urls');

});

// Main Function ------------------------------------------------

app.get('/u/:id', (req, res) => {

  if (!urlDatabase[req.params.id]) {
    return res.status(404).render('not_found', { user: usersDatabase[req.session.user_id] });
  }
  res.redirect(urlDatabase[req.params.id].longURL);

});

//------------------------------------------------

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});