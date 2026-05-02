const supabase = require('../config/supabase');

class TrackingRepository {
  async findAll() {
    const { data, error } = await supabase.from('tracking').select('*').order('date', { ascending: false });
    if (error) throw error;
    return data;
  }

  async create(entry) {
    const { data, error } = await supabase.from('tracking').insert([entry]).select();
    if (error) throw error;
    return data[0];
  }

  async delete(id) {
    const { error } = await supabase.from('tracking').delete().eq('id', id);
    if (error) throw error;
    return true;
  }
}

module.exports = new TrackingRepository();
