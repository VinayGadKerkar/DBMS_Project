const express = require('express');
const attendrouter = express.Router();
const {
  getAllAttendance,
  getAttendanceById,
  createAttendance,
  updateAttendance,
  deleteAttendance,
} = require('../controllers/attendanceController');

attendrouter.get('/', getAllAttendance);
attendrouter.get('/:id', getAttendanceById);
attendrouter.post('/', createAttendance);
attendrouter.put('/:id', updateAttendance);
attendrouter.delete('/:id', deleteAttendance);

module.exports = attendrouter;
