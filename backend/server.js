// const express = require('express');
// const path = require('path');
// const cors = require('cors');
// const app = express();

// const bodyParser = require('body-parser');
// const session = require('express-session');
// const joinRoomRoutes = require('./routes/roomRoutes');
// const authMiddleware = require('./middleware/authMiddleware');
// const db = require('./configs/db_config');
// const {createUser} = require('./models/userModel');
// const port = 3000;

// const userRoutes = require('./routes/userRoutes');
// app.use('/api', userRoutes);

// const roomRoutes = require('./routes/roomRoutes');
// app.use('/api', roomRoutes);

// app.use('/api/rooms', authMiddleware, joinRoomRoutes);
// app.use(express.static(path.join(__dirname, '.. ')));
// app.use(cors({origin : 'http://localhost:3000' }));
// app.use(express.json());

// // Middleware for session
// app.use(session({
//     secret: process.env.SESSION_SECRET || 'secret_key',
//     resave: false,
//     saveUninitialized: false,
//     cookie: { secure: process.env.NODE_ENV === 'production' }
// }));

// app.get('/login', (req, res) => {
//     res.send({
//         username : req.body.username,
//         password : req.body.password
//     })
// })

// app.post('/login', (req, res) => {

//     const {username, email, password} = req.body;

//     console.log('req.body:', req.body)
//     if(!password) {
//         return res.status(400).send({message: "Password is required!"});
//     }
//     if(!username && !email) {
//         return res.status(400).send({
//             message:"A username/email is required."
//         });
//     }
//     db.getUserByUsernameOrEmail(req, res);

// });

// app.get('/users', db.getUsers)
// app.get('/users/:id', db.getUserById)
// app.post('/users', db.createUser)
// app.put('/users/:id', db.updateUser)
// app.delete('/users/:id', db.deleteUser)

// app.use('/api/rooms', roomRoutes);

// app.listen(port, () => console.log(`app listening on port ${port}`));

const express = require("express");
const cors = require("cors");
const path = require("path");

const bodyParser = require("body-parser");
const session = require("express-session");
const joinRoomRoutes = require("./routes/roomRoutes");
const authMiddleware = require("./middleware/authMiddleware");
const db = require("./configs/db_config");
const { createUser } = require("./models/userModel");

const app = express();
const port = 3000;
app.use(express.json());

const userRoutes = require("./routes/userRoutes");
app.use("/api", userRoutes);

const roomRoutes = require("./routes/roomRoutes");
const config = require("../config");
app.use("/api", roomRoutes);

app.use("/api/rooms", authMiddleware, joinRoomRoutes);
app.use(express.static(path.join(__dirname, "../frontend")));
app.use(cors({ origin: config.API_URL }));

app.get("/", (req, res) => {
  res.redirect("/landingpage");
});

// Middleware for session
app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret_key",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === "production" },
  })
);

app.get("/login", (req, res) => {
  res.send({
    username: req.body.username,
    password: req.body.password,
  });
});

app.post("/login", (req, res) => {
  const { username, email, password } = req.body;

  console.log("req.body:", req.body);
  if (!password) {
    return res.status(400).send({ message: "Password is required!" });
  }
  if (!username && !email) {
    return res.status(400).send({
      message: "A username/email is required.",
    });
  }
  db.getUserByUsernameOrEmail(req, res);
});

app.get("/users", db.getUsers);
app.get("/users/:id", db.getUserById);
app.post("/users", db.createUser);
app.put("/users/:id", db.updateUser);
app.delete("/users/:id", db.deleteUser);

app.use("/api/rooms", roomRoutes);

app.listen(port, (error) => {
  if (error) {
    console.log("Couldn't start application");
  } else {
    console.log(`app listening on port ${port}`);
  }
});
