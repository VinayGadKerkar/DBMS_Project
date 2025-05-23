const prisma = require('../db/index');

// GET all events
exports.getEvents = async (req, res) => {
  try {
    const events = await prisma.event.findMany({
      include: {
        organization: true,
          tasks: {
          include:{
            assignments: {
              include:{
                volunteer:true
              }
            }
          }
        },
      },
    });
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch events' });
  }
};

// GET single event by ID
exports.getEventById = async (req, res) => {
  const { id } = req.params;
  try {
    const event = await prisma.event.findUnique({
      where: { id: Number(id) },
      include: {
        organization: true,
        tasks: {
          include:{
            assignments: {
              include:{
                volunteer:true
              }
            }
          }
        },
      },
    });
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json(event);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch event' });
  }
};

// POST create new event
exports.createEvent = async (req, res) => {
  const { name, dates, orgId } = req.body;
  try {
    const newEvent = await prisma.event.create({
      data: { name, dates, orgId },
    });
    res.status(201).json(newEvent);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create event' });
  }
};

// PUT update event
exports.updateEvent = async (req, res) => {
  const { id } = req.params;
  const { name, dates, orgId } = req.body;
  try {
    const updated = await prisma.event.update({
      where: { id: Number(id) },
      data: { name, dates, orgId },
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update event' });
  }
};

// DELETE event
exports.deleteEvent = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.event.delete({
      where: { id: Number(id) },
    });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete event' });
  }
};
