const clientService = require('../services/clientService');

class ClientController {
  async getAll(req, res) {
    try {
      const clients = await clientService.getAllClients();
      res.json(clients);
    } catch (error) {
      console.error('[clients] getAll error:', error);
      res.status(400).json({ error: error.message });
    }
  }

  async create(req, res) {
    try {
      const client = await clientService.createClient(req.body);
      res.json(client);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async delete(req, res) {
    try {
      await clientService.deleteClient(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new ClientController();
