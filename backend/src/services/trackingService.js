const trackingRepository = require('../repositories/trackingRepository');

class TrackingService {
  async getAllTracking() {
    return await trackingRepository.findAll();
  }

  async createTracking(entryData) {
    return await trackingRepository.create(entryData);
  }

  async deleteTracking(id) {
    return await trackingRepository.delete(id);
  }
}

module.exports = new TrackingService();
