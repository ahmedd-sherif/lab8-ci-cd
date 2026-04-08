const express = require('express');
const { MongoClient } = require('mongodb');
const os = require('os');

const app = express();
const PORT = 3000;
const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017';
const DB_NAME = 'lab6db';

let db;

async function connectDB() {
  const client = new MongoClient(MONGO_URL);
  await client.connect();
  db = client.db(DB_NAME);
  console.log('Connected to MongoDB');
}

app.get('/', (req, res) => {
  res.json({
    app: 'CISC 886 Lab 8',
    mode: process.env.MODE || 'local',
    node: process.version,
    host: os.hostname()
  });
});

app.get('/tasks', async (req, res) => {
  const tasks = await db.collection('tasks').find().toArray();
  const grouped = tasks.reduce((acc, task) => {
    acc[task.status] = acc[task.status] || [];
    acc[task.status].push(task);
    return acc;
  }, {});
  res.json(grouped);
});

connectDB().then(() => {
  app.listen(PORT, () => console.log(`App started on port ${PORT}`));
});
