const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors");

const register = async (req, res) => {
  const user = await User.create({ ...req.body });
  const token = user.createJWT();
  res.status(StatusCodes.CREATED).json({ user, token });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError("Please provide email and password");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new UnauthenticatedError("User not authenticated");
  }

  const isMatchingPassword = await user.comparePassword(password);

  if (!isMatchingPassword) {
    throw new UnauthenticatedError("User not authenticated");
  }

  const token = user.createJWT();
  res.status(StatusCodes.OK).json({ user, token });
};

module.exports = { register, login };
