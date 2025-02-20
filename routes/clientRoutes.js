const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// Configuração do multer para upload de imagem de perfil
const storage = multer.diskStorage({
    destination: 'uploads/', // Define a pasta onde os arquivos serão armazenados
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname); // Mantém a extensão original
        const filename = `profile-pic${ext}`; // Define um nome fixo para a foto de perfil
        cb(null, filename);
    }
});

const upload = multer({ storage });

module.exports = (clientInstance) => {
    // Definir status do cliente (Exemplo: "Ocupado", "Férias", etc.)
    router.post('/set-profile-status', async (req, res) => {
        const { status } = req.body;
        
        if (!clientInstance) {
            return res.status(500).json({ error: 'Bot ainda não inicializado' });
        }
        if (!status) {
            return res.status(400).json({ error: 'O status é obrigatório' });
        }

        try {
            await clientInstance.setProfileStatus(status);
            res.json({ success: true, message: 'Status do perfil atualizado com sucesso' });
        } catch (error) {
            console.error('Erro ao definir status do perfil:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    });

    // Definir nome do perfil do cliente
    router.post('/set-profile-name', async (req, res) => {
        const { name } = req.body;
        
        if (!clientInstance) {
            return res.status(500).json({ error: 'Bot ainda não inicializado' });
        }
        if (!name) {
            return res.status(400).json({ error: 'O nome é obrigatório' });
        }

        try {
            await clientInstance.setProfileName(name);
            res.json({ success: true, message: 'Nome do perfil atualizado com sucesso' });
        } catch (error) {
            console.error('Erro ao definir nome do perfil:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    });

    // Definir foto de perfil do cliente via upload de imagem
    router.post('/set-profile-pic', upload.single('image'), async (req, res) => {
        if (!clientInstance) {
            return res.status(500).json({ error: 'Bot ainda não inicializado' });
        }
        if (!req.file) {
            return res.status(400).json({ error: 'Arquivo de imagem não enviado' });
        }

        const filePath = path.resolve(req.file.path);

        try {
            await clientInstance.setProfilePic(filePath);
            res.json({ success: true, message: 'Foto de perfil atualizada com sucesso' });

            // Remover o arquivo após envio
            fs.unlinkSync(filePath);
        } catch (error) {
            console.error('Erro ao definir foto de perfil:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    });

    // Recuperar informações do dispositivo
    router.get('/get-host-device', async (req, res) => {
        if (!clientInstance) {
            return res.status(500).json({ error: 'Bot ainda não inicializado' });
        }

        try {
            const deviceInfo = await clientInstance.getHostDevice();
            res.json({ success: true, deviceInfo });
        } catch (error) {
            console.error('Erro ao recuperar informações do dispositivo:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    });

    return router;
};
