const Model = require("../models/blog-model");

// exports.uploadImage = (req, res, next) => {
//   if (!req.files || Object.keys(req.files).length === 0) {
//     return res.status(400).send("No files were uploaded.");
//   }
//   let image = req.files.blogImage;
//   sampleFile.mv("./upload/", function (err) {
//     if (err) return res.status(500).send(err);

//     res.send("File uploaded!");
//   });
// };

exports.create = async (req, res, next) => {
  console.log("files", req.files);
  console.log("body", req.body);

  // let url = "http://localhost:4001";
  let url = "https://uvuew-node.herokuapp.com";

  if (req.files) {
    let file = url + "/upload/" + req.files.blogImage.name;
    req.files.blogImage.mv(
      "public/upload/" + req.files.blogImage.name,
      function (error) {
        if (error) {
          console.log("Couldn't upload file");
          console.log(error);
        } else {
          console.log("File succesfully uploaded.");
        }
      }
    );

    let arr = JSON.parse(req.body.followerArray);

    const model = new Model({
      blogTitle: req.body.blogTitle,
      blogDescription: req.body.blogDescription,
      blogImage: file,
      userId: req.body.userId,
      userName: req.body.userName,
      followerArray: arr,
    });

    await model
      .save()
      .then((createdObject) => {
        console.log(createdObject);
        res.status(201).json({
          message: "Created successfully",
          model: createdObject,
        });
      })
      .catch((error) => {
        console.log(error);
        res.status(500).json({
          message: "Creation failed!",
        });
      });
  } else {
    const model = new Model({
      blogTitle: req.body.blogTitle,
      blogDescription: req.body.blogDescription,
      userId: req.body.userId,
      userName: req.body.userName,
    });

    await model
      .save()
      .then((createdObject) => {
        console.log(createdObject);
        res.status(201).json({
          message: "Created successfully",
          model: createdObject,
        });
      })
      .catch((error) => {
        console.log(error);
        res.status(500).json({
          message: "Creation failed!",
        });
      });
  }
};

// Get
exports.get = (req, res, next) => {
  Model.find()
    .then((documents) => {
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

exports.getBlogCreatorId = (req, res, next) => {
  Model.find({ userId: req.body.userId })
    .then((documents) => {
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

exports.getBlogUserId = (req, res, next) => {
  // { userId: req.body.userId }
  Model.find()
    .then((documents) => {
      let arr = [];
      if (documents.length > 0) {
        // arr = documents.filter((ele)=> ele.followerArray)
        // arr = documents.filter((item) => {
        //   return item.followerArray.includes(filter) >= 0;
        // });
        // console.log("postsof creator i followed>", arr);

        // arr = documents.filter(
        //   (ele) => !ele.followerArray.find(({ el }) => el === req.body.id)
        // );

        arr = documents.filter((ele) => {
          return ele.followerArray.find((i) => i === req.body.id);
        });

        // arr = documents.map((el) => {
        //   el.followerArray.filter((x) => {
        //     return x === req.body.id;
        //   });
        //   return el;
        // });

        console.log("postsof creator i followed>", arr);
      }

      res.status(200).json({
        message: "Data fetched!!!",
        list: arr,
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Getting data failed!",
      });
    });
};

// // Delete
exports.delete = (req, res, next) => {
  Model.deleteOne({ _id: req.body.id })
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

exports.update = (req, res, next) => {
  // console.log(req.body)
  const model = new Model({
    _id: req.body.id,
    blogTitle: req.body.blogTitle,
    blogDescription: req.body.blogDescription,
    blogImage: req.body.blogImage,
    userId: req.body.userId,
    userName: req.body.userName,
  });
  Model.updateOne({ _id: req.body.id }, model)
    .then((result) => {
      console.log(result);
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
};
