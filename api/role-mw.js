module.exports = (req, res, next) => {
  if (req.decodedToken.roles) {
    next();
  } else {
    res.status(403).json({ message : "You have no rolles assigned. Speak to your manager!" });
  }
};
