const db = require('./config/db');

async function alterTables() {
  const tables = ['services', 'career_opportunities', 'resource_repository', 'blogs', 'testimonials'];
  for (const table of tables) {
    try {
      await db.promise().query(`ALTER TABLE ${table} ADD COLUMN meta_title VARCHAR(255), ADD COLUMN meta_description TEXT, ADD COLUMN meta_keywords TEXT`);
      console.log(`Added columns to ${table}`);
    } catch (e) {
      if (e.code === 'ER_DUP_FIELDNAME') {
        console.log(`Columns already exist in ${table}`);
      } else {
        console.error(`Error on ${table}:`, e.message);
      }
    }
  }
  process.exit();
}
alterTables();
