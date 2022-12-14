const models = require('../models');

const { Account } = models;

// Function to send users to the login page
const loginPage = (req, res) => {
  res.render('login', { csrfToken: req.csrfToken() });
};

// Function to send users to the login page
const notFoundPage = (req, res) => {
  res.status(404).render('notFound', { csrfToken: req.csrfToken() });
};

// Function to logout users and send them to the login page
const logout = (req, res) => {
  req.session.destroy();
  return res.redirect('/');
};

// Function to let users login - validation
const login = (req, res) => {
  const username = `${req.body.username}`;
  const pass = `${req.body.pass}`;

  if (!username || !pass) {
    return res.status(400).json({ error: 'All fields are required!' });
  }

  return Account.authenticate(username, pass, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'Wrong username or password!' });
    }

    req.session.account = Account.toAPI(account);

    return res.json({ redirect: '/upload' });
  });
};

// Function to let users create an account
const signup = async (req, res) => {
  const username = `${req.body.username}`;
  const pass = `${req.body.pass}`;
  const pass2 = `${req.body.pass2}`;

  if (!username || !pass || !pass2) {
    return res.status(400).json({ error: 'All fields are required!' });
  }

  if (pass !== pass2) {
    return res.status(400).json({ error: 'Passwords do not match!' });
  }

  try {
    const hash = await Account.generateHash(pass);
    const newAccount = new Account({ username, password: hash });
    await newAccount.save();
    req.session.account = Account.toAPI(newAccount);
    return res.json({ redirect: '/upload' });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Username already in use.' });
    }
    return res.status(400).json({ error: 'An error occured' });
  }
};

// Function to let users update their password
const changePassword = async (req, res) => {
  // Store the Vars
  const { username } = req.session.account;
  const pass = `${req.body.pass}`;
  const pass2 = `${req.body.pass2}`;

  // Chech that all data is present
  if (!username || !pass || !pass2) {
    return res.status(400).json({ error: 'Password must be typed twice!' });
  }

  // Check that the 2 passwords match
  if (pass !== pass2) {
    return res.status(400).json({ error: 'Passwords do not match!' });
  }

  // TTry to make a hash with the new password and update the Account with it
  try {
    const hash = await Account.generateHash(pass);
    await Account.updateOne({ username }, { password: hash });
    return res.json({ message: 'Password successfully changed', changed: true, redirect: '/upload' });
  } catch (err) {
    console.log(err);
    return res.json({ error: 'Password not changed' });
  }
};

// Function to check users password before allowing them to change it
const checkPassword = (req, res) => {
  // Store the vars
  const { username } = req.session.account;
  const pass = `${req.body.pass}`;

  // Check that something was typed
  if (!pass) {
    return res.status(400).json({ error: 'Password is required!' });
  }

  // Check that the password typed matchs the one stored for this user
  return Account.authenticate(username, pass, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'Password did not match try again!', canChange: false });
    }

    req.session.account = Account.toAPI(account);
    return res.json({ message: 'Password matched!', canChange: true });
  });
};

// Function to all of a users boards back
const getBoards = (req, res) => {
  Account.getBoards((err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error has occured!' });
    }
    return res.json({ userBoards: docs });
  });
};

// Function to allow users to create a new board
const addBoard = (req, res) => {
  const { _id } = req.session.account;
  const { newBoard } = req.body;

  Account.addBoard(_id, newBoard, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error has occured!' });
    }
    return res.json({ userBoards: docs });
  });
};

// Function to return the users csrf
const getToken = (req, res) => res.json({ csrfToken: req.csrfToken() });

module.exports = {
  notFoundPage,
  loginPage,
  login,
  logout,
  signup,
  changePassword,
  checkPassword,
  getBoards,
  addBoard,
  getToken,
};

// Function to allow users to delete a new board
// const deleteBoard = (req, res) => {
//   const _id = req.session.account._id;
//   const newBoard = req.body.newBoard;

//   Account.deleteBoard(_id, newBoard, (err, docs) => {
//     if (err) {
//       console.log(err);
//       return res.status(400).json({ error: 'An error has occured!' });
//     }
//     return res.json({ userBoards: docs });
//   });
// };
