const Sauces = require("../models/sauce");
const fs = require("fs");

exports.getAllSauces = (req, res, next) => {
  Sauces.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(404).json({ error }));
};

exports.getSauce = (req, res, next) => {
  Sauces.findOne({ _id: req.params.id })
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(404).json({ error }));
};

exports.createSauce = (req, res, next) => {
  const SauceObject = JSON.parse(req.body.sauce);
  delete SauceObject._id;
  const sauce = new Sauces({
    ...SauceObject,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersdisLiked: [],
  });
  sauce
    .save()
    .then(() => res.status(201).json({ message: "Sauce enregistrée !" }))
    .catch((error) => res.status(400).json({ error }));
};

exports.modifySauce = (req, res, next) => {
  if (req.file !== undefined) {
    Sauces.findOne({ _id: req.params.id })
      .then((sauce) => {
        const filename = sauce.imageUrl.split("/images/")[1];
        fs.unlink(`images/${filename}`, () => {
          Sauces.updateOne(
            { _id: req.params.id },
            {
              ...req.body,
              imageUrl: `${req.protocol}://${req.get("host")}/images/${
                req.file.filename
              }`
            }
          )
            .then(() =>
              res
                .status(200)
                .json({ message: "Sauce mise à jour avec image !" })
            )
            .catch((error) => res.status(400).json({ error }));
        });
      })
      .catch((error) => res.status(500).json({ error }));
  } else {
    Sauces.updateOne(
      { _id: req.params.id },
      { ...req.body }
    )
      .then(() => res.status(200).json({ message: "Sauce mise à jour !" }))
      .catch((error) => res.status(400).json({ error }));
  }
};

exports.like = (req, res, next) => {
  const userId = req.body.userId;
  Sauces.findOne({ _id: req.params.id })
    .then((sauce) => {
      switch (req.body.like) {
        case 1:
          Sauces.updateOne(
            { _id: req.params.id },
            {
              $inc: { likes: +1 },
              $push: { usersLiked: userId }
            }
          )
            .then(() =>
              res.status(200).json({ message: "J'aime" })
            )
            .catch((error) => res.status(400).json({ error }));
          break;
        case -1:
          Sauces.updateOne(
            { _id: req.params.id },
            {
              $inc: { dislikes: +1 },
              $push: { usersDisliked: userId }
            }
          )
            .then(() =>
              res.status(200).json({ message: "Je n'aime pas" })
            )
            .catch((error) => res.status(400).json({ error }));
          break;
        case 0:
          if (sauce.usersLiked.includes(userId)) {
            Sauces.updateOne(
              { _id: req.params.id },
              {
                $inc: { likes: -1 },
                $pull: { usersLiked: userId }
              }
            )
              .then(() =>
                res.status(200).json({ message: "Suppression du like" })
              )
              .catch((error) => res.status(400).json({ error }));
          } else {
            Sauces.updateOne(
              { _id: req.params.id },
              {
                $inc: { dislikes: -1 },
                $pull: { usersdisLiked: userId }
              }
            )
              .then(() =>
                res.status(200).json({ message: "Suppression du dislike" })
              )
              .catch((error) => res.status(400).json({ error }));
          }
          break;
        default:
          console.error(error);
      }
    })
    .catch((error) => res.status(404).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
  Sauces.findOne({ _id: req.params.id })
    .then((sauce) => {
      const filename = sauce.imageUrl.split("/images/")[1];
      fs.unlink(`images/${filename}`, () => {
        Sauces.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: "Sauce supprimée !" }))
          .catch((error) => res.status(400).json({ error }));
      });
    })
    .catch((error) => res.status(500).json({ error }));
};
