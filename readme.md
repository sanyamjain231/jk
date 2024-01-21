# Local S3 Operations with Node.js

This project demonstrates a simple implementation of S3-like operations using Node.js, Express, and a local file system for object storage. Additionally, it logs these operations to a MySQL database.

## Requirements

- Node.js installed on your machine
- MySQL server installed and running
- npm (Node Package Manager)

## Setup

1. Clone this repository:
   git clone https://github.com/sanyamjain231/jk.git

2. Install dependencies:
   npm install
3. Configure MySQL:
   - Create a MySQL database named s3_operations.
   - Modify the MySQL connection details in the index.js file.
4. Start the server:
   - node index.js

Testing S3 Operations
Use the following sample URLs to test different S3 operations:

1. GET Object:
   http://localhost:3000/objects/bucket_name/object_key
2. PUT Oject:
   URL: http://localhost:3000/objects/bucket_name/object_key
   Method: POST
   Headers: Content-Type: application/json
   Body: { "content": "Your object content goes here" }
3. DELETE Object:
   http://localhost:3000/objects/bucket_name/object_key
4. List Objects in Bucket:
   http://localhost:3000/objects/bucket_name
5. List Buckets:
   http://localhost:3000/buckets

Make sure to replace bucket_name and object_key with your desired values when testing these URLs.
