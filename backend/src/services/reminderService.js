const reminderRepository = require('../repositories/reminderRepository');

class ReminderService {
  async getAllReminders() {
    return await reminderRepository.findAll();
  }

  async createReminder(reminderData) {
    if (!reminderData.title || !reminderData.date) {
      throw new Error('Le titre et la date sont requis');
    }
    return await reminderRepository.create(reminderData);
  }

  async deleteReminder(id) {
    return await reminderRepository.delete(id);
  }
}

module.exports = new ReminderService();
