import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://eyysbfbxqgqctrqkmbkn.supabase.co',
  'sb_publishable_5aOM-hJF6uwlcY_iPZo81A_QGRYHqbb'
);

async function main() {
  const { data, error } = await supabase.from('questions').select('*').limit(1).single();
  console.log(JSON.stringify(data, null, 2));
}

main();
