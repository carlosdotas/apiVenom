const express = require('express');
const router = express.Router();

module.exports = (clientInstance) => {
    // Enviar mensagem de texto normalmente
    router.post('/send-text', async (req, res) => {
        const { number, message } = req.body;
        if (!clientInstance) {
            return res.status(500).json({ error: 'Bot ainda não inicializado' });
        }
        try {
            await clientInstance.sendText(`${number}@c.us`, message);
            res.json({ success: true, message: 'Mensagem enviada com sucesso' });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    });

    // Enviar mensagem simulando digitação
    router.post('/send-text-typing', async (req, res) => {
        const { number, message } = req.body;
        if (!clientInstance) {
            return res.status(500).json({ error: 'Bot ainda não inicializado' });
        }
        try {
            const success = await clientInstance.sendTextViaTyping(`${number}@c.us`, message);
            res.json({ success: true, message: 'Mensagem enviada com sucesso via digitação', result: success });
        } catch (error) {
            console.error('Erro ao enviar mensagem via digitação:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    });

    // Encaminhar mensagens
    router.post('/forward-text', async (req, res) => {
        const { number, messageIds } = req.body;
        if (!clientInstance) {
            return res.status(500).json({ error: 'Bot ainda não inicializado' });
        }
        if (!Array.isArray(messageIds) || messageIds.length === 0) {
            return res.status(400).json({ error: 'Lista de mensagens inválida' });
        }

        try {
            const result = await clientInstance.forwardMessages(`${number}@c.us`, messageIds);
            res.json({ success: true, message: 'Mensagens encaminhadas com sucesso', result });
        } catch (error) {
            console.error('Erro ao encaminhar mensagens:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    });

    // Enviar mensagem com @mencionados
    router.post('/send-mentioned', async (req, res) => {
        const { number, message, mentionedNumbers } = req.body;
        if (!clientInstance) {
            return res.status(500).json({ error: 'Bot ainda não inicializado' });
        }
        if (!Array.isArray(mentionedNumbers) || mentionedNumbers.length === 0) {
            return res.status(400).json({ error: 'Lista de contatos mencionados inválida' });
        }

        try {
            await clientInstance.sendMentioned(`${number}@c.us`, message, mentionedNumbers);
            res.json({ success: true, message: 'Mensagem com marcação enviada com sucesso' });
        } catch (error) {
            console.error('Erro ao enviar mensagem mencionada:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    });

    // Responder a uma mensagem específica
    router.post('/reply-text', async (req, res) => {
        const { number, message, messageId } = req.body;
        if (!clientInstance) {
            return res.status(500).json({ error: 'Bot ainda não inicializado' });
        }
        if (!messageId) {
            return res.status(400).json({ error: 'ID da mensagem original é obrigatório' });
        }

        try {
            await clientInstance.reply(`${number}@c.us`, message, messageId);
            res.json({ success: true, message: 'Resposta enviada com sucesso' });
        } catch (error) {
            console.error('Erro ao responder mensagem:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    });

    // Enviar mensagem com opções (exemplo: responder mensagens específicas)
    router.post('/send-text-options', async (req, res) => {
        const { number, message, quotedMessageId } = req.body;
        if (!clientInstance) {
            return res.status(500).json({ error: 'Bot ainda não inicializado' });
        }
        try {
            const options = quotedMessageId ? { quotedMessageId } : {};
            const result = await clientInstance.sendMessageOptions(`${number}@c.us`, message, options);
            res.json({ success: true, message: 'Mensagem enviada com opções', result });
        } catch (error) {
            console.error('Erro ao enviar mensagem com opções:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    });

    return router;
};
