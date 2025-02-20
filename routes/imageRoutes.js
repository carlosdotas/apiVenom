const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// Configuração do multer para upload de imagens
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
    // Enviar imagem usando um caminho de arquivo local (requisição JSON)
    router.post('/send-image', async (req, res) => {
        const { number, filePath, caption } = req.body;
        if (!clientInstance) {
            return res.status(500).json({ error: 'Bot ainda não inicializado' });
        }
        if (!filePath) {
            return res.status(400).json({ error: 'Caminho do arquivo não fornecido' });
        }

        try {
            await clientInstance.sendImage(`${number}@c.us`, filePath, path.basename(filePath), caption || '');
            res.json({ success: true, message: 'Imagem enviada com sucesso' });
        } catch (error) {
            console.error('Erro ao enviar imagem:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    });

    // Enviar imagem via upload de arquivo (multipart/form-data)
    router.post('/send-image-upload', upload.single('image'), async (req, res) => {
        if (!clientInstance) {
            return res.status(500).json({ error: 'Bot ainda não inicializado' });
        }
        if (!req.file) {
            return res.status(400).json({ error: 'Arquivo de imagem não enviado' });
        }

        const { number, caption } = req.body;
        const filePath = path.resolve(req.file.path);

        try {
            await clientInstance.sendImage(`${number}@c.us`, filePath, req.file.filename, caption || '');
            res.json({ success: true, message: 'Imagem enviada com sucesso' });

            // Remover o arquivo após envio
            fs.unlinkSync(filePath);
        } catch (error) {
            console.error('Erro ao enviar imagem:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    });

    return router;
};
