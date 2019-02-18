const keys = require('./config/keys')
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport = require('passport');
const express = require('express');
require('./models/user');
require('./services/passport');

mongoose.connect(keys.mongoURI, { useNewUrlParser: true }).then(() => {
  console.log('connected!')
}).catch((err) => {
  console.log("Not Connected to Database ERROR! ", err);
});;

const app = express();

app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [keys.cookieKey]
  })
)

app.use(passport.initialize())
app.use(passport.session())

require('./routes/authRoutes')(app)

const PORT = process.env.PORT || 5000;
app.listen(PORT);