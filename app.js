//jshint esversion:6
import 'dotenv/config';
import express from 'express';
import bodyParser from 'body-parser';
import ejs from 'ejs';
import mongoose from 'mongoose';
import encrypt from 'mongoose-encryption';

const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/userDB');

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

userSchema.plugin(encrypt, {
  secret: process.env.SECRET,
  encryptedFields: ['password'],
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
  const newUser = new User({
    email: req.body.username,
    password: req.body.password,
  });
  try {
    newUser.save();
    res.render('secrets.ejs');
  } catch (error) {
    console.log(error);
  }
});
app.post('/login', async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  try {
    const found = await User.findOne({ email: username }).exec();
    if (found) {
      if (found.password === password) {
        res.render('secrets.ejs');
      }
    }
  } catch (error) {
    console.log(error);
  }
});
app.listen(port, () => {
  console.log(`Server is now running on port ${port}`);
});
