const express = require("express");
const helmet = require("helmet");
const cors = require("cors");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const restricted = require("./restricted-mw");
const roleCheck = require("./role-mw");

const server = express();

server.use(helmet());
server.use(express.json());
server.use(cors());

const db = require("./model");

// Endpoints
server.get("/api", (req, res) => {
  res.send("🙃");
});

server.get("/api/users", restricted, roleCheck, (req, res) => {
  db.find(req.decodedToken.roles[0])
    .then(users => {
      res.json(users);
    })
    .catch(err => res.send(err));
});

server.post("/api/register", (req, res) => {
  const user = req.body;
  user.department = user.department ? user.department : "sales";
  const hash = bcrypt.hashSync(user.password, 10);
  user.password = hash;

  db.add(user)
    .then(user => {
      res.status(201).json(user);
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

server.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  db.findBy({ username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        const token = generateToken(user);

        res.status(200).json({
          message: `Greetings, ${user.username}`,
          token
        });
      } else {
        res.status(401).json({
          message: "Invalid credentials."
        });
      }
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

function generateToken(user) {
  const payload = {
    sub: user.id,
    roles: [user.department]
  };

  return jwt.sign(payload, process.env.SECRET_KEY);
}

module.exports = server;
