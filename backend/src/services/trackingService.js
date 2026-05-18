const trackingRepository = require('../repositories/trackingRepository');

class TrackingService {
  async getAllTracking() {
    return await trackingRepository.findAll();
  }

  async createTracking(entryData) {
    if (!entryData.task_id) {
      throw new Error('task_id est requis');
    }
    const payload = {
      ...entryData,
      date: entryData.date || new Date().toISOString(),
    };
    return await trackingRepository.create(payload);
  }

  async deleteTracking(id) {
    return await trackingRepository.delete(id);
  }
}

module.exports = new TrackingService();
