const express = require('express');
const bodyParser = require('body-parser');
const { OAuth2Client } = require('google-auth-library');
const session = require('express-session');

const app = express();
const port = 3000;
const CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID';
const client = new OAuth2Client(CLIENT_ID);

app.use(bodyParser.json());
app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set to true if using HTTPS
}));

app.post('/api/google-signin', async (req, res) => {
  const { token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const userid = payload['sub'];

    // Store user information in session
    req.session.user = {
      id: userid,
      email: payload['email'],
      name: payload['name'],
    };

    res.status(200).json({ message: 'User authenticated', user: req.session.user });
  } catch (error) {
    res.status(401).json({ message: 'Invalid token', error: error.message });
  }
});

app.get('/api/user', (req, res) => {
  if (req.session.user) {
    res.status(200).json({ user: req.session.user });
  } else {
    res.status(401).json({ message: 'User not authenticated' });
  }
});

app.post('/api/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: 'Logout failed', error: err.message });
    }
    res.status(200).json({ message: 'User logged out' });
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});