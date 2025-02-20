const express = require('express');
const router = express.Router();

module.exports = (clientInstance) => {
    // Recuperar todas as mensagens em um chat
    router.get('/get-all-messages-in-chat', async (req, res) => {
        const { chatID, includeMe = true, includeNotifications = true } = req.query;
        
        if (!clientInstance) {
            return res.status(500).json({ error: 'Bot ainda não inicializado' });
        }
        if (!chatID) {
            return res.status(400).json({ error: 'O chatID é obrigatório' });
        }

        try {
            const messages = await clientInstance.getAllMessagesInChat(chatID, includeMe === 'true', includeNotifications === 'true');
            res.json({ success: true, messages });
        } catch (error) {
            console.error('Erro ao recuperar mensagens do chat:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    });

    // Carregar mais mensagens em um chat
    router.get('/load-earlier-messages', async (req, res) => {
        const { chatID } = req.query;
        
        if (!clientInstance) {
            return res.status(500).json({ error: 'Bot ainda não inicializado' });
        }
        if (!chatID) {
            return res.status(400).json({ error: 'O chatID é obrigatório' });
        }

        try {
            const moreMessages = await clientInstance.loadEarlierMessages(chatID);
            res.json({ success: true, moreMessages });
        } catch (error) {
            console.error('Erro ao carregar mais mensagens do chat:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    });

    // Carregar e recuperar todas as mensagens em um chat
    router.get('/load-and-get-all-messages', async (req, res) => {
        const { chatID } = req.query;
        
        if (!clientInstance) {
            return res.status(500).json({ error: 'Bot ainda não inicializado' });
        }
        if (!chatID) {
            return res.status(400).json({ error: 'O chatID é obrigatório' });
        }

        try {
            const allMessages = await clientInstance.loadAndGetAllMessagesInChat(chatID);
            res.json({ success: true, allMessages });
        } catch (error) {
            console.error('Erro ao recuperar todas as mensagens do chat:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    });

    // Recuperar status de um contato
    router.get('/get-status', async (req, res) => {
        const { number } = req.query;
        
        if (!clientInstance) {
            return res.status(500).json({ error: 'Bot ainda não inicializado' });
        }
        if (!number) {
            return res.status(400).json({ error: 'O número do contato é obrigatório' });
        }

        try {
            const status = await clientInstance.getStatus(`${number}@c.us`);
            res.json({ success: true, status });
        } catch (error) {
            console.error('Erro ao recuperar status do contato:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    });

    return router;
};
