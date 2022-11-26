//in dit file worden de credentials van de admin gecontroleerd

module.exports = (req, res, next) => {
  //check als de admin credentials gelden voor huidige user gebonden aan session
  if (!req.session.userid === adminId) {    //nog zoeken hoe adminid best op te slaan (misschien als aparte collection in database en dan alles gehased opslaan?)
    const err = new Error("You are not the admin.");
    err.status = 101;
    return next(err);
  }
  next();
};