const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// Configuração do multer para upload de imagens para stickers
const storage = multer.diskStorage({
    destination: 'uploads/', // Define a pasta onde os arquivos serão armazenados temporariamente
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname); // Mantém a extensão original
        const filename = `${Date.now()}${ext}`; // Nome único para o arquivo
        cb(null, filename);
    }
});

const upload = multer({ storage });

module.exports = (clientInstance) => {
    // Enviar imagem como sticker a partir de um caminho de arquivo
    router.post('/send-sticker', async (req, res) => {
        const { number, filePath } = req.body;
        
        if (!clientInstance) {
            return res.status(500).json({ error: 'Bot ainda não inicializado' });
        }
        if (!filePath) {
            return res.status(400).json({ error: 'Caminho do arquivo não fornecido' });
        }

        try {
            await clientInstance.sendImageAsSticker(`${number}@c.us`, filePath);
            res.json({ success: true, message: 'Sticker enviado com sucesso' });
        } catch (error) {
            console.error('Erro ao enviar sticker:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    });

    // Enviar imagem como sticker via upload de arquivo
    router.post('/send-sticker-upload', upload.single('image'), async (req, res) => {
        if (!clientInstance) {
            return res.status(500).json({ error: 'Bot ainda não inicializado' });
        }
        if (!req.file) {
            return res.status(400).json({ error: 'Arquivo de imagem não enviado' });
        }

        const { number } = req.body;
        const filePath = path.resolve(req.file.path);

        try {
            await clientInstance.sendImageAsSticker(`${number}@c.us`, filePath);
            res.json({ success: true, message: 'Sticker enviado com sucesso' });

            // Remover o arquivo após envio
            fs.unlinkSync(filePath);
        } catch (error) {
            console.error('Erro ao enviar sticker:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    });

    // Enviar GIF como sticker animado a partir de um caminho de arquivo
    router.post('/send-sticker-gif', async (req, res) => {
        const { number, filePath } = req.body;
        
        if (!clientInstance) {
            return res.status(500).json({ error: 'Bot ainda não inicializado' });
        }
        if (!filePath) {
            return res.status(400).json({ error: 'Caminho do arquivo GIF não fornecido' });
        }

        try {
            await clientInstance.sendImageAsStickerGif(`${number}@c.us`, filePath);
            res.json({ success: true, message: 'Sticker animado enviado com sucesso' });
        } catch (error) {
            console.error('Erro ao enviar sticker animado:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    });

    // Enviar GIF como sticker animado via upload de arquivo
    router.post('/send-sticker-gif-upload', upload.single('gif'), async (req, res) => {
        if (!clientInstance) {
            return res.status(500).json({ error: 'Bot ainda não inicializado' });
        }
        if (!req.file) {
            return res.status(400).json({ error: 'Arquivo GIF não enviado' });
        }

        const { number } = req.body;
        const filePath = path.resolve(req.file.path);

        try {
            await clientInstance.sendImageAsStickerGif(`${number}@c.us`, filePath);
            res.json({ success: true, message: 'Sticker animado enviado com sucesso' });

            // Remover o arquivo após envio
            fs.unlinkSync(filePath);
        } catch (error) {
            console.error('Erro ao enviar sticker animado:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    });

    return router;
};
