require('dotenv').config();
const express = require('express');
const userApi = require('./routes/users');
const fileApi = require('./routes/files');
const folderApi = require('./routes/folders');

const cors = require('cors');

const http = require('http');
const WebSocket = require('ws');

require('./config/connect');

const app = express();

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });


const clients = new Set();

wss.on('connection', (ws) => {
    clients.add(ws);
    console.log('Un utilisateur s\'est connecté via WebSocket');

    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);
            if (!data || typeof data.content !== 'string') {
                throw new Error('Données invalides');
            }
            console.log('Message reçu:', data);

            clients.forEach((client) => {
                if (client !== ws && client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({ content: data.content }));
                }
            });
        } catch (error) {
            console.error('Erreur lors du traitement du message:', error.message);
            ws.send(JSON.stringify({ error: 'Message invalide' }));
        }
    });

    ws.on('close', () => {
        clients.delete(ws);
        console.log('Un utilisateur a quitté la connexion WebSocket');
    });

    ws.on('error', (error) => {
        console.error('Erreur WebSocket:', error.message);
    });
});


app.use(express.json());


app.use(cors());



app.use('/user' , userApi);
app.use('/file',fileApi);
app.use('/folder', folderApi)

app.use('/uploads' , express.static('uploads'));

const port = process.env.PORT || 3000;


server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});