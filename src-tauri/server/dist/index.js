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
    console.log("Received request:", req.body);
    // Vous pouvez aussi utiliser les données du body maintenant
    const { request, agentName } = req.body;
    const keySubmission = {
        input: request || 'input',
        output: [
            {
                index: 0,
                type: 'text',
                text: 'output',
                status: 'success',
            },
        ],
    };
    console.log("Sending response:", keySubmission);
    res.json(keySubmission);
});
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
