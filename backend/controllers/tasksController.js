const prisma = require('../db/index');

// GET all tasks
exports.getTasks = async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({
      include: {
        event: true,
        assignments: {
          include:{
            volunteer:true
          }
        },
      },
    });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
};

// GET single task by ID
exports.getTaskById = async (req, res) => {
  const { id } = req.params;
  try {
    const task = await prisma.task.findUnique({
      where: { id: Number(id) },
      include: {
        event: true,
        assignments: true,
      },
    });
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch task' });
  }
};

// POST create new task
exports.createTask = async (req, res) => {
  const { name, description, numRequired, scheduleTime, eventId } = req.body;
  try {
    const newTask = await prisma.task.create({
      data: {
        name,
        description,
        numRequired,
        scheduleTime,
        eventId,
      },
    });
    res.status(201).json(newTask);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create task' });
  }
};

// PUT update task
exports.updateTask = async (req, res) => {
  const { id } = req.params;
  const { name, description, numRequired, scheduleTime, eventId } = req.body;
  try {
    const updated = await prisma.task.update({
      where: { id: Number(id) },
      data: {
        name,
        description,
        numRequired,
        scheduleTime,
        eventId,
      },
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update task' });
  }
};

//Patch task

exports.updateTaskStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!['active', 'suspended', 'completed'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status value' });
  }

  try {
    const updatedTask = await prisma.task.update({
      where: { id: Number(id) },
      data: { status },
    });
    res.json(updatedTask);
  } catch (error) {
    console.error('Failed to update task status:', error);
    res.status(500).json({ error: 'Failed to update task status' });
  }
};

// DELETE task
exports.deleteTask = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.task.delete({
      where: { id: Number(id) },
    });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete task' });
  }
};
