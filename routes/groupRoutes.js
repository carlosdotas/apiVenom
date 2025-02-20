const express = require('express');
const router = express.Router();

module.exports = (clientInstance) => {
    // Alterar a descrição do grupo
    router.post('/set-group-description', async (req, res) => {
        const { groupID, description } = req.body;
        
        if (!clientInstance) {
            return res.status(500).json({ error: 'Bot ainda não inicializado' });
        }
        if (!groupID || !description) {
            return res.status(400).json({ error: 'O groupID e a descrição são obrigatórios' });
        }

        try {
            await clientInstance.setGroupDescription(groupID, description);
            res.json({ success: true, message: 'Descrição do grupo atualizada com sucesso' });
        } catch (error) {
            console.error('Erro ao atualizar descrição do grupo:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    });

    // Sair do grupo
    router.post('/leave-group', async (req, res) => {
        const { groupID } = req.body;

        if (!clientInstance) {
            return res.status(500).json({ error: 'Bot ainda não inicializado' });
        }
        if (!groupID) {
            return res.status(400).json({ error: 'O groupID é obrigatório' });
        }

        try {
            await clientInstance.leaveGroup(groupID);
            res.json({ success: true, message: 'Bot saiu do grupo' });
        } catch (error) {
            console.error('Erro ao sair do grupo:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    });

    // Recuperar membros do grupo
    router.get('/get-group-members', async (req, res) => {
        const { groupID } = req.query;

        if (!clientInstance) {
            return res.status(500).json({ error: 'Bot ainda não inicializado' });
        }
        if (!groupID) {
            return res.status(400).json({ error: 'O groupID é obrigatório' });
        }

        try {
            const members = await clientInstance.getGroupMembers(groupID);
            res.json({ success: true, members });
        } catch (error) {
            console.error('Erro ao recuperar membros do grupo:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    });

    // Recuperar IDs dos membros do grupo
    router.get('/get-group-members-ids', async (req, res) => {
        const { groupID } = req.query;

        if (!clientInstance) {
            return res.status(500).json({ error: 'Bot ainda não inicializado' });
        }
        if (!groupID) {
            return res.status(400).json({ error: 'O groupID é obrigatório' });
        }

        try {
            const membersIDs = await clientInstance.getGroupMembersIds(groupID);
            res.json({ success: true, membersIDs });
        } catch (error) {
            console.error('Erro ao recuperar IDs dos membros do grupo:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    });

    // Gerar link de convite do grupo
    router.get('/get-group-invite-link', async (req, res) => {
        const { groupID } = req.query;

        if (!clientInstance) {
            return res.status(500).json({ error: 'Bot ainda não inicializado' });
        }
        if (!groupID) {
            return res.status(400).json({ error: 'O groupID é obrigatório' });
        }

        try {
            const inviteLink = await clientInstance.getGroupInviteLink(groupID);
            res.json({ success: true, inviteLink });
        } catch (error) {
            console.error('Erro ao gerar link de convite do grupo:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    });

    // Criar um grupo
    router.post('/create-group', async (req, res) => {
        const { groupName, participants } = req.body;

        if (!clientInstance) {
            return res.status(500).json({ error: 'Bot ainda não inicializado' });
        }
        if (!groupName || !Array.isArray(participants) || participants.length === 0) {
            return res.status(400).json({ error: 'O nome do grupo e a lista de participantes são obrigatórios' });
        }

        try {
            const group = await clientInstance.createGroup(groupName, participants);
            res.json({ success: true, group });
        } catch (error) {
            console.error('Erro ao criar grupo:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    });

    // Adicionar participante ao grupo
    router.post('/add-participant', async (req, res) => {
        const { groupID, participant } = req.body;

        if (!clientInstance) {
            return res.status(500).json({ error: 'Bot ainda não inicializado' });
        }

        try {
            await clientInstance.addParticipant(groupID, participant);
            res.json({ success: true, message: 'Participante adicionado com sucesso' });
        } catch (error) {
            console.error('Erro ao adicionar participante:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    });

    // Remover participante do grupo
    router.post('/remove-participant', async (req, res) => {
        const { groupID, participant } = req.body;

        if (!clientInstance) {
            return res.status(500).json({ error: 'Bot ainda não inicializado' });
        }

        try {
            await clientInstance.removeParticipant(groupID, participant);
            res.json({ success: true, message: 'Participante removido com sucesso' });
        } catch (error) {
            console.error('Erro ao remover participante:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    });

    // Promover participante a administrador
    router.post('/promote-participant', async (req, res) => {
        const { groupID, participant } = req.body;

        if (!clientInstance) {
            return res.status(500).json({ error: 'Bot ainda não inicializado' });
        }

        try {
            await clientInstance.promoteParticipant(groupID, participant);
            res.json({ success: true, message: 'Participante promovido a administrador' });
        } catch (error) {
            console.error('Erro ao promover participante:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    });

    return router;
};
