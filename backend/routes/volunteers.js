const express = require('express');
const volrouter = express.Router();
const {
  getVolunteers,
  getVolunteerById,
  createVolunteer,
  updateVolunteer,
  deleteVolunteer,
} = require('../controllers/volunteersController');

volrouter.get('/', getVolunteers);
volrouter.get('/:id', getVolunteerById);
volrouter.post('/', createVolunteer);
volrouter.put('/:id', updateVolunteer);
volrouter.delete('/:id', deleteVolunteer);

module.exports = volrouter;
