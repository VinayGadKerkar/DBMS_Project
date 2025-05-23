const express = require('express');
const Orgrouter = express.Router();
const {
  getOrganizations,
  getOrganizationById,
  createOrganization,
  updateOrganization,
  deleteOrganization,
} = require('../controllers/organizationsController');

Orgrouter.get('/', getOrganizations);
Orgrouter.get('/:id', getOrganizationById);
Orgrouter.post('/', createOrganization);
Orgrouter.put('/:id', updateOrganization);
Orgrouter.delete('/:id', deleteOrganization);

module.exports = Orgrouter;
