const express = require('express');
const router = express.Router();

module.exports = (clientInstance) => {
    // Marcar conversa como lida (✔️✔️)
    router.post('/send-seen', async (req, res) => {
        const { number } = req.body;
        if (!clientInstance) {
            return res.status(500).json({ error: 'Bot ainda não inicializado' });
        }

        try {
            await clientInstance.sendSeen(`${number}@c.us`);
            res.json({ success: true, message: 'Conversa marcada como lida' });
        } catch (error) {
            console.error('Erro ao marcar como lida:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    });

    // Simular digitação
    router.post('/start-typing', async (req, res) => {
        const { number } = req.body;
        if (!clientInstance) {
            return res.status(500).json({ error: 'Bot ainda não inicializado' });
        }

        try {
            await clientInstance.startTyping(`${number}@c.us`);
            res.json({ success: true, message: 'Simulação de digitação iniciada' });
        } catch (error) {
            console.error('Erro ao iniciar digitação:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    });

    // Definir estado do chat (0: digitando, 1: gravando, 2: pausado)
    router.post('/set-chat-state', async (req, res) => {
        const { number, state } = req.body;
        if (!clientInstance) {
            return res.status(500).json({ error: 'Bot ainda não inicializado' });
        }
        if (![0, 1, 2].includes(state)) {
            return res.status(400).json({ error: 'Estado inválido. Use 0 (digitando), 1 (gravando) ou 2 (pausado)' });
        }

        try {
            await clientInstance.setChatState(`${number}@c.us`, state);
            res.json({ success: true, message: `Estado do chat atualizado para ${state}` });
        } catch (error) {
            console.error('Erro ao definir estado do chat:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    });

    return router;
};
