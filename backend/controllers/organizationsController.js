const prisma = require('../db/index');

// GET all organizations
exports.getOrganizations = async (req, res) => {
  try {
    const organizations = await prisma.organization.findMany();
    res.json(organizations);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch organizations' });
  }
};

// GET single organization by ID
exports.getOrganizationById = async (req, res) => {
  const { id } = req.params;
  try {
    const organization = await prisma.organization.findUnique({
      where: { id: Number(id) },
    });
    if (!organization) {
      return res.status(404).json({ error: 'Organization not found' });
    }
    res.json(organization);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch organization' });
  }
};

// POST new organization
exports.createOrganization = async (req, res) => {
  const { name, mission, contactInfo } = req.body;
  try {
    const organization = await prisma.organization.create({
      data: { name, mission, contactInfo },
    });
    res.status(201).json(organization);
  } catch (err) {
    res.status(500).json({ error: err });
    console.log(err);
  }
};

// PUT update organization
exports.updateOrganization = async (req, res) => {
  const { id } = req.params;
  const { name, mission, contactInfo } = req.body;
  try {
    const updated = await prisma.organization.update({
      where: { id: Number(id) },
      data: { name, mission, contactInfo },
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update organization' });
  }
};

// DELETE organization
exports.deleteOrganization = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.organization.delete({
      where: { id: Number(id) },
    });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete organization' });
  }
};
