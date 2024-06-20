const mysql = require('mysql');
const { MongoClient } = require('mongodb');

// MySQL connection configuration
const mysqlConfig = {
    host: 'localhost',
    user: 'root',
    database: 'u429909635_ii6n6'
};

// MongoDB connection configuration
const mongoConfig = {
    url: 'mongodb://127.0.0.1:27017',
    dbName: 'flyingbook'
};

// Function to connect to MySQL and initiate data migration
function connectToMySQL() {
    const mysqlConnection = mysql.createConnection(mysqlConfig);

    mysqlConnection.connect(async (err) => {
        if (err) {
            console.error('Error connecting to MySQL:', err.stack);
            return;
        }
        console.log('Connected to MySQL database!');

        try {
            const mongoClient = new MongoClient(mongoConfig.url, { useNewUrlParser: true, useUnifiedTopology: true });
            await mongoClient.connect();
            console.log('Connected to MongoDB');

            const db = mongoClient.db(mongoConfig.dbName);

            // Get list of tables from MySQL
            mysqlConnection.query('SHOW TABLES', async (err, tables) => {
                if (err) {
                    console.error('Error fetching tables from MySQL:', err);
                    mysqlConnection.end();
                    mongoClient.close();
                    return;
                }

                // Iterate through each table and migrate data to MongoDB
                for (let i = 0; i < tables.length; i++) {
                    const tableName = tables[i]['Tables_in_u429909635_ii6n6'];
                    await migrateTableData(mysqlConnection, db, tableName);
                }

                console.log('Data migration completed successfully');
                mysqlConnection.end();
                mongoClient.close();
            });
        } catch (err) {
            console.error('Error connecting to MongoDB:', err);
            mysqlConnection.end();
        }
    });

    mysqlConnection.on('error', (err) => {
        console.error('MySQL connection error:', err);
    });
}

// Function to migrate data from a MySQL table to MongoDB collection
// Function to migrate data from a MySQL table to MongoDB collection
async function migrateTableData(mysqlConnection, db, tableName) {
    return new Promise((resolve, reject) => {
        mysqlConnection.query(`SELECT * FROM ${tableName}`, async (err, results) => {
            if (err) {
                console.error(`Error querying MySQL table '${tableName}':`, err);
                reject(err);
                return;
            }

            if (results.length === 0) {
                console.log(`No data to migrate for table '${tableName}', skipping.`);
                resolve();
                return;
            }

            try {
                // Insert data into MongoDB collection
                const collection = db.collection(tableName);
                const result = await collection.insertMany(results);
                console.log(`Inserted ${result.insertedCount} documents into MongoDB collection '${tableName}'`);
                resolve();
            } catch (insertErr) {
                console.error(`Error inserting into MongoDB collection '${tableName}':`, insertErr);
                reject(insertErr);
            }
        });
    });
}


// Call the function to initiate the process
connectToMySQL(); // Start MySQL connection and migration
