import express, { Request, Response } from 'express';

const router = express.Router();

router.use((req: Request, res: Response) => {
  // not found 
  res.status(404).json({ error: '404' });
});

export default router;
