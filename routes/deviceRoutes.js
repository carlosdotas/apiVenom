const express = require('express');
const router = express.Router();

module.exports = (clientInstance) => {
    // Desconectar do serviço
    router.post('/logout', async (req, res) => {
        if (!clientInstance) {
            return res.status(500).json({ error: 'Bot ainda não inicializado' });
        }

        try {
            await clientInstance.logout();
            res.json({ success: true, message: 'Desconectado do serviço com sucesso' });
        } catch (error) {
            console.error('Erro ao desconectar do serviço:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    });

    // Encerrar o Service Worker
    router.post('/kill-service-worker', async (req, res) => {
        if (!clientInstance) {
            return res.status(500).json({ error: 'Bot ainda não inicializado' });
        }

        try {
            await clientInstance.killServiceWorker();
            res.json({ success: true, message: 'Service Worker encerrado com sucesso' });
        } catch (error) {
            console.error('Erro ao encerrar o Service Worker:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    });

    // Reiniciar o serviço
    router.post('/restart-service', async (req, res) => {
        if (!clientInstance) {
            return res.status(500).json({ error: 'Bot ainda não inicializado' });
        }

        try {
            await clientInstance.restartService('bot-session');
            res.json({ success: true, message: 'Serviço reiniciado com sucesso' });
        } catch (error) {
            console.error('Erro ao reiniciar o serviço:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    });

    // Obter estado da conexão
    router.get('/get-connection-state', async (req, res) => {
        if (!clientInstance) {
            return res.status(500).json({ error: 'Bot ainda não inicializado' });
        }

        try {
            const state = await clientInstance.getConnectionState();
            res.json({ success: true, connectionState: state });
        } catch (error) {
            console.error('Erro ao obter estado da conexão:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    });

    // Obter nível de bateria
    router.get('/get-battery-level', async (req, res) => {
        if (!clientInstance) {
            return res.status(500).json({ error: 'Bot ainda não inicializado' });
        }

        try {
            const batteryLevel = await clientInstance.getBatteryLevel();
            res.json({ success: true, batteryLevel });
        } catch (error) {
            console.error('Erro ao obter nível da bateria:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    });

    // Verificar se está conectado
    router.get('/is-connected', async (req, res) => {
        if (!clientInstance) {
            return res.status(500).json({ error: 'Bot ainda não inicializado' });
        }

        try {
            const isConnected = await clientInstance.isConnected();
            res.json({ success: true, isConnected });
        } catch (error) {
            console.error('Erro ao verificar conexão:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    });

    // Obter versão do WhatsApp Web
    router.get('/get-wa-version', async (req, res) => {
        if (!clientInstance) {
            return res.status(500).json({ error: 'Bot ainda não inicializado' });
        }

        try {
            const waVersion = await clientInstance.getWAVersion();
            res.json({ success: true, waVersion });
        } catch (error) {
            console.error('Erro ao obter versão do WhatsApp Web:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    });

    return router;
};
