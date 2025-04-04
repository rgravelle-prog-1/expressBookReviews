const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');


// ------------------------
// Task 6: Register a user
// ------------------------
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (users.find(user => user.username === username)) {
    return res.status(409).json({ message: "Username already exists" });
  }

  users.push({ username, password });
  return res.status(201).json({ message: "User registered successfully" });
});


// ------------------------------
// Task 10: Get all books (Promise)
// ------------------------------
const getBooks = () => {
  return new Promise((resolve, reject) => {
    resolve(books);
  });
};

public_users.get("/", (req, res) => {
  getBooks()
    .then(bookList => res.status(200).json(bookList))
    .catch(error => res.status(500).json({ message: "Failed to fetch books", error }));
});


// --------------------------------------
// Task 11: Get book details by ISBN (Promise)
// --------------------------------------
const getByISBN = (isbn) => {
  return new Promise((resolve, reject) => {
    const isbnNum = parseInt(isbn);
    if (books[isbnNum]) {
      resolve(books[isbnNum]);
    } else {
      reject({ status: 404, message: `ISBN ${isbn} not found` });
    }
  });
};

public_users.get("/isbn/:isbn", async (req, res) => {
  try {
    const result = await getByISBN(req.params.isbn);
    res.status(200).json(result);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
});


// --------------------------------------
// Task 12: Get book details by Author (Promise)
// --------------------------------------
const getBooksByAuthor = (author) => {
  return new Promise((resolve, reject) => {
    const booksByAuthor = Object.values(books).filter(book => book.author === author);
    if (booksByAuthor.length > 0) {
      resolve(booksByAuthor);
    } else {
      reject({ status: 404, message: `No books found by author '${author}'` });
    }
  });
};

public_users.get("/author/:author", async (req, res) => {
  try {
    const result = await getBooksByAuthor(req.params.author);
    res.status(200).json(result);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
});


// --------------------------------------
// Task 13: Get book details by Title (Promise)
// --------------------------------------
const getBooksByTitle = (title) => {
  return new Promise((resolve, reject) => {
    const booksByTitle = Object.values(books).filter(book => book.title === title);
    if (booksByTitle.length > 0) {
      resolve(booksByTitle);
    } else {
      reject({ status: 404, message: `No books found with title '${title}'` });
    }
  });
};

public_users.get("/title/:title", async (req, res) => {
  try {
    const result = await getBooksByTitle(req.params.title);
    res.status(200).json(result);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
});


// ------------------------
// Task 5: Get book reviews
// ------------------------
public_users.get("/review/:isbn", async (req, res) => {
  try {
    const result = await getByISBN(req.params.isbn);
    res.status(200).json(result.reviews);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
});


// ✅ Export the router
module.exports.general = public_users;
