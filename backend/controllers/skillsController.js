const prisma = require('../db/index');

// GET all skills
exports.getSkills = async (req, res) => {
  try {
    const skills = await prisma.skill.findMany({
      include: {
        volunteers: {
          include: {
            volunteer: true,
          },
        },
      },
    });
    res.json(skills);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch skills' });
  }
};

// GET single skill by ID
exports.getSkillById = async (req, res) => {
  const { id } = req.params;
  try {
    const skill = await prisma.skill.findUnique({
      where: { id: Number(id) },
      include: {
        volunteers: {
          include: {
            volunteer: true,
          },
        },
      },
    });
    if (!skill) {
      return res.status(404).json({ error: 'Skill not found' });
    }
    res.json(skill);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch skill' });
  }
};

// POST new skill
exports.createSkill = async (req, res) => {
  const { name, description } = req.body;
  try {
    const newSkill = await prisma.skill.create({
      data: { name, description },
    });
    res.status(201).json(newSkill);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create skill' });
  }
};

// PUT update skill
exports.updateSkill = async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  try {
    const updated = await prisma.skill.update({
      where: { id: Number(id) },
      data: { name, description },
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update skill' });
  }
};

// DELETE skill
exports.deleteSkill = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.skill.delete({
      where: { id: Number(id) },
    });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete skill' });
  }
};
