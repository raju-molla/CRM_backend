const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const { changePasswordAfter } = require("../utils/repeatFun");

// SIGN UP

exports.signUp = async (req, res) => {
  try {
    const { name, email_primary, mobile, password, confirm_password } =
      req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email_primary,
      mobile,
      password: hashedPassword,
      confirm_password,
      passwordChangeAt: new Date(),
    });

    // console.log(user);
    await user.save();
    return res.status(201).json({
      status: "success",
      data: user,
      message: "user sign-up successfully!",
    });
  } catch (err) {
    return res.status(404).json({
      status: "fail",
      data: err,
      message: err.message,
    });
  }
};

// LOG IN

exports.login = async (req, res) => {
  try {
    const { email_primary, password } = req.body;

    if (!email_primary || !password) {
      return res.status(404).json({
        status: "fail",
        data: "",
        message: "please provide your email and password",
      });
    }
    const user = await User.findOne({ email_primary });
    if (user) {
      const isValid = await bcrypt.compare(password, user.password);
      if (isValid) {
        const data = {
          data: user,
        };
        const token = jwt.sign(data, process.env.SECREK_KEY, {
          expiresIn: "30d",
        });
        res.cookie("jwt", token, {
          expires: new Date(Date.now() + 2592000000),
          httpOnly: true,
          secure: true,
          sameSite: "none",
        });

        // Send a response with the user object
        res.status(200).json({
          statu: "success",
          data: token,
          message: "user log in successfully",
        });
      } else {
        return res.status(404).json({
          status: "fail",
          data: "",
          message: "password is not match!",
        });
      }
      // console.log(res.cookies.token);
    } else {
      return res.status(404).json({
        status: "fail",
        data: "",
        message: "user is not found!",
      });
    }
  } catch (err) {
    return res.status(404).json({
      status: "fail",
      data: err,
      message: err.message,
    });
  }
};

// PROTECT

exports.protect = async (req, res, next) => {
  try {
    let cookies = req.cookies.jwt;
    // console.log(cookies);
    if (!cookies) {
      return res.status(404).json({
        message: "please login first",
      });
    }
    const decoded = jwt.verify(cookies, process.env.SECREK_KEY);
    // console.log(decoded);
    const freshUser = await User.findById(decoded.data._id);
    console.log(freshUser);
    if (!freshUser) {
      return res.status(404).json({
        message: "The user belongingto this token doest no longer exit",
      });
    }
    if (changePasswordAfter(freshUser.passwordChangeAt, decoded.iat)) {
      return res.status(404).json({
        message: "password changed!",
      });
    }

    req.user = freshUser;
    next();
  } catch (err) {
    return res.status(404).json({
      status: "fail",
      data: err,
      message: err.message,
    });
  }
};

// GET ALL USER
exports.getAllUser = async (req, res) => {
  const users = await User.find();
  return res.send(users);
};

// CURRENT LOG IN USER

exports.currentLoginUser = async (req, res) => {
  try {
    const cookies = req.cookies.jwt;
    if (!cookies) {
      return res.status(404).json({
        message: "please login first",
      });
    }
    const decoded = jwt.verify(cookies, process.env.SECREK_KEY);
    // console.log(decoded);
    const freshUser = await User.findById(decoded.data._id);
    return res.status(200).json({
      status: "success",
      data: freshUser,
      message: "Here you go!",
    });
  } catch (err) {
    return res.status(404).json({
      status: "fail",
      data: err,
      message: err.message,
    });
  }
};

// LOG-OUT

exports.logOut = async (req, res) => {
  try {
    res.clearCookie("jwt");
    await req.user.save();
    res.status(200).json({
      status: "success",
      data: "",
      message: "logout successfully!",
    });
  } catch (err) {
    return res.status(404).json({
      status: "fail",
      data: err,
      message: err.message,
    });
  }
};

// USER UPDATE
