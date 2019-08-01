const db = require("../database/dbConfig");

module.exports = {
  add,
  find,
  findBy,
  findById
};

function find(role) {
  return db("users")
    .select("id", "username", "department")
    .where("department", role)
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
