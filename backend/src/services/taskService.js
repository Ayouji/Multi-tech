const taskRepository = require('../repositories/taskRepository');

class TaskService {
  async getAllTasks() {
    return await taskRepository.findAll();
  }

  async createTask(taskData) {
    // Logique métier possible ici
    return await taskRepository.create({ ...taskData, statut: 'pending' });
  }

  async updateTask(id, updates) {
    return await taskRepository.update(id, updates);
  }

  async deleteTask(id) {
    return await taskRepository.delete(id);
  }
}

module.exports = new TaskService();
