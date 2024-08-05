const Team = require("../models_schema/team_model");
const { team_avatar } = require("../utils/avatar");

const create_team = async (req, res, next) => {
  try {
    const randomIndex = Math.floor(Math.random() * 10);

    const team_avatar_url = team_avatar[randomIndex];
    const team = await Team.create({ ...req.body, team_avatar_url });

    res.status(201).json({ success: true, team });
  } catch (err) {
    next(err);
  }
};

// const get_teams = async (req, res, next) => {
//   try {
//     const teams = await Team.findAll();
//     res.status(200).json({ teams });
//   } catch (err) {
//     next(err);
//   }
// };
// const get_team = async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     const team = await Team.findOne({ where: { id } });
//     res.status(200).json({ team });
//   } catch (err) {
//     next(err);
//   }
// };
// const update_team = async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     const { name, description } = req.body;
//     const team = await Team.findOne({ where: { id } });
//     team.name = name;
//     team.description = description;
//     await team.save();
//     res.status(200).json({ team });
//   } catch (err) {
//     next(err);
//   }
// };
// const delete_team = async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     const team = await Team.findOne({ where: { id } });
//     await team.destroy();
//     res.status(200).json({ team });
//   } catch (err) {
//     next(err);
//   }
// };

module.exports = { create_team };
