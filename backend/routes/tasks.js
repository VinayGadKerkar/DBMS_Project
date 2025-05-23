const express = require('express');
const taskrouter = express.Router();
const {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
} = require('../controllers/tasksController');

taskrouter.get('/', getTasks);
taskrouter.get('/:id', getTaskById);
taskrouter.post('/', createTask);
taskrouter.put('/:id', updateTask);
taskrouter.delete('/:id', deleteTask);
taskrouter.patch('/:id', updateTaskStatus) 


module.exports = taskrouter;
