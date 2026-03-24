require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const path = require('path');
const { PrismaSessionStore } = require('@quixo3/prisma-session-store');
//const { PrismaClient } = require('@prisma/client');
const { prisma } = require('./lib/prisma');


const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Create PrismaClient once, with explicit datasourceUrl
//const prisma = new PrismaClient({
//  datasourceUrl: process.env.DATABASE_URL,
//});

// Session configuration using the same prisma instance
app.use(session({
  cookie: {
    maxAge: 7 * 24 * 60 * 60 * 1000 // 1 week
  },
  secret: process.env.SESSION_SECRET || 'spacebar',
  resave: true,
  saveUninitialized: false,
  store: new PrismaSessionStore(prisma, {   // ← use the existing prisma instance
    checkPeriod: 2 * 60 * 60 * 1000,        // 2 minutes (in milliseconds)
    dbRecordIdIsSessionId: true,
    dbRecordIdFunction: undefined,
  })
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.get('/', (req, res) => {
  res.send('Hello, welcome to Simple Google Drive!');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});