const express = require('express');
const venom = require('venom-bot');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const mime = require('mime-types');

const messageRoutes = require('./routes/textRoutes');
const audioRoutes = require('./routes/voiceRoutes');
const contactRoutes = require('./routes/contactRoutes');
const linkRoutes = require('./routes/linkRoutes');
const imageRoutes = require('./routes/imageRoutes');
const fileRoutes = require('./routes/fileRoutes');
const stickerRoutes = require('./routes/stickerRoutes');
const chatRoutes = require('./routes/chatRoutes');
const chatInfoRoutes = require('./routes/chatInfoRoutes');
const messageInfoRoutes = require('./routes/messageInfoRoutes');
const userInfoRoutes = require('./routes/userInfoRoutes');
const groupRoutes = require('./routes/groupRoutes');
const clientRoutes = require('./routes/clientRoutes');
const deviceRoutes = require('./routes/deviceRoutes');
const locationRoutes = require('./routes/locationRoutes');

const app = express();
const port = 3000;
app.use(express.json());

const DOWNLOADS_DIR = path.join(__dirname, 'downloads');
if (!fs.existsSync(DOWNLOADS_DIR)) {
    fs.mkdirSync(DOWNLOADS_DIR, { recursive: true });
}

// Serve arquivos estaticamente da pasta downloads
app.use('/downloads', express.static(DOWNLOADS_DIR));

function saveMedia(buffer, mimetype) {
    const extension = mime.extension(mimetype) || 'bin';
    const fileName = `${Date.now()}.${extension}`;
    const filePath = path.join(DOWNLOADS_DIR, fileName);

    try {
        fs.writeFileSync(filePath, buffer);
        console.log(`Arquivo salvo em: ${filePath}`);
        return `/downloads/${fileName}`;
    } catch (err) {
        console.error('Erro ao salvar arquivo:', err);
        return null;
    }
}

const WEBHOOK_URLS = [
    "http://localhost/api/salvarmensagem",
    //"http://103.199.186.42:5678/webhook/apivenom",
];

const sendWebhook = async (event, data) => {
    for (const url of WEBHOOK_URLS) {
        try {
            await axios.post(url, { event, data });
            console.log(`Webhook enviado para ${url} - Evento: ${event}`);
        } catch (error) {
            console.error(`Erro ao enviar webhook para ${url} (${event}):`, error.message);
        }
    }
};

let clientInstance;

venom.create({
    session: 'bot-session2',
    multidevice: true,
    headless: 'new',
    useChrome: true,
    debug: false,
    logQR: true,
    browserArgs: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu'
    ]
}).then((client) => {
    clientInstance = client;
    console.log("Bot iniciado com sucesso!");

    client.onMessage(async (message) => {
        console.log("Nova mensagem recebida (onMessage):", message);

        const mediaTypes = ["image", "video", "audio", "ptt", "document", "sticker"];
        const hasMediaType = mediaTypes.includes(message.type);
        const hasMimeType = !!message.mimetype;
        const hasBody = !!message.body;

        let downloadUrl = null;

        if (hasMediaType || hasMimeType) {
            try {
                const buffer = await client.decryptFile(message);
                const relativePath = saveMedia(buffer, message.mimetype);
                if (relativePath) {
                    downloadUrl = `http://localhost:${port}${relativePath}`;
                }
            } catch (error) {
                console.error("Falha ao descriptografar (tentando base64 do body):", error.message);
                if (hasBody) {
                    const buffer = Buffer.from(message.body, "base64");
                    const relativePath = saveMedia(buffer, message.mimetype);
                    if (relativePath) {
                        downloadUrl = `http://localhost:${port}${relativePath}`;
                    }
                }
            }
        }

        if (downloadUrl) {
            message.downloadUrl = downloadUrl;
        }

        await sendWebhook('onMessage', message);
    });

    client.onStateChange(async (state) => {
        console.log('Mudança de estado:', state);
        await sendWebhook('onStateChange', { state });
    });

    client.onAck(async (ack) => {
        console.log('Confirmação de status da mensagem (ACK):', ack);
        await sendWebhook('onAck', ack);
    });

    app.use('/', messageRoutes(clientInstance));
    app.use('/', audioRoutes(clientInstance));
    app.use('/', contactRoutes(clientInstance));
    app.use('/', linkRoutes(clientInstance));
    app.use('/', imageRoutes(clientInstance));
    app.use('/', fileRoutes(clientInstance));
    app.use('/', stickerRoutes(clientInstance));
    app.use('/', chatRoutes(clientInstance));
    app.use('/', chatInfoRoutes(clientInstance));
    app.use('/', messageInfoRoutes(clientInstance));
    app.use('/', userInfoRoutes(clientInstance));
    app.use('/', groupRoutes(clientInstance));
    app.use('/', clientRoutes(clientInstance));
    app.use('/', deviceRoutes(clientInstance));
    app.use('/', locationRoutes(clientInstance));

}).catch((error) => {
    console.error('Erro ao criar cliente:', error);
    process.exit(1);
});

app.post('/webhook', (req, res) => {
    console.log('Webhook recebido:', req.body);
    res.status(200).json({ success: true });
});

app.listen(port, () => {
    console.log(`API rodando na porta ${port}`);
});
