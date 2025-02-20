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

// Criar a pasta de downloads, se não existir
const DOWNLOADS_DIR = path.join(__dirname, 'downloads');
if (!fs.existsSync(DOWNLOADS_DIR)) {
    fs.mkdirSync(DOWNLOADS_DIR, { recursive: true });
}

/**
 * Função para salvar a mídia em disco
 * @param {Buffer} buffer - Buffer de bytes da mídia
 * @param {string} mimetype - Tipo mime (e.g. image/jpeg)
 */
function saveMedia(buffer, mimetype) {
    // Descobrir extensão a partir do mimetype
    const extension = mime.extension(mimetype) || 'bin';
    // Gera nome único baseado no timestamp
    const fileName = `${Date.now()}.${extension}`;
    // Caminho final do arquivo
    const filePath = path.join(DOWNLOADS_DIR, fileName);

    fs.writeFile(filePath, buffer, (err) => {
        if (err) {
            console.error('Erro ao salvar arquivo:', err);
        } else {
            console.log(`Arquivo salvo em: ${filePath}`);
        }
    });
}

// Lista de múltiplos Webhooks (adicione quantos quiser)
const WEBHOOK_URLS = [
    "http://localhost:5678/webhook-test/8b9acaa8-5b92-40bb-aac2-14aa479c7f35"
];

// Função para enviar eventos para todos os Webhooks
const sendWebhook = async (event, data) => {
    WEBHOOK_URLS.forEach(async (url) => {
        try {
            await axios.post(url, { event, data });
            console.log(`Webhook enviado para ${url} - Evento: ${event}`);
        } catch (error) {
            console.error(`Erro ao enviar webhook para ${url} (${event}):`, error.message);
        }
    });
};

let clientInstance;

// Criando sessão do Venom-Bot
venom.create({
    session: 'bot-session',
    multidevice: true,
    headless: "new",
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
})
    .then((client) => {
        clientInstance = client;
        console.log("Bot iniciado com sucesso!");

        // Escutar mensagens recebidas
        client.onMessage(async (message) => {
            //console.log("Nova mensagem recebida (onMessage):", message);

            // 1️⃣ Verifica se o tipo é algo que indique mídia
            const mediaTypes = ["image", "video", "audio", "ptt", "document", "sticker"];
            const hasMediaType = mediaTypes.includes(message.type);

            // 2️⃣ Verifica se existe mimetype e body (caso esteja em base64)
            const hasMimeType = !!message.mimetype;
            const hasBody = !!message.body;

            // Se for um tipo de mídia conhecido ou tiver mimetype
            if (hasMediaType || hasMimeType) {
                try {
                    // Tenta descriptografar se há directPath + mediaKey
                    // (caso não seja inviável)
                    const buffer = await client.decryptFile(message);
                    // Salva no disco
                    saveMedia(buffer, message.mimetype);
                } catch (error) {
                    // Fallback: se falhar ou não precisar descriptografar, usar base64 do body
                    console.error("Falha ao descriptografar (tentando base64 do body):", error.message);

                    if (hasBody) {
                        const buffer = Buffer.from(message.body, "base64");
                        saveMedia(buffer, message.mimetype);
                    } else {
                        console.log("Nenhum body base64 disponível.");
                    }
                }
            }
        });

        // Escutar mudanças de estado do cliente
        client.onStateChange(async (state) => {
            console.log('Mudança de estado:', state);
            await sendWebhook('onStateChange', { state });
        });

        // Escutar mudanças no status das mensagens (ACK)
        client.onAck(async (ack) => {
            console.log('Confirmação de status da mensagem (ACK):', ack);
            await sendWebhook('onAck', ack);
        });

        // Usando rotas externas
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
    })
    .catch((error) => {
        console.error('Erro ao criar cliente:', error);
        process.exit(1);
    });

// Rota para receber notificações de Webhook (caso precise testar)
app.post('/webhook', (req, res) => {
    console.log('Webhook recebido:', req.body);
    res.status(200).json({ success: true });
});

// Iniciando servidor Express
app.listen(port, () => {
    console.log(`API rodando na porta ${port}`);
});
