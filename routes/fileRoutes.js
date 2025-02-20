const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// Configuração do multer para upload de arquivos
const storage = multer.diskStorage({
    destination: 'uploads/', // Define a pasta onde os arquivos serão armazenados
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname); // Mantém a extensão original
        const filename = `${Date.now()}${ext}`; // Nome único para o arquivo
        cb(null, filename);
    }
});

const upload = multer({ storage });

module.exports = (clientInstance) => {
    // Enviar arquivo via caminho do arquivo
    router.post('/send-file', async (req, res) => {
        const { number, filePath, fileName, caption } = req.body;
        
        if (!clientInstance) {
            return res.status(500).json({ error: 'Bot ainda não inicializado' });
        }
        if (!filePath || !fileName) {
            return res.status(400).json({ error: 'Caminho do arquivo e nome do arquivo são obrigatórios' });
        }

        try {
            await clientInstance.sendFile(`${number}@c.us`, filePath, fileName, caption || '');
            res.json({ success: true, message: 'Arquivo enviado com sucesso' });
        } catch (error) {
            console.error('Erro ao enviar arquivo:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    });

    // Enviar arquivo via upload de arquivo
    router.post('/send-file-upload', upload.single('file'), async (req, res) => {
        if (!clientInstance) {
            return res.status(500).json({ error: 'Bot ainda não inicializado' });
        }
        if (!req.file) {
            return res.status(400).json({ error: 'Arquivo não enviado' });
        }

        const { number, caption } = req.body;
        const filePath = path.resolve(req.file.path);
        const fileName = req.file.filename;

        try {
            await clientInstance.sendFile(`${number}@c.us`, filePath, fileName, caption || '');
            res.json({ success: true, message: 'Arquivo enviado com sucesso' });

            // Remover o arquivo após envio
            fs.unlinkSync(filePath);
        } catch (error) {
            console.error('Erro ao enviar arquivo:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    });

    return router;
};
