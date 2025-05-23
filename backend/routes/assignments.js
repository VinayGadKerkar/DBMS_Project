const express = require('express');
const assignrouter = express.Router();
const {
  getAssignments,
  getAssignmentById,
  createAssignment,
  updateAssignment,
  deleteAssignment,
  getAssignmentsByVolunteer,
} = require('../controllers/assignmentsController');

assignrouter.get('/', getAssignments);
assignrouter.get('/:id', getAssignmentById);
assignrouter.post('/', createAssignment);
assignrouter.get('/byVol/:vol',getAssignmentsByVolunteer);
assignrouter.put('/:id', updateAssignment);
assignrouter.delete('/:id', deleteAssignment);

module.exports = assignrouter;
