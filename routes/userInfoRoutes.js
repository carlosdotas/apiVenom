const express = require('express');
const router = express.Router();

module.exports = (clientInstance) => {
    // Recuperar perfil do usuário (atualmente não funciona devido a bug do WhatsApp)
    router.get('/get-number-profile', async (req, res) => {
        const { number } = req.query;
        
        if (!clientInstance) {
            return res.status(500).json({ error: 'Bot ainda não inicializado' });
        }
        if (!number) {
            return res.status(400).json({ error: 'O número do contato é obrigatório' });
        }

        try {
            const profile = await clientInstance.getNumberProfile(`${number}@c.us`);
            res.json({ success: true, profile });
        } catch (error) {
            console.error('Erro ao recuperar perfil do usuário:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    });

    // Recuperar todas as mensagens não lidas
    router.get('/get-unread-messages', async (req, res) => {
        if (!clientInstance) {
            return res.status(500).json({ error: 'Bot ainda não inicializado' });
        }

        try {
            const messages = await clientInstance.getUnreadMessages();
            res.json({ success: true, messages });
        } catch (error) {
            console.error('Erro ao recuperar mensagens não lidas:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    });

    // Recuperar URL da foto de perfil do usuário
    router.get('/get-profile-pic', async (req, res) => {
        const { number } = req.query;
        
        if (!clientInstance) {
            return res.status(500).json({ error: 'Bot ainda não inicializado' });
        }
        if (!number) {
            return res.status(400).json({ error: 'O número do contato é obrigatório' });
        }

        try {
            const url = await clientInstance.getProfilePicFromServer(`${number}@c.us`);
            res.json({ success: true, url });
        } catch (error) {
            console.error('Erro ao recuperar foto de perfil:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    });

    // Recuperar informações do chat/conversa
    router.get('/get-chat', async (req, res) => {
        const { chatID } = req.query;
        
        if (!clientInstance) {
            return res.status(500).json({ error: 'Bot ainda não inicializado' });
        }
        if (!chatID) {
            return res.status(400).json({ error: 'O chatID é obrigatório' });
        }

        try {
            const chat = await clientInstance.getChat(chatID);
            res.json({ success: true, chat });
        } catch (error) {
            console.error('Erro ao recuperar informações do chat:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    });

    // Verificar se o número existe no WhatsApp
    router.get('/check-number-status', async (req, res) => {
        const { number } = req.query;
        
        if (!clientInstance) {
            return res.status(500).json({ error: 'Bot ainda não inicializado' });
        }
        if (!number) {
            return res.status(400).json({ error: 'O número do contato é obrigatório' });
        }

        try {
            const status = await clientInstance.checkNumberStatus(`${number}@c.us`);
            res.json({ success: true, status });
        } catch (error) {
            console.error('Erro ao verificar número no WhatsApp:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    });

    return router;
};
