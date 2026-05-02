const supabase = require('../config/supabase');

class TaskRepository {
  async findAll() {
    const { data, error } = await supabase.from('tasks').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  }

  async create(task) {
    const { data, error } = await supabase.from('tasks').insert([task]).select();
    if (error) throw error;
    return data[0];
  }

  async update(id, updates) {
    const { data, error } = await supabase.from('tasks').update(updates).eq('id', id).select();
    if (error) throw error;
    return data[0];
  }

  async delete(id) {
    const { error } = await supabase.from('tasks').delete().eq('id', id);
    if (error) throw error;
    return true;
  }
}

module.exports = new TaskRepository();
