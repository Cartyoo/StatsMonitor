// server.js (VPS server)
const os = require('os');
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
app.use(express.json()); // For parsing JSON POST body

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }  // allow all origins for simplicity; restrict in production
});

let lastNotificationTimestamp = 0;

function getStats() {
  const load = os.loadavg()[0]; // 1-min load average
  const cpuCount = os.cpus().length;
  const cpuUsagePercent = Math.min(100, (load / cpuCount) * 100).toFixed(1);

  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const usedMem = totalMem - freeMem;
  const memUsagePercent = ((usedMem / totalMem) * 100).toFixed(1);

  return {
    cpuUsagePercent,
    memUsagePercent,
    freeMemMB: (freeMem / 1024 / 1024).toFixed(1),
    totalMemMB: (totalMem / 1024 / 1024).toFixed(1),
    timestamp: Date.now(),
  };
}

// Emit stats every 5 seconds if no notifications in last 15 minutes
setInterval(() => {
  const now = Date.now();
  if (now - lastNotificationTimestamp > 15 * 60 * 1000) {
    io.emit('stats', getStats());
  }
}, 5000);

io.on('connection', (socket) => {
  console.log('Client connected');
  // Send stats immediately on connect if no recent notifications
  if (Date.now() - lastNotificationTimestamp > 15 * 60 * 1000) {
    socket.emit('stats', getStats());
  }
});

// Endpoint to send notifications to clients
app.post('/notify', (req, res) => {
  const notification = req.body;
  if (!notification.title || !notification.message) {
    return res.status(400).send({ error: 'Missing title or message' });
  }
  notification.priority = notification.priority || 1;
  notification.timestamp = Date.now();

  lastNotificationTimestamp = Date.now();
  io.emit('notification', notification);
  res.status(201).send({ status: 'Notification sent' });
});


app.get('/', (req, res) => {
   res.sendFile(__dirname + '/index.html');
});

app.get('/manifest.json', (req, res) => {
   res.sendFile(__dirname + '/manifest.json');
});

const PORT = 9264;
server.listen(PORT, () => {
  console.log(`Stats/Notification server running on port ${PORT}`);
});