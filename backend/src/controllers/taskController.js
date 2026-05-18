const taskService = require('../services/taskService');

class TaskController {
  async getAll(req, res) {
    try {
      const tasks = await taskService.getAllTasks();
      res.json(tasks);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async create(req, res) {
    try {
      const task = await taskService.createTask(req.body);
      res.json(task);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async update(req, res) {
    try {
      const task = await taskService.updateTask(req.params.id, req.body);
      res.json(task);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async delete(req, res) {
    try {
      await taskService.deleteTask(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new TaskController();
