const mysql = require('mysql');
const { MongoClient } = require('mongodb');

// Function to connect to MySQL and initiate data migration
function connectToMySQL() {
    const mysqlConnection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        database: 'u429909635_ii6n6'
    });

    mysqlConnection.connect((err) => {
        if (err) {
            console.error('Error connecting to MySQL:', err.stack);
            return;
        }
        console.log('Connected to MySQL database!');
        connectToMongoDB(mysqlConnection); // Call function to connect to MongoDB after MySQL connection
    });

    mysqlConnection.on('error', (err) => {
        console.error('MySQL connection error:', err);
    });
}

// Function to connect to MongoDB and handle migration
async function connectToMongoDB(mysqlConnection) {
    const mongoClient = new MongoClient('mongodb://127.0.0.1:27017', { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        await mongoClient.connect();
        console.log('Connected to MongoDB');

        const db = mongoClient.db('flyingbook');
        const collectionName = 'flyingtest';

        // Check if collection exists in MongoDB
        const collectionExists = await db.listCollections({ name: collectionName }).toArray();
        if (collectionExists.length > 0) {
            console.log(`Collection '${collectionName}' already exists in database 'flyingbook'`);
        } else {
            console.log(`Collection '${collectionName}' does not exist, creating...`);
            await db.createCollection(collectionName);
            console.log(`Created collection '${collectionName}'`);
        }

        // Call function to migrate data from MySQL to MongoDB
        await migrateDataFromMySQLToMongoDB(mysqlConnection, db, collectionName, mongoClient);

    } catch (err) {
        console.error('Error connecting to MongoDB:', err);
    }
}

// Function to migrate data from MySQL to MongoDB
async function migrateDataFromMySQLToMongoDB(mysqlConnection, db, collectionName, mongoClient) {
    mysqlConnection.query('SELECT * FROM offer_time', async (err, results) => {
        if (err) {
            console.error('Error querying MySQL:', err);
            mysqlConnection.end();
            await mongoClient.close(); // Close MongoDB connection in case of error
            return;
        }

        console.log(`Retrieved ${results.length} rows from MySQL`);

        try {
            // Insert data into MongoDB
            const result = await db.collection(collectionName).insertMany(results);
            console.log(`Inserted ${result.insertedCount} documents into MongoDB`);
            console.log('Data migration completed successfully');
        } catch (insertErr) {
            console.error('Error inserting into MongoDB:', insertErr);
        } finally {
            await mongoClient.close(); // Ensure MongoDB connection is closed
            mysqlConnection.end(); // Close MySQL connection after migration
        }
    });

    mysqlConnection.on('error', (err) => {
        console.error('MySQL connection error:', err);
    });
}

// Call the function to initiate the process
connectToMySQL(); // Start MySQL connection and migration
