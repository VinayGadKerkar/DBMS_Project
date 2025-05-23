const express = require('express');
const skillsrouter = express.Router();
const {
  getSkills,
  getSkillById,
  createSkill,
  updateSkill,
  deleteSkill,
} = require('../controllers/skillsController');

skillsrouter.get('/', getSkills);
skillsrouter.get('/:id', getSkillById);
skillsrouter.post('/', createSkill);
skillsrouter.put('/:id', updateSkill);
skillsrouter.delete('/:id', deleteSkill);

module.exports = skillsrouter;
