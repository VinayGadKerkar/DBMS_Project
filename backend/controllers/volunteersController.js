const prisma = require('../db/index');

// GET all volunteers
exports.getVolunteers = async (req, res) => {
  try {
    const volunteers = await prisma.volunteer.findMany({
      include: {
        organization: true,
        skills: { include: { skill: true } },
        assignments: true,
      },
    });
    res.json(volunteers);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch volunteers' });
  }
};

// GET single volunteer by ID
exports.getVolunteerById = async (req, res) => {
  const { id } = req.params;
  try {
    const volunteer = await prisma.volunteer.findUnique({
      where: { id: Number(id) },
      include: {
        organization: true,
        skills: { include: { skill: true } },
        assignments: true,
      },
    });
    if (!volunteer) {
      return res.status(404).json({ error: 'Volunteer not found' });
    }
    res.json(volunteer);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch volunteer' });
  }
};

// POST new volunteer
exports.createVolunteer = async (req, res) => {
  try {
    const { firstName, lastName, email, status, orgId, skillIds } = req.body;

    const newVolunteer = await prisma.volunteer.create({
      data: {
        firstName,
        lastName,
        email,
        status,
        orgId,
        skills: {
          create: skillIds.map((skillId) => ({
            skill: { connect: { id: skillId } },
            proficiencyLevel: 1, // default proficiency
          })),
        },
      },
      include: {
        skills: {
          include: {
            skill: true,
          },
        },
        organization: true,
      },
    });

    res.status(201).json(newVolunteer);
  } catch (error) {
    console.error('Error creating volunteer:', error);
    res.status(500).json({ error: 'Failed to create volunteer' });
  }

};

// PUT update volunteer
exports.updateVolunteer = async (req, res) => {
  try {
    const volunteerId = parseInt(req.params.id);
    const { firstName, lastName, email, status, orgId, skillIds } = req.body;

    // Remove old skills
    await prisma.volunteerSkill.deleteMany({
      where: { volId: volunteerId },
    });

    const updatedVolunteer = await prisma.volunteer.update({
      where: { id: volunteerId },
      data: {
        firstName,
        lastName,
        email,
        status,
        orgId,
        skills: {
          create: skillIds.map((skillId) => ({
            skill: { connect: { id: skillId } },
            proficiencyLevel: 1, // or dynamic value if you collect it from the UI
          })),
        },
      },
      include: {
        skills: {
          include: {
            skill: true,
          },
        },
        organization: true,
      },
    });

    res.status(200).json(updatedVolunteer);
  } catch (error) {
    console.error('Error updating volunteer:', error);
    res.status(500).json({ error: 'Failed to update volunteer' });
  }
};

// DELETE volunteer
exports.deleteVolunteer = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.volunteer.delete({
      where: { id: Number(id) },
    });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete volunteer' });
  }
};
