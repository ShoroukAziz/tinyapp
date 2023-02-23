// Imports -------------------------------------------------------

const express = require('express');
const cookieSession = require('cookie-session');
const bcrypt = require('bcryptjs');
const methodOverride = require('method-override');
const morgan = require('morgan');

// Helper Functions ------------------------------------------------
const { findUserByEmail, getUrlsForUser, generateNewUser, generateNewURL,generateURLVisit, generateUniqueRandomId } = require('./helpers');

// Databases
const { urls, urlDatabase, users, usersDatabase, errorMessages, visitors } = require('./databses');

// Server Config --------------------------------------------------
const PORT = 8080;
const app = express();
app.set('view engine', 'ejs');
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

// Middleware -----------------------------------------------------
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(methodOverride('_method'));
app.use(morgan('dev'));
app.use(cookieSession({
  name: 'session',
  keys: ['834975rjher43nf43895rjd98', 'gfjhg786675hg6756gf56gfhf7ui'],
}));


// Routes #################################################################


// Login ------------------------------------------------

app.get('/login', (req, res) => {

  if (req.session.userId) {
    return res.redirect('/urls');
  }
  res.render('login');
});


app.post('/login', (req, res) => {

  if (!req.body.email || !req.body.password) {
    return res.status(400).render('login', { errorMessage: errorMessages.emptyEmailOrPassword });
  }

  const user = findUserByEmail(req.body.email, users);

  if (!user) {
    return res.status(401).render('login', { errorMessage: errorMessages.userNotFound });
  }

  if (!bcrypt.compareSync(req.body.password, user.password)) {
    return res.status(401).render('login', { errorMessage: errorMessages.wrongPassword });
  }

  req.session.userId = user.id;
  res.redirect('/urls');
});

// Logout ------------------------------------------------

app.post('/logout', (req, res) => {
  req.session = null;
  res.redirect('/login');
});

// Register ------------------------------------------------

app.get('/register', (req, res) => {

  if (req.session.userId) {
    return res.redirect('/urls');
  }
  res.render('register');

});

app.post('/register', (req, res) => {


  if (!req.body.email || !req.body.password) {
    return res.status(400).render('register', { errorMessage: errorMessages.emptyEmailOrPassword });
  }

  if (findUserByEmail(req.body.email, users)) {
    return res.status(409).render('register', { errorMessage: errorMessages.exisitingEmail });
  }
  const newUser = generateNewUser(req.body.email, req.body.password, users);
  usersDatabase.saveUser(newUser);

  req.session.userId = newUser.id;
  res.redirect('/urls');

});

//Home Page ------------------------------------------------

app.get('/', (req, res) => {
  res.redirect('/urls');
});

app.get('/urls', (req, res) => {

  const userId = req.session.userId;
  if (!userId) {
    return res.status(403).render('forbidden');
  }
  const templateVars = { urls: getUrlsForUser(userId, urls), user: users[userId] };
  res.render('urls_index', templateVars);

});

//Create ------------------------------------------------

app.get('/urls/new', (req, res) => {

  if (!req.session.userId) {
    return res.status(403).redirect('/login');
  }
  res.render('urls_new', { user: users[req.session.userId] });
});

app.post('/urls', (req, res) => {

  if (!req.session.userId) {
    return res.status(403).render('forbidden');
  }

  if (!req.body.longURL) {
    return res.status(400)
      .render('urls_new', { user: users[req.session.userId], errorMessage: errorMessages.emptyURL });
  }
  const newUrl = generateNewURL(req.body.longURL, req.session.userId, urls);
  urlDatabase.saveURL(newUrl);
  res.redirect(`/urls/${newUrl.id}`);

});

//Read ------------------------------------------------
app.get('/urls/:id', (req, res) => {

  const userId = req.session.userId;
  if (!userId) {
    return res.status(403).render('forbidden');
  }

  if (!urls[req.params.id]) {
    return res.status(404).render('not_found', { user: users[req.session.userId] });
  }

  if (urls[req.params.id].userID !== userId) {
    return res.status(403).render('no_permission', { user: users[req.session.userId] });
  }

  const templateVars = {
    id: req.params.id,
    longURL: urls[req.params.id].longURL,
    user: users[userId],
    visits : urls[req.params.id].visits,
    totalVisits : urlDatabase.gettTotalVisitsForURL(req.params.id),
    uniqueVisitors :  urlDatabase.getUniqueVisitorsForURL(req.params.id),
    createdDate : urls[req.params.id].createdDate,
  };
  return res.render('urls_show', templateVars);

});

//Update ------------------------------------------------

app.put('/urls/:id', (req, res) => {

  const userId = req.session.userId;

  if (!userId) {
    return res.status(403).render('forbidden');
  }
  const shortUrl = req.params.id;

  if (!urls[shortUrl]) {
    return res.status(404).render('not_found', { user: users[req.session.userId] });
  }

  if (urls[shortUrl].userID !== userId) {
    return res.status(403).render('no_permission', { user: users[req.session.userId] });
  }

  const newLongURL = req.body.longURL;
  urls[shortUrl].longURL = newLongURL;
  return res.redirect('/urls');


});

//Delete ------------------------------------------------

app.delete('/urls/:id', (req, res) => {

  const userId = req.session.userId;
  if (!userId) {
    return res.status(403).render('forbidden');
  }
  if (!urls[req.params.id]) {
    return res.status(404).render('not_found', { user: users[req.session.userId] });
  }
  if (urls[req.params.id].userID !== userId) {
    return res.status(403).render('no_permission', { user: users[req.session.userId] });
  }

  delete urls[req.params.id];
  return res.redirect('/urls');

});

// Main Function ------------------------------------------------

app.get('/u/:id', (req, res) => {

  if (!urls[req.params.id]) {
    return res.status(404).render('not_found', { user: users[req.session.userId] });
  }
   let visitorId = req.session.visitorId;
  
  if(!visitorId){
    visitorId = generateUniqueRandomId(visitors);
    visitors.addVisitor(visitorId);
    req.session.visitorId = visitorId
  }
  urlDatabase.addVisit(req.params.id, generateURLVisit(visitorId));
  res.redirect(urls[req.params.id].longURL);

});

