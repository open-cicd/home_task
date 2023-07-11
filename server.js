const {createServer} = require("http");

const express = require('express');
const fs = require('fs');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const path = require('path')
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";

// Postgres configuration
const pool = new Pool({
    user: 'postgres',
    host: '0.0.0.0',
    database: 'postgres',
    port: 5432,
});



const startServer = async (port) => {

    // Read the db.sql file
    const sql = fs.readFileSync(path.resolve(__dirname, 'db.sql'), 'utf8');

    // Execute the SQL commands
    await pool.query(sql);

    const app = express();

    // Middleware
    app.use(cors());
    // For parsing application/json
    app.use(bodyParser.json({ limit: '500mb' }));

    // Endpoint for /liveEvent
    app.post('/liveEvent', async (req, res) => {
        const authHeader = req.headers.authorization;
        if (authHeader !== 'secret') {
            res.status(401).send('Unauthorized');
            return;
        }

        const event = req.body;


        // write event to  jsonl file
        try {
            await fs.promises.appendFile('./server_events.jsonl', JSON.stringify(event) + '\n', 'utf8');
            console.log('Event written successfully');
        } catch (err) {
            const errMessage = `Error writing file: ${err}`
            console.error(errMessage);
            res.status(500).send(errMessage);
            return;
        }


        res.status(200).send('Event received');
    });


    // Endpoint for /userEvents/<userid>
    app.get('/userEvents/:userId', (req, res) => {
        const userId = req.params.userId;

        pool.query('SELECT * FROM users WHERE userId = $1', [userId])
            .then(results => {
                if (results.rows.length > 0) {
                    res.status(200).json(results.rows);
                } else {
                    res.status(404).send('User not found');
                }
            })
            .catch(err => {
                if(err.message.includes("relation \"events\" does not exist")){
                    res.status(404).send('User not found');
                    return;
                }
                console.error(err);
                res.status(500).send('Internal server error');
            });
    });


    const httpServer = createServer(app)

    const httpPort = port ?? 8000

    // Start the server on port 8000
    httpServer.listen(httpPort, '0.0.0.0', () => {
        console.log(`Home-Task server listening on port: ${httpPort}`)
    })

}


(async () => {
    await startServer(8000);
})();

