const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function initializeDatabase() {
  const dbHost = process.env.DB_HOST || '127.0.0.1';
  const dbPort = process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306;
  const dbUser = process.env.DB_USER || 'root';
  const dbPassword = process.env.DB_PASSWORD || '';
  const dbName = process.env.DB_NAME || 'club_management_system';

  try {
    console.log('Connecting to MySQL...');
    
    // Connect without database to create it
    const connection = await mysql.createConnection({
      host: dbHost,
      port: dbPort,
      user: dbUser,
      password: dbPassword,
    });

    // Create database if not exists
    console.log(`Creating database "${dbName}" if not exists...`);
    await connection.execute(`CREATE DATABASE IF NOT EXISTS ${dbName}`);
    
    // Use the database
    await connection.execute(`USE ${dbName}`);
    
    // Read and execute schema
    const schemaPath = path.join(__dirname, 'migrations', '001_initial_schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Split by semicolon and execute each statement
    const statements = schema.split(';').filter(stmt => stmt.trim());
    
    console.log(`Executing ${statements.length} SQL statements...`);
    for (const statement of statements) {
      if (statement.trim()) {
        await connection.execute(statement);
      }
    }
    
    console.log('Database schema created successfully!');
    
    // Insert sample data
    console.log('Inserting sample data...');
    
    const sampleUsers = [
      ['1', 'Club', 'Leader', 'Club Leader', 'leader@example.com', 'CLUB_LEADER'],
      ['2', 'Sok', 'Dara', 'Sok Dara', 'sok.dara@example.com', 'STUDENT'],
      ['3', 'Malis', 'Chan', 'Malis Chan', 'malis.chan@example.com', 'STUDENT'],
      ['4', 'Vanna', 'Kim', 'Vanna Kim', 'vanna.kim@example.com', 'STUDENT'],
    ];
    
    for (const user of sampleUsers) {
      const [id, firstName, lastName, name, email, role] = user;
      await connection.execute(
        'INSERT IGNORE INTO users (id, first_name, last_name, name, email, role) VALUES (?, ?, ?, ?, ?, ?)',
        [id, firstName, lastName, name, email, role]
      );
    }
    
    // Insert sample club
    await connection.execute(
      'INSERT IGNORE INTO clubs (id, name, description, category, leader_id) VALUES (?, ?, ?, ?, ?)',
      ['1', 'Robotics Club', 'Build and learn robotics.', 'Technology', '1']
    );
    
    // Insert sample members
    const sampleMembers = [
      ['1', '2', '1', 'ACTIVE', '2026-05-01 09:00:00'],
      ['2', '3', '1', 'PENDING', '2026-05-10 10:30:00'],
    ];
    
    for (const member of sampleMembers) {
      const [id, userId, clubId, status, joinedAt] = member;
      await connection.execute(
        'INSERT IGNORE INTO club_members (id, user_id, club_id, status, joined_at) VALUES (?, ?, ?, ?, ?)',
        [id, userId, clubId, status, joinedAt]
      );
    }
    
    // Insert sample events
    const sampleEvents = [
      ['event-1', '1', 'Robot Workshop', '', '2026-05-18', 'Lab A'],
      ['event-2', '1', 'Design Review', '', '2026-05-25', 'Room 203'],
    ];
    
    for (const event of sampleEvents) {
      const [id, clubId, title, desc, date, location] = event;
      await connection.execute(
        'INSERT IGNORE INTO events (id, club_id, title, description, event_date, location) VALUES (?, ?, ?, ?, ?, ?)',
        [id, clubId, title, desc, date, location]
      );
    }
    
    // Insert sample attendance
    const sampleAttendance = [
      ['att-1', 'event-1', '2', '1', '2026-05-12 08:00:00', 'PRESENT', '2026-05-18 14:00:00'],
      ['att-2', 'event-2', '2', '1', '2026-05-20 09:00:00', 'ABSENT', '2026-05-25 16:00:00'],
      ['att-3', 'event-1', '3', '1', '2026-05-12 08:00:00', 'REGISTERED', null],
    ];
    
    for (const att of sampleAttendance) {
      const [id, eventId, userId, clubId, registeredAt, status, recordedAt] = att;
      await connection.execute(
        'INSERT IGNORE INTO attendance (id, event_id, user_id, club_id, registered_at, participation_status, recorded_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [id, eventId, userId, clubId, registeredAt, status, recordedAt]
      );
    }
    
    console.log('Sample data inserted successfully!');
    
    await connection.end();
    console.log('Database initialization complete!');
    process.exit(0);
  } catch (error) {
    console.error('Database initialization error:', error.message);
    process.exit(1);
  }
}

initializeDatabase();
