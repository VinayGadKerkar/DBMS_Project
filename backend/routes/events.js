const express = require('express');
const eventrouter = express.Router();
const {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
} = require('../controllers/eventsController');

eventrouter.get('/', getEvents);
eventrouter.get('/:id', getEventById);
eventrouter.post('/', createEvent);
eventrouter.put('/:id', updateEvent);
eventrouter.delete('/:id', deleteEvent);

module.exports = eventrouter;
