const express = require('express');
const router = express.Router();

module.exports = (clientInstance) => {
    // Enviar localização para um contato
    router.post('/send-location', async (req, res) => {
        const { number, latitude, longitude, description } = req.body;

        if (!clientInstance) {
            return res.status(500).json({ error: 'Bot ainda não inicializado' });
        }
        if (!number || !latitude || !longitude || !description) {
            return res.status(400).json({ error: 'Os campos number, latitude, longitude e description são obrigatórios' });
        }

        try {
            const result = await clientInstance.sendLocation(`${number}@c.us`, latitude, longitude, description);
            res.json({ success: true, message: 'Localização enviada com sucesso', result });
        } catch (error) {
            console.error('Erro ao enviar localização:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    });

    return router;
};
