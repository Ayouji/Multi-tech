const trackingService = require('../services/trackingService');

class TrackingController {
  async getAll(req, res) {
    try {
      const entries = await trackingService.getAllTracking();
      res.json(entries);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async create(req, res) {
    try {
      const entry = await trackingService.createTracking(req.body);
      res.json(entry);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async delete(req, res) {
    try {
      await trackingService.deleteTracking(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new TrackingController();
