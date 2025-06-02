import { db } from './database';

export async function runMigrations() {
  console.log('Running database migrations...');

  try {
    // Check if migrations table exists
    await db.run(`
      CREATE TABLE IF NOT EXISTS migrations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL,
        applied_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Migration 1: Add hazard-specific fields
    const migration1 = 'add_hazard_specific_fields';
    const applied1 = await db.get('SELECT * FROM migrations WHERE name = ?', [migration1]);

    if (!applied1) {
      console.log(`Applying migration: ${migration1}`);

      // Add earthquake fields
      await db.run('ALTER TABLE audits ADD COLUMN foundation_work TEXT');
      await db.run('ALTER TABLE audits ADD COLUMN water_heater_security TEXT');
      await db.run('ALTER TABLE audits ADD COLUMN chimney_inspection TEXT');
      await db.run('ALTER TABLE audits ADD COLUMN garage_retrofit TEXT');

      // Add wind fields
      await db.run('ALTER TABLE audits ADD COLUMN roof_inspection TEXT');
      await db.run('ALTER TABLE audits ADD COLUMN window_door_protection TEXT');
      await db.run('ALTER TABLE audits ADD COLUMN continuous_load_path TEXT');

      // Add flood fields
      await db.run('ALTER TABLE audits ADD COLUMN equipment_elevation TEXT');
      await db.run('ALTER TABLE audits ADD COLUMN automatic_flood_vents TEXT');
      await db.run('ALTER TABLE audits ADD COLUMN appliance_platforms TEXT');

      // Add wildfire fields
      await db.run('ALTER TABLE audits ADD COLUMN roof_material TEXT');
      await db.run('ALTER TABLE audits ADD COLUMN defensible_space_width TEXT');
      await db.run('ALTER TABLE audits ADD COLUMN under_elevation_finish TEXT');

      // Record migration
      await db.run('INSERT INTO migrations (name) VALUES (?)', [migration1]);
      console.log(`Migration ${migration1} completed`);
    }

    // Migration 2: Add metadata fields
    const migration2 = 'add_metadata_fields';
    const applied2 = await db.get('SELECT * FROM migrations WHERE name = ?', [migration2]);

    if (!applied2) {
      console.log(`Applying migration: ${migration2}`);

      await db.run('ALTER TABLE audits ADD COLUMN recent_upgrades TEXT');
      await db.run('ALTER TABLE audits ADD COLUMN insurance_claims TEXT');
      await db.run('ALTER TABLE audits ADD COLUMN emergency_kit TEXT');
      await db.run('ALTER TABLE audits ADD COLUMN evacuation_plan TEXT');
      await db.run('ALTER TABLE audits ADD COLUMN user_agent TEXT');
      await db.run('ALTER TABLE audits ADD COLUMN ip_address TEXT');
      await db.run('ALTER TABLE audits ADD COLUMN assessment_duration INTEGER');

      await db.run('INSERT INTO migrations (name) VALUES (?)', [migration2]);
      console.log(`Migration ${migration2} completed`);
    }

    // Migration 3: Normalize hazard values
    const migration3 = 'normalize_hazard_values';
    const applied3 = await db.get('SELECT * FROM migrations WHERE name = ?', [migration3]);

    if (!applied3) {
      console.log(`Applying migration: ${migration3}`);

      // Update hurricane/tornado to wind
      await db.run(`
        UPDATE audits 
        SET primary_hazard = 'wind' 
        WHERE primary_hazard IN ('hurricane', 'tornado', 'Hurricane', 'Tornado')
      `);

      // Lowercase all hazards
      await db.run(`
        UPDATE audits 
        SET primary_hazard = LOWER(primary_hazard)
        WHERE primary_hazard IS NOT NULL
      `);

      await db.run('INSERT INTO migrations (name) VALUES (?)', [migration3]);
      console.log(`Migration ${migration3} completed`);
    }

    console.log('All migrations completed successfully');
  } catch (error) {
    console.error('Migration error:', error);
    throw error;
  }
}

// Run migrations when this module is imported
runMigrations().catch(console.error);