require('dotenv').config();
const express = require('express');
const userApi = require('./routes/users');
const fileApi = require('./routes/files');



const cors = require('cors');

const http = require('http');
const WebSocket = require('ws');

require('./config/connect');

const app = express();

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });



const clients = new Map();

wss.on('connection', (ws, req) => {
    const userId = req.url.split('?userId=')[1]; // Extraire userId de l'URL
    if (!userId) {
        ws.close();
        return;
    }

    clients.set(userId, ws);
    console.log(`Utilisateur ${userId} connecté via WebSocket`);

    // Mettre à jour son statut en "Actif"
    updateUserStatus(userId, 'Active');

    ws.on('close', () => {
        console.log(`Utilisateur ${userId} déconnecté`);
        clients.delete(userId);
        updateUserStatus(userId, 'Inactive');
    });

    ws.on('error', (error) => {
        console.error('Erreur WebSocket:', error.message);
    });
});

async function updateUserStatus(userId, status) {
    try {
        await User.findByIdAndUpdate(userId, { ActiveStatus: status });
        broadcastStatusChange(userId, status);
    } catch (error) {
        console.error(`Erreur mise à jour du statut de ${userId}:`, error);
    }
}

function broadcastStatusChange(userId, status) {
    const message = JSON.stringify({ userId, status });
    clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    });
}


app.use(express.json());


app.use(cors());

app.use('/user' , userApi);
app.use('/file',fileApi);

app.use('/uploads' , express.static('uploads'));

const port = process.env.PORT || 4000;


server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});