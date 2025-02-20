const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// Configuração do multer para manter a extensão do arquivo
const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname); // Obtém a extensão original do arquivo
        const filename = `${Date.now()}${ext}`; // Gera um nome único com a extensão original
        cb(null, filename);
    }
});

const upload = multer({ storage });

module.exports = (clientInstance) => {
    // Enviar áudio MP3 via arquivo
    router.post('/send-voice', async (req, res) => {
        const { number, filePath } = req.body;
        if (!clientInstance) {
            return res.status(500).json({ error: 'Bot ainda não inicializado' });
        }
        try {
            await clientInstance.sendVoice(`${number}@c.us`, filePath);
            res.json({ success: true, message: 'Áudio enviado com sucesso' });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    });

    // Enviar áudio MP3 via upload de arquivo
    router.post('/send-voice-upload', upload.single('audio'), async (req, res) => {
        if (!clientInstance) {
            return res.status(500).json({ error: 'Bot ainda não inicializado' });
        }
        if (!req.file) {
            return res.status(400).json({ error: 'Arquivo de áudio não enviado' });
        }

        const number = req.body.number;
        const filePath = path.resolve(req.file.path);

        try {
            await clientInstance.sendVoice(`${number}@c.us`, filePath);
            res.json({ success: true, message: 'Áudio enviado com sucesso' });

            // Remover o arquivo após envio
            fs.unlinkSync(filePath);
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    });

    return router;
};
