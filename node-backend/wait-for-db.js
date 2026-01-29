const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

const config = {
  host: process.env.DB_HOST || 'db',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'productivity_hub'
};

const maxRetries = 30;
const retryDelay = 2000; // 2 seconds

async function waitForDatabase() {
  for (let i = 1; i <= maxRetries; i++) {
    try {
      console.log(`Attempt ${i}/${maxRetries}: Connecting to database...`);
      const connection = await mysql.createConnection({
        host: config.host,
        port: config.port,
        user: config.user,
        password: config.password
      });
      
      await connection.query('SELECT 1');
      await connection.end();
      
      console.log('✅ Database is ready!');
      return true;
    } catch (error) {
      console.log(`❌ Database not ready: ${error.message}`);
      if (i < maxRetries) {
        console.log(`Waiting ${retryDelay/1000} seconds before retry...`);
        await new Promise(resolve => setTimeout(resolve, retryDelay));
      }
    }
  }
  
  console.error('Failed to connect to database after maximum retries');
  process.exit(1);
}

// Find the main server file
function findServerFile() {
  const possibleFiles = ['server.js', 'index.js', 'app.js', 'main.js'];
  
  for (const file of possibleFiles) {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
      console.log(`Found server file: ${file}`);
      return filePath;
    }
  }
  
  console.error('Could not find server file (tried: server.js, index.js, app.js, main.js)');
  console.error('Please specify your main file in wait-for-db.js');
  process.exit(1);
}

waitForDatabase().then(() => {
  console.log('Starting application...');
  const serverFile = findServerFile();
  require(serverFile);
}).catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});