const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const fs = require("fs");
const path = require("path");

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// Base directory for storing local S3 buckets and objects
const baseDir = path.join(__dirname, "local-s3");

// Helper function to create directories if they don't exist
const createDirectoryIfNotExists = (directory) => {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }
};

// MySQL connection pool setup
const pool = mysql.createPool({
  connectionLimit: 10,
  host: "localhost",
  user: "root",
  password: "root",
  database: "s3_operations",
});

// Handle GET request to retrieve an object
app.get("/objects/:bucket/:key", (req, res) => {
  const { bucket, key } = req.params;
  const filePath = path.join(baseDir, bucket, key);

  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, "utf-8");
    res.json({ key, content });

    // Log the GET operation to MySQL
    logOperation(bucket, key, "GET");
  } else {
    res.status(404).json({ error: "Object not found" });
  }
});

// Handle POST request to upload an object
app.post("/objects/:bucket/:key", (req, res) => {
  const { bucket, key } = req.params;
  const { content } = req.body;
  const bucketDir = path.join(baseDir, bucket);

  createDirectoryIfNotExists(bucketDir);

  const filePath = path.join(bucketDir, key);
  fs.writeFileSync(filePath, content);

  res.json({ message: "Object successfully uploaded" });

  // Log the PUT operation to MySQL
  logOperation(bucket, key, "PUT");
});

// Handle DELETE request to delete an object
app.delete("/objects/:bucket/:key", (req, res) => {
  const { bucket, key } = req.params;
  const filePath = path.join(baseDir, bucket, key);

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    res.json({ message: "Object successfully deleted" });

    // Log the DELETE operation to MySQL
    logOperation(bucket, key, "DELETE");
  } else {
    res.status(404).json({ error: "Object not found" });
  }
});

// Handle GET request to list objects in a bucket
app.get("/objects/:bucket", (req, res) => {
  const { bucket } = req.params;
  const bucketDir = path.join(baseDir, bucket);

  if (fs.existsSync(bucketDir)) {
    const objects = fs.readdirSync(bucketDir);
    res.json(objects);

    // Log the LIST operation to MySQL
    logOperation(bucket, "", "LIST");
  } else {
    res.status(404).json({ error: "Bucket not found" });
  }
});

// Handle GET request to list all buckets
app.get("/buckets", (req, res) => {
  const buckets = fs.readdirSync(baseDir);
  res.json(buckets);

  // Log the LIST BUCKETS operation to MySQL
  logOperation("", "", "LIST BUCKETS");
});

// Function to log S3 operation to MySQL
function logOperation(bucket, key, operation) {
  const query =
    "INSERT INTO s3_operations (bucket, s3_key, operation) VALUES (?, ?, ?)";
  const values = [bucket, key, operation];

  // Use the MySQL connection pool to execute the query
  pool.query(query, values, (error) => {
    if (error) {
      console.error(error);
    }
  });
}

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
