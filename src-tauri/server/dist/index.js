"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const PORT = 4004;
app.use(express_1.default.json());
app.get('/api/key/healthcheck', (req, res) => {
    res.json({ status: 'success' });
});
app.post('/api/key/request', (req, res) => {
    try {
        // Accéder aux données envoyées dans la requête
        const receivedData = req.body;
        console.log('Données reçues:', receivedData);
        // Répondre avec un JSON valide
        const responseData = {
            input: "test",
            output: [
                {
                    index: 0,
                    type: 'text',
                    text: 'Réponse générée',
                    status: 'success',
                }
            ]
        };
        res.json(responseData);
    }
    catch (error) {
        console.error('Erreur:', error);
        res.status(500).json({ error: 'Erreur de traitement' });
    }
});
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
