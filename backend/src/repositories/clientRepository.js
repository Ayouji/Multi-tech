const supabase = require('../config/supabase');

class ClientRepository {
  async findAll() {
    const { data, error } = await supabase.from('clients').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  }

  async create(client) {
    const { data, error } = await supabase.from('clients').insert([client]).select();
    if (error) throw error;
    return data[0];
  }

  async delete(id) {
    const { error } = await supabase.from('clients').delete().eq('id', id);
    if (error) throw error;
    return true;
  }
}

module.exports = new ClientRepository();
