const reminderService = require('../services/reminderService');

class ReminderController {
  async getAll(req, res) {
    try {
      const reminders = await reminderService.getAllReminders();
      res.json(reminders);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async create(req, res) {
    try {
      const reminder = await reminderService.createReminder(req.body);
      res.json(reminder);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async delete(req, res) {
    try {
      await reminderService.deleteReminder(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new ReminderController();
