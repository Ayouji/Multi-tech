const clientRepository = require('../repositories/clientRepository');

class ClientService {
  async getAllClients() {
    return await clientRepository.findAll();
  }

  async createClient(clientData) {
    return await clientRepository.create(clientData);
  }

  async deleteClient(id) {
    return await clientRepository.delete(id);
  }
}

module.exports = new ClientService();
