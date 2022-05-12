const UserModel = require("../Models/User.Model");
module.exports = async (req, res, next) => {
  try {
    const loggedInUser = req.currentUser;
    if (loggedInUser.role !== "ARTIST") {
      return res.status(401).json({ msg: "This user is not an artist." });
    }
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};