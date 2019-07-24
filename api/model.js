const db = require("../database/dbConfig");

module.exports = {
  add,
  find,
  findBy,
  findById
};

function find() {
  return db("users").select("*");
}

async function add(user) {
  const [id] = await db('users').insert(user);

  return findById(id);
}

function findBy(param) {
  return db("users").where(param);
}

function findById(id) {
  return db("users")
    .where({ id })
    .first();
}
