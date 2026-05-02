const supabase = require('../config/supabase');

class ReminderRepository {
  async findAll() {
    const { data, error } = await supabase.from('reminders').select('*').order('date', { ascending: true });
    if (error) throw error;
    return data;
  }

  async create(reminder) {
    const { data, error } = await supabase.from('reminders').insert([reminder]).select();
    if (error) throw error;
    return data[0];
  }

  async delete(id) {
    const { error } = await supabase.from('reminders').delete().eq('id', id);
    if (error) throw error;
    return true;
  }
}

module.exports = new ReminderRepository();
