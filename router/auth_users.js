const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

//  Add at least one test user!
let users = [
  { username: "demo1", password: "demo123" }
];

const isValid = (username) => {
  const userMatches = users.filter((user) => user.username === username);
  return userMatches.length > 0;
}

const authenticatedUser = (username, password) => {
  const matchingUsers = users.filter((user) => user.username === username && user.password === password);
  return matchingUsers.length > 0;
}

// Task 7: Only registered users can login
regd_users.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }
  
    if (authenticatedUser(username, password)) {
      const accessToken = jwt.sign({ username }, "access", { expiresIn: "1h" });
      req.session.authorization = { accessToken, username };
      return res.status(200).json({ message: "User successfully logged in", token: accessToken });
    } else {
      return res.status(401).json({ message: "Invalid username or password" });
    }
  });
  

//  Task 8: Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.body.review;
  const username = req.session.authorization.username;
  if (books[isbn]) {
    let book = books[isbn];
    book.reviews[username] = review;
    return res.status(200).send("Review successfully posted");
  } else {
    return res.status(404).json({ message: `ISBN ${isbn} not found` });
  }
});

// Task 9: Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization?.username;
  
    if (!username) {
      return res.status(403).json({ message: "User not logged in" });
    }
  
    const book = books[isbn];
    if (!book) {
      return res.status(404).json({ message: `Book with ISBN ${isbn} not found` });
    }
  
    if (!book.reviews[username]) {
      return res.status(404).json({ message: "You have not reviewed this book" });
    }
  
    delete book.reviews[username];
    return res.status(200).json({ message: "Review successfully deleted" });
  });
  

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
