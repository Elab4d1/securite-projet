const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const app = express();

// Set up session middleware
app.use(session({
  secret: 'secretkey',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true,
    httpOnly: false,
    sameSite: false,
    maxAge: 3600000 // 1 hour
  }
}));

// Add body-parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.session.isAuthenticated) {
    next();
  } else {
    res.redirect('/login');
  }
};

// Simulated user database
const users = [
  {
    username: 'admin',
    password: "$2a$12$XoimyQsA4ylbA2TVAH9YA.ZSJXQqdwXxBCUPuKTfNTM4ageMWdv5a"
    // Password: "password"
  }
];

// Login route
app.post('/login', (req, res) => {
  const { username, password } = req.body;
 

  // Find user by username
  const user = users.find(user => user.username === username);

  if (user) {
    // Compare passwords
    bcrypt.compare(password, user.password, (err, result) => {
        console.log(result);
      if (result) {
        // Set session variables
        console.log("result");
        req.session.isAuthenticated = true;
        req.session.username = username;
        res.redirect('/dashboard');
      } else {
        res.redirect('/login');
      }
    });
  } else {
    res.redirect('/login');
  }
});

// Dashboard route
app.get('/dashboard', isAuthenticated, (req, res) => {
  res.send(`Welcome, ${req.session.username}! This is your dashboard.`);
});

// Logout route
app.get('/logout', isAuthenticated, (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

// Login form route
app.get('/login', (req, res) => {
  res.send(`
    <form method="post" action="/login">
      <input type="text" name="username" placeholder="Username" required /><br>
      <input type="password" name="password" placeholder="Password" required /><br>
      <button type="submit">Login</button>
    </form>
  `);
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});