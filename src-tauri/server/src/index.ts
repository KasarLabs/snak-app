import express, { Request, Response } from 'express';

export interface Output {
  index: number;
  type: string;
  text: string;
  status: string;
}
export interface KeySubmission {
  input: string;
  output: Output[];
}

const app = express();
const PORT = 4004;

app.use(express.json());

app.get('/api/key/healthcheck', (req: Request, res: Response) => {
  res.json({ status: 'success' });
});

app.post('/api/key/request', (req: Request, res: Response) => {
  console.log('Received request:', req.body);
  // Vous pouvez aussi utiliser les données du body maintenant
  const { request, agentName } = req.body;

  const keySubmission: KeySubmission = {
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

  console.log('Sending response:', keySubmission);
  res.json(keySubmission);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
