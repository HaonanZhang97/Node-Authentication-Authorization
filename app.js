//jshint esversion:6
import 'dotenv/config';
import express from 'express';
import bodyParser from 'body-parser';
import ejs from 'ejs';
import mongoose from 'mongoose';
import bcrypt, { hashSync } from 'bcrypt';
import { error } from 'console';

const saltRounds = 10;

const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/userDB');

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

const User = new mongoose.model('User', userSchema);
app.get('/', (req, res) => {
  res.render('home.ejs');
});
app.get('/login', (req, res) => {
  res.render('login.ejs');
});
app.get('/register', (req, res) => {
  res.render('register.ejs');
});

app.post('/register', (req, res) => {
  bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
    const newUser = new User({
      email: req.body.username,
      password: hash,
    });
    try {
      newUser.save();
      res.render('secrets.ejs');
    } catch (error) {
      console.log(error);
    }
  });
});
app.post('/login', async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  try {
    const found = await User.findOne({ email: username }).exec();
    if (found) {
      bcrypt.compare(password, found.password, function (err, result) {
        if (result) {
          res.render('secrets.ejs');
        } else {
          console.log(err);
        }
      });
    }
  } catch (error) {
    console.log(error);
  }
});
app.listen(port, () => {
  console.log(`Server is now running on port ${port}`);
});
