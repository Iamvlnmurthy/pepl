const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

async function syncDb() {
    const passwords = [
        process.env.DB_PASSWORD,
        'Trijesta1',
        '[!Trijesta1!]',
        '!Trijesta1!'
    ].filter(p => !!p && p !== '[YOUR-PASSWORD]');

    for (const password of passwords) {
        console.log(`Attempting connection with password variation...`);
        const client = new Client({
            host: process.env.DB_HOST,
            port: 6543,
            user: process.env.DB_USER,
            password: password,
            database: process.env.DB_NAME,
            ssl: {
                rejectUnauthorized: false
            }
        });

        try {
            await client.connect();
            console.log('Connected successfully!');

            const schemaPath = path.join(__dirname, '../../pepl-schema.sql');
            const sql = fs.readFileSync(schemaPath, 'utf8');

            console.log('Executing schema...');
            await client.query(sql);
            console.log('Schema synchronized successfully! 🚀');
            await client.end();
            return; // Exit on success
        } catch (err) {
            console.error(`Attempt failed with error: ${err.message}`);
            await client.end().catch(() => { });
        }
    }
    console.error('All connection attempts failed.');
    process.exit(1);
}

syncDb();
