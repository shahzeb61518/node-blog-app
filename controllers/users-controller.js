const Users = require("../models/users-model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { GoogleAuth } = require("google-auth-library");

// Create User Account
exports.create = (req, res, next) => {
  let date = new Date();
  date.toString;
  // bcrypt.hash(req.body.userPassword, 10).then(hash => {
  // console.log("dataaaa", req.body)
  let email = req.body.userEmail;
  email = email.toLowerCase();
  const users = new Users({
    userEmail: email,
    userName: req.body.userName,
    userPassword: req.body.userPassword,
    userRole: req.body.userRole,
    joinDate: date,
  });
  users
    .save()
    .then((result) => {
      res.status(201).json({
        message: "User created successfully!",
        result: result,
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: "Invalid authentication credentials!",
      });
      console.log("error", err);
    });
  // });
};

// User login
exports.login = (req, res, next) => {
  let fetchedUser;
  let email = req.body.userEmail;
  email = email.toLowerCase();
  Users.findOne({ userEmail: req.body.userEmail })
    .then((user) => {
      if (!user) {
        return res.status(200).json({
          message: "Invalid email or password",
        });
      }
      fetchedUser = user;
      // return bcrypt.compare(req.body.userPassword, user.userPassword);
      return req.body.userPassword === user.userPassword;
    })
    .then((result) => {
      if (!result) {
        return res.status(200).json({
          message: "Invalid email or password",
        });
      }
      console.log("fetchedUser>>>>", fetchedUser);
      const token = jwt.sign(
        {
          userEmail: fetchedUser.userEmail,
          userId: fetchedUser._id,
          namef: fetchedUser.userName,
          role: fetchedUser.userRole,
        },
        "secret_this_should_be_longer",
        { expiresIn: "10h" }
      );
      res.status(200).json({
        token: token,
        role: fetchedUser.userRole,
        expiresIn: 360000,
        userId: fetchedUser._id,
        userName: fetchedUser.userName,
        userEmail: fetchedUser.userEmail,
      });
    })
    .catch((err) => {
      return res.status(401).json({
        message: "Invalid authentication credentials!",
      });
    });
};

// Get user
exports.get = (req, res, next) => {
  Users.find()
    .then((documents) => {
      // console.log(documents);
      res.status(200).json({
        message: "Data fetched!!!",
        list: documents,
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Getting data failed!",
      });
    });
};

// // Delete user
exports.delete = (req, res, next) => {
  Users.deleteOne({ _id: req.body.id })
    .then((result) => {
      if (result.n > 0) {
        res.status(200).json({ message: "Deletion successful!" });
      } else {
        res.status(401).json({ message: "Not deleted!" });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "Deletion failed!",
      });
    });
};

//   // Update User
exports.update = (req, res, next) => {
  // console.log(req.body)
  // bcrypt.hash(req.body.userPassword, 10).then(hash => {

  // let url = "http://localhost:4001";
  let url = "https://uvuew-node.herokuapp.com";

  if (req.files) {
    let file = url + "/upload/" + req.files.profileImage.name;
    req.files.profileImage.mv(
      "public/upload/" + req.files.profileImage.name,
      function (error) {
        if (error) {
          console.log("Couldn't upload file");
          console.log(error);
        } else {
          console.log("File succesfully uploaded.");
        }
      }
    );

    const users = new Users({
      _id: req.body.id,
      // userRole: req.body.userRole,
      userEmail: req.body.userEmail,
      userName: req.body.userName,
      profileImage: file,
      aboutMe: req.body.aboutMe,
      location: req.body.location,
      creditCard: req.body.creditCard,
      emailVerify: req.body.emailVerify,
      userPassword: req.body.userPassword,
      facebook: req.body.facebook,
      twitter: req.body.twitter,
      instagram: req.body.instagram,
    });
    Users.updateOne({ _id: req.body.id }, users)
      .then((result) => {
        if (result.nModified > 0) {
          res.status(200).json({ message: "Update successful!" });
        } else {
          res.status(401).json({ message: "Not authorized!" });
        }
      })
      .catch((err) => {
        console.log(err);
        return res.status(401).json({
          message: "No updated!",
        });
      });
  } else {
    const users = new Users({
      _id: req.body.id,
      // userRole: req.body.userRole,
      userEmail: req.body.userEmail,
      userName: req.body.userName,
      aboutMe: req.body.aboutMe,
      location: req.body.location,
      creditCard: req.body.creditCard,
      emailVerify: req.body.emailVerify,
      userPassword: req.body.userPassword,
      facebook: req.body.facebook,
      twitter: req.body.twitter,
      instagram: req.body.instagram,
    });
    Users.updateOne({ _id: req.body.id }, users)
      .then((result) => {
        if (result.nModified > 0) {
          res.status(200).json({ message: "Update successful!" });
        } else {
          res.status(401).json({ message: "Not authorized!" });
        }
      })
      .catch((err) => {
        console.log(err);
        return res.status(401).json({
          message: "No updated!",
        });
      });
  }

  // });
};

// Get User By Id
exports.getById = (req, res, next) => {
  Users.findById(req.body.id).then((user) => {
    if (!user)
      return res
        .status(404)
        .json({ status: false, message: "User record not found." });
    // console.log(user);
    else return res.status(200).json(user);
  });
};

// login with google
exports.loginWithGoogle = (req, res, next) => {
  console.log("read>");
  if (req.body.token && req.body.email && req.body.name) {
    Users.findOne({ userEmail: req.body.email }).then((user) => {
      if (!user) {
        let date = new Date();
        date.toString;
        let email = req.body.email;
        email = email.toLowerCase();
        const users = new Users({
          userEmail: email,
          userName: req.body.name,
          userPassword: "123",
          userRole: "user",
          joinDate: date,
        });
        users.save().then((result) => {
          const token = jwt.sign(
            {
              userEmail: result.userEmail,
              userId: result._id,
              namef: result.userName,
              role: result.userRole,
            },
            "secret_this_should_be_longer",
            { expiresIn: "10h" }
          );
          res.status(201).json({
            message: "User created successfully!",
            result: result,
            token: token,
          });
        });
      } else {
        fetchedUser = user;
        req.body.userPassword === user.userPassword;
        // console.log("fetchedUser>>>>", fetchedUser);
        const token = jwt.sign(
          {
            userEmail: fetchedUser.userEmail,
            userId: fetchedUser._id,
            namef: fetchedUser.userName,
            role: fetchedUser.userRole,
          },
          "secret_this_should_be_longer",
          { expiresIn: "10h" }
        );
        res.status(200).json({
          token: token,
          role: fetchedUser.userRole,
          expiresIn: 360000,
          userId: fetchedUser._id,
          userName: fetchedUser.userName,
          userEmail: fetchedUser.userEmail,
        });
      }
    });
  }
};
