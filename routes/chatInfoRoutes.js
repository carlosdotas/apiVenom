const express = require('express');
const router = express.Router();

module.exports = (clientInstance) => {
    // Recuperar todas as conversas
    router.get('/get-all-chats', async (req, res) => {
        if (!clientInstance) {
            return res.status(500).json({ error: 'Bot ainda não inicializado' });
        }
        try {
            const chats = await clientInstance.getAllChats();
            res.json({ success: true, chats });
        } catch (error) {
            console.error('Erro ao recuperar todas as conversas:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    });

    // Recuperar todas as conversas com novas mensagens
    router.get('/get-all-chats-new-msg', async (req, res) => {
        if (!clientInstance) {
            return res.status(500).json({ error: 'Bot ainda não inicializado' });
        }
        try {
            const chatsNew = await clientInstance.getAllChatsNewMsg();
            res.json({ success: true, chatsNew });
        } catch (error) {
            console.error('Erro ao recuperar conversas com novas mensagens:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    });

    // Recuperar todos os contatos das conversas
    router.get('/get-all-chats-contacts', async (req, res) => {
        if (!clientInstance) {
            return res.status(500).json({ error: 'Bot ainda não inicializado' });
        }
        try {
            const contacts = await clientInstance.getAllChatsContacts();
            res.json({ success: true, contacts });
        } catch (error) {
            console.error('Erro ao recuperar contatos das conversas:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    });

    // Recuperar mensagens novas dos contatos
    router.get('/get-chat-contact-new-msg', async (req, res) => {
        if (!clientInstance) {
            return res.status(500).json({ error: 'Bot ainda não inicializado' });
        }
        try {
            const contactNewMsg = await clientInstance.getChatContactNewMsg();
            res.json({ success: true, contactNewMsg });
        } catch (error) {
            console.error('Erro ao recuperar novas mensagens dos contatos:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    });

    // Recuperar todos os grupos (opcional: passar ID do grupo)
    router.get('/get-all-groups', async (req, res) => {
        const { groupId } = req.query;
        if (!clientInstance) {
            return res.status(500).json({ error: 'Bot ainda não inicializado' });
        }
        try {
            const groups = await clientInstance.getAllChatsGroups(groupId || undefined);
            res.json({ success: true, groups });
        } catch (error) {
            console.error('Erro ao recuperar grupos:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    });

    // Recuperar novas mensagens dos grupos
    router.get('/get-chat-group-new-msg', async (req, res) => {
        if (!clientInstance) {
            return res.status(500).json({ error: 'Bot ainda não inicializado' });
        }
        try {
            const groupNewMsg = await clientInstance.getChatGroupNewMsg();
            res.json({ success: true, groupNewMsg });
        } catch (error) {
            console.error('Erro ao recuperar novas mensagens dos grupos:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    });

    // Recuperar todas as listas de transmissão
    router.get('/get-all-chats-transmission', async (req, res) => {
        if (!clientInstance) {
            return res.status(500).json({ error: 'Bot ainda não inicializado' });
        }
        try {
            const transmission = await clientInstance.getAllChatsTransmission();
            res.json({ success: true, transmission });
        } catch (error) {
            console.error('Erro ao recuperar listas de transmissão:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    });

    // Recuperar todos os contatos
    router.get('/get-all-contacts', async (req, res) => {
        if (!clientInstance) {
            return res.status(500).json({ error: 'Bot ainda não inicializado' });
        }
        try {
            const contacts = await clientInstance.getAllContacts();
            res.json({ success: true, contacts });
        } catch (error) {
            console.error('Erro ao recuperar todos os contatos:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    });

    // Recuperar lista de silenciados (mute e não-mute)
    router.get('/get-list-mute', async (req, res) => {
        const { type } = req.query; // "all", "toMute" ou "noMute"
        if (!clientInstance) {
            return res.status(500).json({ error: 'Bot ainda não inicializado' });
        }
        if (!["all", "toMute", "noMute"].includes(type)) {
            return res.status(400).json({ error: 'Tipo inválido. Use "all", "toMute" ou "noMute"' });
        }

        try {
            const listMute = await clientInstance.getListMute(type);
            res.json({ success: true, listMute });
        } catch (error) {
            console.error('Erro ao recuperar lista de silenciados:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    });

    // Recuperar lista de contatos bloqueados
    router.get('/get-block-list', async (req, res) => {
        if (!clientInstance) {
            return res.status(500).json({ error: 'Bot ainda não inicializado' });
        }
        try {
            const blockList = await clientInstance.getBlockList();
            res.json({ success: true, blockList });
        } catch (error) {
            console.error('Erro ao recuperar lista de bloqueados:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    });

    return router;
};
