const keys = require('./config/keys')
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport = require('passport');
const express = require('express');
const bodyParser = require('body-parser');
require('./models/user');
require('./services/passport');

mongoose.Promise = global.Promise;
mongoose.connect(keys.mongoURI, { useNewUrlParser: true }).catch(
  (err) => { console.log('MONGOOSE err (╯°□°)╯︵ ┻━┻ ', err) }
);

const app = express();

app.use(bodyParser.json());
app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [keys.cookieKey]
  })
)
app.use(passport.initialize())
app.use(passport.session())

if (process.env.NODE_ENV === 'production') {
  // serves up React app 
  app.use(express.static('client/build'));

  const path = require('path');
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  })
}

require('./routes/authRoutes')(app)
require('./routes/billingRoutes')(app)

const PORT = process.env.PORT || 5000;
app.listen(PORT);