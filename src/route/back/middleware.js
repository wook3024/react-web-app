const db = require("../../models");
const fs = require("fs");
const path = require("path");

const removeLocalImage = (target, value) => {
  (() => {
    if (target === "postId") {
      return db.Image.findAll({
        where: { postId: value },
      });
    } else if (target === "userId") {
      return db.Image.findAll({
        where: { postId: value },
      });
    } else {
      console.error("😡 ", "target not found");
    }
  })()
    .then((res) => {
      res.forEach((image) => {
        console.log("find image 🐳🐳", image.dataValues.filename);
        fs.unlink(
          path.join(
            __dirname,
            `../../../public/images/${image.dataValues.filename}`
          ),
          (error) => {
            if (error) {
              console.error("😡 ", error);
              return;
            }
            console.log("File deleted! 🐳", image.dataValues.filename);
          }
        );
      });
    })
    .catch((error) => {
      console.error("😡 ", error);
    });
};

const findAllPostElement = () => {
  return {
    include: [
      {
        model: db.Comment,
        include: [
          {
            model: db.Like,
          },
          {
            model: db.Dislike,
          },
          {
            model: db.User,
            include: [
              {
                model: db.Image,
              },
            ],
          },
        ],
      },
      {
        model: db.Image,
      },
      {
        model: db.User,
        include: [
          {
            model: db.Image,
          },
        ],
        attributes: ["username", "id", "age"],
      },
    ],
  };
};

const findAllCommentElement = () => {
  return {
    include: [
      {
        model: db.Like,
      },
      {
        model: db.Dislike,
      },
      {
        model: db.User,
        include: [
          {
            model: db.Image,
          },
        ],
      },
    ],
  };
};

const setPersonalMessage = (user, data) => {
  return db.Following.findAll({
    where: { targetUserId: user.id },
  }).then((followers) => {
    console.log("followers 😱😡", followers);
    followers.forEach((follower) => {
      db.Notification.create({
        userId: follower.dataValues.userId,
        postId: data.postId,
        username: user.nickname,
        state: "addReply",
        message: data.comment,
      })
        .then((res) => {
          console.log("create notification", res);
        })
        .catch((error) => {
          console.error("😡 ", error);
        });
    });
  });
};

const getUserInfo = (user) => {
  return db.User.findOne({
    where: { username: user.username },
    attributes: [
      "username",
      "nickname",
      "id",
      "description",
      "age",
      "created_at",
    ],
    include: [
      {
        model: db.Image,
      },
    ],
  });
};

module.exports = {
  removeLocalImage,
  findAllPostElement,
  findAllCommentElement,
  setPersonalMessage,
  getUserInfo,
};
