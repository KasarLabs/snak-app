import express, { Request, Response } from 'express';

export interface Output {
  index : number;
  type : string,
  text : string,
  status : string,
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
  try {
    // Accéder aux données envoyées dans la requête
    const receivedData = req.body;
    console.log('Données reçues:', receivedData);
    
    // Répondre avec un JSON valide
    const responseData : KeySubmission = {
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
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ error: 'Erreur de traitement' });
  }
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});