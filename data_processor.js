const fs = require('fs');
const readline = require('readline');
const { Pool } = require('pg');

// Postgres Config
const pool = new Pool({
    user: 'postgres',
    host: '0.0.0.0',
    database: 'postgres',
    port: 5432,
});

async function processData() {
    const fileStream = fs.createReadStream('server_events.jsonl');

    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    const userRevenues = new Map();

    // Read the file line by line
    for await (const line of rl) {
        const event = JSON.parse(line);

        // Initialize the user's revenue if it's the first event for this user
        if (!userRevenues.has(event.userId)) {
            userRevenues.set(event.userId, 0);
        }

        // Add or subtract the event value from the user's revenue
        if (event.name === 'add_revenue') {
            userRevenues.set(event.userId, userRevenues.get(event.userId) + event.value);
        } else if (event.name === 'subtract_revenue') {
            userRevenues.set(event.userId, userRevenues.get(event.userId) - event.value);
        }
    }

    // Update the user revenues in the database
    for (const [userId, revenue] of userRevenues) {

        const query = "INSERT INTO users (userId, revenue) VALUES ($1, $2) ON CONFLICT (userId) DO UPDATE SET revenue = $2 WHERE users.userId = $1";
        await pool.query(query, [userId,revenue ]);
    }

    console.log('Done processing data.');
}

processData().catch(err => console.error(err));
