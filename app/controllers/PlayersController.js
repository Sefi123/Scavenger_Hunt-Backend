const Players = require("../models/Players");
const Scavengers = require("../models/Scavenger");
const Quiz = require("../models/Quiz");
const bcrypt = require("bcryptjs");

exports.createPlayer = (req, res, next) => {
  // console.log(req.body);
  // Players.findOne({
  //   where: {
  //     email: req.body.email,
  //   },
  // })
  //   .then((checkPlayer) => {
  //     //   res.status(200).send({ success: true, data: result });
  //     if (checkPlayer == null) {
  //       const player = new Players({
  //         fullName: req.body.name,
  //         email: req.body.email,
  //         cards: [],
  //         total_cards: null,
  //       });
  //       return player.save();
  //     }
  //   })
  const player = new Players({
    fullName: req.body.name,
    email: req.body.email,
    cards: [],
    total_cards: null,
  });
  return player
    .save()
    .then((result) => res.status(200).send({ success: true, data: result }))
    .catch((err) => {
      console.log(err);
      res.status(404).send({ success: false, data: [] });
    });
};

exports.addPlayerCards = (req, res, next) => {
  console.log(req.body);
  let player;
  Players.findOne({
    where: {
      id: req.body.id,
    },
  })
    .then((checkPlayer) => {
      //   res.status(200).send({ success: true, data: result });
      if (checkPlayer !== null) {
        player = checkPlayer;
        const scavenger = Scavengers.findOne({
          where: {
            id: req.body.scavenger_id,
          },
        });
        return scavenger;
      }
    })
    .then((scavenger) => {
      const card_list = scavenger.category
        .map((eachCategory) => eachCategory.cards)
        ?.flat();

      const card = card_list.find(
        (eachCard) => eachCard?.id == req.body.card_id
      );
      player.cards.push(card);

      if (card) {
        Players.update(
          { cards: player.cards, total_cards: card_list.length }, // Set the new values
          { where: { id: req.body.id } } // Filter the user to update by id
        );
        res.status(200).send({
          success: true,
          data: card,
        });
      } else res.status(200).send({ success: false, data: {} });
    })
    .catch((err) => {
      console.log(err);
      res.status(404).send({ success: false, data: [] });
    });
};

// exports.addPlayerCards = (req, res, next) => {

//   let player;
//   Players.findOne({
//     where: {
//       id: req.body.id,
//     },
//   })
//     .then((checkPlayer) => {
//       //   res.status(200).send({ success: true, data: result });
//       if (checkPlayer !== null) {
//         player = checkPlayer;
//         const scavenger = Scavengers.findOne({
//           where: {
//             id: req.body.scavenger_id,
//           },
//         });
//         return scavenger;
//       }
//     })
//     .then((scavenger) => {
//       const card_list = scavenger.category
//         .map((eachCategory) => eachCategory.cards)
//         ;
// console.log(card_list)
//       const card =card_list.length!=0&& card_list.concat(...card_list).find(
//         (eachCard) => eachCard.id == req.body.card_id
//       );
//       player.cards.push(card);

//       if (card) {
//         Players.update(
//           { cards: player.cards, total_cards: card_list.concat(...card_list).length }, // Set the new values
//           { where: { id: req.body.id } } // Filter the user to update by id
//         );
//         res.status(200).send({
//           success: true,
//           data: card,
//         });
//       } else res.status(200).send({ success: false, data: {} });
//     })
//     .catch((err) => {
//       console.log(err);
//       res.status(404).send({ success: false, data: [] });
//     });
// };

exports.getPlayer = (req, res, next) => {
  Players.findOne({
    where: {
      id: req.body.id,
    },
  })
    .then((result) => {
      //   res.status(200).send({ success: true, data: result });
      if (result != null) res.status(200).send({ success: true, data: result });
      else res.status(200).send({ success: false, data: {} });
    })

    .catch((err) => {
      console.log(err);
      res.status(404).send({ success: false, data: [] });
    });
};

exports.onSubmitOption = (req, res, next) => {
  Players.findOne({
    where: {
      id: req.body.id,
    },
  })
    .then((player) => {
      let getCard = player.cards.find((card) => card.id == req.body.card_id);
      const index = player.cards.findIndex(
        (card) => card.id == req.body.card_id
      );
      getCard = { ...getCard, selected_option: req.body.selected };
      player.cards[index] = getCard;

      Players.update(
        { cards: [...player.cards] }, // Set the new values
        { where: { id: req.body.id } } // Filter the user to update by id
      );
      return getCard;
      //   res.status(200).send({ success: true, data: result });
    })
    .then((result) => {
      if (result != null)
        res.status(200).send({
          success: true,
          data: {
            ...result,
            option_status: result.selected_option == result.correct,
          },
        });
      else res.status(200).send({ success: false, data: {} });
    })

    .catch((err) => {
      console.log(err);
      res.status(404).send({ success: false, data: [] });
    });
};

exports.createQuiz = (req, res, next) => {
  const quiz = new Quiz({
    title: req.body.title,
    audio: req.body.audio,
    images: req.body.images,
    correct: req.body.correct,
    selected: 0,
  });
  return quiz
    .save()
    .then((result) =>
      res.status(200).send({
        success: true,
        message: "Quiz successfully created",
        data: result,
      })
    )
    .catch((err) => {
      console.log(err);
      res.status(404).send({ success: false, data: [] });
    });
};

exports.getQuiz = (req, res, next) => {
  Quiz.findOne({
    where: {
      id: req.body.id,
    },
  })
    .then((result) => {
      if (result != null) res.status(200).send({ success: true, data: result });
      else res.status(200).send({ success: false, data: {} });
    })

    .catch((err) => {
      console.log(err);
      res.status(404).send({ success: false, data: [] });
    });
};
