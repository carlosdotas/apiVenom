const express = require('express');
const router = express.Router();

module.exports = (clientInstance) => {
    // Enviar um único contato
    router.post('/send-contact', async (req, res) => {
        const { number, contactNumber, contactName } = req.body;
        if (!clientInstance) {
            return res.status(500).json({ error: 'Bot ainda não inicializado' });
        }
        try {
            await clientInstance.sendContactVcard(`${number}@c.us`, `${contactNumber}@c.us`, contactName);
            res.json({ success: true, message: 'Contato enviado com sucesso' });
        } catch (error) {
            console.error('Erro ao enviar contato:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    });

    // Enviar uma lista de contatos
    router.post('/send-contact-list', async (req, res) => {
        const { number, contactNumbers } = req.body;
        
        if (!clientInstance) {
            return res.status(500).json({ error: 'Bot ainda não inicializado' });
        }
        
        if (!Array.isArray(contactNumbers) || contactNumbers.length === 0) {
            return res.status(400).json({ error: 'Lista de contatos inválida' });
        }
    
        try {
            const formattedContacts = contactNumbers.map(num => `${num}@c.us`);
            const result = await clientInstance.sendContactVcardList(`${number}@c.us`, formattedContacts);
    
            console.log("Resultado do envio:", result);
    
            res.json({ success: true, message: 'Lista de contatos enviada com sucesso' });
        } catch (error) {
            console.error('Erro ao enviar lista de contatos:', error); 
            res.status(500).json({ success: false, error: error?.message || 'Erro desconhecido' });
        }
    });
    

    return router;
};
