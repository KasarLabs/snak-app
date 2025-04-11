import express, { Request, Response } from 'express';

export interface Output {
  index : number;
  type : string,
  text : string,
  status : string,
}
export interface KeySubmission {
  input: string;
  output: Output;
}

const app = express();
const PORT = 3001;

app.use(express.json());

app.get('/api/key/healthcheck', (req: Request, res: Response) => {
  res.json({ status: 'success' });
});

app.get('/api/key/request', (req: Request, res: Response) => {
  // Traitement de la requête
   const keySubmission: KeySubmission = {
    input: 'input',
    output: {
      index: 0,
      type: 'type',
      text: 'text',
      status: 'status',
    },
  };
   res.json({ message: 'Données reçues avec succès' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});