const express = require('express');
const router = express.Router();

module.exports = (clientInstance) => {
    // Enviar link com preview automático
    router.post('/link-preview', async (req, res) => {
        const { number, url, message } = req.body;
        if (!clientInstance) {
            return res.status(500).json({ error: 'Bot ainda não inicializado' });
        }
        try {
            const result = await clientInstance.sendLinkPreview(`${number}@c.us`, url, message);
            res.json({ success: true, message: 'Link com preview enviado com sucesso', result });
        } catch (error) {
            console.error('Erro ao enviar link preview:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    });

    return router;
};
